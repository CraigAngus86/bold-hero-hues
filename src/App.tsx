
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Team from './pages/Team';
import Fixtures from './pages/Fixtures';
import LeagueTable from './pages/LeagueTable';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import Stadium from './pages/Stadium';
import Tickets from './pages/Tickets';
import StyleGuide from './pages/StyleGuide';

// Admin pages
import Admin from './pages/Admin';
import Dashboard from './pages/admin/Dashboard';
import TeamManagement from './pages/admin/TeamManagement';
import { default as AdminFixtures } from './pages/admin/Fixtures';
import FixturesManagement from './pages/admin/FixturesManagement';
import NewsManagement from './pages/admin/NewsManagement';

// Toast notifications
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/team" element={<Team />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/league" element={<LeagueTable />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/stadium" element={<Stadium />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/styleguide" element={<StyleGuide />} />
        
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/team" element={<TeamManagement />} />
        <Route path="/admin/fixtures" element={<AdminFixtures />} />
        <Route path="/admin/fixtures-management" element={<FixturesManagement />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}

export default App;
