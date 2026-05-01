import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectParams = searchParams.get('redirect');
  const stateMessage = location.state?.message || '';

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectParams) {
        navigate(decodeURIComponent(redirectParams), { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, redirectParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
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
          <h1 className="text-3xl font-bold text-[#F4F6FF] mb-2">Welcome back</h1>
          <p className="text-[#A7B1C8]">Sign in to access your portfolio</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {stateMessage && (
            <div className="mb-4 p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-medium text-center">
              {stateMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F4F6FF]">Email</Label>
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F4F6FF]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7B1C8]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C8] hover:text-[#F4F6FF]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-white/20 data-[state=checked]:bg-[#2D6BFF] data-[state=checked]:border-[#2D6BFF]"
                />
                <Label htmlFor="remember" className="text-sm text-[#A7B1C8] cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-[#2D6BFF] hover:underline">
                Forgot password?
              </Link>
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
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A7B1C8] text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#2D6BFF] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
