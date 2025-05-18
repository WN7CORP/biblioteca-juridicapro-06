
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Note } from '../types';
import { mockBooks, mockNotes } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface LibraryContextProps {
  books: Book[];
  notes: Note[];
  filteredBooks: Book[];
  favoriteBooks: Book[];
  selectedArea: string | null;
  setSelectedArea: (area: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleFavorite: (bookId: number) => void;
  addNote: (bookId: number, content: string) => void;
  deleteNote: (noteId: string) => void;
  getNotesByBook: (bookId: number) => Note[];
}

const LibraryContext = createContext<LibraryContextProps>({} as LibraryContextProps);

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get user IP for tracking favorites and notes (simple approach)
  const [userIp, setUserIp] = useState<string>('');
  
  useEffect(() => {
    // Get a unique identifier for this user/browser
    const getUniqueId = async () => {
      const storedId = localStorage.getItem('bibjuridica_user_id');
      if (storedId) {
        setUserIp(storedId);
      } else {
        const randomId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('bibjuridica_user_id', randomId);
        setUserIp(randomId);
      }
    };
    
    getUniqueId();
  }, []);

  // Fetch books from Supabase
  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biblioteca_juridica')
        .select('*');
      
      if (error) {
        console.error('Error fetching books:', error);
        toast({
          title: "Erro ao carregar livros",
          description: "Não foi possível carregar os livros. Tente novamente mais tarde.",
        });
        return mockBooks; // Fallback to mock data if there's an error
      }
      
      return data as Book[];
    },
    enabled: true,
  });
  
  // Fetch user favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userIp],
    queryFn: async () => {
      if (!userIp) return [];
      
      const { data, error } = await supabase
        .from('book_favorites')
        .select('book_id')
        .eq('user_ip', userIp);
      
      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }
      
      return data.map(fav => Number(fav.book_id));
    },
    enabled: !!userIp,
  });
  
  // Fetch user notes
  const { data: notes = [] } = useQuery({
    queryKey: ['notes', userIp],
    queryFn: async () => {
      if (!userIp) return mockNotes;
      
      const { data, error } = await supabase
        .from('book_notes')
        .select('*')
        .eq('user_ip', userIp);
      
      if (error) {
        console.error('Error fetching notes:', error);
        return mockNotes;
      }
      
      return data.map(note => ({
        id: note.id,
        bookId: Number(note.book_id),
        content: note.note_text,
        createdAt: new Date(note.created_at),
      })) as Note[];
    },
    enabled: !!userIp,
  });
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (bookId: number) => {
      const isFavorite = favorites.includes(bookId);
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('book_favorites')
          .delete()
          .eq('book_id', bookId)
          .eq('user_ip', userIp);
          
        if (error) throw new Error(error.message);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('book_favorites')
          .insert([
            { book_id: bookId, user_ip: userIp }
          ]);
          
        if (error) throw new Error(error.message);
      }
      
      return { bookId, isFavorite: !isFavorite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userIp] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar favoritos",
        description: error.message,
      });
    }
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async ({ bookId, content }: { bookId: number, content: string }) => {
      const { data, error } = await supabase
        .from('book_notes')
        .insert([
          { book_id: bookId, note_text: content, user_ip: userIp }
        ])
        .select();
        
      if (error) throw new Error(error.message);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userIp] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar nota",
        description: error.message,
      });
    }
  });
  
  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('book_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_ip', userIp);
        
      if (error) throw new Error(error.message);
      return noteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userIp] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir nota",
        description: error.message,
      });
    }
  });

  // Enhanced books with favorite status
  const enhancedBooks = books.map(book => ({
    ...book,
    favorito: favorites.includes(book.id)
  }));

  // Filter books based on selected area and search term
  const filteredBooks = enhancedBooks.filter(book => {
    const matchesArea = selectedArea ? book.area === selectedArea : true;
    const matchesSearch = searchTerm
      ? book.livro.toLowerCase().includes(searchTerm.toLowerCase()) || book.area.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesArea && matchesSearch;
  });

  // Get favorite books
  const favoriteBooks = enhancedBooks.filter(book => book.favorito);

  // Toggle favorite status
  const toggleFavorite = (bookId: number) => {
    toggleFavoriteMutation.mutate(bookId);
    
    const book = books.find(b => b.id === bookId);
    if (book) {
      const isFavorite = favorites.includes(bookId);
      toast({
        title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: book.livro,
      });
    }
  };

  // Add a note
  const addNote = (bookId: number, content: string) => {
    addNoteMutation.mutate({ bookId, content });
    toast({
      title: "Nota adicionada",
      description: "Sua anotação foi salva com sucesso.",
    });
  };

  // Delete a note
  const deleteNote = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
    toast({
      title: "Nota excluída",
      description: "Sua anotação foi removida com sucesso.",
    });
  };

  // Get notes by book ID
  const getNotesByBook = (bookId: number) => {
    return notes.filter(note => note.bookId === bookId);
  };

  return (
    <LibraryContext.Provider
      value={{
        books: enhancedBooks,
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
