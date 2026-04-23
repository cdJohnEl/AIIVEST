import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, extendedData?: any, referralCodeFromInput?: string) => Promise<boolean>;
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
          });
        } else {
          // Fallback to Auth displayName if Firestore isn't ready, but avoid email prefix
          const fallbackName = firebaseUser.displayName || 'User';
          console.log('AuthContext: Profile missing in Firestore, using fallback name:', fallbackName);
          
          setUser({
            id: firebaseUser.uid,
            name: fallbackName,
            email: firebaseUser.email || '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
            role: 'user',
          });

          // Self-heal: Create missing user and portfolio documents for broken registrations
          const healAccount = async () => {
            try {
              const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
              
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                 name: fallbackName,
                 email: firebaseUser.email,
                 role: 'user',
                 avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
                 createdAt: serverTimestamp(),
                 referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                 referredBy: ''
              }, { merge: true });

              await setDoc(doc(db, 'portfolios', firebaseUser.uid), {
                 totalInvested: 0,
                 totalReturns: 0,
                 dailyReturns: 0,
                 totalProfit: 0,
                 monthlyProfit: 0,
                 activeInvestments: 0,
                 availableBalance: 0,
                 lastUpdated: serverTimestamp()
              }, { merge: true });
              console.log('AuthContext: Successfully healed missing user profile and portfolio');
            } catch (err) {
              console.error('AuthContext: Failed to heal missing profile', err);
            }
          };
          healAccount();
        }
        setLoading(false);
      }, (error) => {
        console.error('AuthContext: Profile snapshot error:', error);
        setLoading(false);
      });

      return () => unsubscribeProfile();
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'AIVEST-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const register = async (name: string, email: string, password: string, extendedData?: any, referralCodeFromInput?: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Also update the Auth profile as a backup
      const { updateProfile, sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(firebaseUser);
      console.log('[AuthContext] Verification email sent to:', email);
      
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

      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
      const newReferralCode = generateReferralCode();
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
                          availableBalance: (currentPortfolio.availableBalance || 0) + 50
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
                          toAddress: 'AIVEST Referral System',
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
          createdAt: new Date().toISOString(),
          referralCode: newReferralCode,
          referredBy: referredBy,
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

      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        avatar,
        role: 'user',
        referralCode: newReferralCode,
        referredBy: referredBy,
        ...(extendedData || {})
      };

      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
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
