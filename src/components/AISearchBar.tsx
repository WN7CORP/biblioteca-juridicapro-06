import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/contexts/LibraryContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/types';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import BookCard from '@/components/BookCard';

const AISearchBar: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAISearch, setShowAISearch] = useState(true); // Default to AI search
  const [aiConversation, setAiConversation] = useState<string[]>([]);
  const [matchedBooks, setMatchedBooks] = useState<Book[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const { books, setSelectedArea, setSearchTerm } = useLibrary();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Define guided questions for the AI search
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

  const startAISearch = () => {
    setShowAISearch(true);
    setAiConversation([]);
    setMatchedBooks([]);
    setQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setIsDrawerOpen(true);
  }

  const handleNextQuestion = async (response: string) => {
    const newConversation = [...aiConversation, `Você: ${response}`];
    setAiConversation(newConversation);
    
    setIsSearching(true);
    
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (questionIndex < questions.length - 1) {
      // Still have more questions to ask
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setAiConversation([...newConversation, `Assistente: ${questions[nextIndex]}`]);
    } else {
      // Final question answered, search for books
      const allResponses = [...aiConversation, response].join(' ');
      await searchBooks(allResponses);
    }
    
    setIsSearching(false);
    setAiQuery('');
  };

  const searchBooks = async (query: string) => {
    // This is a simplified AI matching function
    // In a real implementation, this would call an edge function with a more sophisticated algorithm
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    } catch (error) {
      setAiConversation(prev => [
        ...prev, 
        `Assistente: Ocorreu um erro ao processar sua pesquisa. Por favor, tente novamente.`
      ]);
    }
  };

  const handleBookClick = (book: Book) => {
    // Close drawer
    setIsDrawerOpen(false);
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
            
            <DrawerContent className="max-h-[90vh]">
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">Assistente de Busca</h3>
                
                {/* Conversation history */}
                <div className="bg-netflix-card p-4 rounded-md max-h-[40vh] overflow-y-auto space-y-4">
                  {aiConversation.map((message, idx) => (
                    <div 
                      key={idx} 
                      className={`${
                        message.startsWith('Assistente:') ? 'text-netflix-accent' : 'text-netflix-text'
                      }`}
                    >
                      {message}
                    </div>
                  ))}
                  
                  {questionIndex < questions.length && currentQuestion && (
                    <div className="text-netflix-accent">
                      Assistente: {currentQuestion}
                    </div>
                  )}
                </div>
                
                {/* Input area */}
                {questionIndex < questions.length && (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Sua resposta..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiQuery.trim()) {
                          e.preventDefault();
                          handleNextQuestion(aiQuery);
                        }
                      }}
                    />
                    <Button 
                      disabled={!aiQuery.trim() || isSearching}
                      onClick={() => handleNextQuestion(aiQuery)}
                    >
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
                    </Button>
                  </div>
                )}
                
                {/* Matched books */}
                {matchedBooks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Livros recomendados:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {matchedBooks.map((book) => (
                        <div 
                          key={book.id}
                          onClick={() => handleBookClick(book)}
                          className="cursor-pointer hover:bg-netflix-cardHover transition-colors p-2 rounded-md"
                        >
                          <h5 className="font-medium text-netflix-accent">{book.livro}</h5>
                          <p className="text-sm text-netflix-secondary">{book.area}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-4">
                  <DrawerClose asChild>
                    <Button variant="outline">Fechar</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          
          <p className="text-xs text-netflix-accent mt-1 font-semibold animate-pulse">
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
    </div>
  );
};

export default AISearchBar;
