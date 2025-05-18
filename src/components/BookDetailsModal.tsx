
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, Download, BookmarkPlus, Check } from 'lucide-react';
import { Book } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="bg-netflix-background border-netflix-cardHover max-w-md p-0 overflow-hidden">
        <div className="relative">
          <img 
            src={book.imagem} 
            alt={book.livro} 
            className="w-full h-[200px] object-cover"
          />
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
        
        <div className="p-5">
          <h2 className="text-xl font-bold mb-1">{book.livro}</h2>
          <p className="text-sm text-netflix-accent mb-4">{book.area}</p>
          
          <p className="text-sm text-netflix-text mb-6">{book.sobre}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="default" 
              onClick={handleRead}
              className="bg-netflix-accent hover:bg-[#c11119] text-white flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              <span>Ler</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="bg-transparent border-white/20 text-netflix-text hover:bg-netflix-cardHover flex items-center justify-center gap-2"
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
            <div className="mt-4">
              <NotesSection bookId={book.id} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;
