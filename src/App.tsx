
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "./contexts/LibraryContext";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import ReadBook from "./pages/ReadBook";
import Favorites from "./pages/Favorites";
import Reading from "./pages/Reading";
import Annotations from "./pages/Annotations";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import AppTutorial from "./components/AppTutorial";

const queryClient = new QueryClient();

const App = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  
  useEffect(() => {
    // Check if it's the user's first visit
    const tutorialSeen = localStorage.getItem('tutorialSeen');
    if (!tutorialSeen) {
      setIsFirstVisit(true);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <LibraryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppTutorial isFirstVisit={isFirstVisit} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/read/:bookId" element={<ReadBook />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/reading" element={<Reading />} />
              <Route path="/annotations" element={<Annotations />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:areaName" element={<Categories />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LibraryProvider>
    </QueryClientProvider>
  );
};

export default App;
