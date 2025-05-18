
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotesSectionProps {
  bookId: number;
}

const NotesSection: React.FC<NotesSectionProps> = ({ bookId }) => {
  const { getNotesByBook, addNote, deleteNote } = useLibrary();
  const [noteContent, setNoteContent] = useState('');
  
  const bookNotes = getNotesByBook(bookId);
  
  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNote(bookId, noteContent);
      setNoteContent('');
    }
  };
  
  return (
    <div className="bg-netflix-card rounded-md p-4">
      <h3 className="text-sm font-medium mb-3">Anotações</h3>
      
      <Textarea
        placeholder="Escreva sua anotação..."
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        className="bg-[#232323] border-[#333] resize-none mb-2 text-sm"
        rows={3}
      />
      
      <Button 
        onClick={handleAddNote}
        className="w-full bg-netflix-accent hover:bg-[#c11119] text-white text-sm py-1.5 h-auto mb-4"
      >
        Adicionar anotação
      </Button>
      
      {bookNotes.length > 0 ? (
        <ScrollArea className="h-[180px] pr-4">
          <div className="space-y-3">
            {bookNotes.map(note => (
              <div 
                key={note.id} 
                className="bg-[#232323] rounded p-3 relative"
              >
                <p className="text-xs mb-2 text-netflix-text">{note.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-netflix-secondary">
                    {format(new Date(note.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </span>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-netflix-secondary hover:text-netflix-accent transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-xs text-netflix-secondary text-center py-4">
          Nenhuma anotação para este livro.
        </p>
      )}
    </div>
  );
};

export default NotesSection;
