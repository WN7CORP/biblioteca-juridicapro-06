
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, FileText, Layers } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Layers, label: 'Categorias', path: '/categories' },
    { icon: BookOpen, label: 'Lendo', path: '/reading' },
    { icon: FileText, label: 'Anotações', path: '/annotations' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
  ];
  
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-netflix-background mobile-nav flex justify-around items-center py-3 border-b border-netflix-cardHover shadow-lg"
      data-intro="navigation"
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center px-2 py-1 ${
            isActive(item.path) 
              ? 'text-netflix-accent border-b-2 border-netflix-accent' 
              : 'text-netflix-secondary'
          }`}
        >
          <item.icon size={18} />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
