import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ userId, isOpen, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'financials' | 'referrals'>('profile');

  useEffect(() => {
    if (!userId || !isOpen) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch Profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }

        // Fetch Portfolio Status
        const portfolioDoc = await getDoc(doc(db, 'portfolios', userId));
        if (portfolioDoc.exists()) {
          setPortfolio(portfolioDoc.data());
        } else {
            setPortfolio(null);
        }

        // Fetch Active Investments
        const investmentsQuery = query(
          collection(db, 'investments'),
          where('userId', '==', userId),
          where('status', '==', 'active')
        );
        const invSnapshot = await getDocs(investmentsQuery);
        const invData = invSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvestments(invData);

        // Fetch Transaction History
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        const txSnapshot = await getDocs(transactionsQuery);
        const txData = txSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txData);

        // Fetch Referrals
        const referralsQuery = query(
          collection(db, 'users'),
          where('referredBy', '==', userId)
        );
        const refSnapshot = await getDocs(referralsQuery);
        const refData = refSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReferrals(refData);

      } catch (error) {
        console.error("Error fetching user details for admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, isOpen]);

  if (!isOpen || !userId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0D1220] border-white/10 text-[#F4F6FF] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-white/20" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <User className="w-6 h-6 text-[#A7B1C8]" />
              </div>
            )}
            <div>
              <div>{profile?.name || 'User Profile'}</div>
              <div className="text-sm font-normal text-[#A7B1C8] flex items-center gap-2">
                <Mail className="w-3 h-3" /> {profile?.email}
              </div>
            </div>
            {profile?.role === 'admin' && (
              <Badge variant="outline" className="ml-auto bg-blue-500/10 text-blue-400 border-blue-500/20">Admin</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2D6BFF]"></div>
          </div>
        ) : (
          <div className="mt-4">
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'profile' ? 'border-[#2D6BFF] text-[#2D6BFF]' : 'border-transparent text-[#A7B1C8] hover:text-[#F4F6FF]'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Details
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'financials' ? 'border-[#2D6BFF] text-[#2D6BFF]' : 'border-transparent text-[#A7B1C8] hover:text-[#F4F6FF]'}`}
                onClick={() => setActiveTab('financials')}
              >
                Financials
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'referrals' ? 'border-[#2D6BFF] text-[#2D6BFF]' : 'border-transparent text-[#A7B1C8] hover:text-[#F4F6FF]'}`}
                onClick={() => setActiveTab('referrals')}
              >
                Referrals
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#A7B1C8] border-b border-white/5 pb-2">Personal</h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <span className="text-sm text-[#A7B1C8] block">Date of Birth</span>
                      <span>{profile?.dob || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#A7B1C8] block">Age</span>
                      <span>{profile?.age || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#A7B1C8] block">Gender</span>
                      <span>{profile?.gender || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#A7B1C8] block">Occupation</span>
                      <span className="flex items-center gap-2">
                        {profile?.occupation ? <><Briefcase className="w-4 h-4 text-[#A7B1C8]" /> {profile.occupation}</> : 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#A7B1C8] border-b border-white/5 pb-2">Contact</h3>
                  <div className="grid grid-cols-1 gap-y-4">
                     <div>
                      <span className="text-sm text-[#A7B1C8] block mb-1">Phone</span>
                      <span className="flex items-center gap-2">
                         <Phone className="w-4 h-4 text-[#A7B1C8]" /> {profile?.phone || 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-[#A7B1C8] block mb-1">Country</span>
                      <span className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-[#A7B1C8]" /> {profile?.country || 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-[#A7B1C8] block mb-1">City/State</span>
                      <span>{profile?.city || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-sm text-[#A7B1C8] block mb-1">Address</span>
                      <span>{profile?.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financials Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-8">
                 {/* Portfolio Summary Summary */}
                 {portfolio && (
                     <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <span className="text-sm text-[#A7B1C8] block mb-1">Available Balance</span>
                            <span className="text-xl font-bold font-mono">${(portfolio.availableBalance || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <span className="text-sm text-[#A7B1C8] block mb-1">Total Invested</span>
                            <span className="text-xl font-bold font-mono">${(portfolio.totalInvested || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-[#2D6BFF]/10 p-4 rounded-lg border border-[#2D6BFF]/20">
                            <span className="text-sm text-[#A7B1C8] block mb-1">Total Returns</span>
                            <span className="text-xl font-bold font-mono text-[#2D6BFF]">+${(portfolio.totalReturns || 0).toLocaleString()}</span>
                        </div>
                     </div>
                 )}

                {/* Active Investments */}
                <div>
                  <h3 className="text-lg font-semibold text-[#A7B1C8] border-b border-white/5 pb-2 mb-4 flex items-center justify-between">
                    <span>Active Investments</span>
                    <Badge variant="outline" className="bg-white/5">{investments.length}</Badge>
                  </h3>
                  {investments.length > 0 ? (
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-[#A7B1C8]">
                          <tr>
                            <th className="px-4 py-3 font-medium">Plan</th>
                            <th className="px-4 py-3 font-medium">Principal</th>
                            <th className="px-4 py-3 font-medium">Current Return</th>
                            <th className="px-4 py-3 font-medium cursor-help" title="Number of return cycles elapsed">Cycles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investments.map((inv) => (
                            <tr key={inv.id} className="border-b border-white/5">
                              <td className="px-4 py-3 font-medium capitalize">{inv.planId}</td>
                              <td className="px-4 py-3 font-mono">${inv.amount.toLocaleString()}</td>
                              <td className="px-4 py-3 font-mono text-green-400">+${(inv.totalReturn || 0).toFixed(2)}</td>
                              <td className="px-4 py-3">{inv.cyclesElapsed || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-[#A7B1C8] italic">No active investments found.</p>
                  )}
                </div>

                {/* Transaction History */}
                <div>
                  <h3 className="text-lg font-semibold text-[#A7B1C8] border-b border-white/5 pb-2 mb-4 flex items-center justify-between">
                    <span>Transaction History</span>
                    <Badge variant="outline" className="bg-white/5">{transactions.length}</Badge>
                  </h3>
                  {transactions.length > 0 ? (
                    <div className="border border-white/10 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                      <table className="w-full text-sm text-left relative">
                         <thead className="bg-[#0D1220] text-[#A7B1C8] sticky top-0 z-10 shadow-sm shadow-white/5">
                          <tr>
                            <th className="px-4 py-3 font-medium border-b border-white/10">Type</th>
                            <th className="px-4 py-3 font-medium border-b border-white/10">Amount</th>
                            <th className="px-4 py-3 font-medium border-b border-white/10">Status</th>
                            <th className="px-4 py-3 font-medium border-b border-white/10">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-white/5">
                              <td className="px-4 py-3 capitalize">
                                <span className={`flex items-center gap-1.5 ${tx.type === 'deposit' ? 'text-green-400' : 'text-orange-400'}`}>
                                  {tx.type === 'deposit' ? <DollarSign className="w-3 h-3" /> : <Wallet className="w-3 h-3" />}
                                  {tx.type}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono">${parseFloat(tx.amount).toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={`
                                  ${tx.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                    tx.status === 'detected' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                    tx.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                                `}>
                                  {tx.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-[#A7B1C8]">
                                {tx.timestamp ? new Date(tx.timestamp.seconds * 1000).toLocaleDateString() : 'Pending'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-[#A7B1C8] italic">No transcations found.</p>
                  )}
                </div>

              </div>
            )}
            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#A7B1C8] border-b border-white/5 pb-2 flex items-center justify-between">
                  <span>Referred Users</span>
                  <Badge variant="outline" className="bg-white/5">{referrals.length}</Badge>
                </h3>
                
                {profile?.referralCode && (
                  <div className="bg-white/5 p-4 rounded-lg flex items-center justify-between border border-white/10">
                    <span className="text-[#A7B1C8] text-sm">User's Referral Code:</span>
                    <Badge className="bg-[#2D6BFF]/20 text-[#2D6BFF] border border-[#2D6BFF]/30 font-mono tracking-widest">{profile.referralCode}</Badge>
                  </div>
                )}

                {referrals.length > 0 ? (
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[#0D1220] text-[#A7B1C8]">
                        <tr>
                          <th className="px-4 py-3 font-medium border-b border-white/10">User</th>
                          <th className="px-4 py-3 font-medium border-b border-white/10">Email</th>
                          <th className="px-4 py-3 font-medium border-b border-white/10">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((ref) => (
                          <tr key={ref.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {ref.avatar ? (
                                  <img src={ref.avatar} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-[#A7B1C8]" />
                                  </div>
                                )}
                                <span className="font-semibold text-[#F4F6FF]">{ref.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#A7B1C8]">{ref.email}</td>
                            <td className="px-4 py-3 text-[#A7B1C8]">
                              {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-[#A7B1C8]">This user has not referred anyone yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
