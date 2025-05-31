
import React, { useState } from 'react';
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

const BookCard: React.FC<BookCardProps> = ({ book, onClick, index = 0 }) => {
  const { toggleFavorite } = useLibrary();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      console.log('Favoriting book:', book.id, 'Current status:', book.favorito);
      
      // Enhanced animation for mobile
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
      
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

  return (
    <div 
      className="book-card relative bg-netflix-card rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/20 animate-fade-in group border border-netflix-cardHover hover:border-netflix-accent"
      onClick={onClick}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="relative">
        <LazyImage 
          src={book.imagem} 
          alt={book.livro}
          className="w-full aspect-[2/3]"
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 hover:scale-110 z-10 ${
            book.favorito 
              ? 'bg-netflix-accent/90 backdrop-blur-sm' 
              : 'bg-black/50 backdrop-blur-sm hover:bg-black/70'
          }`}
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
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-0 rounded-full bg-netflix-accent/40 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-netflix-accent/30 animate-ping" style={{ animationDelay: '0.1s' }} />
              <div className="absolute inset-0 rounded-full bg-netflix-accent/20 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-0 rounded-full bg-netflix-accent/10 animate-ping" style={{ animationDelay: '0.3s' }} />
            </div>
          )}
        </button>
        
        {/* New indicator badge */}
        {book.isNew && (
          <div className="absolute top-2 left-2 bg-blue-500 text-xs text-white px-2 py-1 rounded-full flex items-center animate-pulse shadow-lg">
            <Clock size={12} className="mr-1" />
            Novo
          </div>
        )}

        {/* Quick action overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <div className="text-white text-sm font-medium">Ver detalhes</div>
          </div>
        </div>
      </div>
      
      <div className="p-3 transition-all duration-300 group-hover:bg-netflix-cardHover">
        <h3 className="text-sm font-medium line-clamp-2 transition-colors duration-200 group-hover:text-white">
          {book.livro}
        </h3>
        <p className="text-xs text-netflix-secondary mt-1 transition-colors duration-200 group-hover:text-netflix-accent">
          {book.area}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
