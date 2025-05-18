
import React from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const AreaFilter: React.FC = () => {
  const { books, selectedArea, setSelectedArea } = useLibrary();
  
  // Get unique areas from books
  const areas = Array.from(new Set(books.map(book => book.area))).sort();
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Áreas Jurídicas</h2>
      
      <ScrollArea className="whitespace-nowrap pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedArea(null)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedArea === null
                ? 'bg-netflix-accent text-white'
                : 'bg-netflix-card text-netflix-text hover:bg-netflix-cardHover'
            }`}
          >
            Todas
          </button>
          
          {areas.map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedArea === area
                  ? 'bg-netflix-accent text-white'
                  : 'bg-netflix-card text-netflix-text hover:bg-netflix-cardHover'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AreaFilter;
