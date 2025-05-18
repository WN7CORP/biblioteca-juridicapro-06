
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, FileText } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: BookOpen, label: 'Lendo', path: '/reading' },
    { icon: FileText, label: 'Anotações', path: '/annotations' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-netflix-background mobile-nav flex justify-around items-center py-3 border-t border-netflix-cardHover">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center px-4 py-1 ${
            isActive(item.path) ? 'text-netflix-accent' : 'text-netflix-secondary'
          }`}
        >
          <item.icon size={20} />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
