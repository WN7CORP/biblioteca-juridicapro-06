
import React from 'react';
import { Book as BookType } from '@/types';
import { Star, BookOpen } from 'lucide-react';

interface PopularBooksPreviewProps {
  books: BookType[];
}

const PopularBooksPreview: React.FC<PopularBooksPreviewProps> = ({ books }) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-card border border-netflix-accent/20 rounded-xl p-4 shadow-2xl z-50 animate-fade-in">
      <div className="flex items-center mb-3">
        <BookOpen size={16} className="text-netflix-accent mr-2" />
        <span className="text-sm font-medium text-netflix-text">Livros Populares</span>
      </div>
      
      <div className="space-y-2">
        {books.map((book, index) => (
          <div key={book.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-netflix-background/50 transition-colors">
            <div className="w-8 h-10 bg-gradient-to-br from-netflix-accent/20 to-netflix-accent/40 rounded flex items-center justify-center">
              <BookOpen size={14} className="text-netflix-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-netflix-text truncate">
                {book.livro}
              </div>
              {book.progresso > 0 && (
                <div className="flex items-center mt-1">
                  <div className="w-12 h-1 bg-netflix-secondary rounded-full mr-2">
                    <div 
                      className="h-full bg-netflix-accent rounded-full" 
                      style={{ width: `${book.progresso}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-netflix-secondary">{book.progresso}%</span>
                </div>
              )}
            </div>
            {book.favorito && (
              <Star size={12} className="text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
      
      {books.length === 0 && (
        <div className="text-center py-4 text-netflix-secondary text-sm">
          Nenhum livro encontrado nesta categoria
        </div>
      )}
    </div>
  );
};

export default PopularBooksPreview;
