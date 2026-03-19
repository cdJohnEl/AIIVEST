import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InvestmentProvider } from './contexts/InvestmentContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import InvestmentPlans from './pages/InvestmentPlans';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Features from './pages/Features';
import Security from './pages/Security';
import API from './pages/API';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Partners from './pages/Partners';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Disclosures from './pages/Disclosures';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import Status from './pages/Status';
import Community from './pages/Community';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TransactionManagement from './pages/admin/TransactionManagement';
import AffiliateProgram from './pages/AffiliateProgram';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { LiveChat } from './components/LiveChat';
import './App.css';

function AppRoutes() {
  const { loading, isAuthenticated, user } = useAuth();

  console.log('AppRoutes: Rendering...', { loading, isAuthenticated, userId: user?.id });

  if (loading) {
    console.log('AppRoutes: Showing loading spinner');
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2D6BFF]/20 border-t-[#2D6BFF] rounded-full animate-spin" />
      </div>
    );
  }

  console.log('AppRoutes: Rendering main layout');
  return (
    <div className="relative min-h-screen bg-[#070A12]">
      <div className="noise-overlay" />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/plans" element={
          <ProtectedRoute>
            <InvestmentPlans />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        
        {/* Product Routes */}
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={
          <ProtectedRoute>
            <InvestmentPlans />
          </ProtectedRoute>
        } />
        <Route path="/security" element={<Security />} />
        <Route path="/api" element={<API />} />
        
        {/* Company Routes */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/affiliate-program" element={<AffiliateProgram />} />
        
        {/* Legal Routes */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/disclosures" element={<Disclosures />} />
        
        {/* Support Routes */}
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/status" element={<Status />} />
        <Route path="/community" element={<Community />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LiveChat />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InvestmentProvider>
        <Router>
          <AppRoutes />
        </Router>
      </InvestmentProvider>
    </AuthProvider>
  );
}

export default App;
