
import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/contexts/LibraryContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/types';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import BookDetailsModal from '@/components/BookDetailsModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

const AISearchBar: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAISearch, setShowAISearch] = useState(true);
  const [matchedBooks, setMatchedBooks] = useState<Book[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [searchResult, setSearchResult] = useState<string>('');
  const { books, setSelectedArea, setSearchTerm } = useLibrary();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the end when content updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [matchedBooks, relatedBooks, searchResult]);

  const startAISearch = () => {
    setIsDrawerOpen(true);
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: 'Atenção',
        description: 'Digite algo para buscar.',
        variant: 'default',
      });
      return;
    }

    setIsSearching(true);
    setMatchedBooks([]);
    setRelatedBooks([]);
    setSearchResult('');

    try {
      const userIp = localStorage.getItem('bibjuridica_user_id') || `demo-${Math.floor(Math.random() * 1000000)}`;
      
      const { data, error } = await supabase.functions.invoke('legal-assistant', {
        body: {
          action: 'find-books',
          query: aiQuery,
          userIp,
          bookId: null
        },
      });

      if (error) throw new Error(error.message);
      
      if (data && data.success) {
        const bookIds = data.bookIds || [];
        const relatedIds = data.relatedBookIds || [];
        
        if (bookIds.length > 0) {
          const matchingBooks = books.filter(book => bookIds.includes(book.id));
          setMatchedBooks(matchingBooks.slice(0, 1)); // Show only main result
          
          // Get related books
          if (relatedIds.length > 0) {
            const relatedBooksData = books.filter(book => relatedIds.includes(book.id));
            setRelatedBooks(relatedBooksData.slice(0, 4)); // Show up to 4 related
          }
          
          setSearchResult(data.explanation || 'Livro encontrado com base na sua busca.');
        } else {
          fallbackBookSearch(aiQuery);
        }
      } else {
        fallbackBookSearch(aiQuery);
      }
    } catch (error) {
      console.error('Error with AI book search:', error);
      fallbackBookSearch(aiQuery);
    } finally {
      setIsSearching(false);
    }
  };

  // Enhanced fallback search
  const fallbackBookSearch = (query: string) => {
    const keywords = query.toLowerCase().split(/\s+/);
    const matches = books.map(book => {
      let score = 0;
      keywords.forEach(keyword => {
        if (book.livro.toLowerCase().includes(keyword)) score += 3;
        if (book.area.toLowerCase().includes(keyword)) score += 2;
        if (book.sobre && book.sobre.toLowerCase().includes(keyword)) score += 1;
      });
      return { book, score };
    });
    
    const sortedMatches = matches
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score);
    
    if (sortedMatches.length > 0) {
      setMatchedBooks([sortedMatches[0].book]); // Main result
      
      // Get related books from same area
      const mainBook = sortedMatches[0].book;
      const sameAreaBooks = books
        .filter(book => book.area === mainBook.area && book.id !== mainBook.id)
        .slice(0, 4);
      setRelatedBooks(sameAreaBooks);
      
      setSearchResult(`Encontrei este livro de ${mainBook.area} que corresponde à sua busca.`);
    } else {
      setSearchResult('Não encontrei livros correspondentes. Tente termos mais gerais como "Civil", "Penal" ou "Constitucional".');
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const closeBookModal = () => {
    setSelectedBook(null);
    setShowBookModal(false);
  };

  const handleBookSelection = (book: Book) => {
    setIsDrawerOpen(false);
    setShowBookModal(false);
    setSelectedArea(null);
    setSearchTerm('');
    
    toast({
      title: "Livro selecionado",
      description: book.livro,
    });
    
    navigate(`/read/${book.id}`);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Encontre seu material</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAISearch(!showAISearch)}
          className="text-netflix-secondary hover:text-netflix-accent"
        >
          {showAISearch ? "Busca simples" : "Busca IA"}
        </Button>
      </div>
      
      {showAISearch ? (
        <div className="relative">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Ex: livro sobre contratos, direito penal..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="bg-netflix-card border-netflix-accent border-2 text-sm w-full pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && aiQuery.trim()) {
                        e.preventDefault();
                        handleAISearch();
                      }
                    }}
                  />
                  <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-netflix-accent" size={16} />
                </div>
                <Button
                  onClick={startAISearch}
                  className="bg-netflix-accent hover:bg-[#c11119] min-w-[100px] font-bold"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Buscar
                </Button>
              </div>
            </DrawerTrigger>
            
            <DrawerContent className="max-h-[90vh] bg-netflix-background border-netflix-cardHover">
              <div className="flex flex-col h-[80vh] max-h-[80vh]">
                <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Sparkles className="mr-2 text-netflix-accent" size={20} />
                    Busca Inteligente
                  </h3>
                  
                  <ScrollArea className="flex-1 min-h-0 h-full w-full pr-2">
                    <div className="space-y-4 pb-4">
                      {/* Search input */}
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Digite o que você procura..."
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          className="flex-grow bg-netflix-card border-netflix-cardHover text-xs"
                          disabled={isSearching}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && aiQuery.trim() && !isSearching) {
                              e.preventDefault();
                              handleAISearch();
                            }
                          }}
                        />
                        <Button 
                          disabled={!aiQuery.trim() || isSearching}
                          onClick={handleAISearch}
                          className="bg-netflix-accent hover:bg-[#c11119] text-xs"
                          size="sm"
                        >
                          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                        </Button>
                      </div>

                      {/* Search result explanation */}
                      {searchResult && (
                        <div className="bg-[#1a1a1a] rounded-lg p-3 border-l-2 border-netflix-accent animate-fade-in">
                          <p className="text-sm text-netflix-text">{searchResult}</p>
                        </div>
                      )}

                      {/* Main result */}
                      {matchedBooks.length > 0 && (
                        <div className="space-y-3 mb-6 bg-[#1a1a1a] rounded-lg p-4 border-l-2 border-netflix-accent animate-book-entrance">
                          <h4 className="font-medium text-white text-base mb-2">📚 Resultado Principal</h4>
                          {matchedBooks.map((book, idx) => (
                            <div 
                              key={book.id}
                              onClick={() => handleBookClick(book)}
                              className="book-card cursor-pointer bg-netflix-card hover:bg-netflix-cardHover transition-all duration-300 rounded-lg overflow-hidden border border-netflix-cardHover hover:border-netflix-accent flex"
                            >
                              <div className="w-1/4 overflow-hidden">
                                <img 
                                  src={book.imagem} 
                                  alt={book.livro} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3 flex-grow flex flex-col">
                                <h5 className="font-medium text-netflix-accent line-clamp-2 text-sm">{book.livro}</h5>
                                <p className="text-xs text-netflix-secondary mt-1">{book.area}</p>
                                <p className="text-xs mt-2 line-clamp-3 text-netflix-text flex-grow">
                                  {book.sobre || 'Material jurídico especializado para estudo e consulta.'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Related books */}
                      {relatedBooks.length > 0 && (
                        <div className="space-y-3 bg-[#1a1a1a] rounded-lg p-4 border-l-2 border-blue-500 animate-book-entrance">
                          <h4 className="font-medium text-white text-base mb-2">🔗 Livros Relacionados</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {relatedBooks.map((book, idx) => (
                              <div 
                                key={book.id}
                                onClick={() => handleBookClick(book)}
                                className="book-card cursor-pointer bg-netflix-card hover:bg-netflix-cardHover transition-all duration-300 rounded-lg overflow-hidden border border-netflix-cardHover hover:border-blue-500 flex"
                                style={{ animationDelay: `${idx * 100}ms` }}
                              >
                                <div className="w-1/3 overflow-hidden">
                                  <img 
                                    src={book.imagem} 
                                    alt={book.livro} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-2 flex-grow flex flex-col">
                                  <h5 className="font-medium text-blue-400 line-clamp-2 text-xs">{book.livro}</h5>
                                  <p className="text-xs text-netflix-secondary mt-1">{book.area}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isSearching && (
                        <div className="bg-[#232323] p-3 rounded-lg border-l-2 border-netflix-accent animate-fade-in">
                          <p className="text-xs text-netflix-secondary mb-1">IA</p>
                          <div className="typing-indicator ml-2 my-2">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex justify-end p-4 border-t border-netflix-cardHover">
                  <DrawerClose asChild>
                    <Button variant="outline" size="sm">Fechar</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
          <p className="text-xs text-netflix-accent mt-1 font-semibold">
            🤖 Busca inteligente: digite o que procura e encontre o livro ideal
          </p>
        </div>
      ) : (
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar por título ou área..."
            className="bg-netflix-card border-netflix-cardHover text-sm pl-10"
            value={useLibrary().searchTerm}
            onChange={(e) => useLibrary().setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-netflix-secondary" size={16} />
        </div>
      )}
      
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={showBookModal} 
        onClose={closeBookModal} 
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .typing-indicator {
            display: inline-flex;
            align-items: center;
          }
          
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #e50914;
            margin-right: 3px;
            animation: pulse 1.4s infinite ease-in-out;
          }
          
          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes pulse {
            0%, 50%, 100% { transform: scale(1); opacity: 1; }
            25%, 75% { transform: scale(0.8); opacity: 0.6; }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-book-entrance {
            animation: book-entrance 0.6s ease-out forwards;
          }
          
          @keyframes book-entrance {
            0% { opacity: 0; transform: translateY(-20px); }
            60% { transform: translateY(5px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .book-card {
            animation: book-zoom-in 0.5s ease-out forwards;
            opacity: 0;
            transform: scale(0.95);
          }
          
          @keyframes book-zoom-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `
      }} />
    </div>
  );
};

export default AISearchBar;
