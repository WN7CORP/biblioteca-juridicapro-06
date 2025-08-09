
import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';

const CategoryHeroSection: React.FC = () => {
  const { books } = useLibrary();
  const totalAreas = [...new Set(books.map(book => book.area))].length;

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center mb-4">
        <div className="bg-netflix-accent/20 p-3 rounded-full mr-4">
          <BookOpen className="text-netflix-accent" size={32} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Explore por <span className="text-netflix-accent">Categoria</span>
          </h1>
          <p className="text-netflix-secondary">
            {totalAreas} áreas do direito para você dominar
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeroSection;
