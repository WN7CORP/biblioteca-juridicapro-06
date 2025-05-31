
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import MobileNav from '@/components/MobileNav';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Layers, Book, ArrowLeft, Search, Grid, List, Sparkles } from 'lucide-react';
import BookGrid from '@/components/BookGrid';
import BookList from '@/components/BookList';
import BookDetailsModal from '@/components/BookDetailsModal';

const Categories: React.FC = () => {
  const { books, setSelectedArea } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { areaName } = useParams<{ areaName?: string }>();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [highlightedBookId, setHighlightedBookId] = useState<number | null>(null);

  // Check if we came from AI search with a book to highlight
  useEffect(() => {
    if (location.state?.highlightBookId) {
      setHighlightedBookId(location.state.highlightBookId);
      
      // Auto-scroll to highlighted book after a delay
      setTimeout(() => {
        const bookElement = document.querySelector(`[data-book-id="${location.state.highlightBookId}"]`);
        if (bookElement) {
          bookElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);

      // Remove highlight after 3 seconds
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

  // Sort areas alphabetically
  const sortedAreas = Object.entries(areaStats).sort(([areaA], [areaB]) => areaA.localeCompare(areaB));

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
                  <Book className="mr-2" size={24} />
                  {areaName}
                </h1>
                <div className="ml-4 text-sm text-netflix-secondary">
                  {filteredBooks.length} {filteredBooks.length === 1 ? 'livro' : 'livros'}
                </div>
              </div>
              
              {/* Show search info if came from AI search */}
              {location.state?.searchQuery && (
                <div className="flex items-center text-sm text-netflix-accent bg-netflix-card px-3 py-2 rounded-lg border border-netflix-accent/30">
                  <Sparkles size={14} className="mr-2" />
                  <span>Busca: "{location.state.searchQuery}"</span>
                </div>
              )}
              
              {/* View mode toggle */}
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
            <div className="mb-8 animate-fade-in">
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Layers className="mr-3" size={28} />
                Categorias
              </h1>
              <p className="text-netflix-secondary">
                Explore nossa biblioteca organizada por áreas do direito
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedAreas.map(([area, count], index) => {
                // Generate a colorful background for each area card
                const colors = [
                  "bg-gradient-to-br from-pink-500 to-purple-600",
                  "bg-gradient-to-br from-blue-500 to-teal-400",
                  "bg-gradient-to-br from-yellow-400 to-orange-500",
                  "bg-gradient-to-br from-green-400 to-emerald-600",
                  "bg-gradient-to-br from-red-500 to-pink-600",
                  "bg-gradient-to-br from-indigo-500 to-purple-500",
                  "bg-gradient-to-br from-cyan-400 to-blue-500",
                  "bg-gradient-to-br from-amber-400 to-yellow-500"
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <div
                    key={area}
                    onClick={() => handleAreaClick(area)}
                    className={`${colorClass} rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/20 group animate-fade-in relative`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex flex-col items-center text-white text-center h-full">
                      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <Book size={48} className="drop-shadow-lg" />
                      </div>
                      <h2 className="font-bold text-lg mb-3 leading-tight group-hover:scale-105 transition-transform duration-300">
                        {area}
                      </h2>
                      <div className="mt-auto">
                        <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transform group-hover:scale-105 transition-all duration-300">
                          {count} {count === 1 ? 'livro' : 'livros'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-sm font-medium flex items-center">
                        <Search size={16} className="mr-2" />
                        Explorar área
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
