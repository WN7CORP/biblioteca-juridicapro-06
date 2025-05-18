
import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import Header from '@/components/Header';
import BookGrid from '@/components/BookGrid';
import BookDetailsModal from '@/components/BookDetailsModal';
import MobileNav from '@/components/MobileNav';
import { Book } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

// For the reading page, we're using the mock data for now
// In a real app, this would track which books the user is currently reading
const Reading = () => {
  const { books } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Mock reading list (first two books)
  const readingBooks = books.slice(0, 2);

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
        <h1 className="text-2xl font-bold mb-6">Lendo Atualmente</h1>
        
        {readingBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-netflix-secondary text-center">
              Você não está lendo nenhum livro no momento.
            </p>
          </div>
        ) : (
          <BookGrid books={readingBooks} onBookClick={handleBookClick} />
        )}
      </div>
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default Reading;
