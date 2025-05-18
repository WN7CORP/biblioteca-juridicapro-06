
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import LegalAssistant from '@/components/LegalAssistant';

const ReadBook = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { books } = useLibrary();
  const navigate = useNavigate();

  // Convert the string parameter to a number to match our updated Book type
  const numericBookId = bookId ? parseInt(bookId) : undefined;
  
  const book = numericBookId ? books.find(b => b.id === numericBookId) : undefined;

  useEffect(() => {
    if (!book) {
      navigate('/');
    }
  }, [book, navigate]);

  if (!book) {
    return null;
  }

  // Simplified back button handler that will definitely navigate back with one click
  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex items-center bg-netflix-background py-3 px-4 shadow-md">
        <button
          onClick={handleGoBack}
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
      
      <LegalAssistant book={book} />
    </div>
  );
};

export default ReadBook;
