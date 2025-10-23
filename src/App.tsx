import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TelegramProvider } from "./contexts/TelegramContext";
import { AppLayout } from "./components/AppLayout";
import Index from "./pages/Index";
import Phuket from "./pages/Phuket";
import Beaches from "./pages/Beaches";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import PlaceDetail from "./pages/PlaceDetail";
import NotFound from "./pages/NotFound";
import { CartDrawer } from "./components/CartDrawer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TelegramProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartDrawer />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/phuket" element={<Phuket />} />
              <Route path="/beaches" element={<Beaches />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/ai-concierge" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/place/:handle" element={<PlaceDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </TelegramProvider>
  </QueryClientProvider>
);

export default App;
