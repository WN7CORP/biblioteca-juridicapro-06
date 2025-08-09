
import React from 'react';
import { Book, BookOpen, Sparkles, ArrowRight, Play } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-gradient-to-br from-netflix-background via-[#1a1a1a] to-[#2a1810] py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-netflix-accent/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-netflix-accent/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Impactful Welcome */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center bg-netflix-accent/10 border border-netflix-accent/20 rounded-full px-6 py-3 mb-6">
            <Sparkles className="text-netflix-accent mr-2" size={20} />
            <span className="text-netflix-accent font-medium">Sua jornada jurídica começa aqui</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Domine o <span className="text-netflix-accent">Direito</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-netflix-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
            Acesse {totalBooks}+ livros jurídicos, estude com IA e transforme seu conhecimento em sucesso profissional.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center items-center space-x-8 mb-12 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-netflix-accent">{totalBooks}+</div>
            <div className="text-sm text-netflix-secondary">Livros</div>
          </div>
          <div className="w-px h-12 bg-netflix-secondary/30"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netflix-accent">{totalAreas}</div>
            <div className="text-sm text-netflix-secondary">Áreas</div>
          </div>
          <div className="w-px h-12 bg-netflix-secondary/30"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netflix-accent">IA</div>
            <div className="text-sm text-netflix-secondary">Assistente</div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="space-y-4 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleExploreClick}
            size="lg"
            className="bg-netflix-accent hover:bg-[#c11119] text-white px-12 py-4 text-xl font-semibold rounded-full transform transition-all duration-300 hover:scale-105 shadow-2xl group"
          >
            <Play className="mr-3 group-hover:scale-110 transition-transform" size={24} />
            Começar Agora
            <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
          </Button>
          
          <div className="text-netflix-secondary text-sm">
            ✨ Sem cadastro necessário • Acesso imediato • 100% gratuito
          </div>
        </div>

        {/* Trust Signal */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center space-x-6 bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-netflix-accent/10">
            <div className="flex items-center">
              <BookOpen className="text-netflix-accent mr-2" size={16} />
              <span className="text-netflix-secondary text-sm">Conteúdo Atualizado</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="text-blue-400 mr-2" size={16} />
              <span className="text-netflix-secondary text-sm">IA Integrada</span>
            </div>
            <div className="flex items-center">
              <Book className="text-green-400 mr-2" size={16} />
              <span className="text-netflix-secondary text-sm">Acesso Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
