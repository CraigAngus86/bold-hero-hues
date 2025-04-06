
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/admin/auth/RequireAuth';

// Public pages
import Home from './pages/Home';
import News from './pages/News';
import Article from './pages/Article';
import Team from './pages/Team';
import Fixtures from './pages/Fixtures';
import Table from './pages/Table';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import TeamManagement from './pages/admin/TeamManagement';
import FixtureManagement from './pages/admin/FixtureManagement';
import Media from './pages/admin/Media';
import Tickets from './pages/admin/Tickets';
import Settings from './pages/admin/Settings';
import Sponsors from './pages/admin/Sponsors';
import LeagueTableManagement from './pages/admin/LeagueTableManagement';
import FansManagement from './pages/admin/FansManagement';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<Article />} />
        <Route path="/team" element={<Team />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/table" element={<Table />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Admin Routes - No longer protected */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/team" element={<TeamManagement />} />
        <Route path="/admin/fixtures" element={<FixtureManagement />} />
        <Route path="/admin/media" element={<Media />} />
        <Route path="/admin/tickets" element={<Tickets />} />
        <Route path="/admin/sponsors" element={<Sponsors />} />
        <Route path="/admin/league-table-management" element={<LeagueTableManagement />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/fans" element={<FansManagement />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
