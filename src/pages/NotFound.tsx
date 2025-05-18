
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-netflix-background text-netflix-text">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-netflix-secondary mb-6">Página não encontrada</p>
        <Button asChild className="bg-netflix-accent hover:bg-[#c11119] text-white">
          <Link to="/">Voltar para a Biblioteca</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
