
import React, { useState } from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import Header from '@/components/Header';
import AreaFilter from '@/components/AreaFilter';
import BookGrid from '@/components/BookGrid';
import BookDetailsModal from '@/components/BookDetailsModal';
import MobileNav from '@/components/MobileNav';
import { Book } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import AISearchBar from '@/components/AISearchBar';
import AreaStats from '@/components/AreaStats';
import FAQ from '@/components/FAQ';
import { Book as BookIcon, BookOpen, GraduationCap, Scale, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { filteredBooks, books } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Get unique areas for featured area cards
  const uniqueAreas = [...new Set(books.map(book => book.area))].sort();
  
  // Top featured areas (limit to 6)
  const featuredAreas = uniqueAreas.slice(0, 6);

  // Area icons mapping
  const getAreaIcon = (areaName: string) => {
    const lowerCaseArea = areaName.toLowerCase();
    if (lowerCaseArea.includes('constitucional')) return GraduationCap;
    if (lowerCaseArea.includes('civil')) return BookOpen;
    if (lowerCaseArea.includes('penal')) return Gavel;
    if (lowerCaseArea.includes('trabalho')) return Scale;
    return BookIcon;
  };

  const handleAreaCardClick = (area: string) => {
    navigate(`/categories/${encodeURIComponent(area)}`);
  };

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text" data-intro="welcome">
      {isMobile ? <MobileNav /> : <Header />}
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-20' : 'pt-24'} pb-16`}>
        {/* Search Bar with AI Integration */}
        <div data-intro="search">
          <AISearchBar />
        </div>
        
        {/* Statistics Overview */}
        <AreaStats />
        
        {/* Featured Areas with colorful cards */}
        <div className="mb-10" data-intro="areas">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <BookIcon className="mr-2" size={20} />
            Áreas de Direito
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredAreas.map((area, index) => {
              const AreaIcon = getAreaIcon(area);
              const colors = [
                "bg-gradient-to-br from-pink-500 to-purple-600",
                "bg-gradient-to-br from-blue-500 to-teal-400",
                "bg-gradient-to-br from-yellow-400 to-orange-500",
                "bg-gradient-to-br from-green-400 to-emerald-600", 
                "bg-gradient-to-br from-red-500 to-pink-600",
                "bg-gradient-to-br from-indigo-500 to-purple-500"
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div 
                  key={area} 
                  onClick={() => handleAreaCardClick(area)}
                  className={`${colorClass} rounded-lg p-6 cursor-pointer transition-transform hover:scale-105 flex flex-col items-center text-white shadow-lg`}
                >
                  <AreaIcon size={48} className="mb-3" />
                  <h3 className="text-lg font-bold text-center">{area}</h3>
                  <p className="mt-2 text-sm bg-black bg-opacity-30 px-3 py-1 rounded-full">
                    {books.filter(b => b.area === area).length} livros
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-5">
            <button 
              onClick={() => navigate('/categories')}
              className="bg-netflix-accent text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition flex items-center"
            >
              <BookIcon size={16} className="mr-2" />
              Ver todas as áreas
            </button>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div data-intro="faq">
          <FAQ />
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

export default Index;
