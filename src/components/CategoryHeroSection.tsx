
import React from 'react';
import { BookOpen, Sparkles, Target } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';

const CategoryHeroSection: React.FC = () => {
  const { books } = useLibrary();
  const totalAreas = [...new Set(books.map(book => book.area))].length;

  return (
    <div className="text-center mb-12">
      {/* Enhanced Header */}
      <div className="flex justify-center items-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-accent to-red-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-netflix-accent/30 to-red-500/30 p-4 rounded-2xl border border-netflix-accent/40 backdrop-blur-sm">
            <BookOpen className="text-netflix-accent animate-bounce-gentle" size={40} />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          Explore por{' '}
          <span className="bg-gradient-to-r from-netflix-accent via-red-400 to-orange-500 bg-clip-text text-transparent">
            Categoria
          </span>
        </h1>
        
        <div className="flex justify-center items-center space-x-4 mb-6">
          <div className="flex items-center bg-gradient-to-r from-netflix-accent/20 to-red-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-netflix-accent/30">
            <Target className="text-netflix-accent mr-2 animate-pulse" size={20} />
            <span className="text-white font-bold text-lg">
              {totalAreas} áreas especializadas
            </span>
          </div>
          
          <div className="flex items-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-500/30">
            <Sparkles className="text-blue-400 mr-2 animate-bounce-gentle" size={20} />
            <span className="text-blue-100 font-bold text-lg">
              Para dominar
            </span>
          </div>
        </div>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
          Escolha sua área de interesse e mergulhe em conteúdo jurídico de alta qualidade. 
          <span className="text-netflix-accent font-bold"> Cada categoria</span> foi cuidadosamente curada para 
          <span className="text-blue-400 font-bold"> acelerar seu aprendizado</span>.
        </p>
      </div>
    </div>
  );
};

export default CategoryHeroSection;
