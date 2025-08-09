
import React from 'react';
import { Book, ArrowRight } from 'lucide-react';
import { Book as BookType } from '@/types';

interface SimpleCategoryCardProps {
  area: string;
  count: number;
  books: BookType[];
  index: number;
  onClick: (area: string) => void;
}

const SimpleCategoryCard: React.FC<SimpleCategoryCardProps> = ({ 
  area, 
  count, 
  index, 
  onClick 
}) => {
  const colorSchemes = [
    "from-red-500/80 to-pink-600/80",
    "from-blue-500/80 to-cyan-500/80", 
    "from-green-500/80 to-emerald-600/80",
    "from-purple-500/80 to-indigo-600/80",
    "from-yellow-500/80 to-orange-500/80",
    "from-teal-500/80 to-green-500/80"
  ];
  
  const colorClass = colorSchemes[index % colorSchemes.length];

  return (
    <div
      className="group cursor-pointer animate-fade-in"
      onClick={() => onClick(area)}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className={`
        relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClass} 
        p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl
        border border-white/10 backdrop-blur-sm h-32
      `}>
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between h-full text-white">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Book size={24} className="mr-3 opacity-90" />
              <h3 className="font-bold text-lg leading-tight group-hover:scale-105 transition-transform duration-300">
                {area}
              </h3>
            </div>
            
            <div className="text-sm opacity-90">
              {count} {count === 1 ? 'livro' : 'livros'}
            </div>
          </div>
          
          <div className="transform group-hover:translate-x-2 transition-transform duration-300">
            <ArrowRight size={24} className="opacity-75" />
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
      </div>
    </div>
  );
};

export default SimpleCategoryCard;
