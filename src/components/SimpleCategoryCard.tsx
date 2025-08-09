
import React from 'react';
import { Book, ArrowRight, Scale, Gavel, Shield, FileText, Building, Users } from 'lucide-react';
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
    {
      gradient: "from-netflix-accent/90 to-red-600/90",
      icon: "bg-white/20",
      hover: "hover:from-red-600 hover:to-netflix-accent"
    },
    {
      gradient: "from-blue-500/90 to-cyan-500/90", 
      icon: "bg-white/20",
      hover: "hover:from-cyan-500 hover:to-blue-500"
    },
    {
      gradient: "from-green-500/90 to-emerald-600/90",
      icon: "bg-white/20",
      hover: "hover:from-emerald-600 hover:to-green-500"
    },
    {
      gradient: "from-purple-500/90 to-indigo-600/90",
      icon: "bg-white/20",
      hover: "hover:from-indigo-600 hover:to-purple-500"
    },
    {
      gradient: "from-yellow-500/90 to-orange-500/90",
      icon: "bg-white/20",
      hover: "hover:from-orange-500 hover:to-yellow-500"
    },
    {
      gradient: "from-teal-500/90 to-green-500/90",
      icon: "bg-white/20",
      hover: "hover:from-green-500 hover:to-teal-500"
    }
  ];
  
  const icons = [Scale, Gavel, Shield, FileText, Building, Users];
  const IconComponent = icons[index % icons.length];
  const colorScheme = colorSchemes[index % colorSchemes.length];

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
        relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorScheme.gradient} ${colorScheme.hover}
        p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2
        border-2 border-white/20 backdrop-blur-sm h-40 group-hover:border-white/40
      `}>
        {/* Enhanced Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10 group-hover:scale-125 transition-transform duration-500"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-between h-full text-white">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className={`${colorScheme.icon} p-3 rounded-xl mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                <IconComponent size={28} className="text-white drop-shadow-lg" />
              </div>
              <div>
                <h3 className="font-bold text-xl leading-tight group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                  {area}
                </h3>
                <div className="text-white/90 text-base font-medium mt-1">
                  {count} {count === 1 ? 'livro' : 'livros'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="transform group-hover:translate-x-3 group-hover:scale-125 transition-all duration-300">
            <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors duration-300">
              <ArrowRight size={28} className="text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/10 via-transparent to-white/10 blur-xl"></div>
      </div>
    </div>
  );
};

export default SimpleCategoryCard;
