
import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';
import LazyImage from './LazyImage';

interface BookCardProps {
  book: Book & { isNew?: boolean };
  onClick: () => void;
  index?: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick, index = 0 }) => {
  const { toggleFavorite } = useLibrary();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(book.id);
  };

  return (
    <div 
      className="book-card relative bg-netflix-card rounded-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/20 animate-fade-in group"
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
          className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-black/70 hover:scale-110"
        >
          <Heart 
            size={18} 
            className={`transition-all duration-200 ${
              book.favorito 
                ? 'text-netflix-accent fill-netflix-accent scale-110' 
                : 'text-white hover:text-netflix-accent'
            }`} 
          />
        </button>
        
        {/* New indicator badge */}
        {book.isNew && (
          <div className="absolute top-2 left-2 bg-netflix-accent text-xs text-white px-2 py-1 rounded-full flex items-center animate-pulse shadow-lg">
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
