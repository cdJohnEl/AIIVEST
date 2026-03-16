import { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Globe, 
  Clock, 
  DollarSign, 
  Heart,
  Zap,
  Users,
  Coffee,
  Laptop,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  { icon: DollarSign, title: 'Competitive Salary', description: 'Top-tier compensation packages' },
  { icon: Globe, title: 'Remote First', description: 'Work from anywhere in the world' },
  { icon: Heart, title: 'Health Coverage', description: 'Comprehensive medical, dental, vision' },
  { icon: Zap, title: 'Learning Budget', description: '$5,000/year for courses & conferences' },
  { icon: Coffee, title: 'Flexible Hours', description: 'Work when you are most productive' },
  { icon: Laptop, title: 'Equipment', description: 'Latest MacBook Pro + home office setup' },
];

const openings = [
  {
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$150k - $200k',
  },
  {
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    location: 'Remote',
    type: 'Full-time',
    salary: '$160k - $220k',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $160k',
  },
  {
    title: 'Security Engineer',
    department: 'Security',
    location: 'Remote',
    type: 'Full-time',
    salary: '$140k - $190k',
  },
  {
    title: 'Customer Success Manager',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $110k',
  },
  {
    title: 'Blockchain Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$150k - $210k',
  },
];

const values = [
  {
    title: 'Move Fast',
    description: 'Speed matters. We make decisions quickly and iterate rapidly.',
  },
  {
    title: 'Think Big',
    description: 'We are building the future of finance. No idea is too ambitious.',
  },
  {
    title: 'User First',
    description: 'Every decision starts with what is best for our users.',
  },
  {
    title: 'Stay Humble',
    description: 'We are always learning and open to feedback.',
  },
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-6">
            Join Our <span className="text-gradient">Team</span>
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            Help us build the future of wealth management. We are always looking for 
            exceptional talent to join our remote-first team.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '50+', label: 'Team Members' },
            { value: '25+', label: 'Countries' },
            { value: '4.9★', label: 'Employee Rating' },
            { value: '$2.4B', label: 'AUM' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#2D6BFF] mb-1">{stat.value}</div>
              <div className="text-sm text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] text-center mb-8">
            Why Work With Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card p-6 text-center">
                <benefit.icon className="w-8 h-8 text-[#2D6BFF] mx-auto mb-3" />
                <h3 className="text-[#F4F6FF] font-medium mb-1">{benefit.title}</h3>
                <p className="text-xs text-[#A7B1C8]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="glass-card p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#F4F6FF] text-center mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">{value.title}</h3>
                <p className="text-sm text-[#A7B1C8]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] text-center mb-8">
            Open Positions
          </h2>
          <div className="space-y-4">
            {openings.map((job) => (
              <div
                key={job.title}
                className="glass-card p-6 hover:border-[#2D6BFF]/30 transition-all cursor-pointer"
                onClick={() => setSelectedJob(selectedJob === job.title ? null : job.title)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#A7B1C8]">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#10B981] font-medium">{job.salary}</span>
                    <Button className="btn-primary text-sm">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-card p-8">
          <Users className="w-12 h-12 text-[#2D6BFF] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F4F6FF] mb-2">
            Do not See the Right Role?
          </h3>
          <p className="text-[#A7B1C8] mb-4">
            We are always interested in meeting talented people. Send us your resume.
          </p>
          <a 
            href="mailto:careers@aiinvestpro.com" 
            className="text-[#2D6BFF] hover:underline"
          >
            careers@aiinvestpro.com
          </a>
        </div>
      </div>
    </div>
  );
}
