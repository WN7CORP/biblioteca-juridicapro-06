
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Search, X, FileText, Layers, Home, BookOpen, Heart, BookMarked } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useLibrary();
  const [showSearch, setShowSearch] = useState(false);

  const isHomePage = location.pathname === '/';
  const isReadPage = location.pathname.includes('/read/');
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-netflix-background border-b border-netflix-cardHover shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col">
        <div className="flex items-center justify-between">
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
              <h1 className="text-xl md:text-2xl font-bold text-netflix-accent flex items-center">
                <BookMarked size={24} className="mr-2" />
                Biblioteca Jurídica
              </h1>
              
              <div className="flex items-center space-x-4">
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
        
        {!isReadPage && (
          <div className="flex justify-center mt-2">
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/" icon={Home} label="Início" isActive={isActive('/')} />
              <NavLink to="/categories" icon={Layers} label="Categorias" isActive={isActive('/categories')} />
              <NavLink to="/reading" icon={BookOpen} label="Lendo" isActive={isActive('/reading')} />
              <NavLink to="/annotations" icon={FileText} label="Anotações" isActive={isActive('/annotations')} />
              <NavLink to="/favorites" icon={Heart} label="Favoritos" isActive={isActive('/favorites')} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Helper component for navigation links
const NavLink = ({ to, icon: Icon, label, isActive }: { to: string; icon: any; label: string; isActive: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center py-2 px-3 transition-colors ${
      isActive 
        ? 'text-netflix-accent border-b-2 border-netflix-accent' 
        : 'text-netflix-text hover:text-netflix-accent'
    }`}
  >
    <Icon size={18} className="mr-1" />
    <span>{label}</span>
  </Link>
);

export default Header;
