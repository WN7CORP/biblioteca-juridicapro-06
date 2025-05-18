import React from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Book } from '@/types';
import { Dices, BookOpen } from 'lucide-react';
const AreaStats: React.FC = () => {
  const {
    books
  } = useLibrary();

  // Get counts by area
  const areaCounts = books.reduce((acc: Record<string, number>, book: Book) => {
    const area = book.area;
    if (!acc[area]) {
      acc[area] = 0;
    }
    acc[area]++;
    return acc;
  }, {});

  // Sort areas by count (descending)
  const sortedAreas = Object.entries(areaCounts).sort(([, countA], [, countB]) => countB - countA).slice(0, 6); // Get top 6 areas

  return <div className="mb-8">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <BookOpen className="mr-2" size={20} />
        Biblioteca em números
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-netflix-card rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-netflix-accent">{books.length}</span>
          <span className="text-sm text-netflix-secondary mt-1">Total de livros</span>
        </div>
        
        <div className="bg-netflix-card rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-netflix-accent">
            {Object.keys(areaCounts).length}
          </span>
          <span className="text-sm text-netflix-secondary mt-1">Áreas disponíveis</span>
        </div>
        
        <div className="bg-netflix-card rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-netflix-accent">
            <Dices size={24} />
          </span>
          <span className="text-sm text-netflix-secondary mt-1">Conteúdo atualizado</span>
        </div>
      </div>
      
      
    </div>;
};
export default AreaStats;