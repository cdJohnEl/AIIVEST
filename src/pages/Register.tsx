import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const extendedData = {
        phone,
        dob,
        age: parseInt(age),
        gender,
        country,
        city,
        address,
        occupation
      };
      
      const success = await register(name, email, password, extendedData, referralCode);
      if (!success) {
        setError('Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains a special character', met: /[!@#$%^&*]/.test(password) },
  ];

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
          <h1 className="text-3xl font-bold text-[#F4F6FF] mb-2">Create your account</h1>
          <p className="text-[#A7B1C8]">Start your investment journey today</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#F4F6FF]">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7B1C8]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F4F6FF]">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7B1C8]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#F4F6FF]">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-[#F4F6FF]">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    const newDob = e.target.value;
                    setDob(newDob);
                    if (newDob) {
                      const birthDate = new Date(newDob);
                      const today = new Date();
                      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        calculatedAge--;
                      }
                      setAge(calculatedAge.toString());
                    }
                  }}
                  className="bg-white/5 border-white/10 text-[#F4F6FF] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-[#F4F6FF]">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  placeholder="18+"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-[#F4F6FF]">Gender</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F6FF] focus:border-[#2D6BFF] focus:ring-1 focus:ring-[#2D6BFF]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled className="bg-[#0D1220] text-[#A7B1C8]">Select gender</option>
                  <option value="Male" className="bg-[#0D1220]">Male</option>
                  <option value="Female" className="bg-[#0D1220]">Female</option>
                  <option value="Other" className="bg-[#0D1220]">Other</option>
                  <option value="Prefer not to say" className="bg-[#0D1220]">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-[#F4F6FF]">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[#F4F6FF]">City / State</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York, NY"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#F4F6FF]">Residential Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Wall St, Suite 400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-[#F4F6FF]">Occupation</Label>
              <Input
                id="occupation"
                type="text"
                placeholder="Software Engineer"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-[#F4F6FF]">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                type="text"
                placeholder="e.g. NEXUS-A1B2C3"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20 font-mono tracking-widest uppercase"
              />
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#F4F6FF]">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7B1C8]" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8]/50 focus:border-[#2D6BFF] focus:ring-[#2D6BFF]/20"
                  required
                />
              </div>
            </div>

            {/* Password requirements */}
            <div className="space-y-2">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.met ? 'bg-[#10B981]' : 'bg-white/10'
                  }`}>
                    <Check className={`w-3 h-3 ${req.met ? 'text-white' : 'text-transparent'}`} />
                  </div>
                  <span className={`text-xs ${req.met ? 'text-[#10B981]' : 'text-[#A7B1C8]'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-1 border-white/20 data-[state=checked]:bg-[#2D6BFF] data-[state=checked]:border-[#2D6BFF]"
              />
              <Label htmlFor="terms" className="text-sm text-[#A7B1C8] cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-[#2D6BFF] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#2D6BFF] hover:underline">Privacy Policy</Link>
              </Label>
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
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A7B1C8] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2D6BFF] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
