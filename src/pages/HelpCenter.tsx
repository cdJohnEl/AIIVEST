import { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Wallet, 
  Shield, 
  TrendingUp, 
  Zap,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  {
    icon: Wallet,
    title: 'Getting Started',
    articles: 12,
    description: 'Account setup, verification, and first steps',
  },
  {
    icon: TrendingUp,
    title: 'Investing',
    articles: 18,
    description: 'How to invest, manage portfolios, and track returns',
  },
  {
    icon: Zap,
    title: 'Deposits & Withdrawals',
    articles: 15,
    description: 'Crypto deposits, withdrawals, and payment methods',
  },
  {
    icon: Shield,
    title: 'Security',
    articles: 10,
    description: 'Account security, 2FA, and best practices',
  },
];

const faqs = [
  {
    question: 'What is the minimum investment amount?',
    answer: 'The minimum investment amount varies by plan. Our Conservative Growth plan starts at $100, while other plans require higher minimums. Check the Investment Plans page for specific details.',
  },
  {
    question: 'How do I deposit funds?',
    answer: 'You can deposit funds using various cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT, USDC, and more. Simply go to your Dashboard and click the "Deposit" button to get started.',
  },
  {
    question: 'Is KYC required?',
    answer: 'KYC is not required for crypto deposits under $10,000. For larger deposits or fiat transactions, identity verification may be required to comply with regulations.',
  },
  {
    question: 'How are returns calculated?',
    answer: 'Returns are calculated daily based on your portfolio performance. The daily return rate is derived from the annual ROI of your chosen investment plan divided by 365.',
  },
  {
    question: 'Can I withdraw anytime?',
    answer: 'Yes, you can request withdrawals 24/7. Withdrawals are processed automatically and typically complete within the timeframe specified for your chosen cryptocurrency network.',
  },
  {
    question: 'How secure is my investment?',
    answer: 'We employ bank-grade security measures including AES-256 encryption, multi-signature wallets, and cold storage for 95% of digital assets. We have maintained a zero-breach record since 2020.',
  },
];

const quickLinks = [
  { title: 'Account Setup', icon: BookOpen },
  { title: 'Investment Guide', icon: TrendingUp },
  { title: 'Crypto Deposits', icon: Zap },
  { title: 'Security Tips', icon: Shield },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-4">
            Help Center
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Find answers to your questions and learn how to make the most of NexusFinPro.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7B1C8]" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white/5 border-white/10 text-[#F4F6FF] text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {quickLinks.map((link) => (
            <button
              key={link.title}
              className="glass-card p-4 text-center hover:border-[#2D6BFF]/30 transition-all"
            >
              <link.icon className="w-6 h-6 text-[#2D6BFF] mx-auto mb-2" />
              <span className="text-sm text-[#F4F6FF]">{link.title}</span>
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.title}
                className="glass-card p-6 hover:border-[#2D6BFF]/30 transition-all cursor-pointer"
              >
                <category.icon className="w-8 h-8 text-[#2D6BFF] mb-4" />
                <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">{category.title}</h3>
                <p className="text-sm text-[#A7B1C8] mb-3">{category.description}</p>
                <span className="text-xs text-[#2D6BFF]">{category.articles} articles</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-[#F4F6FF] font-medium">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#A7B1C8]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#A7B1C8]" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-[#A7B1C8] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="glass-card p-8 text-center">
          <MessageCircle className="w-10 h-10 text-[#2D6BFF] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#F4F6FF] mb-2">
            Still Need Help?
          </h2>
          <p className="text-[#A7B1C8] mb-6">
            Our support team is available 24/7 to assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="btn-primary">
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a 
              href="mailto:support@aiinvestpro.com" 
              className="text-[#2D6BFF] hover:underline"
            >
              support@aiinvestpro.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
