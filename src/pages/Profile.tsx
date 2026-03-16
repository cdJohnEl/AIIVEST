import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Edit2, Check, X, Building, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    age: 0,
    gender: '',
    country: '',
    city: '',
    address: '',
    occupation: '',
    avatar: '',
    referralCode: ''
  });

  // Keep a copy of the original data to allow cancelling edits
  const [originalData, setOriginalData] = useState({ ...profileData });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const docRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const pData = {
            name: data.name || user.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            dob: data.dob || '',
            age: data.age || 0,
            gender: data.gender || '',
            country: data.country || '',
            city: data.city || '',
            address: data.address || '',
            occupation: data.occupation || '',
            avatar: data.avatar || user.avatar || '',
            referralCode: data.referralCode || user.referralCode || ''
          };
          setProfileData(pData);
          setOriginalData(pData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const docRef = doc(db, 'users', user.id);
      await updateDoc(docRef, {
        name: profileData.name,
        phone: profileData.phone,
        dob: profileData.dob,
        age: Number(profileData.age) || 0,
        gender: profileData.gender,
        country: profileData.country,
        city: profileData.city,
        address: profileData.address,
        occupation: profileData.occupation,
      });
      
      setOriginalData({ ...profileData });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2D6BFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img 
                src={profileData.avatar} 
                alt={profileData.name} 
                className="w-24 h-24 rounded-full border-4 border-[#2D6BFF]/20 bg-[#0D1220]"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#F4F6FF]">{profileData.name}</h1>
              <p className="text-[#A7B1C8] flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {profileData.email}
              </p>
              {profileData.referralCode && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-[#A7B1C8] uppercase tracking-wider font-semibold">Your Referral Code:</span>
                  <code className="bg-[#2D6BFF]/10 text-[#2D6BFF] px-3 py-1 rounded-md border border-[#2D6BFF]/20 font-mono font-bold tracking-widest">
                    {profileData.referralCode}
                  </code>
                </div>
              )}
            </div>
          </div>
          
          <div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="btn-secondary">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleCancel} variant="outline" className="border-white/10 text-[#A7B1C8] hover:text-white hover:bg-white/5">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Info */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#F4F6FF] border-b border-white/5 pb-4 mb-4">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#A7B1C8]">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
                  <Input 
                    id="name" 
                    value={profileData.name} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    className="pl-9 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob" className="text-[#A7B1C8]">Date of Birth</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
                    <Input 
                      id="dob" 
                      type="date"
                      value={profileData.dob} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="pl-9 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] text-sm h-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="age" className="text-[#A7B1C8]">Age</Label>
                  <Input 
                    id="age" 
                    type="number"
                    value={profileData.age} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    className="mt-1 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender" className="text-[#A7B1C8]">Gender</Label>
                <select
                  id="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F4F6FF] focus:border-[#2D6BFF] focus:ring-1 focus:ring-[#2D6BFF]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <option value="" disabled className="bg-[#0D1220] text-[#A7B1C8]">Select gender</option>
                  <option value="Male" className="bg-[#0D1220]">Male</option>
                  <option value="Female" className="bg-[#0D1220]">Female</option>
                  <option value="Other" className="bg-[#0D1220]">Other</option>
                  <option value="Prefer not to say" className="bg-[#0D1220]">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-semibold text-[#F4F6FF] border-b border-white/5 pb-4 mb-4">Contact & Location</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-[#A7B1C8]">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
                  <Input 
                    id="phone" 
                    type="tel"
                    value={profileData.phone} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    className="pl-9 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country" className="text-[#A7B1C8]">Country</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
                    <Input 
                      id="country" 
                      value={profileData.country} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="pl-9 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="city" className="text-[#A7B1C8]">City/State</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
                    <Input 
                      id="city" 
                      value={profileData.city} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="pl-9 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-[#A7B1C8]">Residential Address</Label>
                <Input 
                  id="address" 
                  value={profileData.address} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  className="mt-1 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                />
              </div>

              <div>
                <Label htmlFor="occupation" className="text-[#A7B1C8]">Occupation</Label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
                  <Input 
                    id="occupation" 
                    value={profileData.occupation} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    className="pl-9 bg-white/5 border-white/10 text-[#F4F6FF] disabled:opacity-70 disabled:cursor-not-allowed text-sm h-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
