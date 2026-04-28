import { useState, useEffect } from 'react';
import { sendEmail } from '../../lib/emailService';

// Skeleton shimmer
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />;
}
function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
      ))}
    </tr>
  );
}

import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  runTransaction,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Search, 
  Briefcase, 
  MoreHorizontal, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  XCircle,
  PieChart
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

interface Investment {
  id: string;
  userId: string;
  userName?: string;
  planId: string;
  planName: string;
  amount: number;
  startDate: string;
  dailyReturn: number;
  totalReturn: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
}

export default function InvestmentManagement() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Basic query for investments
    const q = query(collection(db, 'investments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Investment[];

      // Sort by startDate descending (newest first)
      invData.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());

      setInvestments(invData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching investments:', error);
      toast.error('Failed to load investments');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (inv: Investment) => {
    if (inv.status === 'active') return;
    
    try {
      const portfolioRef = doc(db, 'portfolios', inv.userId);
      const invRef = doc(db, 'investments', inv.id);

      await runTransaction(db, async (transaction) => {
        const portSnap = await transaction.get(portfolioRef);
        if (!portSnap.exists()) throw new Error("User Portfolio not found");

        const portfolioData = portSnap.data();
        
        if ((portfolioData.availableBalance || 0) < inv.amount) {
          throw new Error("User has insufficient available balance to fund this investment.");
        }

        // Securely perform portfolio math during approval
        transaction.update(portfolioRef, {
          availableBalance: (portfolioData.availableBalance || 0) - inv.amount,
          totalInvested: (portfolioData.totalInvested || 0) + inv.amount,
          activeInvestments: (portfolioData.activeInvestments || 0) + 1,
          dailyReturns: (portfolioData.dailyReturns || 0) + inv.dailyReturn
        });

        // Activate Investment
        transaction.update(invRef, {
          status: 'active',
          startDate: new Date().toISOString()
        });
      });

      toast.success('Investment approved successfully. Balance deducted.');

      // Notify the user via email
      // We need to fetch the user email from Firestore or rely on userId
      // For now, we fetch from the users collection inside the transaction
      import('firebase/firestore').then(({ getDoc, doc: fdoc }) => {
        getDoc(fdoc(db, 'users', inv.userId)).then(userSnap => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            sendEmail('investment_activated', {
              to_name: userData.name || inv.userName || 'Investor',
              to_email: userData.email || '',
              plan_name: inv.planName,
              amount: `$${inv.amount.toLocaleString()}`,
              daily_return: `$${inv.dailyReturn.toFixed(2)}`,
            });
          }
        });
      });
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve investment');
    }
  };

  const handleReject = async (inv: Investment) => {
    try {
      const invRef = doc(db, 'investments', inv.id);
      await updateDoc(invRef, {
        status: 'rejected',
      });
      toast.success('Investment dynamically rejected.');
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject investment');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 animate-pulse">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredInv = investments.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-3xl font-bold text-[#F4F6FF]">Investment Management</h1>
          <p className="text-[#A7B1C8] mt-1">Approve pending user investments to secure financial flow.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Approvals', value: investments.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Active Assets', value: investments.filter(t => t.status === 'active').length, icon: PieChart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Platform Portfolio', value: `$${investments.reduce((acc, t) => acc + (t.status === 'active' ? t.amount : 0), 0).toLocaleString()}`, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-left">
                <p className="text-sm text-[#A7B1C8]">{stat.label}</p>
                <p className="text-2xl font-bold text-[#F4F6FF]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
            <Input 
              placeholder="Search ID or Username..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">User / Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-sm">
              {loading ? (
                <>{[...Array(5)].map((_, i) => <SkeletonTableRow key={i} cols={5} />)}</>
              ) : filteredInv.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-[#A7B1C8]">
                      <AlertCircle className="w-12 h-12 opacity-20" />
                      <p>No investments found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInv.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-left space-y-1">
                        <p className="font-bold text-[#F4F6FF]">{inv.userName || inv.userId.substring(0, 8)}</p>
                        <p className="text-[10px] text-[#A7B1C8] uppercase bg-white/5 px-2 py-0.5 rounded-full inline-block">{inv.planName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <p className="font-bold text-[#10B981]">${inv.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-[#A7B1C8]">≈ ${inv.dailyReturn.toFixed(2)} / daily</p>
                    </td>
                    <td className="px-6 py-4 text-left">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="px-6 py-4 text-left">
                       <p className="text-xs text-[#A7B1C8]">{new Date(inv.startDate).toLocaleDateString()}</p>
                       <p className="text-[10px] text-[#5A6578]">{new Date(inv.startDate).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                           <Button onClick={() => handleApprove(inv)} size="sm" className="bg-green-500 hover:bg-green-600 text-white h-8 text-xs">
                             Approve
                           </Button>
                           <Button onClick={() => handleReject(inv)} size="sm" variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 h-8 text-xs">
                             Reject
                           </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-[#A7B1C8] hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#0A0E1A] border-white/10 text-[#F4F6FF]">
                            <DropdownMenuLabel>Manage Investment</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem 
                              disabled={true}
                              className="text-gray-400"
                            >
                              <ShieldCheck className="w-4 h-4 mr-2" /> Adjust ROI
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleReject(inv)}
                              disabled={inv.status === 'completed' || inv.status === 'rejected'}
                              className="text-red-400 focus:text-red-400 focus:bg-red-400/10"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Force Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
