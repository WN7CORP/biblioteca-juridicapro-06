
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, Download, BookmarkPlus, Check } from 'lucide-react';
import { Book } from '@/types';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import NotesSection from './NotesSection';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showNotes, setShowNotes] = useState(false);

  if (!book) return null;

  const handleRead = () => {
    navigate(`/read/${book.id}`);
    onClose();
  };

  const handleDownload = () => {
    window.open(book.download, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-netflix-background border-netflix-cardHover max-w-md p-0 overflow-hidden animate-dialog-entry">
        {/* Properly implemented accessibility elements */}
        <DialogTitle className="sr-only">{book.livro}</DialogTitle>
        <DialogDescription className="sr-only">Detalhes do livro e opções</DialogDescription>
        
        <div className="relative">
          <img 
            src={book.imagem} 
            alt={book.livro} 
            className="w-full h-[200px] object-cover" 
          />
          <DialogClose className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-opacity">
            <X size={20} className="text-white" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-background to-transparent"></div>
        </div>
        
        <div className="p-5 -mt-10 relative">
          <h2 className="text-xl font-bold mb-1 drop-shadow-lg">{book.livro}</h2>
          <p className="text-sm text-netflix-accent mb-4">{book.area}</p>
          
          <p className="text-sm text-netflix-text mb-6">{book.sobre || "Este material jurídico aborda temas essenciais para estudantes e profissionais do direito."}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="default" 
              onClick={handleRead}
              className="bg-netflix-accent hover:bg-[#c11119] text-white flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <BookOpen size={18} />
              <span>Ler</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="bg-transparent border-white/20 text-netflix-text hover:bg-netflix-cardHover flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <Download size={18} />
              <span>Download</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setShowNotes(!showNotes)}
            className="w-full justify-center text-sm text-netflix-text hover:bg-netflix-cardHover flex items-center gap-2"
          >
            {showNotes ? (
              <>
                <Check size={18} />
                <span>Fechar anotações</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={18} />
                <span>Ver/adicionar anotações</span>
              </>
            )}
          </Button>
          
          {showNotes && (
            <div className="mt-4 animate-fade-in">
              <NotesSection bookId={book.id} />
            </div>
          )}
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes dialog-entry {
              0% { opacity: 0; transform: translate(-50%, -48%) scale(0.9); }
              100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            
            .animate-dialog-entry {
              animation: dialog-entry 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            @keyframes fade-in {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `
        }} />
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;
