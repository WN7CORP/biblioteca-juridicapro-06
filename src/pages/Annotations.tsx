
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { Book, Note } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLibrary } from '@/contexts/LibraryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupedNote extends Note {
  bookTitle: string;
  bookArea: string;
}

const Annotations: React.FC = () => {
  const { books, notes, getNotesByBook, deleteNote } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<GroupedNote[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Group notes by books and add book info
  useEffect(() => {
    const groupedNotes: GroupedNote[] = [];
    
    books.forEach(book => {
      const bookNotes = getNotesByBook(book.id);
      bookNotes.forEach(note => {
        groupedNotes.push({
          ...note,
          bookTitle: book.livro,
          bookArea: book.area
        });
      });
    });
    
    // Sort by most recent
    groupedNotes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setFilteredNotes(groupedNotes);
  }, [books, notes, getNotesByBook]);

  // Filter notes by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      const groupedNotes: GroupedNote[] = [];
      
      books.forEach(book => {
        const bookNotes = getNotesByBook(book.id);
        bookNotes.forEach(note => {
          groupedNotes.push({
            ...note,
            bookTitle: book.livro,
            bookArea: book.area
          });
        });
      });
      
      groupedNotes.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setFilteredNotes(groupedNotes);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = filteredNotes.filter(note => 
      note.content.toLowerCase().includes(query) ||
      note.bookTitle.toLowerCase().includes(query) ||
      note.bookArea.toLowerCase().includes(query)
    );
    
    setFilteredNotes(filtered);
  }, [searchQuery, books, notes, getNotesByBook]);

  const handleOpenBook = (bookId: number) => {
    navigate(`/read/${bookId}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric' 
    }).format(new Date(date));
  };

  const groupNotesByBook = () => {
    const grouped: Record<string, GroupedNote[]> = {};
    
    filteredNotes.forEach(note => {
      if (!grouped[note.bookTitle]) {
        grouped[note.bookTitle] = [];
      }
      grouped[note.bookTitle].push(note);
    });
    
    return grouped;
  };

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      {isMobile ? <MobileNav /> : <Header />}
      <div className={`container mx-auto px-4 ${isMobile ? 'pt-20 pb-24' : 'pt-24'} pb-16`}>
        <h1 className="text-2xl font-bold mb-6">Minhas Anotações</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Pesquisar anotações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-netflix-card border-netflix-cardHover pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-netflix-secondary" size={16} />
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="byBook">Por Livro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="bg-netflix-card p-6 rounded-lg text-center text-netflix-secondary">
                <p>Você ainda não tem anotações.</p>
                <p className="mt-2 text-sm">Ao ler um livro, selecione um texto para adicionar uma anotação.</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="bg-netflix-card rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-white">{note.bookTitle}</h3>
                      <p className="text-xs text-netflix-secondary">{note.bookArea} • {formatDate(note.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenBook(note.bookId)}
                        className="text-netflix-secondary hover:text-netflix-accent h-8 w-8 p-0"
                      >
                        <BookOpen size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-netflix-secondary hover:text-red-500 h-8 w-8 p-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="byBook">
            {Object.keys(groupNotesByBook()).length === 0 ? (
              <div className="bg-netflix-card p-6 rounded-lg text-center text-netflix-secondary">
                <p>Você ainda não tem anotações.</p>
                <p className="mt-2 text-sm">Ao ler um livro, selecione um texto para adicionar uma anotação.</p>
              </div>
            ) : (
              Object.entries(groupNotesByBook()).map(([bookTitle, bookNotes]) => (
                <div key={bookTitle} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-medium">{bookTitle}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenBook(bookNotes[0].bookId)}
                      className="text-netflix-secondary hover:text-netflix-accent"
                    >
                      <BookOpen size={16} className="mr-1" />
                      <span>Abrir livro</span>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {bookNotes.map(note => (
                      <div key={note.id} className="bg-netflix-card rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs text-netflix-secondary">{formatDate(note.createdAt)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                            className="text-netflix-secondary hover:text-red-500 h-8 w-8 p-0"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Annotations;
