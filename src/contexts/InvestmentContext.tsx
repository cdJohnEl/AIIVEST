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
    id: 'conservative',
    name: 'Conservative Growth',
    description: 'Stable returns with minimal risk. Perfect for beginners.',
    minAmount: 100,
    maxAmount: 10000,
    avgROI: 8.5,
    riskLevel: 'low',
    duration: '12 months',
    features: ['Capital protection', 'Monthly payouts', 'Instant withdrawal', 'AI monitoring'],
    color: '#10B981',
  },
  {
    id: 'balanced',
    name: 'Balanced Portfolio',
    description: 'Optimal risk-reward balance for steady wealth building.',
    minAmount: 500,
    maxAmount: 50000,
    avgROI: 15.2,
    riskLevel: 'medium',
    duration: '18 months',
    features: ['Diversified assets', 'Weekly payouts', 'Rebalancing', 'Tax optimization'],
    color: '#2D6BFF',
  },
  {
    id: 'growth',
    name: 'Growth Accelerator',
    description: 'Higher returns with moderate risk for ambitious investors.',
    minAmount: 1000,
    maxAmount: 100000,
    avgROI: 22.8,
    riskLevel: 'medium',
    duration: '24 months',
    features: ['Growth stocks', 'Daily compounding', 'Priority support', 'Advanced analytics'],
    color: '#8B5CF6',
  },
  {
    id: 'aggressive',
    name: 'Alpha Seeker',
    description: 'Maximum returns for experienced, risk-tolerant investors.',
    minAmount: 5000,
    maxAmount: 500000,
    avgROI: 35.5,
    riskLevel: 'high',
    duration: '36 months',
    features: ['Venture exposure', 'Options strategy', 'Dedicated manager', 'VIP access'],
    color: '#F59E0B',
  },
  {
    id: 'crypto',
    name: 'Crypto Alpha',
    description: 'AI-powered cryptocurrency portfolio with dynamic hedging.',
    minAmount: 2000,
    maxAmount: 250000,
    avgROI: 48.2,
    riskLevel: 'high',
    duration: 'Flexible',
    features: ['Multi-chain', 'DeFi yields', 'Auto-hedging', '24/7 trading'],
    color: '#EC4899',
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
      console.log('InvestmentContext: No user, resetting portfolio');
      setPortfolio({
        totalInvested: 0,
        totalReturns: 0,
        dailyReturns: 0,
        activeInvestments: 0,
        availableBalance: 0,
      });
      setPortfolioLoading(false);
      return;
    }

    console.log('InvestmentContext: Initializing portfolio listener for', user.id);
    const portfolioRef = doc(db, 'portfolios', user.id);
    const unsubscribe = onSnapshot(portfolioRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log('InvestmentContext: Portfolio data received');
        setPortfolio(docSnap.data() as Portfolio);
      } else {
        console.log('InvestmentContext: Portfolio does not exist yet (waiting for registration sync)');
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
