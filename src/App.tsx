
import React, { useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

// Import Layouts
import MainLayout from './components/layout/MainLayout';
import { AdminLayout } from './components/admin/layout';

// Import Pages
import Index from './pages/Index';
import LeagueTablePage from './components/league/LeagueTablePage';
import NotFoundPage from './pages/admin/NotFoundPage';
import LeagueTableManagement from "./pages/admin/LeagueTableManagement";
import FixturesManagement from './pages/admin/FixturesManagement';
import Admin from './pages/Admin';
import NewsManagement from './pages/admin/NewsManagement';
import TeamManagement from './pages/admin/TeamManagement';

function App() {
  useEffect(() => {
    // Set document title on initial load
    document.title = "Banks o' Dee FC";
  }, []);

  return (
    <HelmetProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/table" element={<MainLayout><LeagueTablePage /></MainLayout>} />
        <Route path="/fixtures" element={<MainLayout><div>Fixtures Page</div></MainLayout>} />
        <Route path="/results" element={<MainLayout><div>Results Page</div></MainLayout>} />
        <Route path="/news" element={<MainLayout><div>News Page</div></MainLayout>} />
        <Route path="/team" element={<MainLayout><div>Team Page</div></MainLayout>} />
        <Route path="/stadium" element={<MainLayout><div>Spain Park Page</div></MainLayout>} />
        <Route path="/tickets" element={<MainLayout><div>Tickets Page</div></MainLayout>} />
        <Route path="/contact" element={<MainLayout><div>Contact Page</div></MainLayout>} />
        <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
        <Route path="*" element={<Navigate to="/404" replace />} />

        {/* Admin Routes - All using AdminLayout */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/fixtures" element={<AdminLayout><FixturesManagement /></AdminLayout>} />
        <Route path="/admin/league-table-management" element={<AdminLayout><LeagueTableManagement /></AdminLayout>} />
        <Route path="/admin/news" element={<AdminLayout><NewsManagement /></AdminLayout>} />
        <Route path="/admin/team" element={<AdminLayout><TeamManagement /></AdminLayout>} />
        <Route path="/admin/images" element={<AdminLayout><div>Media Management</div></AdminLayout>} />
        <Route path="/admin/sponsors" element={<AdminLayout><div>Sponsors Management</div></AdminLayout>} />
      </Routes>
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
