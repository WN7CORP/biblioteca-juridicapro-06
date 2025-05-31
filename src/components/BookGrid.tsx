
import React from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  title?: string;
  isLoading?: boolean;
  highlightedBookId?: number | null;
}

const BookGrid: React.FC<BookGridProps> = ({ 
  books, 
  onBookClick, 
  title, 
  isLoading = false,
  highlightedBookId 
}) => {
  if (isLoading) {
    return (
      <div className="mb-10">
        {title && <h2 className="text-lg font-medium mb-3">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

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
    <div className="mb-10">
      {title && (
        <h2 className="text-lg font-medium mb-3 animate-fade-in">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <div
            key={book.id}
            data-book-id={book.id}
            className={`${
              highlightedBookId === book.id 
                ? 'ring-2 ring-netflix-accent ring-offset-2 ring-offset-netflix-background animate-pulse' 
                : ''
            }`}
          >
            <BookCard 
              book={book} 
              onClick={() => onBookClick(book)}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
