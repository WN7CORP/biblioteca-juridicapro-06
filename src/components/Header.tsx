
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Search, X, FileText } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useLibrary();
  const [showSearch, setShowSearch] = useState(false);

  const isHomePage = location.pathname === '/';
  const isReadPage = location.pathname.includes('/read/');

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-netflix-background border-b border-netflix-cardHover">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {isReadPage ? (
          <button
            onClick={handleGoBack}
            className="flex items-center text-netflix-text hover:text-netflix-accent transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            <span>Voltar</span>
          </button>
        ) : (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-netflix-accent">Biblioteca Jurídica</h1>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/annotations" 
                className="text-netflix-text hover:text-netflix-accent transition-colors hidden md:flex items-center"
              >
                <FileText size={20} className="mr-1" />
                <span>Anotações</span>
              </Link>
              
              {isHomePage && (
                <>
                  {showSearch ? (
                    <div className="flex items-center space-x-2 bg-[#232323] rounded-md px-3 py-1.5">
                      <Input
                        type="search"
                        placeholder="Buscar livros..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-none bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <button onClick={toggleSearch} className="text-netflix-text">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={toggleSearch} className="text-netflix-text hover:text-netflix-accent transition-colors">
                      <Search size={20} />
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
