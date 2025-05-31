
import React, { useState, memo, useCallback } from 'react';
import { Heart, Clock } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';
import LazyImage from './LazyImage';
import { useToast } from '@/hooks/use-toast';

interface BookCardProps {
  book: Book & { isNew?: boolean };
  onClick: () => void;
  index?: number;
}

const BookCard: React.FC<BookCardProps> = memo(({ book, onClick, index = 0 }) => {
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      console.log('Favoriting book:', book.id, 'Current status:', book.favorito);
      
      // Set animation IMMEDIATELY before any async operations
      setIsAnimating(true);
      
      // Haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Execute the favorite toggle (async)
      const favoritePromise = toggleFavorite(book.id);
      
      // Show immediate feedback with toast
      toast({
        title: book.favorito ? "Removido dos favoritos" : "❤️ Adicionado aos favoritos",
        description: book.livro,
        duration: 2000,
      });
      
      // Wait for the operation to complete
      await favoritePromise;
      
      // Reset animation after fixed duration
      setTimeout(() => setIsAnimating(false), 800);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      setIsAnimating(false); // Reset animation on error
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [book.id, book.favorito, book.livro, toggleFavorite, toast]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Determine image priority based on index (first few books get high priority)
  const imagePriority = index < 6 ? 'high' : index < 12 ? 'normal' : 'low';

  return (
    <div 
      className="book-card relative bg-netflix-card rounded-lg overflow-hidden cursor-pointer transform transition-smooth hover:scale-105 hover:shadow-xl hover:shadow-black/20 animate-fade-in group border border-netflix-cardHover hover:border-netflix-accent flex flex-col h-full"
      onClick={onClick}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="relative flex-shrink-0">
        {imageError ? (
          <div className="w-full aspect-[2/3] bg-netflix-cardHover flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 bg-netflix-accent/20 rounded-full flex items-center justify-center">
                <Heart size={24} className="text-netflix-accent" />
              </div>
              <p className="text-xs text-netflix-secondary">Capa não disponível</p>
            </div>
          </div>
        ) : (
          <>
            <LazyImage 
              src={book.imagem} 
              alt={book.livro}
              className="w-full aspect-[2/3]"
              onError={handleImageError}
              priority={imagePriority}
            />
            
            {/* Título estrategicamente posicionado na capa */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 mb-1 drop-shadow-lg">
                  {book.livro}
                </h3>
                <p className="text-netflix-accent text-xs font-medium drop-shadow-lg">
                  {book.area}
                </p>
              </div>
            </div>
          </>
        )}
        
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-bounce hover:scale-110 z-10 ${
            book.favorito 
              ? 'bg-netflix-accent/90 backdrop-blur-sm animate-glow' 
              : 'bg-black/50 backdrop-blur-sm hover:bg-black/70'
          }`}
          aria-label={book.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart 
            size={18} 
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
            <div className="absolute inset-0 rounded-full pointer-events-none">
              <div className="absolute inset-0 rounded-full bg-netflix-accent/40 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-netflix-accent/30 animate-ping" style={{ animationDelay: '0.1s' }} />
              <div className="absolute inset-0 rounded-full bg-netflix-accent/20 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-0 rounded-full bg-netflix-accent/10 animate-ping" style={{ animationDelay: '0.3s' }} />
            </div>
          )}
        </button>
        
        {/* New indicator badge */}
        {book.isNew && (
          <div className="absolute top-2 left-2 bg-blue-500 text-xs text-white px-2 py-1 rounded-full flex items-center animate-float shadow-lg">
            <Clock size={12} className="mr-1" />
            Novo
          </div>
        )}

        {/* Progress indicator if available */}
        {book.progresso > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-netflix-accent transition-all duration-300"
              style={{ width: `${Math.min(book.progresso, 100)}%` }}
            />
          </div>
        )}

        {/* Quick action overlay - only on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-bounce">
            <div className="text-white text-sm font-medium">Ver detalhes</div>
          </div>
        </div>
      </div>
      
      {/* Compact bottom info - fallback for when hover is not available */}
      <div className="flex flex-col flex-grow p-3 transition-smooth group-hover:bg-netflix-cardHover min-h-[80px] sm:group-hover:opacity-50">
        <div className="flex-grow">
          <h3 className="text-sm font-medium line-clamp-2 transition-smooth group-hover:text-white mb-1">
            {book.livro}
          </h3>
          <p className="text-xs text-netflix-secondary transition-smooth group-hover:text-netflix-accent">
            {book.area}
          </p>
        </div>
        
        {/* Progress percentage if available - always at bottom */}
        {book.progresso > 0 && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-netflix-cardHover/30">
            <span className="text-xs text-netflix-secondary">
              {book.progresso}% lido
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;
