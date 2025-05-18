
import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';

interface BookCardProps {
  book: Book & { isNew?: boolean };
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { toggleFavorite } = useLibrary();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(book.id);
  };

  return (
    <div 
      className="book-card relative bg-netflix-card rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={book.imagem} 
          alt={book.livro} 
          className="w-full object-cover aspect-[2/3]"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full"
        >
          <Heart 
            size={18} 
            className={`transition-colors ${book.favorito ? 'text-netflix-accent fill-netflix-accent' : 'text-white'}`} 
          />
        </button>
        
        {/* New indicator badge */}
        {book.isNew && (
          <div className="absolute top-2 left-2 bg-netflix-accent text-xs text-white px-2 py-1 rounded-full flex items-center">
            <Clock size={12} className="mr-1" />
            Novo
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2">{book.livro}</h3>
        <p className="text-xs text-netflix-secondary mt-1">{book.area}</p>
      </div>
    </div>
  );
};

export default BookCard;
