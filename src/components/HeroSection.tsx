
import React from 'react';
import { Book, BookOpen, Sparkles, ArrowRight, Play, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '@/contexts/LibraryContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { books } = useLibrary();
  
  const totalBooks = books.length;
  const totalAreas = [...new Set(books.map(book => book.area))].length;

  const handleExploreClick = () => {
    navigate('/categories');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-netflix-background via-[#0a0a0a] to-[#1a1a1a] py-24">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-72 h-72 bg-netflix-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-netflix-accent/5 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Enhanced Welcome Badge */}
        <div className="mb-16 animate-fade-in">
          <div className="inline-flex items-center bg-gradient-to-r from-netflix-accent/20 to-blue-500/20 border-2 border-netflix-accent/30 rounded-full px-8 py-4 mb-8 backdrop-blur-sm shadow-2xl">
            <Sparkles className="text-netflix-accent mr-3 animate-bounce-gentle" size={24} />
            <span className="text-white font-bold text-lg">🎯 Sua jornada jurídica começa aqui</span>
            <Zap className="text-blue-400 ml-3 animate-bounce-gentle" size={24} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
            Domine o{' '}
            <span className="bg-gradient-to-r from-netflix-accent via-red-400 to-orange-500 bg-clip-text text-transparent animate-shimmer bg-size-200 bg-pos-0">
              Direito
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            Acesse <span className="text-netflix-accent font-bold">{totalBooks}+</span> livros jurídicos, 
            estude com <span className="text-blue-400 font-bold">IA avançada</span> e transforme seu conhecimento em 
            <span className="text-green-400 font-bold"> sucesso profissional</span>.
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="flex justify-center items-center space-x-12 mb-16 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-netflix-accent/50 transition-all duration-300 hover:scale-110">
            <div className="text-5xl font-black text-netflix-accent mb-2">{totalBooks}+</div>
            <div className="text-lg text-gray-300 font-medium">Livros Jurídicos</div>
          </div>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-netflix-accent/50 to-transparent"></div>
          <div className="text-center bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-110">
            <div className="text-5xl font-black text-blue-400 mb-2">{totalAreas}</div>
            <div className="text-lg text-gray-300 font-medium">Áreas Jurídicas</div>
          </div>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-netflix-accent/50 to-transparent"></div>
          <div className="text-center bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-110">
            <div className="text-5xl font-black text-green-400 mb-2">IA</div>
            <div className="text-lg text-gray-300 font-medium">Assistente Legal</div>
          </div>
        </div>

        {/* Enhanced Main CTA */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleExploreClick}
            size="lg"
            className="bg-gradient-to-r from-netflix-accent via-red-500 to-orange-500 hover:from-red-600 hover:via-netflix-accent hover:to-red-400 text-white px-16 py-6 text-2xl font-bold rounded-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-netflix-accent/25 group border-2 border-white/20"
          >
            <Play className="mr-4 group-hover:scale-125 transition-transform duration-300" size={32} />
            🚀 Começar Agora
            <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300" size={32} />
          </Button>
          
          <div className="text-gray-400 text-lg font-medium">
            ✨ <span className="text-green-400">Sem cadastro necessário</span> • 
            <span className="text-blue-400"> Acesso imediato</span> • 
            <span className="text-yellow-400">100% gratuito</span>
          </div>
        </div>

        {/* Enhanced Trust Signals */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center space-x-8 bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-lg rounded-3xl px-12 py-6 border border-white/10 shadow-2xl hover:shadow-netflix-accent/10 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-netflix-accent to-red-500 rounded-full flex items-center justify-center animate-pulse">
                <BookOpen className="text-white" size={24} />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Conteúdo Premium</div>
                <div className="text-gray-400 text-sm">Sempre atualizado</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse delay-300">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">IA Avançada</div>
                <div className="text-gray-400 text-sm">Assistente jurídico</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse delay-500">
                <Book className="text-white" size={24} />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg">Biblioteca Completa</div>
                <div className="text-gray-400 text-sm">Acesso total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
