
import React from 'react';
import { Book, BookOpen, Users, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { books } = useLibrary();
  
  const totalBooks = books.length;
  const totalAreas = [...new Set(books.map(book => book.area))].length;

  const handleExploreClick = () => {
    const element = document.getElementById('featured-books');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-netflix-background via-[#1a1a1a] to-[#2a1810] py-16 mb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-netflix-accent rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-netflix-accent rounded-lg rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-netflix-accent rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-netflix-accent rounded-lg rotate-12"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Heading */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-center items-center mb-4">
            <Book className="text-netflix-accent mr-3" size={48} />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Biblioteca <span className="text-netflix-accent">Jurídica</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-netflix-secondary max-w-3xl mx-auto leading-relaxed">
            Sua jornada jurídica começa aqui. Acesse milhares de livros, use IA para estudar melhor e domine o Direito.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-netflix-accent/20">
            <BookOpen className="text-netflix-accent mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{totalBooks}+</div>
            <div className="text-sm text-netflix-secondary">Livros</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-netflix-accent/20">
            <Star className="text-netflix-accent mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{totalAreas}</div>
            <div className="text-sm text-netflix-secondary">Áreas do Direito</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-netflix-accent/20">
            <Sparkles className="text-netflix-accent mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">IA</div>
            <div className="text-sm text-netflix-secondary">Assistente Jurídico</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-netflix-accent/20">
            <Users className="text-netflix-accent mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm text-netflix-secondary">Atualizado</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleExploreClick}
            className="bg-netflix-accent hover:bg-[#c11119] text-white px-8 py-3 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <BookOpen className="mr-2" size={20} />
            Começar a Estudar
          </Button>
          <Button 
            onClick={() => navigate('/categories')}
            variant="outline" 
            className="border-netflix-accent text-netflix-accent hover:bg-netflix-accent hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300"
          >
            Ver Todas as Áreas
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-netflix-secondary mb-4">Usado por estudantes e profissionais do Direito</p>
          <div className="flex justify-center items-center space-x-6 text-netflix-secondary">
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-1" size={16} />
              <span className="text-sm">Conteúdo Gratuito</span>
            </div>
            <div className="flex items-center">
              <Book className="text-netflix-accent mr-1" size={16} />
              <span className="text-sm">100% Atualizado</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="text-blue-400 mr-1" size={16} />
              <span className="text-sm">Powered by IA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
