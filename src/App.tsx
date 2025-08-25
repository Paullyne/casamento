import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import WeddingHome from "./pages/WeddingHome";
import RSVPPage from "./pages/RSVPPage";
import GiftsPage from "./pages/GiftsPage";
import GalleryPage from "./pages/GalleryPage";
import VenuePage from "./pages/VenuePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<WeddingHome />} />
            <Route path="rsvp" element={<RSVPPage />} />
            <Route path="gifts" element={<GiftsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="venue" element={<VenuePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
