
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import MobileNav from '@/components/MobileNav';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Search, Grid, List, Sparkles } from 'lucide-react';
import BookGrid from '@/components/BookGrid';
import BookList from '@/components/BookList';
import BookDetailsModal from '@/components/BookDetailsModal';
import CategoryHeroSection from '@/components/CategoryHeroSection';
import CategoryCard from '@/components/CategoryCard';
import CategoryStats from '@/components/CategoryStats';
import CategoryFilters from '@/components/CategoryFilters';

const Categories: React.FC = () => {
  const { books } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { areaName } = useParams<{ areaName?: string }>();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [highlightedBookId, setHighlightedBookId] = useState<number | null>(null);
  
  // New filter states
  const [sortBy, setSortBy] = useState<'alphabetic' | 'count' | 'recent'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

  // Get unique areas and count books in each area
  const areaStats = books.reduce((acc: Record<string, number>, book) => {
    if (!acc[book.area]) {
      acc[book.area] = 0;
    }
    acc[book.area]++;
    return acc;
  }, {});

  // Sort areas based on filters
  const getSortedAreas = () => {
    let sortedEntries = Object.entries(areaStats);
    
    // Filter favorites if needed
    if (showFavoritesOnly) {
      sortedEntries = sortedEntries.filter(([area]) => 
        books.some(book => book.area === area && book.favorito)
      );
    }

    // Sort based on criteria
    switch (sortBy) {
      case 'alphabetic':
        sortedEntries.sort(([areaA], [areaB]) => 
          sortOrder === 'asc' ? areaA.localeCompare(areaB) : areaB.localeCompare(areaA)
        );
        break;
      case 'count':
        sortedEntries.sort(([, countA], [, countB]) => 
          sortOrder === 'asc' ? countA - countB : countB - countA
        );
        break;
      case 'recent':
        sortedEntries.sort(([areaA], [areaB]) => {
          const recentA = books.filter(book => 
            book.area === areaA && 
            new Date(book.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length;
          const recentB = books.filter(book => 
            book.area === areaB && 
            new Date(book.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length;
          return sortOrder === 'asc' ? recentA - recentB : recentB - recentA;
        });
        break;
    }

    return sortedEntries;
  };

  const sortedAreas = getSortedAreas();

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
            {/* Area specific view */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/categories')}
                  className="mr-4 flex items-center text-netflix-accent hover:text-white transition-colors duration-200 group"
                >
                  <ArrowLeft size={20} className="mr-1 transform group-hover:-translate-x-1 transition-transform duration-200" />
                  <span>Voltar</span>
                </button>
                <h1 className="text-xl font-bold flex items-center">
                  <div className="w-8 h-8 bg-netflix-accent rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">{areaName.charAt(0)}</span>
                  </div>
                  {areaName}
                </h1>
                <div className="ml-4 text-sm text-netflix-secondary">
                  {filteredBooks.length} {filteredBooks.length === 1 ? 'livro' : 'livros'}
                </div>
              </div>
              
              {location.state?.searchQuery && (
                <div className="flex items-center text-sm text-netflix-accent bg-netflix-card px-3 py-2 rounded-lg border border-netflix-accent/30">
                  <Sparkles size={14} className="mr-2" />
                  <span>Busca: "{location.state.searchQuery}"</span>
                </div>
              )}
              
              {filteredBooks.length > 0 && (
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
            
            {viewMode === 'grid' ? (
              <BookGrid 
                books={filteredBooks} 
                onBookClick={handleBookClick}
                highlightedBookId={highlightedBookId}
              />
            ) : (
              <BookList 
                books={filteredBooks} 
                onBookClick={handleBookClick}
                highlightedBookId={highlightedBookId}
              />
            )}
          </>
        ) : (
          <>
            {/* Categories overview */}
            <CategoryHeroSection />
            
            <CategoryStats />
            
            <CategoryFilters
              sortBy={sortBy}
              sortOrder={sortOrder}
              viewMode={viewMode}
              showFavoritesOnly={showFavoritesOnly}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              onViewModeChange={setViewMode}
              onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAreas.map(([area, count], index) => {
                const areaBooks = books.filter(book => book.area === area);
                return (
                  <CategoryCard
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
                <div className="text-netflix-secondary text-lg mb-2">
                  {showFavoritesOnly ? 'Nenhuma área favorita encontrada' : 'Nenhuma categoria disponível'}
                </div>
                {showFavoritesOnly && (
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className="text-netflix-accent hover:underline"
                  >
                    Ver todas as categorias
                  </button>
                )}
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
