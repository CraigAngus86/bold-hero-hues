import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

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
// Add import for FansManagement
import FansManagement from "./pages/admin/FansManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";

// Import error fallback component
import ErrorFallback from './components/ErrorFallback';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="banks-o-dee-theme">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
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
              <Route path="/admin/settings" element={<SettingsManagement />} />
              
              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HelmetProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
