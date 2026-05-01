import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2D6BFF]/20 border-t-[#2D6BFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verification Gate
  if (user && user.isVerified === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#0A0F1C]">
        <div className="w-full max-w-md text-center glass-card p-10 relative">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Mail className="w-10 h-10 text-[#10B981]" />
          </div>
          <h1 className="text-3xl font-bold text-[#F4F6FF] mb-4">Pending Verification</h1>
          <p className="text-[#A7B1C8] text-lg mb-8 leading-relaxed">
            Your account runs on our secure infrastructure, but your email address needs to be verified first.
          </p>
          <div className="bg-[#141b2d] border border-white/5 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-[#2D6BFF] font-semibold mb-3">What to do next:</h3>
            <ul className="text-[#5a6578] space-y-3 text-sm list-disc pl-4">
              <li>Check your inbox for the verification email.</li>
              <li>Always check your <strong className="text-white">Spam</strong> or <strong className="text-white">Junk</strong> folder.</li>
              <li>Click the verification link to unlock your dashboard.</li>
            </ul>
          </div>
          <Button onClick={async () => await logout()} variant="outline" className="w-full border-white/10 text-white/70 hover:bg-white/5">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
