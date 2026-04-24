import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck,
  Menu,
  X,
  History,
  Briefcase
} from 'lucide-react';
import { Button } from './ui/button';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2D6BFF]/20 border-t-[#2D6BFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Transactions', path: '/admin/transactions', icon: History },
    { name: 'Investments', path: '/admin/investments', icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-[#070A12] text-[#F4F6FF]">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 border-r border-white/10 bg-[#0A0E1A] flex flex-col fixed h-full z-50`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#2D6BFF]" />
              <span className="font-bold tracking-tight">ADMIN PANEL</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg text-[#A7B1C8]"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#2D6BFF] text-white' 
                    : 'text-[#A7B1C8] hover:bg-white/5 hover:text-[#F4F6FF]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full flex items-center gap-3 text-[#A7B1C8] hover:text-[#E11D48] hover:bg-[#E11D48]/10"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 p-8 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
