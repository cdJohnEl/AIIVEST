import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  avgROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  duration: string;
  features: string[];
  color: string;
}

export interface UserInvestment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  startDate: string;
  dailyReturn: number;
  totalReturn: number;
  status: 'active' | 'completed' | 'pending';
}

export interface Portfolio {
  totalInvested: number;
  totalReturns: number;
  dailyReturns: number;
  activeInvestments: number;
  availableBalance: number;
  referralEarnings: number;
  referralCount: number;
}

interface InvestmentContextType {
  plans: InvestmentPlan[];
  userInvestments: UserInvestment[];
  portfolio: Portfolio;
  portfolioLoading: boolean;
  invest: (planId: string, amount: number) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
}

const investmentPlans: InvestmentPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Basic AI-managed portfolio with 24/7 risk monitoring and weekly performance reports.',
    minAmount: 50,
    maxAmount: 199,
    avgROI: 5.0, // 4% – 6% Target Monthly ROI
    riskLevel: 'low',
    duration: 'Monthly',
    features: [
      'Basic AI-managed portfolio',
      '24/7 risk monitoring',
      'Weekly performance report',
      'Secure deposits (BTC, ETH, USDT)',
      'Optional privacy layers'
    ],
    color: '#10B981',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced AI strategies (momentum & arbitrage) with priority support and strategy calls.',
    minAmount: 200,
    maxAmount: 999,
    avgROI: 8.0, // 7% – 9% Target Monthly ROI
    riskLevel: 'medium',
    duration: 'Monthly',
    features: [
      'Advanced AI strategies (momentum & arbitrage)',
      'Priority support',
      'Monthly strategy call',
      'Secure deposits (BTC, ETH, USDT)',
      'Optional privacy layers'
    ],
    color: '#2D6BFF',
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Dedicated portfolio manager, custom strategy tuning, and quarterly in-depth audits.',
    minAmount: 1000,
    maxAmount: 100000,
    avgROI: 11.0, // 10% – 12% Target Monthly ROI
    riskLevel: 'high',
    duration: 'Flexible',
    features: [
      'Dedicated portfolio manager',
      'Custom strategy tuning',
      'Quarterly in-depth audit',
      'Secure deposits (BTC, ETH, USDT)',
      'Optional privacy layers'
    ],
    color: '#8B5CF6',
  },
];

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalInvested: 0,
    totalReturns: 0,
    dailyReturns: 0,
    activeInvestments: 0,
    availableBalance: 0,
    referralEarnings: 0,
    referralCount: 0,
  });

  // Fetch investments real-time
  useEffect(() => {
    if (!user) {
      setUserInvestments([]);
      return;
    }

    const q = query(collection(db, 'investments'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const investments: UserInvestment[] = [];
      snapshot.forEach((doc) => {
        investments.push({ id: doc.id, ...doc.data() } as UserInvestment);
      });
      setUserInvestments(investments);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch portfolio real-time
  useEffect(() => {
    if (!user) {
      setPortfolio({
        totalInvested: 0,
        totalReturns: 0,
        dailyReturns: 0,
        activeInvestments: 0,
        availableBalance: 0,
        referralEarnings: 0,
        referralCount: 0,
      });
      setPortfolioLoading(false);
      return;
    }

    const portfolioRef = doc(db, 'portfolios', user.id);
    const unsubscribe = onSnapshot(portfolioRef, (docSnap) => {
      if (docSnap.exists()) {
        setPortfolio(docSnap.data() as Portfolio);
      }
      setPortfolioLoading(false);
    }, (error) => {
      console.error('InvestmentContext: Portfolio snapshot error:', error);
      setPortfolioLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const invest = async (planId: string, amount: number): Promise<boolean> => {
    if (!user) return false;
    
    const plan = investmentPlans.find(p => p.id === planId);
    if (!plan) return false;
    
    if (amount < plan.minAmount || amount > plan.maxAmount) return false;
    if (portfolio.availableBalance < amount) return false;

    try {
      const portfolioRef = doc(db, 'portfolios', user.id);
      const investmentsRef = collection(db, 'investments');

      await runTransaction(db, async (transaction) => {
        const portSnap = await transaction.get(portfolioRef);
        if (!portSnap.exists()) throw new Error("Portfolio does not exist!");

        const currentPortfolio = portSnap.data() as Portfolio;
        if (currentPortfolio.availableBalance < amount) throw new Error("Insufficient balance!");

        const dailyReturnRate = plan.avgROI / 365 / 100;
        const dailyReturn = amount * dailyReturnRate;

        // Add investment as pending (Admin will approve and deduct balance)
        const newInvestmentRef = doc(investmentsRef);
        transaction.set(newInvestmentRef, {
          userId: user.id,
          userName: user.name || 'User',
          planId,
          planName: plan.name,
          amount,
          startDate: new Date().toISOString(),
          dailyReturn,
          totalReturn: 0,
          status: 'pending',
        });
        
        // Removed portfolio update: This will now strictly happen in the Admin panel for security!
      });

      return true;
    } catch (error) {
      console.error('Investment error:', error);
      return false;
    }
  };

  const withdraw = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount > portfolio.availableBalance) return false;

    try {
      const portfolioRef = doc(db, 'portfolios', user.id);
      await updateDoc(portfolioRef, {
        availableBalance: portfolio.availableBalance - amount,
      });
      return true;
    } catch (error) {
      console.error('Withdrawal error:', error);
      return false;
    }
  };

  // NOTE: Daily returns accumulation is handled server-side (admin approval or Cloud Function).
  // Client-side simulation was removed because Firestore rules restrict portfolio writes to admins only.

  return (
    <InvestmentContext.Provider value={{
      plans: investmentPlans,
      userInvestments,
      portfolio,
      portfolioLoading,
      invest,
      withdraw,
    }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestment() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
}
