import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, AlertTriangle, Check, Info, Calculator } from 'lucide-react';
import { useInvestment, type InvestmentPlan } from '../contexts/InvestmentContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const riskLabels = {
  low: { text: 'Low Risk', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
  medium: { text: 'Medium Risk', color: 'text-[#2D6BFF]', bg: 'bg-[#2D6BFF]/10' },
  high: { text: 'High Risk', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
};

export default function InvestmentPlans() {
  const { plans, portfolio, invest } = useInvestment();
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState(100);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);

  const handleInvestClick = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.minAmount);
    setIsDialogOpen(true);
    setInvestSuccess(false);
  };

  const handleInvest = async () => {
    if (!selectedPlan) return;
    
    setIsInvesting(true);
    const success = await invest(selectedPlan.id, investAmount);
    setIsInvesting(false);
    
    if (success) {
      setInvestSuccess(true);
      setTimeout(() => {
        setIsDialogOpen(false);
      }, 2000);
    }
  };

  const calculateReturns = (amount: number, roi: number, days: number) => {
    const dailyRate = roi / 365 / 100;
    return amount * dailyRate * days;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FF] mb-4">
            Investment Plans
          </h1>
          <p className="text-[#A7B1C8] text-lg max-w-2xl mx-auto">
            Choose from our range of AI-powered investment strategies designed to match your risk tolerance and financial goals.
          </p>
        </div>

        {/* Balance Card */}
        {isAuthenticated && (
          <div className="glass-card p-6 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#A7B1C8] mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-[#F4F6FF]">
                  ${(portfolio.availableBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-[#A7B1C8] mb-1">Total Invested</p>
                  <p className="text-xl font-semibold text-[#F4F6FF]">
                    ${(portfolio.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#A7B1C8] mb-1">Total Returns</p>
                  <p className="text-xl font-semibold text-[#10B981]">
                    +${(portfolio.totalReturns || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const risk = riskLabels[plan.riskLevel];
            return (
              <div
                key={plan.id}
                className="glass-card p-6 hover:border-[#2D6BFF]/30 transition-all duration-300"
              >
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#F4F6FF] mb-1">{plan.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                      <Shield className="w-3 h-3" />
                      {risk.text}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#10B981]">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold">{plan.avgROI}%</span>
                    </div>
                    <p className="text-xs text-[#A7B1C8]">Avg. ROI</p>
                  </div>
                </div>

                <p className="text-[#A7B1C8] text-sm mb-6">{plan.description}</p>

                {/* Investment Range */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#A7B1C8]">Min Investment</span>
                    <span className="text-[#F4F6FF] font-medium">${plan.minAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A7B1C8]">Max Investment</span>
                    <span className="text-[#F4F6FF] font-medium">${plan.maxAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#10B981]" />
                      <span className="text-[#A7B1C8]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-[#A7B1C8] mb-6">
                  <Info className="w-4 h-4" />
                  <span>Duration: {plan.duration}</span>
                </div>

                {/* CTA */}
                {isAuthenticated ? (
                  <Button
                    onClick={() => handleInvestClick(plan)}
                    className="w-full btn-primary"
                    disabled={portfolio.availableBalance < plan.minAmount}
                  >
                    Invest Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Link to="/register" className="w-full btn-primary flex items-center justify-center">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                )}

                {isAuthenticated && portfolio.availableBalance < plan.minAmount && (
                  <div className="text-center mt-3">
                    <p className="text-xs text-[#A7B1C8] mb-2">Insufficient balance</p>
                    <Link 
                      to="/dashboard" 
                      className="text-xs text-[#2D6BFF] hover:underline font-medium"
                    >
                      Fund your account on the Dashboard →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Risk Warning */}
        <div className="mt-12 glass-card-sm p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[#F4F6FF] font-semibold mb-2">Investment Risk Notice</h4>
            <p className="text-sm text-[#A7B1C8] leading-relaxed">
              All investments carry risk, including the possible loss of principal. Past performance does not guarantee future results. 
              The ROI figures shown are historical averages and may vary. Please invest only what you can afford to lose and consider 
              consulting with a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Invest Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0D1220] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F4F6FF]">Invest in {selectedPlan?.name}</DialogTitle>
            <DialogDescription className="text-[#A7B1C8]">
              Enter the amount you want to invest
            </DialogDescription>
          </DialogHeader>

          {investSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">Investment Successful!</h3>
              <p className="text-[#A7B1C8]">Your investment has been processed.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label className="text-[#F4F6FF] mb-2 block">Investment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7B1C8]">$</span>
                  <Input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                    min={selectedPlan?.minAmount}
                    max={selectedPlan?.maxAmount}
                    className="pl-8 bg-white/5 border-white/10 text-[#F4F6FF]"
                  />
                </div>
                <Slider
                  value={[investAmount]}
                  onValueChange={(value) => setInvestAmount(value[0])}
                  min={selectedPlan?.minAmount || 100}
                  max={Math.min(selectedPlan?.maxAmount || 10000, portfolio.availableBalance)}
                  step={100}
                  className="mt-4"
                />
                <div className="flex justify-between text-xs text-[#A7B1C8] mt-2">
                  <span>Min: ${selectedPlan?.minAmount.toLocaleString()}</span>
                  <span>Max: ${Math.min(selectedPlan?.maxAmount || 0, portfolio.availableBalance).toLocaleString()}</span>
                </div>
              </div>

              {/* Returns Calculator */}
              <div className="glass-card-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-[#2D6BFF]" />
                  <span className="text-sm text-[#F4F6FF] font-medium">Projected Returns</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A7B1C8]">Daily</span>
                    <span className="text-[#10B981]">
                      +${calculateReturns(investAmount, selectedPlan?.avgROI || 0, 1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A7B1C8]">Monthly (30 days)</span>
                    <span className="text-[#10B981]">
                      +${calculateReturns(investAmount, selectedPlan?.avgROI || 0, 30).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A7B1C8]">Yearly (365 days)</span>
                    <span className="text-[#10B981]">
                      +${calculateReturns(investAmount, selectedPlan?.avgROI || 0, 365).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-white/10 text-[#F4F6FF] hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvest}
                  disabled={isInvesting || investAmount < (selectedPlan?.minAmount || 0) || investAmount > (selectedPlan?.maxAmount || 0)}
                  className="flex-1 btn-primary"
                >
                  {isInvesting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Confirm Investment'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
