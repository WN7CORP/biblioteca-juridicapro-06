
import React from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  title?: string;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onBookClick, title }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-netflix-secondary">Nenhum livro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      {title && <h2 className="text-lg font-medium mb-3">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map(book => (
          <BookCard 
            key={book.id} 
            book={book} 
            onClick={() => onBookClick(book)} 
          />
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
