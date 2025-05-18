
import React from 'react';
import { Heart } from 'lucide-react';
import { Book } from '@/types';
import { useLibrary } from '@/contexts/LibraryContext';

interface BookCardProps {
  book: Book;
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
      className="book-card relative bg-netflix-card rounded-md overflow-hidden cursor-pointer"
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
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2">{book.livro}</h3>
        <p className="text-xs text-netflix-secondary mt-1">{book.area}</p>
      </div>
    </div>
  );
};

export default BookCard;
