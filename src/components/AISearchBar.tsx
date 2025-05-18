
import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Loader2 } from 'lucide-react';
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
  const [showAISearch, setShowAISearch] = useState(true); // Default to AI search
  const [aiConversation, setAiConversation] = useState<string[]>([]);
  const [matchedBooks, setMatchedBooks] = useState<Book[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { books, setSelectedArea, setSearchTerm } = useLibrary();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Define guided questions for the AI search - each question will only be asked once
  const questions = [
    "Que área do direito você deseja estudar? (ex: Civil, Penal, Constitucional)",
    "Há algum tema específico dentro dessa área?",
    "Qual seu objetivo com esse estudo? (ex: concurso, OAB, faculdade)"
  ];

  useEffect(() => {
    if (questionIndex < questions.length) {
      setCurrentQuestion(questions[questionIndex]);
    }
  }, [questionIndex]);

  // Scroll to the end of conversation when it updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiConversation]);

  const startAISearch = () => {
    setShowAISearch(true);
    setAiConversation([]);
    setMatchedBooks([]);
    setQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setIsDrawerOpen(true);
  }

  const handleNextQuestion = async (response: string) => {
    // Prevent duplicate questions by checking if we've already added the response
    const newConversation = [...aiConversation];
    
    // Only add the user's response if it's not already the last item
    if (newConversation.length === 0 || !newConversation[newConversation.length - 1].startsWith(`Você: ${response}`)) {
      newConversation.push(`Você: ${response}`);
      setAiConversation(newConversation);
    }
    
    setIsSearching(true);
    setIsTyping(true);
    
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (questionIndex < questions.length - 1) {
      // Still have more questions to ask
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      
      // Check if this assistant message is already in the conversation
      const assistantMessage = `Assistente: ${questions[nextIndex]}`;
      if (!newConversation.some(msg => msg === assistantMessage)) {
        setAiConversation([...newConversation, assistantMessage]);
      }
    } else {
      // Final question answered, search for books
      const allResponses = [...aiConversation, response].join(' ');
      await searchBooks(allResponses);
    }
    
    setIsSearching(false);
    setIsTyping(false);
    setAiQuery('');
  };

  const searchBooks = async (query: string) => {
    try {
      setIsTyping(true);
      
      // Use Gemini AI for more intelligent book matching via our legal-assistant edge function
      const userIp = localStorage.getItem('bibjuridica_user_id') || `demo-${Math.floor(Math.random() * 1000000)}`;
      
      const { data, error } = await supabase.functions.invoke('legal-assistant', {
        body: {
          action: 'find-books',
          query: query,
          userIp,
          bookId: null
        },
      });
      
      setIsTyping(false);
      
      if (error) throw new Error(error.message);
      
      if (data && data.success) {
        // Extract book IDs from the response
        const bookIds = data.bookIds || [];
        
        if (bookIds.length > 0) {
          // Find the matching books from our local books array
          const matchingBooks = books.filter(book => bookIds.includes(book.id));
          
          if (matchingBooks.length > 0) {
            setMatchedBooks(matchingBooks);
            
            setAiConversation(prev => [
              ...prev, 
              `Assistente: Baseado no que você me disse, encontrei ${matchingBooks.length} ${matchingBooks.length === 1 ? 'livro' : 'livros'} que podem te ajudar:`
            ]);
          } else {
            fallbackBookSearch(query);
          }
        } else {
          fallbackBookSearch(query);
        }
      } else {
        fallbackBookSearch(query);
      }
    } catch (error) {
      console.error('Error with AI book search:', error);
      fallbackBookSearch(query);
    }
  };
  
  // Fallback to simple keyword matching if AI search fails
  const fallbackBookSearch = (query: string) => {
    // Simple keyword matching
    const keywords = query.toLowerCase().split(/\s+/);
    const matches = books.map(book => {
      // Calculate a simple relevance score based on keyword matches
      let score = 0;
      keywords.forEach(keyword => {
        if (book.livro.toLowerCase().includes(keyword)) score += 3;
        if (book.area.toLowerCase().includes(keyword)) score += 2;
        if (book.sobre && book.sobre.toLowerCase().includes(keyword)) score += 1;
      });
      return { book, score };
    });
    
    // Sort by relevance and get top matches
    const sortedMatches = matches
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Get top 5 matches
    
    if (sortedMatches.length > 0) {
      const matchingBooks = sortedMatches.map(match => match.book);
      setMatchedBooks(matchingBooks);
      
      setAiConversation(prev => [
        ...prev, 
        `Assistente: Baseado no que você me disse, encontrei ${matchingBooks.length} ${matchingBooks.length === 1 ? 'livro' : 'livros'} que podem te ajudar:`
      ]);
    } else {
      setAiConversation(prev => [
        ...prev, 
        `Assistente: Não encontrei livros que correspondam exatamente à sua busca. Tente usar termos mais gerais ou outra área do direito.`
      ]);
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
    // Close drawer
    setIsDrawerOpen(false);
    setShowBookModal(false);
    
    // Reset states
    setSelectedArea(null);
    setSearchTerm('');
    
    // Show toast
    toast({
      title: "Livro selecionado",
      description: book.livro,
    });
    
    // Navigate to book details
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
          {showAISearch ? "Busca simples" : "Busca por IA"}
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
                    placeholder="Descreva o que você quer estudar..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="bg-netflix-card border-netflix-accent border-2 text-sm w-full pr-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && aiQuery.trim()) {
                        e.preventDefault();
                        handleNextQuestion(aiQuery);
                      }
                    }}
                  />
                  <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-netflix-accent" size={16} />
                </div>
                <Button
                  onClick={startAISearch}
                  className="bg-netflix-accent hover:bg-[#c11119] min-w-[100px] font-bold"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "IA Busca"}
                </Button>
              </div>
            </DrawerTrigger>
            
            <DrawerContent className="max-h-[90vh] bg-netflix-background border-netflix-cardHover">
              <div className="flex flex-col h-[80vh] max-h-[80vh]">
                <div className="p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <BookOpen className="mr-2 text-netflix-accent" size={20} />
                    Assistente de Busca
                  </h3>
                  
                  {/* Book recommendations - Show at the top when available with animation */}
                  {matchedBooks.length > 0 && (
                    <div className="space-y-3 mb-6 bg-[#1a1a1a] rounded-lg p-4 border-l-2 border-netflix-accent animate-book-entrance">
                      <h4 className="font-medium text-white text-lg mb-2">Livros Recomendados</h4>
                      <p className="text-sm text-netflix-text mb-3">
                        Com base nas suas respostas, selecionei os seguintes materiais que podem ajudar no seu estudo:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-x-auto">
                        {matchedBooks.map((book, idx) => (
                          <div 
                            key={book.id}
                            onClick={() => handleBookClick(book)}
                            className="book-card cursor-pointer bg-netflix-card hover:bg-netflix-cardHover transition-all duration-300 rounded-lg overflow-hidden border border-netflix-cardHover hover:border-netflix-accent flex"
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                            <div className="w-1/3 overflow-hidden">
                              <img 
                                src={book.imagem} 
                                alt={book.livro} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 flex-grow flex flex-col">
                              <h5 className="font-medium text-netflix-accent line-clamp-2">{book.livro}</h5>
                              <p className="text-xs text-netflix-secondary mt-1">{book.area}</p>
                              <p className="text-xs mt-2 line-clamp-2 text-netflix-text flex-grow">
                                {book.sobre || 'Material didático recomendado para seu estudo.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Conversation history in a scrollable area with improved scrolling */}
                  <ScrollArea className="flex-1 min-h-0 h-full w-full overflow-y-auto pr-2">
                    <div className="space-y-4 pb-4">
                      {aiConversation.map((message, idx) => (
                        <div 
                          key={idx} 
                          className={`${
                            message.startsWith('Assistente:') 
                              ? 'bg-[#232323] p-3 rounded-lg border-l-2 border-netflix-accent animate-fade-in'
                              : 'bg-netflix-card text-right ml-12 p-2 rounded-lg animate-fade-in'
                          }`}
                        >
                          <p className="text-xs text-netflix-secondary mb-1">
                            {message.startsWith('Assistente:') ? 'Assistente' : 'Você'}
                          </p>
                          <p className={message.startsWith('Assistente:') ? 'text-netflix-text' : 'text-sm'}>
                            {message.replace(/^(Assistente:|Você:)\s/, '')}
                          </p>
                        </div>
                      ))}
                      
                      {questionIndex < questions.length && currentQuestion && !isTyping && (
                        <div className="bg-[#232323] p-3 rounded-lg border-l-2 border-netflix-accent animate-fade-in">
                          <p className="text-xs text-netflix-secondary mb-1">Assistente</p>
                          <p className="text-netflix-text">{currentQuestion}</p>
                        </div>
                      )}
                      
                      {isTyping && (
                        <div className="bg-[#232323] p-3 rounded-lg border-l-2 border-netflix-accent animate-fade-in">
                          <p className="text-xs text-netflix-secondary mb-1">Assistente</p>
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
                  
                  {/* Input area */}
                  {(questionIndex < questions.length || isTyping) && (
                    <div className="flex gap-2 mt-4">
                      <Input
                        type="text"
                        placeholder="Sua resposta..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        className="flex-grow bg-netflix-card border-netflix-cardHover"
                        disabled={isTyping || isSearching}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && aiQuery.trim() && !isTyping && !isSearching) {
                            e.preventDefault();
                            handleNextQuestion(aiQuery);
                          }
                        }}
                      />
                      <Button 
                        disabled={!aiQuery.trim() || isSearching || isTyping}
                        onClick={() => handleNextQuestion(aiQuery)}
                        className="bg-netflix-accent hover:bg-[#c11119]"
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end p-4 border-t border-netflix-cardHover">
                  <DrawerClose asChild>
                    <Button variant="outline">Fechar</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
          <p className="text-xs text-netflix-accent mt-1 font-semibold">
            Utilize nossa IA para encontrar o material jurídico ideal para você ✨
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
      
      {/* Book details modal for recommended books */}
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
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #e50914;
            margin-right: 4px;
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
          
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          
          @keyframes book-entrance {
            0% { opacity: 0; transform: translateY(-20px); }
            60% { transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-book-entrance {
            animation: book-entrance 0.6s ease-out forwards;
          }
          
          .book-card {
            animation: book-zoom-in 0.5s ease-out forwards;
            opacity: 0;
            transform: scale(0.8);
          }
          
          @keyframes book-zoom-in {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
        `
      }} />
    </div>
  );
};

export default AISearchBar;
