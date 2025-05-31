
import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import Header from '@/components/Header';
import BookGrid from '@/components/BookGrid';
import BookList from '@/components/BookList';
import BookDetailsModal from '@/components/BookDetailsModal';
import MobileNav from '@/components/MobileNav';
import { Book } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid, List, Heart } from 'lucide-react';

const Favorites = () => {
  const { favoriteBooks } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Heart className="mr-3 text-netflix-accent" size={28} />
            Meus Favoritos
          </h1>
          
          {favoriteBooks.length > 0 && (
            <div className="flex items-center space-x-2 bg-netflix-card rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-netflix-accent text-white' 
                    : 'text-netflix-secondary hover:text-white'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-netflix-accent text-white' 
                    : 'text-netflix-secondary hover:text-white'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          )}
        </div>
        
        {favoriteBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Heart size={64} className="text-netflix-secondary/50 mb-4" />
            <p className="text-netflix-secondary text-center text-lg mb-2">
              Você ainda não tem livros favoritos.
            </p>
            <p className="text-netflix-secondary/70 text-sm text-center">
              Clique no coração dos livros para adicioná-los aos seus favoritos
            </p>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <BookGrid books={favoriteBooks} onBookClick={handleBookClick} />
          ) : (
            <BookList books={favoriteBooks} onBookClick={handleBookClick} />
          )
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

export default Favorites;
