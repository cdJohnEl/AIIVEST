import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Server,
  Globe,
  Database,
  Shield
} from 'lucide-react';

const systems = [
  {
    name: 'Trading Engine',
    status: 'operational',
    uptime: '99.99%',
    lastIncident: '45 days ago',
  },
  {
    name: 'Deposit Processing',
    status: 'operational',
    uptime: '99.97%',
    lastIncident: '12 days ago',
  },
  {
    name: 'Withdrawal Processing',
    status: 'operational',
    uptime: '99.98%',
    lastIncident: '23 days ago',
  },
  {
    name: 'API',
    status: 'operational',
    uptime: '99.99%',
    lastIncident: '67 days ago',
  },
  {
    name: 'User Dashboard',
    status: 'operational',
    uptime: '99.95%',
    lastIncident: '8 days ago',
  },
  {
    name: 'AI Analytics',
    status: 'operational',
    uptime: '99.99%',
    lastIncident: '91 days ago',
  },
];

const incidents = [
  {
    date: 'Dec 10, 2024',
    title: 'Minor API Latency',
    status: 'resolved',
    duration: '15 minutes',
    description: 'Experienced elevated response times due to increased traffic. Issue was resolved automatically.',
  },
  {
    date: 'Nov 28, 2024',
    title: 'Scheduled Maintenance',
    status: 'resolved',
    duration: '2 hours',
    description: 'Planned system upgrade to improve performance and security.',
  },
  {
    date: 'Oct 15, 2024',
    title: 'Deposit Processing Delay',
    status: 'resolved',
    duration: '45 minutes',
    description: 'Bitcoin network congestion caused temporary delays in deposit confirmations.',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle2 className="w-5 h-5 text-[#10B981]" />;
    case 'degraded':
      return <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />;
    case 'down':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-[#A7B1C8]" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'operational':
      return 'bg-[#10B981]/20 text-[#10B981]';
    case 'degraded':
      return 'bg-[#F59E0B]/20 text-[#F59E0B]';
    case 'down':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-[#A7B1C8]/20 text-[#A7B1C8]';
  }
};

export default function Status() {
  const allOperational = systems.every(s => s.status === 'operational');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-[#2D6BFF]/20 flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-[#2D6BFF]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F4F6FF] mb-4">
            System Status
          </h1>
          <p className="text-xl text-[#A7B1C8]">
            Real-time status of NexusFinPro services
          </p>
        </div>

        {/* Overall Status */}
        <div className={`glass-card p-8 mb-8 text-center ${allOperational ? 'border-l-4 border-[#10B981]' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            {allOperational ? (
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-[#F59E0B]" />
            )}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${allOperational ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
            {allOperational ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
          </h2>
          <p className="text-[#A7B1C8]">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Server, label: 'Uptime', value: '99.99%' },
            { icon: Globe, label: 'Regions', value: '12' },
            { icon: Database, label: 'API Calls/Day', value: '50M+' },
            { icon: Shield, label: 'Incidents (30d)', value: '0' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className="w-6 h-6 text-[#2D6BFF] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#F4F6FF]">{stat.value}</div>
              <div className="text-xs text-[#A7B1C8]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Systems Status */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-[#F4F6FF] mb-6">System Components</h2>
          <div className="space-y-4">
            {systems.map((system) => (
              <div key={system.name} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  {getStatusIcon(system.status)}
                  <span className="text-[#F4F6FF]">{system.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-[#A7B1C8]">Uptime: {system.uptime}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(system.status)}`}>
                    {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-[#F4F6FF] mb-6">Recent Incidents</h2>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <div key={index} className="border-l-2 border-[#2D6BFF] pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[#A7B1C8]">{incident.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                    {incident.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#F4F6FF] mb-1">{incident.title}</h3>
                <p className="text-sm text-[#A7B1C8] mb-1">{incident.description}</p>
                <p className="text-xs text-[#A7B1C8]">Duration: {incident.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe */}
        <div className="glass-card p-6 mt-8 text-center">
          <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">
            Subscribe to Status Updates
          </h3>
          <p className="text-[#A7B1C8] mb-4">
            Get notified when incidents occur or are resolved.
          </p>
          <a 
            href="mailto:status@aiinvestpro.com?subject=Subscribe to Status Updates"
            className="text-[#2D6BFF] hover:underline"
          >
            Subscribe via Email
          </a>
        </div>
      </div>
    </div>
  );
}
