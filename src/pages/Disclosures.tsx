import { AlertTriangle, TrendingDown, Scale, FileText, Info } from 'lucide-react';

const riskFactors = [
  {
    title: 'Market Risk',
    description: 'All investments are subject to market fluctuations. The value of your portfolio can go up or down based on market conditions.',
  },
  {
    title: 'Liquidity Risk',
    description: 'Some investments may not be easily convertible to cash without significant loss in value.',
  },
  {
    title: 'Technology Risk',
    description: 'Our platform relies on technology that may experience outages, errors, or security breaches.',
  },
  {
    title: 'Regulatory Risk',
    description: 'Changes in laws and regulations may affect the availability or profitability of certain investments.',
  },
  {
    title: 'Cryptocurrency Risk',
    description: 'Crypto assets are highly volatile and may experience extreme price fluctuations.',
  },
  {
    title: 'AI Model Risk',
    description: 'Our AI predictions are based on historical data and may not accurately predict future performance.',
  },
];

const disclosures = [
  {
    icon: Info,
    title: 'Not Financial Advice',
    content: 'The information provided on this platform is for informational purposes only and should not be construed as financial advice. Always consult with a qualified financial advisor before making investment decisions.',
  },
  {
    icon: TrendingDown,
    title: 'Past Performance',
    content: 'Past performance does not guarantee future results. Historical ROI figures are provided for reference only and should not be used to predict future returns.',
  },
  {
    icon: Scale,
    title: 'Regulatory Status',
    content: 'NexusFinPro is registered with relevant regulatory authorities. However, cryptocurrency investments are not insured by the FDIC or any government agency.',
  },
  {
    icon: FileText,
    title: 'Fee Disclosure',
    content: 'All fees are clearly disclosed before any investment. Management fees are deducted from your portfolio balance automatically.',
  },
];

export default function Disclosures() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-[#F59E0B]/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-[#F59E0B]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F6FF] mb-4">
            Risk Disclosures
          </h1>
          <p className="text-[#A7B1C8]">
            Important information about the risks associated with investing
          </p>
        </div>

        {/* Warning Banner */}
        <div className="glass-card p-6 mb-8 border-l-4 border-[#F59E0B]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-[#F4F6FF] mb-2">
                Investment Risk Warning
              </h2>
              <p className="text-[#A7B1C8] text-sm leading-relaxed">
                Investing involves risk, including the possible loss of principal. You should not 
                invest money that you cannot afford to lose. Please read all disclosures carefully 
                before making any investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* General Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {disclosures.map((item) => (
            <div key={item.title} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-5 h-5 text-[#2D6BFF]" />
                <h3 className="text-lg font-semibold text-[#F4F6FF]">{item.title}</h3>
              </div>
              <p className="text-[#A7B1C8] text-sm leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        {/* Risk Factors */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#F4F6FF] mb-6">
            Risk Factors
          </h2>
          <div className="space-y-4">
            {riskFactors.map((risk) => (
              <div key={risk.title} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">{risk.title}</h3>
                <p className="text-[#A7B1C8] text-sm leading-relaxed">{risk.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Crypto Specific */}
        <div className="glass-card p-6 mb-8 border-l-4 border-[#8B5CF6]">
          <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">
            Cryptocurrency-Specific Risks
          </h2>
          <ul className="space-y-3 text-[#A7B1C8]">
            <li>• Extreme price volatility with potential for significant losses</li>
            <li>• Regulatory uncertainty in many jurisdictions</li>
            <li>• Potential for irreversible transactions due to user error</li>
            <li>• Security risks including hacking and theft</li>
            <li>• Limited recourse in case of disputes or fraud</li>
            <li>• Environmental concerns related to certain blockchain networks</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="glass-card p-6 text-center">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-2">
            Questions About Risks?
          </h2>
          <p className="text-[#A7B1C8] mb-4">
            Contact our support team for clarification on any risk factors.
          </p>
          <a 
            href="mailto:support@nexusfinpro.com" 
            className="text-[#2D6BFF] hover:underline"
          >
            support@nexusfinpro.com
          </a>
        </div>
      </div>
    </div>
  );
}
