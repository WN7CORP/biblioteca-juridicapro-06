import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Note } from '../types';
import { mockBooks, mockNotes } from '../data/mockData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuzzySearch, searchWithScore } from '@/utils/searchUtils';

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
  isLoading: boolean;
  isError: boolean;
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

  // Fetch books from Supabase with better error handling
  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('biblioteca_juridica_duplicate')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) {
          console.error('Error fetching books:', error);
          throw new Error(`Failed to fetch books: ${error.message}`);
        }
        
        // Convert the data to match our Book interface with proper type conversion
        return data.map(book => ({
          id: Number(book.id), // Ensure id is a number
          area: book.area || '',
          livro: book.livro || '',
          link: book.link || '',
          imagem: book.imagem || '/placeholder.svg', // Fallback image
          sobre: book.sobre || '',
          download: book.download || '',
          favorito: false, // We'll set this based on user favorites
          progresso: parseInt(book.progresso?.toString() || '0') || 0, // Ensure it's a number
          created_at: book.created_at || new Date().toISOString()
        })) as Book[];
      } catch (error) {
        console.error('Query error:', error);
        // Return mock data as fallback
        return mockBooks;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  // Fetch user favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userIp],
    queryFn: async () => {
      if (!userIp) return [];
      
      try {
        const { data, error } = await supabase
          .from('book_favorites')
          .select('book_id')
          .eq('user_ip', userIp);
        
        if (error) {
          console.error('Error fetching favorites:', error);
          return [];
        }
        
        return data.map(fav => Number(fav.book_id));
      } catch (error) {
        console.error('Favorites query error:', error);
        return [];
      }
    },
    enabled: !!userIp,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  // Fetch user notes
  const { data: notes = [] } = useQuery({
    queryKey: ['notes', userIp],
    queryFn: async () => {
      if (!userIp) return mockNotes;
      
      try {
        const { data, error } = await supabase
          .from('book_notes')
          .select('*')
          .eq('user_ip', userIp)
          .order('created_at', { ascending: false });
        
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
      } catch (error) {
        console.error('Notes query error:', error);
        return mockNotes;
      }
    },
    enabled: !!userIp,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
  
  // Toggle favorite mutation with optimistic updates
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
    onMutate: async (bookId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['favorites', userIp] });
      const previousFavorites = queryClient.getQueryData<number[]>(['favorites', userIp]);
      
      const isFavorite = favorites.includes(bookId);
      const newFavorites = isFavorite 
        ? favorites.filter(id => id !== bookId)
        : [...favorites, bookId];
      
      queryClient.setQueryData(['favorites', userIp], newFavorites);
      
      return { previousFavorites };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userIp] });
    },
    onError: (error, bookId, context) => {
      // Rollback optimistic update
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', userIp], context.previousFavorites);
      }
      toast({
        title: "Erro ao atualizar favoritos",
        description: error.message,
        variant: "destructive",
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
        variant: "destructive",
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
        variant: "destructive",
      });
    }
  });

  // Enhanced books with favorite status
  const enhancedBooks = books.map(book => ({
    ...book,
    favorito: favorites.includes(book.id)
  }));

  // Filter books based on selected area and search term with fuzzy search
  const filteredBooks = enhancedBooks.filter(book => {
    const matchesArea = selectedArea ? book.area === selectedArea : true;
    
    if (!searchTerm) return matchesArea;
    
    // Use fuzzy search for better matching
    const matchesSearch = 
      fuzzySearch(searchTerm, book.livro, 0.6) ||
      fuzzySearch(searchTerm, book.area, 0.6) ||
      fuzzySearch(searchTerm, book.sobre, 0.6);
    
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

  // Add note mutation
  const addNote = (bookId: number, content: string) => {
    addNoteMutation.mutate({ bookId, content });
    toast({
      title: "Nota adicionada",
      description: "Sua anotação foi salva com sucesso.",
    });
  };

  // Delete note mutation
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
        getNotesByBook,
        isLoading,
        isError
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
