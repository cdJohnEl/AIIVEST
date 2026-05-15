import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { sendVerificationEmail } from '../lib/emailService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  phone?: string;
  dob?: string;
  age?: number;
  gender?: string;
  country?: string;
  city?: string;
  address?: string;
  occupation?: string;
  referralCode?: string;
  referredBy?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  register: (name: string, email: string, password: string, extendedData?: any, referralCodeFromInput?: string) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing onAuthStateChanged...');
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('AuthContext: onAuthStateChanged triggered', firebaseUser?.uid);
      
      if (!firebaseUser) {
        console.log('AuthContext: No user authenticated');
        setUser(null);
        setLoading(false);
        return;
      }

      // Use onSnapshot for real-time profile updates
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log('AuthContext: User data found in Firestore', userData);
          setUser({
            id: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
            role: userData.role || 'user',
            phone: userData.phone,
            dob: userData.dob,
            age: userData.age,
            gender: userData.gender,
            country: userData.country,
            city: userData.city,
            address: userData.address,
            occupation: userData.occupation,
            referralCode: userData.referralCode,
            referredBy: userData.referredBy,
            isVerified: userData.isVerified !== false, // Default to true for old users
          });
        } else {
          // Profile missing in Firestore, the main register function will create it.
          // We set a minimal user here to avoid "loading" forever if the doc is truly missing
          // but we no longer "auto-heal" here to avoid permission loops.
          console.warn('AuthContext: Profile missing in Firestore for', firebaseUser.uid);
        }
        setLoading(false);
      }, (error) => {
        console.error('AuthContext: Profile snapshot error (likely permissions during registration):', error);
        setLoading(false);
      });

      return () => unsubscribeProfile();
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid email or password.' };
    }
  };

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NEXUS-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const register = async (name: string, email: string, password: string, extendedData?: any, referralCodeFromInput?: string): Promise<{success: boolean, error?: string}> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update the Auth profile display name
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(firebaseUser, { displayName: name });

      // Automatically subscribe to newsletter
      try {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        await addDoc(collection(db, 'subscribers'), {
          email: email.trim().toLowerCase(),
          subscribedAt: serverTimestamp(),
          source: 'signup_auto'
        });
        console.log('[AuthContext] User automatically subscribed to newsletter');
      } catch (err) {
        console.error('[AuthContext] Failed to auto-subscribe (non-blocking):', err);
      }

      const gender = extendedData?.gender || 'Other';
      const avatarSeed = gender === 'Male' ? `male_${email}` : (gender === 'Female' ? `female_${email}` : `user_${email}`);
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;
      const newReferralCode = generateReferralCode();
      const verificationToken = generateVerificationToken();
      let referredBy = '';

      // Check if referred by someone
      if (referralCodeFromInput) {
        try {
          const { collection, query, where, getDocs, runTransaction } = await import('firebase/firestore');
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referralCodeFromInput.trim().toUpperCase()));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            referredBy = referrerDoc.id;
            
            // Transaction to safely award bonus
            try {
               await runTransaction(db, async (transaction) => {
                  const referrerPortfolioRef = doc(db, 'portfolios', referredBy);
                  const referrerPortSnap = await transaction.get(referrerPortfolioRef);
                  
                  if (referrerPortSnap.exists()) {
                      const currentPortfolio = referrerPortSnap.data();
                      transaction.update(referrerPortfolioRef, {
                          availableBalance: (currentPortfolio.availableBalance || 0) + 50,
                          referralEarnings: (currentPortfolio.referralEarnings || 0) + 50,
                          referralCount: (currentPortfolio.referralCount || 0) + 1
                      });

                      // Log transaction
                      const newTxRef = doc(collection(db, 'transactions'));
                      transaction.set(newTxRef, {
                          userId: referredBy,
                          userName: referrerDoc.data().name,
                          type: 'referral_bonus',
                          amount: 50,
                          currency: 'USD',
                          status: 'confirmed',
                          toAddress: 'NexusFinPro Referral System',
                          confirmations: 6,
                          createdAt: new Date().toISOString()
                      });
                  }
               });
            } catch (e) {
                console.error("Failed to award referral bonus:", e);
            }
          }
        } catch (err) {
          console.error('[AuthContext] Referral check failed (non-blocking):', err);
        }
      }

      // Atomic registration: Profile + Portfolio
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const portfolioDocRef = doc(db, 'portfolios', firebaseUser.uid);

      await Promise.all([
        setDoc(userDocRef, {
          name,
          email,
          avatar,
          role: 'user',
          createdAt: serverTimestamp(),
          referralCode: newReferralCode,
          referredBy: referredBy,
          isVerified: false,
          verificationToken: verificationToken,
          ...(extendedData || {})
        }),
        setDoc(portfolioDocRef, {
          totalInvested: 0,
          totalReturns: 0,
          dailyReturns: 0,
          activeInvestments: 0,
          availableBalance: 0,
        })
      ]);

      // Generate the custom NexusFinPro URL, NO Firebase domain
      // Uses the current origin (localhost for testing, nexusfinpro.com for prod)
      const dynamicOrigin = window.location.origin;
      const customVerificationLink = `${dynamicOrigin}/verify?token=${verificationToken}&uid=${firebaseUser.uid}`;

      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        avatar,
        role: 'user',
        referralCode: newReferralCode,
        referredBy: referredBy,
        isVerified: false,
        classification: 'Starter', // Using default
        ...(extendedData || {})
      };

      // Send branded verification email via Resend completely skipping Firebase Admin links
      try {
        console.log('[AuthContext] Dispatching fully custom verification email via Resend...');
        await sendVerificationEmail(name, email, customVerificationLink);
      } catch (err) {
        console.error('[AuthContext] Verification email dispatch failed:', err);
      }

      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'This email is already registered. Please log in instead.' };
      }
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
