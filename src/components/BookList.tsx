
import React, { useState } from 'react';
import { Book } from '@/types';
import { Heart, ExternalLink } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';
import LazyImage from './LazyImage';

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  highlightedBookId?: number | null;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick, highlightedBookId }) => {
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const [animatingBookId, setAnimatingBookId] = useState<number | null>(null);

  const handleFavoriteClick = async (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    
    try {
      // Enhanced animation for mobile
      setAnimatingBookId(book.id);
      setTimeout(() => setAnimatingBookId(null), 800);
      
      await toggleFavorite(book.id);
      
      toast({
        title: book.favorito ? "Removido dos favoritos" : "❤️ Adicionado aos favoritos",
        description: book.livro,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-4 bg-netflix-cardHover rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-netflix-secondary rounded opacity-50" />
        </div>
        <p className="text-netflix-secondary text-lg mb-2">Nenhum livro encontrado</p>
        <p className="text-netflix-secondary/70 text-sm">Tente ajustar os filtros ou explore outras categorias</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {books.map((book, index) => {
        const isAnimating = animatingBookId === book.id;
        const isHighlighted = highlightedBookId === book.id;
        
        return (
          <div
            key={book.id}
            data-book-id={book.id}
            className={`bg-netflix-card hover:bg-netflix-cardHover border transition-all duration-300 animate-fade-in group cursor-pointer rounded-lg p-4 ${
              isHighlighted 
                ? 'border-netflix-accent ring-2 ring-netflix-accent ring-offset-2 ring-offset-netflix-background animate-pulse' 
                : 'border-netflix-cardHover hover:border-netflix-accent'
            }`}
            onClick={() => onBookClick(book)}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <LazyImage 
                  src={book.imagem} 
                  alt={book.livro}
                  className="w-16 h-20 object-cover rounded"
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-white group-hover:text-netflix-accent transition-colors line-clamp-2">
                  {book.livro}
                </h3>
                <p className="text-sm text-netflix-secondary mt-1">
                  {book.area}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-netflix-accent/20 text-netflix-accent px-2 py-1 rounded-full">
                    100% Atualizado
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleFavoriteClick(e, book)}
                  className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                    book.favorito 
                      ? 'bg-netflix-accent/90 backdrop-blur-sm' 
                      : 'bg-black/50 backdrop-blur-sm hover:bg-black/70'
                  }`}
                >
                  <Heart 
                    size={16} 
                    className={`transition-all duration-500 ${
                      book.favorito 
                        ? 'text-white fill-white' 
                        : 'text-white hover:text-netflix-accent'
                    } ${
                      isAnimating 
                        ? 'animate-bounce scale-125' 
                        : ''
                    }`}
                    style={{
                      filter: isAnimating ? 'drop-shadow(0 0 12px rgba(229, 9, 20, 0.8))' : 'none'
                    }}
                  />
                  
                  {/* Enhanced Animation for Mobile */}
                  {isAnimating && (
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full bg-netflix-accent/40 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-netflix-accent/30 animate-ping" style={{ animationDelay: '0.1s' }} />
                      <div className="absolute inset-0 rounded-full bg-netflix-accent/20 animate-ping" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute inset-0 rounded-full bg-netflix-accent/10 animate-ping" style={{ animationDelay: '0.3s' }} />
                    </div>
                  )}
                </button>
                
                <ExternalLink 
                  size={16} 
                  className="text-netflix-secondary group-hover:text-white transition-colors" 
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookList;
