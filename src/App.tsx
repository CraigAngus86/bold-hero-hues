
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
import LeagueTablePage from './components/league/LeagueTablePage';
import NotFoundPage from './pages/admin/NotFoundPage';
import LeagueTableManagement from "./pages/admin/LeagueTableManagement";
import Admin from './pages/Admin';
import FixturesManagement from './pages/admin/FixturesManagement';

function App() {
  useEffect(() => {
    // Set document title on initial load
    document.title = "Banks o' Dee FC";
  }, []);

  return (
    <HelmetProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><div>Home Page</div></MainLayout>} />
        <Route path="/table" element={<MainLayout><LeagueTablePage /></MainLayout>} />
        <Route path="/fixtures" element={<MainLayout><div>Fixtures Page</div></MainLayout>} />
        <Route path="/results" element={<MainLayout><div>Results Page</div></MainLayout>} />
        <Route path="/contact" element={<MainLayout><div>Contact Page</div></MainLayout>} />
        <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
        <Route path="*" element={<Navigate to="/404" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/fixtures" element={<FixturesManagement />} />
        <Route path="/admin/league-table-management" element={<LeagueTableManagement />} />
      </Routes>
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
