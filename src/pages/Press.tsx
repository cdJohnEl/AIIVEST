import { 
  Newspaper, 
  Calendar, 
  ArrowUpRight, 
  Download,
  Mail,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const pressReleases = [
  {
    date: 'December 15, 2024',
    title: 'AI Invest Pro Surpasses $2.4 Billion in Assets Under Management',
    summary: 'Continued growth driven by AI-powered investment strategies and expanding global user base.',
    category: 'Company News',
  },
  {
    date: 'November 28, 2024',
    title: 'Launch of Anonymous Crypto Deposit Feature',
    summary: 'New privacy-first option allows users to invest without KYC verification for deposits under $10,000.',
    category: 'Product Update',
  },
  {
    date: 'October 10, 2024',
    title: 'AI Invest Pro Expands to 180 Countries',
    summary: 'Global expansion brings AI-powered wealth management to investors worldwide.',
    category: 'Expansion',
  },
  {
    date: 'September 5, 2024',
    title: 'Partnership with Leading Crypto Custody Provider',
    summary: 'Strategic partnership enhances security infrastructure and institutional-grade asset protection.',
    category: 'Partnership',
  },
  {
    date: 'August 12, 2024',
    title: 'Q2 2024 Report: 94.7% AI Prediction Accuracy',
    summary: 'Machine learning models continue to outperform traditional investment strategies.',
    category: 'Performance',
  },
];

const mediaCoverage = [
  { outlet: 'Forbes', title: 'The Future of AI-Powered Investing', date: 'Dec 2024' },
  { outlet: 'TechCrunch', title: 'Anonymous Investing Goes Mainstream', date: 'Nov 2024' },
  { outlet: 'Bloomberg', title: 'AI Hedge Funds for Everyone', date: 'Oct 2024' },
  { outlet: 'CoinDesk', title: 'Privacy-First Wealth Management', date: 'Sep 2024' },
  { outlet: 'WSJ', title: 'Democratizing Sophisticated Investing', date: 'Aug 2024' },
];

const brandAssets = [
  { name: 'Logo Pack', description: 'PNG, SVG, and EPS formats', size: '2.4 MB' },
  { name: 'Brand Guidelines', description: 'Colors, typography, usage rules', size: '4.1 MB' },
  { name: 'Executive Photos', description: 'High-res team photos', size: '12.8 MB' },
  { name: 'Product Screenshots', description: 'Dashboard and app images', size: '8.2 MB' },
];

export default function Press() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Press & <span className="text-gradient">Media</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Latest news, press releases, and media resources about AI Invest Pro.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '150K+', label: 'Users' },
            { value: '$2.4B', label: 'AUM' },
            { value: '180', label: 'Countries' },
            { value: '2020', label: 'Founded' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#2D6BFF] mb-1">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-8">
            Press Releases
          </h2>
          <div className="space-y-4">
            {pressReleases.map((release) => (
              <div key={release.title} className="glass-card p-6 hover:border-[#2D6BFF]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#2D6BFF]/20 text-[#2D6BFF]">
                        {release.category}
                      </span>
                      <span className="text-sm text-[#A7B1C8] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {release.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">{release.title}</h3>
                    <p className="text-[#A7B1C8] text-sm">{release.summary}</p>
                  </div>
                  <Button variant="outline" className="border-white/10 text-[#F4F6FF] hover:bg-white/5 flex-shrink-0">
                    Read More
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Coverage */}
        <div className="glass-card p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6">
            In the News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaCoverage.map((article) => (
              <div key={article.title} className="p-4 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors">
                <p className="text-xs text-[#2D6BFF] mb-2">{article.outlet}</p>
                <h4 className="text-[#F4F6FF] font-medium mb-2">{article.title}</h4>
                <p className="text-xs text-[#A7B1C8]">{article.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Assets */}
        <div className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-8">
            Brand Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brandAssets.map((asset) => (
              <div key={asset.name} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2D6BFF]/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#2D6BFF]" />
                  </div>
                  <div>
                    <h4 className="text-[#F4F6FF] font-medium">{asset.name}</h4>
                    <p className="text-xs text-[#A7B1C8]">{asset.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#A7B1C8]">{asset.size}</span>
                  <Button variant="outline" size="sm" className="border-white/10 text-[#F4F6FF]">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-8 text-center">
          <Mail className="w-10 h-10 text-[#2D6BFF] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F4F6FF] mb-2">
            Media Inquiries
          </h3>
          <p className="text-[#A7B1C8] mb-4">
            For press inquiries, interview requests, or additional information.
          </p>
          <a 
            href="mailto:press@aiinvestpro.com" 
            className="text-[#2D6BFF] hover:underline text-lg"
          >
            press@aiinvestpro.com
          </a>
        </div>
      </div>
    </div>
  );
}
