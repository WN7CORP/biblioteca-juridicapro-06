
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';
import MobileNav from '@/components/MobileNav';
import Header from '@/components/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Layers } from 'lucide-react';

const Categories: React.FC = () => {
  const { books, setSelectedArea } = useLibrary();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Get unique areas and count books in each area
  const areaStats = books.reduce((acc: Record<string, number>, book) => {
    if (!acc[book.area]) {
      acc[book.area] = 0;
    }
    acc[book.area]++;
    return acc;
  }, {});

  // Sort areas alphabetically
  const sortedAreas = Object.entries(areaStats).sort(([areaA], [areaB]) => areaA.localeCompare(areaB));

  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      {isMobile ? <MobileNav /> : <Header />}
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-20' : 'pt-24'} pb-16`}>
        <h1 className="text-xl font-bold mb-6 flex items-center">
          <Layers className="mr-2" size={24} />
          Categorias
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedAreas.map(([area, count]) => (
            <div
              key={area}
              onClick={() => handleAreaClick(area)}
              className="bg-netflix-card rounded-lg p-4 cursor-pointer hover:bg-netflix-cardHover transition-all"
            >
              <h2 className="font-medium">{area}</h2>
              <p className="text-netflix-accent text-sm mt-2">{count} {count === 1 ? 'livro' : 'livros'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
