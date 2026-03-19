import { 
  Users, 
  MessageSquare, 
  Twitter, 
  Send,
  Youtube,
  TrendingUp,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const communityStats = [
  { value: '50K+', label: 'Community Members' },
  { value: '10K+', label: 'Daily Active Users' },
  { value: '100+', label: 'Countries' },
  { value: '24/7', label: 'Support' },
];

const socialChannels = [
  {
    icon: Twitter,
    name: 'Twitter',
    handle: '@AIInvestPro',
    followers: '125K',
    description: 'Latest updates, market insights, and announcements',
    url: 'https://twitter.com/aiinvestpro',
    color: '#1DA1F2',
  },
  {
    icon: Send,
    name: 'Telegram',
    handle: 'AIInvestPro',
    followers: '85K',
    description: 'Real-time discussions and community support',
    url: 'https://t.me/aiinvestpro',
    color: '#0088cc',
  },
  {
    icon: MessageSquare,
    name: 'Discord',
    handle: 'AI Invest Pro',
    followers: '45K',
    description: 'Deep dives, strategy discussions, and events',
    url: 'https://discord.gg/aiinvestpro',
    color: '#5865F2',
  },
  {
    icon: Youtube,
    name: 'YouTube',
    handle: 'AI Invest Pro',
    followers: '30K',
    description: 'Tutorials, webinars, and educational content',
    url: 'https://youtube.com/aiinvestpro',
    color: '#FF0000',
  },
];

const topContributors = [
  { name: 'Alex M.', role: 'Top Investor', contribution: '$2.4M invested' },
  { name: 'Sarah K.', role: 'Community Helper', contribution: '500+ answers' },
  { name: 'James L.', role: 'Early Adopter', contribution: 'Since 2020' },
  { name: 'Maria R.', role: 'Strategy Expert', contribution: '15% avg ROI' },
];

const upcomingEvents = [
  {
    title: 'Weekly AMA with Founders',
    date: 'Every Friday, 3 PM UTC',
    description: 'Ask anything about our roadmap and vision',
  },
  {
    title: 'Investment Strategy Workshop',
    date: 'Dec 28, 2024',
    description: 'Learn advanced portfolio management techniques',
  },
  {
    title: 'Crypto Market Outlook 2025',
    date: 'Jan 5, 2025',
    description: 'Expert predictions and analysis for the new year',
  },
];

export default function Community() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    try {
      await addDoc(collection(db, 'subscribers'), {
        email: email.trim().toLowerCase(),
        subscribedAt: serverTimestamp(),
        source: 'community_newsletter'
      });

      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
    } catch (error) {
      console.error('Newsletter Error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-4">
            Join Our <span className="text-gradient">Community</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Connect with 50,000+ investors worldwide. Share strategies, get support, 
            and stay updated on the latest from AI Invest Pro.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {communityStats.map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#2D6BFF] mb-1">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Social Channels */}
        <div className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] text-center mb-8">
            Connect With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-6 hover:border-[#2D6BFF]/30 transition-all group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${channel.color}20` }}
                >
                  <channel.icon className="w-6 h-6" style={{ color: channel.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">{channel.name}</h3>
                <p className="text-sm text-[#2D6BFF] mb-2">{channel.handle}</p>
                <p className="text-xs text-[#A7B1C8] mb-3">{channel.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F4F6FF]">{channel.followers} followers</span>
                  <ArrowRight className="w-4 h-4 text-[#A7B1C8] group-hover:text-[#2D6BFF] transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Top Contributors */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#F59E0B]" />
              <h2 className="text-xl font-bold text-[#F4F6FF]">Top Contributors</h2>
            </div>
            <div className="space-y-4">
              {topContributors.map((contributor) => (
                <div key={contributor.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D6BFF] to-[#1a4fd1] flex items-center justify-center">
                    <span className="text-white font-semibold">{contributor.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#F4F6FF] font-medium">{contributor.name}</p>
                    <p className="text-xs text-[#A7B1C8]">{contributor.role}</p>
                  </div>
                  <span className="text-sm text-[#10B981]">{contributor.contribution}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-[#2D6BFF]" />
              <h2 className="text-xl font-bold text-[#F4F6FF]">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.title} className="border-l-2 border-[#2D6BFF] pl-4">
                  <h3 className="text-[#F4F6FF] font-medium mb-1">{event.title}</h3>
                  <p className="text-xs text-[#2D6BFF] mb-1">{event.date}</p>
                  <p className="text-sm text-[#A7B1C8]">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass-card p-8 text-center relative overflow-hidden">
          {subscribed ? (
            <div className="py-8 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[#10B981]" />
              </div>
              <h2 className="text-2xl font-bold text-[#F4F6FF] mb-2">You're on the list!</h2>
              <p className="text-[#A7B1C8]">Thank you for subscribing to the AIVEST newsletter.</p>
            </div>
          ) : (
            <>
              <TrendingUp className="w-10 h-10 text-[#2D6BFF] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#F4F6FF] mb-2">
                Stay in the Loop
              </h2>
              <p className="text-[#A7B1C8] mb-6 max-w-lg mx-auto">
                Subscribe to our newsletter for weekly market insights, product updates, 
                and exclusive community content.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F4F6FF] placeholder:text-[#A7B1C8] focus:outline-none focus:border-[#2D6BFF]"
                />
                <Button type="submit" disabled={isSubscribing} className="btn-primary w-full sm:w-auto min-w-[120px]">
                  {isSubscribing ? 'Joining...' : 'Subscribe'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
