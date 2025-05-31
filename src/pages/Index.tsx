
import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import Header from '@/components/Header';
import BookDetailsModal from '@/components/BookDetailsModal';
import MobileNav from '@/components/MobileNav';
import HeroSection from '@/components/HeroSection';
import FeaturedBooksSection from '@/components/FeaturedBooksSection';
import QuickStartGuide from '@/components/QuickStartGuide';
import AISearchBar from '@/components/AISearchBar';
import AreaStats from '@/components/AreaStats';
import FAQ from '@/components/FAQ';
import { Book } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { isLoading } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background text-netflix-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-netflix-accent mx-auto mb-4"></div>
          <p className="text-netflix-secondary">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text" data-intro="welcome">
      {isMobile ? <MobileNav /> : <Header />}
      
      <div className={`${isMobile ? 'pt-20' : 'pt-24'}`}>
        {/* Hero Section */}
        <HeroSection />
        
        <div className="container mx-auto px-4 pb-16">
          {/* Search Bar with AI Integration */}
          <div data-intro="search" className="mb-12">
            <AISearchBar />
          </div>
          
          {/* Quick Start Guide for new users */}
          <QuickStartGuide />
          
          {/* Featured Books Section */}
          <FeaturedBooksSection />
          
          {/* Statistics Overview */}
          <AreaStats />
          
          {/* FAQ Section */}
          <div data-intro="faq">
            <FAQ />
          </div>
        </div>
      </div>
      
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default Index;
