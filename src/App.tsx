import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Import Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Import Pages
import HomePage from './pages/HomePage';
import LeagueTablePage from './components/league/LeagueTablePage';
import FixturesPage from './pages/FixturesPage';
import ResultsPage from './pages/ResultsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ImageManager from './pages/admin/ImageManager';
import FixtureManagement from './pages/admin/FixtureManagement';
import NotFoundPage from './pages/NotFoundPage';
import CMSPage from './pages/admin/CMSPage';
import LeagueTableManagement from "./pages/admin/LeagueTableManagement";

// Import Auth Routes
import AuthenticatedRoute from './components/auth/AuthenticatedRoute';
import GuestRoute from './components/auth/GuestRoute';

// Import necessary Toast context
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const { currentUser } = useAuth();

  useEffect(() => {
    // Set document title on initial load
    document.title = 'Banks o’ Dee FC';
  }, []);

  return (
    <HelmetProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/table" element={<MainLayout><LeagueTablePage /></MainLayout>} />
            <Route path="/fixtures" element={<MainLayout><FixturesPage /></MainLayout>} />
            <Route path="/results" element={<MainLayout><ResultsPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
            <Route path="*" element={<Navigate to="/404" replace />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <MainLayout><LoginPage /></MainLayout>
                </GuestRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AuthenticatedRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/admin/images"
              element={
                <AuthenticatedRoute>
                  <AdminLayout><ImageManager /></AdminLayout>
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/admin/fixtures"
              element={
                <AuthenticatedRoute>
                  <AdminLayout><FixtureManagement /></AdminLayout>
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/admin/cms"
              element={
                <AuthenticatedRoute>
                  <AdminLayout><CMSPage /></AdminLayout>
                </AuthenticatedRoute>
              }
            />
            {
              path: "/admin/league-table-management",
              element: <AuthenticatedRoute><AdminLayout><LeagueTableManagement /></AdminLayout></AuthenticatedRoute>
            },
          </Routes>
        </Router>
        <Toaster />
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
