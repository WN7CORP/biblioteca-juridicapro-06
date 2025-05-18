
import React from 'react';
import { Book } from '@/types';
import BookCard from './BookCard';
import { Clock } from 'lucide-react';

interface UpdatedBooksSectionProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

// Helper to get recent books (added in last 30 days)
const getRecentlyUpdatedBooks = (books: Book[]): Book[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return books
    .filter(book => {
      if (!book.created_at) return false;
      const bookDate = new Date(book.created_at);
      return bookDate > thirtyDaysAgo;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10); // Get top 10 most recent
};

const UpdatedBooksSection: React.FC<UpdatedBooksSectionProps> = ({ books, onBookClick }) => {
  const recentBooks = getRecentlyUpdatedBooks(books);
  
  if (recentBooks.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-10">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <Clock className="mr-2" size={20} />
        Atualizados Recentemente
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentBooks.map(book => (
          <BookCard 
            key={book.id} 
            book={{...book, isNew: true}} 
            onClick={() => onBookClick(book)} 
          />
        ))}
      </div>
    </div>
  );
};

export default UpdatedBooksSection;
