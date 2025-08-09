
import React from 'react';
import { Book, BookOpen, Users, Star, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';

const CategoryHeroSection: React.FC = () => {
  const { books } = useLibrary();
  
  const totalBooks = books.length;
  const totalAreas = [...new Set(books.map(book => book.area))].length;
  const recentBooks = books.filter(book => {
    const bookDate = new Date(book.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return bookDate > thirtyDaysAgo;
  }).length;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-netflix-background via-[#1a1a1a] to-[#2a1810] py-12 mb-8 rounded-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 left-8 w-16 h-16 border border-netflix-accent rounded-full animate-float"></div>
        <div className="absolute top-20 right-12 w-12 h-12 border border-netflix-accent rounded-lg rotate-45"></div>
        <div className="absolute bottom-12 left-1/4 w-10 h-10 border border-netflix-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-20 h-20 border border-netflix-accent rounded-lg rotate-12"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-netflix-accent/20 p-3 rounded-full mr-4 animate-glow">
              <Book className="text-netflix-accent" size={40} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-1">
                Explore por <span className="text-netflix-accent">Categoria</span>
              </h1>
              <p className="text-netflix-secondary text-lg">
                Descubra o direito através das suas áreas de interesse
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-netflix-accent/20 text-center transform hover:scale-105 transition-all duration-300">
            <BookOpen className="text-netflix-accent mx-auto mb-2" size={28} />
            <div className="text-2xl font-bold text-white">{totalBooks}</div>
            <div className="text-sm text-netflix-secondary">Total de Livros</div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="text-yellow-500 mx-auto mb-2" size={28} />
            <div className="text-2xl font-bold text-white">{totalAreas}</div>
            <div className="text-sm text-netflix-secondary">Áreas do Direito</div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 text-center transform hover:scale-105 transition-all duration-300">
            <TrendingUp className="text-green-500 mx-auto mb-2" size={28} />
            <div className="text-2xl font-bold text-white">{recentBooks}</div>
            <div className="text-sm text-netflix-secondary">Novos este mês</div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 text-center transform hover:scale-105 transition-all duration-300">
            <Sparkles className="text-blue-500 mx-auto mb-2" size={28} />
            <div className="text-2xl font-bold text-white">IA</div>
            <div className="text-sm text-netflix-secondary">Assistente Legal</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center bg-netflix-accent/10 border border-netflix-accent/30 rounded-full px-4 py-2 mb-4">
            <Star className="text-netflix-accent mr-2" size={16} />
            <span className="text-netflix-accent text-sm font-medium">
              Escolha sua área e comece a estudar agora
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeroSection;
