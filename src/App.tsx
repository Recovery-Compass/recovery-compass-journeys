
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import PathwaySelect from "./pages/PathwaySelect";
import CompassCompanion from "./pages/CompassCompanion";
import ImpactTranslator from "./pages/ImpactTranslator";
import NotFound from "./pages/NotFound";
import { trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();

// Analytics wrapper component to track page views
const AnalyticsWrapper = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view on every route change
    trackPageView(document.title);
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsWrapper />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pathways" element={<PathwaySelect />} />
          <Route path="/compass-companion" element={<CompassCompanion />} />
          <Route path="/impact-translator" element={<ImpactTranslator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
