
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
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        <Route path="/admin/news" element={
          <RequireAuth>
            <NewsManagement />
          </RequireAuth>
        } />
        <Route path="/admin/team" element={
          <RequireAuth>
            <TeamManagement />
          </RequireAuth>
        } />
        <Route path="/admin/fixtures" element={
          <RequireAuth>
            <FixtureManagement />
          </RequireAuth>
        } />
        <Route path="/admin/media" element={
          <RequireAuth>
            <Media />
          </RequireAuth>
        } />
        <Route path="/admin/tickets" element={
          <RequireAuth>
            <Tickets />
          </RequireAuth>
        } />
        <Route path="/admin/sponsors" element={
          <RequireAuth>
            <Sponsors />
          </RequireAuth>
        } />
        <Route path="/admin/league-table-management" element={
          <RequireAuth>
            <LeagueTableManagement />
          </RequireAuth>
        } />
        <Route path="/admin/settings" element={
          <RequireAuth allowedRoles={['admin']}>
            <Settings />
          </RequireAuth>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
