
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Index from './pages/Index';
import NewsArticle from './pages/NewsArticle';
import NewsPage from './pages/News';
import TeamPage from './pages/Team';
import FixturesPage from './pages/Fixtures';
import LeagueTable from './pages/LeagueTable';
import StadiumPage from './pages/Stadium';
import TicketsPage from './pages/Tickets';
import StyleGuide from './pages/StyleGuide';
import { Toaster } from './components/ui/sonner';

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <BrowserRouter>
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/fixtures" element={<FixturesPage />} />
            <Route path="/table" element={<LeagueTable />} />
            <Route path="/stadium" element={<StadiumPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/styleguide" element={<StyleGuide />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
