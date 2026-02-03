import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PeoplePage from "./pages/PeoplePage";
import PlatformsPage from "./pages/PlatformsPage";
import CryptoPage from "./pages/CryptoPage";
import InvestingPage from "./pages/InvestingPage";
import AIPage from "./pages/AIPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/type/people" element={<PeoplePage />} />
          <Route path="/type/platforms" element={<PlatformsPage />} />
          <Route path="/category/crypto" element={<CryptoPage />} />
          <Route path="/category/investing" element={<InvestingPage />} />
          <Route path="/category/ai" element={<AIPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
