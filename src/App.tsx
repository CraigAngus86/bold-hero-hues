
import React, { useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Import Layouts
import MainLayout from './components/layout/MainLayout';
import { AdminLayout } from './components/admin/layout';

// Import Pages
import Index from './pages/Index';
import LeagueTablePage from './components/league/LeagueTablePage';
import NotFoundPage from './pages/admin/NotFoundPage';
import LeagueTableManagement from "./pages/admin/LeagueTableManagement";
import FixturesManagement from './pages/admin/FixturesManagement';
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import TeamManagement from './pages/admin/TeamManagement';
import MediaGallery from './pages/admin/MediaGallery';
import Team from './pages/Team';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    // Set document title on initial load
    document.title = "Banks o' Dee FC";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/table" element={<MainLayout><LeagueTablePage /></MainLayout>} />
          <Route path="/fixtures" element={<MainLayout><div>Fixtures Page</div></MainLayout>} />
          <Route path="/results" element={<MainLayout><div>Results Page</div></MainLayout>} />
          <Route path="/news" element={<MainLayout><div>News Page</div></MainLayout>} />
          <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
          <Route path="/stadium" element={<MainLayout><div>Spain Park Page</div></MainLayout>} />
          <Route path="/tickets" element={<MainLayout><div>Tickets Page</div></MainLayout>} />
          <Route path="/contact" element={<MainLayout><div>Contact Page</div></MainLayout>} />
          <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
          <Route path="*" element={<Navigate to="/404" replace />} />

          {/* Admin Routes - All using AdminLayout */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/fixtures" element={<FixturesManagement />} />
          <Route path="/admin/league-table-management" element={<LeagueTableManagement />} />
          <Route path="/admin/news" element={<NewsManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/images" element={<MediaGallery />} />
          <Route path="/admin/sponsors" element={<AdminLayout><div>Sponsors Management</div></AdminLayout>} />
          <Route path="/admin/tickets" element={<AdminLayout><div>Tickets Management</div></AdminLayout>} />
          <Route path="/admin/fans" element={<AdminLayout><div>Fans Zone Management</div></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><div>Settings</div></AdminLayout>} />
        </Routes>
        <Toaster />
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
