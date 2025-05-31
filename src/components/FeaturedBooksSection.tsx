
import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Book } from '@/types';
import BookCard from './BookCard';
import BookDetailsModal from './BookDetailsModal';
import { TrendingUp, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FeaturedBooksSection: React.FC = () => {
  const { books } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get featured books (most popular areas)
  const popularAreas = ['Direito Civil', 'Direito Penal', 'Direito Constitucional', 'Direito do Trabalho'];
  const featuredBooks = books
    .filter(book => popularAreas.includes(book.area))
    .slice(0, 8);

  // Get recent books (simulating new additions)
  const recentBooks = books
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div id="featured-books" className="mb-12">
      {/* Trending Books */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp className="mr-3 text-netflix-accent" size={28} />
            Livros em Destaque
          </h2>
          <Button 
            onClick={() => navigate('/categories')}
            variant="ghost" 
            className="text-netflix-accent hover:text-white"
          >
            Ver todos
          </Button>
        </div>
        
        <p className="text-netflix-secondary mb-6 text-lg">
          Os livros mais procurados pelos estudantes de Direito
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredBooks.map((book, index) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onClick={() => handleBookClick(book)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* New Additions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Clock className="mr-3 text-blue-500" size={28} />
            Recém Adicionados
          </h2>
          <Button 
            onClick={() => navigate('/categories')}
            variant="ghost" 
            className="text-blue-500 hover:text-white"
          >
            Explorar mais
          </Button>
        </div>
        
        <p className="text-netflix-secondary mb-6 text-lg">
          Novos materiais para enriquecer seus estudos
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentBooks.map((book, index) => (
            <BookCard 
              key={book.id} 
              book={{...book, isNew: true}} 
              onClick={() => handleBookClick(book)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-netflix-accent/10 to-blue-500/10 rounded-xl p-8 border border-netflix-accent/20">
        <div className="text-center">
          <Heart className="text-netflix-accent mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-bold text-white mb-4">Novo por aqui?</h3>
          <p className="text-netflix-secondary mb-6 max-w-2xl mx-auto">
            Comece sua jornada jurídica explorando nossas áreas mais populares. 
            Use nossa busca inteligente ou navegue pelas categorias para encontrar o conteúdo perfeito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                const searchElement = document.querySelector('[data-intro="search"]');
                if (searchElement) {
                  searchElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-netflix-accent hover:bg-[#c11119]"
            >
              🤖 Experimentar Busca IA
            </Button>
            <Button 
              onClick={() => navigate('/categories')}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              📚 Explorar por Área
            </Button>
          </div>
        </div>
      </div>

      <BookDetailsModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
};

export default FeaturedBooksSection;
