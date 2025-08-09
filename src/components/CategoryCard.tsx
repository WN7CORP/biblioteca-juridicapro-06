
import React, { useState } from 'react';
import { Book, Users, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Book as BookType } from '@/types';
import PopularBooksPreview from './PopularBooksPreview';

interface CategoryCardProps {
  area: string;
  count: number;
  books: BookType[];
  index: number;
  onClick: (area: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  area, 
  count, 
  books, 
  index, 
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get recent books count (last 30 days)
  const recentBooks = books.filter(book => {
    const bookDate = new Date(book.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return bookDate > thirtyDaysAgo;
  });

  // Determine if this is a popular area (top 3)
  const isPopular = index < 3;
  const isNew = recentBooks.length > 0;

  // Color schemes for different areas
  const colorSchemes = [
    "from-red-500 to-pink-600",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-600",
    "from-purple-500 to-indigo-600",
    "from-yellow-500 to-orange-500",
    "from-teal-500 to-green-500",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600"
  ];
  
  const colorClass = colorSchemes[index % colorSchemes.length];

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onClick(area)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} 
        p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl 
        hover:shadow-black/30 animate-fade-in h-48
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {isPopular && (
            <div className="bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Star size={10} className="mr-1" />
              Popular
            </div>
          )}
          {isNew && (
            <div className="bg-green-500/20 backdrop-blur-sm text-green-300 px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <TrendingUp size={10} className="mr-1" />
              Novo
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full text-white">
          <div>
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <Book size={40} className="drop-shadow-lg" />
            </div>
            
            <h3 className="font-bold text-xl mb-2 leading-tight group-hover:scale-105 transition-transform duration-300">
              {area}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium">
              {count} {count === 1 ? 'livro' : 'livros'}
            </div>
            
            <div className="transform group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight size={20} />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
              <Book size={16} className="mr-2" />
              Explorar {area}
            </div>
          </div>
        </div>
      </div>

      {/* Preview on hover */}
      {isHovered && books.length > 0 && (
        <PopularBooksPreview books={books.slice(0, 3)} />
      )}
    </div>
  );
};

export default CategoryCard;
