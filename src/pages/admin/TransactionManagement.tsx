import { useState, useEffect } from 'react';
import { sendNotificationEmail } from '../../lib/emailService';

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
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  DollarSign, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Filter,
  RefreshCw,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  AlertCircle,
  FlaskConical
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

interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  amountUsd?: number;
  usdRateAtSubmission?: number;
  currency: string;
  network?: string;
  status: 'pending' | 'detected' | 'confirmed' | 'failed';
  txHash?: string;
  toAddress: string;
  receiptUrl?: string;
  confirmations: number;
  createdAt: any;
  updatedAt?: any;
}

export default function TransactionManagement() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // We remove the orderBy from the query to avoid internal Firestore sorting bugs 
    // that cause "Assertion Failed" during local cache updates with serverTimestamps.
    const q = query(collection(db, 'transactions'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          // Handle different formats of createdAt (ISO string or Firestore Timestamp)
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString()
        };
      }) as Transaction[];

      // Sort manually in JS to be safe
      txData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setTransactions(txData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleForceApprove = async (tx: Transaction) => {
    if (tx.status === 'confirmed') return;

    // Stablecoins are 1:1 with USD; everything else must have an amountUsd
    // captured at submission time. Reject the approval rather than guess.
    const isStable = tx.currency === 'USDT' || tx.currency === 'USDC';
    const usdAmount = tx.amountUsd ?? (isStable ? tx.amount : undefined);
    if (typeof usdAmount !== 'number' || Number.isNaN(usdAmount) || usdAmount <= 0) {
      toast.error(`Cannot approve: missing USD value for this ${tx.currency} transaction.`);
      return;
    }

    try {
      const portfolioRef = doc(db, 'portfolios', tx.userId);
      const txRef = doc(db, 'transactions', tx.id);

      await runTransaction(db, async (transaction) => {
        const portSnap = await transaction.get(portfolioRef);
        if (!portSnap.exists()) throw new Error("Portfolio not found");

        // Re-read the transaction inside the runTransaction so two admins
        // can't double-approve the same row.
        const freshTxSnap = await transaction.get(txRef);
        if (!freshTxSnap.exists()) throw new Error("Transaction no longer exists");
        if (freshTxSnap.data().status === 'confirmed') {
          throw new Error("Transaction already confirmed");
        }

        const portfolioData = portSnap.data();

        if (tx.type === 'deposit') {
          transaction.update(portfolioRef, {
            availableBalance: (portfolioData.availableBalance || 0) + usdAmount
          });
        } else if (tx.type === 'withdrawal') {
          if ((portfolioData.availableBalance || 0) < usdAmount) {
            throw new Error("Insufficient balance for withdrawal");
          }
          transaction.update(portfolioRef, {
            availableBalance: (portfolioData.availableBalance || 0) - usdAmount
          });
        }

        transaction.update(txRef, {
          status: 'confirmed',
          confirmations: 6,
          settledUsd: usdAmount,
          updatedAt: new Date().toISOString()
        });
      });

      toast.success(`Approved: $${usdAmount.toLocaleString()} credited to user.`);

      // Email notification via Resend (server-side)
      import('firebase/firestore').then(({ getDoc, doc: fdoc }) => {
        getDoc(fdoc(db, 'users', tx.userId)).then(userSnap => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const emailType = tx.type === 'deposit' ? 'deposit_approved' as const : 'withdrawal_approved' as const;
            sendNotificationEmail({
              toName: userData.name || tx.userName || 'User',
              toEmail: userData.email || '',
              emailType,
              amount: `$${tx.amount.toLocaleString()}`,
              currency: tx.currency,
            });
          }
        });
      });
    } catch (error) {
      console.error('Force approve error:', error);
      toast.error('Failed to approve transaction');
    }
  };

  const handleReject = async (tx: Transaction) => {
    if (tx.status === 'confirmed') return;

    try {
      const txRef = doc(db, 'transactions', tx.id);
      await updateDoc(txRef, {
        status: 'failed',
        updatedAt: new Date().toISOString()
      });
      toast.success('Transaction voided successfully');
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to void transaction');
    }
  };

  const handleSimulateDeposit = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      const mockTx = {
        userId: user.id || 'unknown_user',
        userName: user.name || 'Test User',
        type: 'deposit',
        amount: Math.floor(Math.random() * 1000) + 100,
        currency: ['BTC', 'ETH', 'USDT'][Math.floor(Math.random() * 3)],
        status: 'detected',
        toAddress: `bc1q${Math.random().toString(36).substring(7)}...`,
        confirmations: 0,
        receiptUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'transactions'), mockTx);
      toast.success('Test transaction simulated successfully!');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Failed to simulate transaction');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Confirmed</Badge>;
      case 'detected':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 font-medium animate-pulse">Detected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTx = transactions.filter(tx => 
    tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.toAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-3xl font-bold text-[#F4F6FF]">Transaction Logs</h1>
          <p className="text-[#A7B1C8] mt-1">Monitor and verify all blockchain deposits and withdrawals.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Verification', value: transactions.filter(t => t.status === 'detected' || t.status === 'pending').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Total Volume', value: `$${transactions.reduce((acc, t) => acc + (t.status === 'confirmed' ? (t.amountUsd ?? 0) : 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Recent Success', value: transactions.filter(t => t.status === 'confirmed').length, icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Platform Wallets', value: '3 Active', icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
      <div className="flex items-center justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleSimulateDeposit}
          disabled={isRefreshing}
          className="border-yellow-500/20 bg-yellow-500/5 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 h-10 px-4"
        >
          <FlaskConical className="w-4 h-4 mr-2" />
          Simulate Test Deposit
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 1000);
          }}
          disabled={isRefreshing}
          className="border-white/10 hover:bg-white/5 text-[#A7B1C8] h-10 px-4"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Explorer
        </Button>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B1C8]" />
            <Input 
              placeholder="Search TXID or Address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-[#A7B1C8] hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter By Currency
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">Type / Coin</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">TXID / Wallet</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A7B1C8] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-sm">
              {loading ? (
                <>{[...Array(5)].map((_, i) => <SkeletonTableRow key={i} cols={5} />)}</>
              ) : filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-[#A7B1C8]">
                      <AlertCircle className="w-12 h-12 opacity-20" />
                      <p>No transactions found on-chain yet.</p>
                      <Button variant="outline" className="border-white/10">Manual Registry Scan</Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-[#F4F6FF] uppercase tracking-tight">{tx.currency}</p>
                          <p className="text-[10px] text-[#A7B1C8] uppercase">{tx.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <p className="font-bold text-[#F4F6FF]">
                        {typeof tx.amountUsd === 'number'
                          ? `$${tx.amountUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                          : '—'}
                      </p>
                      <p className="text-[10px] text-[#A7B1C8]">{tx.amount} {tx.currency}</p>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 group/tx">
                          <p className="text-xs text-[#2D6BFF] max-w-[120px] truncate">{tx.txHash || 'PENDING DETECTION...'}</p>
                          {tx.txHash && <ExternalLink className="w-3 h-3 opacity-0 group-hover/tx:opacity-100 transition-opacity cursor-pointer text-[#A7B1C8]" />}
                        </div>
                        <p className="text-[10px] text-[#A7B1C8] truncate max-w-[150px]">To: {tx.toAddress}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="space-y-2">
                        {getStatusBadge(tx.status)}
                        {tx.status === 'detected' && (
                          <div className="w-full bg-white/5 rounded-full h-1">
                            <div className="bg-[#2D6BFF] h-1 rounded-full animate-pulse" style={{ width: '33%' }} />
                          </div>
                        )}
                        <p className="text-[10px] text-[#A7B1C8]">{tx.confirmations}/6 Configured</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-[#A7B1C8] hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[#0A0E1A] border-white/10 text-[#F4F6FF]">
                          <DropdownMenuLabel>Verification Tools</DropdownMenuLabel>
                          {tx.receiptUrl && (
                            <DropdownMenuItem onClick={() => window.open(tx.receiptUrl, '_blank')} className="text-[#2D6BFF] focus:bg-[#2D6BFF]/10 focus:text-[#2D6BFF]">
                              <ExternalLink className="w-4 h-4 mr-2" /> View Attached Receipt
                            </DropdownMenuItem>
                          )}
                          {tx.txHash && (
                            <DropdownMenuItem onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank')}>
                              <ExternalLink className="w-4 h-4 mr-2" /> View on Block Explorer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem 
                            onClick={() => handleForceApprove(tx)}
                            disabled={tx.status === 'confirmed'}
                            className="text-green-400 focus:text-green-400 focus:bg-green-400/10"
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" /> Force Global Approval
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleReject(tx)}
                            disabled={tx.status === 'confirmed' || tx.status === 'failed'}
                            className="text-red-400 focus:text-red-400 focus:bg-red-400/10"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" /> Void Transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
