import { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    value: 'support@nexusfinpro.com',
    description: 'General inquiries and support',
    responseTime: '24 hours',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    value: 'Available 24/7',
    description: 'Instant assistance from our team',
    responseTime: 'Instant',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (888) 123-4567',
    description: 'For urgent matters only',
    responseTime: 'Business hours',
  },
];

const departments = [
  { name: 'General Support', email: 'support@nexusfinpro.com' },
  { name: 'Sales', email: 'admin@nexusfinpro.com' },
  { name: 'Partnerships', email: 'partnerships@nexusfinpro.com' },
  { name: 'Press', email: 'info@nexusfinpro.com' },
  { name: 'Security', email: 'security@nexusfinpro.com' },
  { name: 'Legal', email: 'info@nexusfinpro.com' },
];

const socialLinks = [
  { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/nexusfinpro' },
  { icon: Linkedin, name: 'LinkedIn', url: 'https://linkedin.com/company/nexusfinpro' },
  { icon: Github, name: 'GitHub', url: 'https://github.com/nexusfinpro' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6FF] mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-[#A7B1C8] max-w-2xl mx-auto">
            We are here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method) => (
            <div key={method.title} className="glass-card p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#2D6BFF]/10 flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-7 h-7 text-[#2D6BFF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">{method.title}</h3>
              <p className="text-[#2D6BFF] font-medium mb-1">{method.value}</p>
              <p className="text-sm text-[#A7B1C8] mb-2">{method.description}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-[#10B981]">
                <Clock className="w-3 h-3" />
                {method.responseTime}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">Message Sent!</h3>
                <p className="text-[#A7B1C8]">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#A7B1C8] mb-1 block">Name</label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-[#F4F6FF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#A7B1C8] mb-1 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-[#F4F6FF]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#A7B1C8] mb-1 block">Subject</label>
                  <Input
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-white/5 border-white/10 text-[#F4F6FF]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-[#A7B1C8] mb-1 block">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white/5 border-white/10 text-[#F4F6FF] min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-primary">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Departments & Social */}
          <div className="space-y-6">
            {/* Departments */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-[#F4F6FF] mb-4">Department Contacts</h2>
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <span className="text-[#A7B1C8]">{dept.name}</span>
                    <a 
                      href={`mailto:${dept.email}`}
                      className="text-sm text-[#2D6BFF] hover:underline"
                    >
                      {dept.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-[#F4F6FF] mb-4">Follow Us</h2>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#2D6BFF]/20 transition-colors"
                  >
                    <social.icon className="w-5 h-5 text-[#A7B1C8]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Office Location */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-[#2D6BFF]" />
                <h2 className="text-lg font-bold text-[#F4F6FF]">Headquarters</h2>
              </div>
              <p className="text-[#A7B1C8]">
                123 Finance Street<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
