
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from "@/components/ui/sonner";

// Static components for immediate loading
import Navbar from '@/components/Navbar';

// Import the StaticHome component
import StaticHome from '@/pages/StaticHome';

// Lazy-loaded components
const News = lazy(() => import('@/pages/News'));
const Team = lazy(() => import('@/pages/Team'));
const Fixtures = lazy(() => import('@/pages/Fixtures'));
const LeagueTable = lazy(() => import('@/pages/LeagueTable'));
const Stadium = lazy(() => import('@/pages/Stadium'));
const Tickets = lazy(() => import('@/pages/Tickets'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const App = () => {
  return (
    <>
      <Helmet defaultTitle="Banks o' Dee FC" titleTemplate="%s | Banks o' Dee FC" />
      
      <Navbar />
      
      <main className="pt-24"> {/* Add padding-top to account for the fixed navbar */}
        <Suspense fallback={<div className="flex items-center justify-center min-h-[70vh]">Loading...</div>}>
          <Routes>
            <Route path="/" element={<StaticHome />} />
            <Route path="/news" element={<News />} />
            <Route path="/team" element={<Team />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/table" element={<LeagueTable />} />
            <Route path="/stadium" element={<Stadium />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      <Toaster />
    </>
  );
};

export default App;
