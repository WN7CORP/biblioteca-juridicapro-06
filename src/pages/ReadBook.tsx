
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';

const ReadBook = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { books } = useLibrary();
  const navigate = useNavigate();

  const book = books.find(b => b.id === bookId);

  useEffect(() => {
    if (!book) {
      navigate('/');
    }
  }, [book, navigate]);

  if (!book) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex items-center bg-netflix-background py-3 px-4 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-netflix-text hover:text-netflix-accent transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          <span>Voltar</span>
        </button>
        <h1 className="ml-4 text-sm font-medium truncate">{book.livro}</h1>
      </div>
      
      <div className="flex-1 w-full">
        <iframe
          src={book.link}
          title={book.livro}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default ReadBook;
