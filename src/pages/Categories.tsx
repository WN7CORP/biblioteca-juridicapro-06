
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import MobileNav from '@/components/MobileNav';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Sparkles } from 'lucide-react';
import BookList from '@/components/BookList';
import BookDetailsModal from '@/components/BookDetailsModal';
import CategoryHeroSection from '@/components/CategoryHeroSection';
import SimpleCategoryCard from '@/components/SimpleCategoryCard';

const Categories: React.FC = () => {
  const { books } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { areaName } = useParams<{ areaName?: string }>();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedBookId, setHighlightedBookId] = useState<number | null>(null);

  // Check if we came from AI search with a book to highlight
  useEffect(() => {
    if (location.state?.highlightBookId) {
      setHighlightedBookId(location.state.highlightBookId);
      
      setTimeout(() => {
        const bookElement = document.querySelector(`[data-book-id="${location.state.highlightBookId}"]`);
        if (bookElement) {
          bookElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);

      setTimeout(() => {
        setHighlightedBookId(null);
      }, 3000);
    }
  }, [location.state]);

  // Get areas and count books in each area
  const areaStats = books.reduce((acc: Record<string, number>, book) => {
    if (!acc[book.area]) {
      acc[book.area] = 0;
    }
    acc[book.area]++;
    return acc;
  }, {});

  // Sort areas by book count (most popular first)
  const sortedAreas = Object.entries(areaStats).sort(([, countA], [, countB]) => countB - countA);

  // Filter books by selected area if any
  const filteredBooks = areaName ? books.filter(book => book.area === areaName) : [];

  const handleAreaClick = (area: string) => {
    navigate(`/categories/${encodeURIComponent(area)}`);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      {isMobile ? <MobileNav /> : <Header />}
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-20' : 'pt-24'} pb-16`}>
        {areaName ? (
          <>
            {/* Area specific view - Always show as list */}
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/categories')}
                  className="mr-4 flex items-center text-netflix-accent hover:text-white transition-colors duration-200 group"
                >
                  <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
                  <span>Voltar</span>
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                    <div className="w-10 h-10 bg-netflix-accent rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{areaName.charAt(0)}</span>
                    </div>
                    {areaName}
                  </h1>
                  <div className="text-sm text-netflix-secondary mt-1">
                    {filteredBooks.length} {filteredBooks.length === 1 ? 'livro disponível' : 'livros disponíveis'}
                  </div>
                </div>
              </div>
              
              {location.state?.searchQuery && (
                <div className="flex items-center text-sm text-netflix-accent bg-netflix-card px-3 py-2 rounded-lg border border-netflix-accent/30">
                  <Sparkles size={14} className="mr-2" />
                  <span>Busca: "{location.state.searchQuery}"</span>
                </div>
              )}
            </div>
            
            <BookList 
              books={filteredBooks} 
              onBookClick={handleBookClick}
              highlightedBookId={highlightedBookId}
            />
          </>
        ) : (
          <>
            {/* Categories overview - Simple and clean */}
            <CategoryHeroSection />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedAreas.map(([area, count], index) => {
                const areaBooks = books.filter(book => book.area === area);
                return (
                  <SimpleCategoryCard
                    key={area}
                    area={area}
                    count={count}
                    books={areaBooks}
                    index={index}
                    onClick={handleAreaClick}
                  />
                );
              })}
            </div>

            {sortedAreas.length === 0 && (
              <div className="text-center py-12">
                <div className="text-netflix-secondary text-lg">
                  Nenhuma categoria disponível
                </div>
              </div>
            )}
          </>
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

export default Categories;
