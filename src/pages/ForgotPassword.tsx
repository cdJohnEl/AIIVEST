import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      // Swallow user-not-found and invalid-email to prevent account enumeration.
      // Surface only true infrastructure failures (network, quota).
      const benign = ['auth/user-not-found', 'auth/invalid-email'];
      if (!benign.includes(err?.code)) {
        console.error('Password reset error:', err);
      }
    } finally {
      setSent(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
              <span className="text-white font-bold text-xs">NF</span>
            </div>
            <span className="text-[#F4F6FF] font-semibold text-xl">NexusFinPro</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#F4F6FF] mb-2">Forgot Password</h1>
          <p className="text-[#A7B1C8]">Enter your email to receive a reset link</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#F4F6FF] mb-2">Check Your Inbox</h3>
              <p className="text-[#A7B1C8] text-sm mb-6">
                If an account exists for <strong className="text-[#F4F6FF]">{email}</strong>, we've sent a password reset link.
                Check your inbox (and spam folder) and follow the instructions.
              </p>
              <Link to="/login">
                <Button className="btn-primary w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#F4F6FF]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7B1C8]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-sm text-[#A7B1C8] hover:text-[#2D6BFF] flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
