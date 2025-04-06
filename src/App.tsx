
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import ErrorBoundary from './components/ErrorBoundary';

// Import public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import admin pages
import Dashboard from "./pages/admin/Dashboard";
import NewsManagement from "./pages/admin/NewsManagement";
import TeamManagement from "./pages/admin/TeamManagement";
import FixturesManagement from "./pages/admin/FixturesManagement";
import LeagueTableManagement from "./pages/admin/LeagueTableManagement";
import MediaGallery from "./pages/admin/MediaGallery";
import SponsorsManagement from "./pages/admin/SponsorsManagement";
import TicketsManagement from "./pages/admin/TicketsManagement";
import FansManagement from "./pages/admin/FansManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="banks-o-dee-theme">
      <ErrorBoundary>
        <HelmetProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/news" element={<NewsManagement />} />
            <Route path="/admin/team" element={<TeamManagement />} />
            <Route path="/admin/fixtures" element={<FixturesManagement />} />
            <Route path="/admin/league-table-management" element={<LeagueTableManagement />} />
            <Route path="/admin/images" element={<MediaGallery />} />
            <Route path="/admin/sponsors" element={<SponsorsManagement />} />
            <Route path="/admin/tickets" element={<TicketsManagement />} />
            <Route path="/admin/fans" element={<FansManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HelmetProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
