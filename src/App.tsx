import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/admin/auth/RequireAuth';

// Static Home Page
import StaticHome from './pages/StaticHome';

// Other pages that we'll keep but not use for now
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
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Use the new static home page as the main route */}
        <Route path="/" element={<StaticHome />} />
        
        {/* Keep other routes but they won't be actively used for now */}
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<Article />} />
        <Route path="/team" element={<Team />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/table" element={<Table />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
