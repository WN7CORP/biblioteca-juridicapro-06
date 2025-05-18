
import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import Header from '@/components/Header';
import AreaFilter from '@/components/AreaFilter';
import BookGrid from '@/components/BookGrid';
import BookDetailsModal from '@/components/BookDetailsModal';
import MobileNav from '@/components/MobileNav';
import { Book } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import AISearchBar from '@/components/AISearchBar';
import AreaStats from '@/components/AreaStats';
import FAQ from '@/components/FAQ';
import UpdatedBooksSection from '@/components/UpdatedBooksSection';

const Index = () => {
  const { filteredBooks } = useLibrary();
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

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      {isMobile ? <MobileNav /> : <Header />}
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-20' : 'pt-24'} pb-16`}>
        {/* Search Bar with AI Integration */}
        <AISearchBar />
        
        {/* Statistics Overview */}
        <AreaStats />
        
        {/* Recently Updated Books */}
        <UpdatedBooksSection books={filteredBooks} onBookClick={handleBookClick} />
        
        {/* Area Filter + Book Grid */}
        <AreaFilter />
        <BookGrid books={filteredBooks} onBookClick={handleBookClick} />
        
        {/* FAQ Section */}
        <FAQ />
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
