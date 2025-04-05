
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Import pages
const Index = lazy(() => import('./pages/Index'));
const News = lazy(() => import('./pages/News'));
const Team = lazy(() => import('./pages/Team'));
const Fixtures = lazy(() => import('./pages/Fixtures'));
const LeagueTable = lazy(() => import('./pages/LeagueTable'));
const Stadium = lazy(() => import('./pages/Stadium'));
const Tickets = lazy(() => import('./pages/Tickets'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Admin = lazy(() => import('./pages/Admin'));

// Import UI components
const Loading = lazy(() => import('./components/ui/Loading'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/news/*" element={<News />} />
            <Route path="/team" element={<Team />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/table" element={<LeagueTable />} />
            <Route path="/stadium" element={<Stadium />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
