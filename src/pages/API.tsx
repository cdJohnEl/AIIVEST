import { useState } from 'react';
import { 
  Code, 
  Terminal, 
  Copy, 
  Check, 
  Key, 
  BookOpen, 
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const codeExample = `// Get portfolio balance
const response = await fetch('https://api.nexusfinpro.com/v1/portfolio', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.balance); // $49,800.00`;

const endpoints = [
  { method: 'GET', path: '/v1/portfolio', description: 'Get portfolio overview and balances' },
  { method: 'GET', path: '/v1/investments', description: 'List all active investments' },
  { method: 'POST', path: '/v1/invest', description: 'Create a new investment' },
  { method: 'GET', path: '/v1/returns', description: 'Get daily returns history' },
  { method: 'GET', path: '/v1/market/data', description: 'Access real-time market data' },
  { method: 'POST', path: '/v1/withdraw', description: 'Request a withdrawal' },
];

const features = [
  { icon: Zap, title: 'Low Latency', description: 'Sub-100ms response times globally' },
  { icon: Globe, title: 'Global CDN', description: '99.99% uptime with edge distribution' },
  { icon: Shield, title: 'Secure', description: 'OAuth 2.0 + API key authentication' },
  { icon: Terminal, title: 'WebSocket Support', description: 'Real-time streaming data feeds' },
];

export default function API() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Code className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Developer <span className="text-gradient">API</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Build powerful applications with our comprehensive REST API. 
            Access portfolio data, execute trades, and retrieve market insights programmatically.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6 text-center">
              <feature.icon className="w-8 h-8 text-[#2D6BFF] mx-auto mb-3" />
              <h3 className="text-[#F4F6FF] font-medium mb-1">{feature.title}</h3>
              <p className="text-xs text-[#A7B1C8]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="glass-card overflow-hidden mb-16">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#2D6BFF]" />
              <span className="text-[#F4F6FF] font-medium">Quick Start</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm text-[#A7B1C8] hover:text-[#F4F6FF] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-[#070A12]">
            <pre className="text-sm overflow-x-auto">
              <code className="text-[#A7B1C8]">
                {codeExample.split('\n').map((line, i) => (
                  <div key={i} className="font-mono">
                    <span className="text-[#6B7280]">{String(i + 1).padStart(2, '0')}</span>{' '}
                    {line.includes('//') ? (
                      <>
                        <span className="text-[#6B7280]">{line}</span>
                      </>
                    ) : line.includes('const') || line.includes('await') ? (
                      <>
                        <span className="text-[#C084FC]">const</span>
                        <span className="text-[#F4F6FF]">{line.replace('const', '')}</span>
                      </>
                    ) : (
                      <span className="text-[#F4F6FF]">{line}</span>
                    )}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6">API Endpoints</h2>
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-white/5">
              {endpoints.map((endpoint) => (
                <div key={endpoint.path} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint.method === 'GET' ? 'bg-[#10B981]/20 text-[#10B981]' :
                    endpoint.method === 'POST' ? 'bg-[#2D6BFF]/20 text-[#2D6BFF]' :
                    'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-[#F4F6FF] font-mono text-sm">{endpoint.path}</code>
                  <span className="text-[#A7B1C8] text-sm ml-auto">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation & Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-[#2D6BFF]" />
              <h3 className="text-lg font-semibold text-[#F4F6FF]">Documentation</h3>
            </div>
            <p className="text-[#A7B1C8] text-sm mb-4">
              Comprehensive guides, reference materials, and code examples to help you integrate quickly.
            </p>
            <Button className="btn-secondary w-full">
              View Docs
            </Button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-[#2D6BFF]" />
              <h3 className="text-lg font-semibold text-[#F4F6FF]">API Keys</h3>
            </div>
            <p className="text-[#A7B1C8] text-sm mb-4">
              Generate and manage your API keys from your dashboard. Free tier includes 1,000 requests/day.
            </p>
            <Button className="btn-primary w-full">
              Get API Key
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
