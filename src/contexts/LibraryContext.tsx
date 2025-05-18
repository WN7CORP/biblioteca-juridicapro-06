
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Note } from '../types';
import { mockBooks, mockNotes } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';

interface LibraryContextProps {
  books: Book[];
  notes: Note[];
  filteredBooks: Book[];
  favoriteBooks: Book[];
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleFavorite: (bookId: string) => void;
  addNote: (bookId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  getNotesByBook: (bookId: string) => Note[];
}

const LibraryContext = createContext<LibraryContextProps>({} as LibraryContextProps);

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  // Filter books based on selected area and search term
  const filteredBooks = books.filter(book => {
    const matchesArea = selectedArea ? book.area === selectedArea : true;
    const matchesSearch = searchTerm
      ? book.livro.toLowerCase().includes(searchTerm.toLowerCase()) || book.area.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesArea && matchesSearch;
  });

  // Get favorite books
  const favoriteBooks = books.filter(book => book.favorito);

  // Toggle favorite status
  const toggleFavorite = (bookId: string) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId ? { ...book, favorito: !book.favorito } : book
      )
    );
    
    const book = books.find(b => b.id === bookId);
    if (book) {
      toast({
        title: book.favorito ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: book.livro,
      });
    }
  };

  // Add a note
  const addNote = (bookId: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      bookId,
      content,
      createdAt: new Date()
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
    toast({
      title: "Nota adicionada",
      description: "Sua anotação foi salva com sucesso.",
    });
  };

  // Delete a note
  const deleteNote = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    toast({
      title: "Nota excluída",
      description: "Sua anotação foi removida com sucesso.",
    });
  };

  // Get notes by book ID
  const getNotesByBook = (bookId: string) => {
    return notes.filter(note => note.bookId === bookId);
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        notes,
        filteredBooks,
        favoriteBooks,
        selectedArea,
        setSelectedArea,
        searchTerm,
        setSearchTerm,
        toggleFavorite,
        addNote,
        deleteNote,
        getNotesByBook
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
