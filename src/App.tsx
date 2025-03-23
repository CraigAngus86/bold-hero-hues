
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Index from "./pages/Index";
import News from "./pages/News";
import Team from "./pages/Team";
import Fixtures from "./pages/Fixtures";
import LeagueTable from "./pages/LeagueTable";
import Stadium from "./pages/Stadium";
import Tickets from "./pages/Tickets";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a new QueryClient instance inside the component
  // This fixes the "dispatcher.useEffect" error
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/team" element={<Team />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/table" element={<LeagueTable />} />
              <Route path="/stadium" element={<Stadium />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
