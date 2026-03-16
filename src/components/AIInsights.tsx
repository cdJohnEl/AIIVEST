import { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { useInvestment } from '../contexts/InvestmentContext';
import { useAuth } from '../contexts/AuthContext';
import { generateChatCompletion } from '../lib/groq';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIInsights() {
  const { user } = useAuth();
  const { portfolio, userInvestments } = useInvestment();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsight = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      const portfolioSummary = {
        totalInvested: portfolio.totalInvested,
        totalReturns: portfolio.totalReturns,
        activeInvestments: portfolio.activeInvestments,
        availableBalance: portfolio.availableBalance,
        holdings: userInvestments.map(inv => ({
          plan: inv.planName,
          amount: inv.amount,
          status: inv.status,
          returns: inv.totalReturn
        }))
      };

      const prompt = `Act as a senior AI investment strategist. Analyze this user portfolio and provide 3-4 insightful, expert-level recommendations.
      User: ${user.name}
      Portfolio Data: ${JSON.stringify(portfolioSummary)}
      
      Requirements:
      1. Tone: Professional and expert.
      2. Length: 1-2 clear sentences per insight.
      3. Formatting: Do NOT use any asterisks (*) or bolding (**).
      4. Bullets: Use simple hyphens (-) for lists.
      5. Header: Start with a clear "AI Summary".`;

      const result = await generateChatCompletion([
        { role: 'system', content: 'You are an advanced AI financial advisor powered by Llama-3.' },
        { role: 'user', content: prompt }
      ]);
      
      setInsight(result);
    } catch (error) {
      console.error('Failed to generate AI insight:', error);
      setInsight("Unable to generate insights at this moment. Please check your connection or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (portfolio.totalInvested >= 0 && !insight) {
      generateInsight();
    }
  }, [portfolio.totalInvested]);

  return (
    <Card className="bg-[#0D1220] border-white/5 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D6BFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#2D6BFF]/10 text-[#2D6BFF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <CardTitle className="text-sm font-semibold text-[#F4F6FF]">AI Strategy Insights</CardTitle>
        </div>
        <button 
          onClick={generateInsight}
          disabled={isLoading}
          className="p-1.5 rounded-md hover:bg-white/5 text-[#A7B1C8] transition-colors disabled:opacity-50"
          title="Refresh Insights"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-[#2D6BFF] animate-spin" />
            <p className="text-xs text-[#A7B1C8] animate-pulse">Analyzing portfolio engine...</p>
          </div>
        ) : insight ? (
          <div className="prose prose-invert prose-xs max-w-none">
            <div className="text-[11px] leading-relaxed text-[#A7B1C8] whitespace-pre-wrap">
              {insight}
            </div>
            {!portfolio.totalInvested && (
                <div className="mt-4 p-2 rounded-lg bg-[#2D6BFF]/5 border border-[#2D6BFF]/10 flex items-start gap-2">
                    <Lightbulb className="w-3 h-3 text-[#2D6BFF] mt-0.5" />
                    <p className="text-[10px] text-[#A7B1C8]">Tip: Start your first investment to get more personalized strategic advice.</p>
                </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <button 
              onClick={generateInsight}
              className="text-xs text-[#2D6BFF] hover:underline flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="w-3 h-3" />
              Generate personalized insights
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
