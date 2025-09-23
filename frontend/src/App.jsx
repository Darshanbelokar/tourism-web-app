import { Toaster } from "@/components/UI/toaster";
import { Toaster as Sonner } from "@/components/UI/sooner";
import { TooltipProvider } from "@/components/UI/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import FeedbackSystem from "./components/FeedbackSystem";
import Marketplace from "./components/Marketplace";
import TransportTracker from "./components/TransportTracker";
import DestinationDetail from "./components/DestinationDetail";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/feedback" element={<FeedbackSystem targetType="spot" targetId={null} />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/transport" element={<TransportTracker />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
