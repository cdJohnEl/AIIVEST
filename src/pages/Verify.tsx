import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyUser = async () => {
      // 1. Wait for Firebase to finish loading initial auth state
      if (loading) return;

      // 2. Cross-device fallback: If they are fully logged out, auth rules will reject. Force them to login first and return here.
      if (!isAuthenticated) {
        setRedirecting(true);
        const redirectUrl = `/verify?token=${token}&uid=${uid}`;
        navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`, { replace: true });
        return;
      }
      if (!token || !uid) {
        setStatus('error');
        setErrorMessage('Invalid verification link. Missing token or user ID.');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setStatus('error');
          setErrorMessage('Account not found. Please register again.');
          return;
        }

        const userData = userDoc.data();

        if (userData.isVerified) {
          setStatus('success');
          return; // Already verified
        }

        if (userData.verificationToken !== token) {
          setStatus('error');
          setErrorMessage('Invalid or expired verification link.');
          return;
        }

        // Token matches! Update Firestore
        await updateDoc(userDocRef, {
          isVerified: true,
          verificationToken: '' // Clear token after use
        });

        // Trigger the Welcome email now that they are verified
        try {
          // Dynamically import to avoid any circular dependency issues, or just use the direct import
          const { sendWelcomeEmail } = await import('../lib/emailService');
          await sendWelcomeEmail(userData.name, userData.email);
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr);
        }

        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'An error occurred during verification.');
      }
    };

    verifyUser();
  }, [token, uid, loading, isAuthenticated, navigate]);

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#0A0F1C]">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="w-12 h-12 text-[#2D6BFF] animate-spin mb-4" />
          <p className="text-[#A7B1C8]">Preparing secure environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#0A0F1C]">
      <div className="w-full max-w-md text-center glass-card p-10">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#2D6BFF] animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-[#F4F6FF] mb-2">Verifying Account</h1>
            <p className="text-[#A7B1C8]">Please wait while we securely verify your credentials...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F6FF] mb-2">Account Verified!</h1>
            <p className="text-[#A7B1C8] mb-8">
              Your email has been successfully verified. You now have full access to your NexusFinPro dashboard.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full btn-primary py-6">
              Log in to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F6FF] mb-2">Verification Failed</h1>
            <p className="text-[#A7B1C8] mb-8">{errorMessage}</p>
            <Button onClick={() => navigate('/login')} className="w-full bg-white/5 text-white hover:bg-white/10 py-6">
              Return to Login
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
