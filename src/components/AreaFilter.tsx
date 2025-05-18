
import React from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Book } from 'lucide-react';

const AreaFilter: React.FC = () => {
  const { books, selectedArea, setSelectedArea } = useLibrary();
  
  // Get unique areas from books and count books per area
  const areaCounts = books.reduce((acc: Record<string, number>, book) => {
    const area = book.area;
    if (!acc[area]) {
      acc[area] = 0;
    }
    acc[area]++;
    return acc;
  }, {});
  
  // Sort areas by count (descending)
  const areas = Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([area]) => area);
  
  return (
    <div className="mb-6">
      <h2 className="text-base font-medium mb-3 flex items-center">
        <BookOpen size={18} className="mr-2" /> 
        Filtrar por área
      </h2>
      
      <ScrollArea className="whitespace-nowrap pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedArea(null)}
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center ${
              selectedArea === null
                ? 'bg-netflix-accent text-white shadow-md'
                : 'bg-netflix-card text-netflix-text hover:bg-netflix-cardHover'
            }`}
          >
            <Book size={14} className="mr-1" />
            <span>Todas</span>
            <span className="ml-1 bg-black bg-opacity-30 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {books.length}
            </span>
          </button>
          
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center ${
                selectedArea === area
                  ? 'bg-netflix-accent text-white shadow-md'
                  : 'bg-netflix-card text-netflix-text hover:bg-netflix-cardHover'
              }`}
            >
              <span>{area}</span>
              <span className="ml-1 bg-black bg-opacity-30 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {areaCounts[area]}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AreaFilter;
