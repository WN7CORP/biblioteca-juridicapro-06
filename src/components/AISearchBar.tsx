import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Sparkles, Loader2, X, Send, MapPin, Heart } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { searchWithScore } from '@/utils/searchUtils';

const AISearchBar = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [animatingBookId, setAnimatingBookId] = useState<number | null>(null);
  
  const {
    books,
    toggleFavorite
  } = useLibrary();
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock AI responses for demonstration
  const mockAIResponses = {
    'administrativo': 'Com base na sua pesquisa sobre Direito Administrativo, encontrei livros relevantes. Esta área abrange temas como atos administrativos, licitações, contratos públicos e responsabilidade civil do Estado. Os livros mais atualizados incluem análises das últimas mudanças na Lei de Licitações.',
    'constitucional': 'Para Direito Constitucional, nossa biblioteca possui obras especializadas. Você encontrará desde fundamentos básicos até análises avançadas sobre direitos fundamentais, controle de constitucionalidade e organização do Estado brasileiro.',
    'civil': 'Em Direito Civil, temos uma coleção robusta cobrindo obrigações, contratos, responsabilidade civil, direitos reais e direito de família. Inclui as mais recentes atualizações do Código Civil.',
    'default': 'Com base na sua pesquisa, encontrei conteúdos relevantes em nossa biblioteca jurídica. Use palavras-chave específicas para resultados mais precisos, como "responsabilidade civil", "licitações" ou "direitos fundamentais".'
  };

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setShowResults(true);
    setActiveTab('results');

    // Simulate API delay with better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Use fuzzy search with scoring
    const searchResults = searchWithScore(
      books,
      query,
      (book) => `${book.livro} ${book.area} ${book.sobre}`,
      0.5 // Lower threshold for more inclusive results
    );
    
    setResults(searchResults.map(result => result.item));

    // Generate AI response based on query
    const queryLower = query.toLowerCase();
    let response = mockAIResponses.default;
    if (queryLower.includes('administrativo')) response = mockAIResponses.administrativo;
    else if (queryLower.includes('constitucional')) response = mockAIResponses.constitucional;
    else if (queryLower.includes('civil')) response = mockAIResponses.civil;
    
    // Add fuzzy search hint if we found results with fuzzy matching
    if (searchResults.some(r => r.matchType === 'fuzzy')) {
      response += ' (Alguns resultados foram encontrados usando busca aproximada para melhor correspondência.)';
    }
    
    setAiResponse(response);
    setIsLoading(false);
  }, [query, books]);

  const handleBookClick = useCallback((book: any) => {
    // Navigate to the book's category and highlight it
    const categoryUrl = `/categories/${encodeURIComponent(book.area)}`;
    navigate(categoryUrl, {
      state: {
        highlightBookId: book.id,
        searchQuery: query
      }
    });
  }, [navigate, query]);

  const handleFavoriteClick = useCallback(async (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    
    try {
      // Trigger enhanced animation for mobile - SET IMMEDIATELY
      setAnimatingBookId(book.id);
      
      // Haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
      
      // Clear animation after fixed duration
      setTimeout(() => setAnimatingBookId(null), 800);
      
      await toggleFavorite(book.id);
      
      toast({
        title: book.favorito ? "Removido dos favoritos" : "❤️ Adicionado aos favoritos",
        description: book.livro,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      setAnimatingBookId(null); // Reset on error
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [toggleFavorite, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  }, [handleSearch, isLoading]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setShowResults(false);
    setResults([]);
    setAiResponse('');
    setActiveTab('search');
    inputRef.current?.focus();
  }, []);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Backdrop blur when results are shown */}
      {showResults && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setShowResults(false)}
        />
      )}
      
      <div className={`relative w-full mx-auto transition-all duration-300 ${showResults ? 'z-50' : 'z-10'}`} ref={resultsRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-netflix-card border border-netflix-cardHover max-w-2xl lg:max-w-4xl mx-auto transition-smooth">
            <TabsTrigger value="search" className="data-[state=active]:bg-netflix-accent data-[state=active]:text-white transition-smooth text-xs sm:text-sm">
              <Search className="mr-1 sm:mr-2" size={14} />
              <span className="hidden sm:inline">Busca Inteligente</span>
              <span className="sm:hidden">Buscar</span>
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!showResults} className="data-[state=active]:bg-netflix-accent data-[state=active]:text-white disabled:opacity-50 transition-smooth text-xs sm:text-sm">
              <Sparkles className="mr-1 sm:mr-2" size={14} />
              <span className="hidden sm:inline">Resultados IA</span>
              <span className="sm:hidden">Resultados</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4">
            <div className="relative max-w-2xl lg:max-w-4xl mx-auto">
              <div className="flex items-center bg-netflix-card border border-netflix-cardHover rounded-xl overflow-hidden transition-smooth focus-within:border-netflix-accent focus-within:shadow-lg focus-within:shadow-netflix-accent/20">
                <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4">
                  <Sparkles className="text-netflix-accent mr-2 sm:mr-3 animate-float" size={20} />
                  <span className="text-netflix-accent text-sm sm:text-base font-medium whitespace-nowrap hidden sm:inline">Buscar</span>
                </div>
                
                <input 
                  ref={inputRef} 
                  type="text" 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  placeholder="Digite o que você procura... (tolerante a erros de digitação)" 
                  className="flex-1 bg-transparent text-white placeholder-netflix-secondary px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none min-w-0 transition-smooth" 
                />
                
                {query && (
                  <button 
                    onClick={clearSearch} 
                    className="p-2 sm:p-3 text-netflix-secondary hover:text-white transition-smooth hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                )}
                
                <Button 
                  onClick={handleSearch} 
                  disabled={!query.trim() || isLoading} 
                  className="m-2 sm:m-3 bg-netflix-accent hover:bg-netflix-accent/90 text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 transition-bounce disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </Button>
              </div>
              
              {/* Search hint */}
              <div className="text-center mt-3 text-netflix-secondary text-xs sm:text-sm">
                Busca inteligente - encontra livros mesmo com erros de digitação
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-4">
            <div className="w-full max-w-2xl lg:max-w-4xl mx-auto bg-netflix-card border border-netflix-cardHover rounded-xl overflow-hidden animate-fade-in shadow-2xl">
              {isLoading ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="text-netflix-accent animate-pulse mr-3" size={28} />
                    <span className="text-netflix-accent text-lg sm:text-xl font-medium">IA processando...</span>
                  </div>
                  <div className="animate-pulse text-netflix-secondary text-sm sm:text-lg">
                    Analisando sua consulta e buscando os melhores resultados...
                  </div>
                </div>
              ) : (
                <>
                  {/* AI Response */}
                  {aiResponse && (
                    <div className="p-4 sm:p-6 border-b border-netflix-cardHover bg-netflix-cardHover/30">
                      <div className="flex items-start mb-3">
                        <Sparkles className="text-netflix-accent mt-1 mr-2 sm:mr-3 flex-shrink-0 animate-float" size={18} />
                        <span className="text-netflix-accent font-semibold text-sm sm:text-lg">Análise da IA</span>
                      </div>
                      <p className="text-white text-sm sm:text-lg leading-relaxed ml-6 sm:ml-8">{aiResponse}</p>
                    </div>
                  )}
                  
                  {/* Search Results */}
                  {results.length > 0 && (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-sm sm:text-lg font-semibold">
                          Livros encontrados ({results.length})
                        </h3>
                        <span className="text-netflix-secondary text-xs sm:text-sm animate-float">
                          Clique para ir até o livro
                        </span>
                      </div>
                      
                      {/* Enhanced Compact List View */}
                      <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                        {results.map((book, index) => {
                          const isAnimating = animatingBookId === book.id;
                          
                          return (
                            <div 
                              key={book.id} 
                              onClick={() => handleBookClick(book)}
                              className="flex items-center p-3 rounded-lg hover:bg-netflix-cardHover transition-bounce cursor-pointer group border border-transparent hover:border-netflix-accent animate-fade-in hover:shadow-lg"
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: 'both'
                              }}
                            >
                              <img 
                                src={book.imagem} 
                                alt={book.livro} 
                                className="w-8 h-10 sm:w-10 sm:h-14 object-cover rounded mr-3 flex-shrink-0 group-hover:scale-105 transition-bounce shadow-md" 
                              />
                              
                              <div className="flex-1 min-w-0 mr-3">
                                <h4 className="text-white font-medium text-xs sm:text-sm line-clamp-1 group-hover:text-netflix-accent transition-smooth">
                                  {book.livro}
                                </h4>
                                <p className="text-netflix-secondary text-xs mt-1">{book.area}</p>
                                <div className="flex items-center mt-1 text-xs text-netflix-accent opacity-0 group-hover:opacity-100 transition-smooth">
                                  <MapPin size={10} className="mr-1" />
                                  <span>Ir para livro</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={(e) => handleFavoriteClick(e, book)}
                                className={`relative p-2 rounded-full transition-bounce hover:scale-110 ${
                                  book.favorito 
                                    ? 'bg-netflix-accent/90 backdrop-blur-sm animate-glow' 
                                    : 'bg-black/50 backdrop-blur-sm hover:bg-black/70'
                                }`}
                              >
                                <Heart 
                                  size={12} 
                                  className={`transition-all duration-500 ${
                                    book.favorito 
                                      ? 'text-white fill-white' 
                                      : 'text-white hover:text-netflix-accent'
                                  } ${
                                    isAnimating 
                                      ? 'animate-bounce scale-125' 
                                      : ''
                                  }`}
                                  style={{
                                    filter: isAnimating ? 'drop-shadow(0 0 12px rgba(229, 9, 20, 0.8))' : 'none'
                                  }}
                                />
                                
                                {/* Enhanced Mobile Animation */}
                                {isAnimating && (
                                  <div className="absolute inset-0 rounded-full">
                                    <div className="absolute inset-0 rounded-full bg-netflix-accent/40 animate-ping" />
                                    <div className="absolute inset-0 rounded-full bg-netflix-accent/30 animate-ping" style={{ animationDelay: '0.1s' }} />
                                    <div className="absolute inset-0 rounded-full bg-netflix-accent/20 animate-ping" style={{ animationDelay: '0.2s' }} />
                                    <div className="absolute inset-0 rounded-full bg-netflix-accent/10 animate-ping" style={{ animationDelay: '0.3s' }} />
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {results.length === 0 && !isLoading && aiResponse && (
                    <div className="p-6 text-center">
                      <div className="animate-float mb-4">
                        <Sparkles size={48} className="mx-auto text-netflix-accent opacity-50" />
                      </div>
                      <p className="text-netflix-secondary text-lg">Nenhum livro específico encontrado, mas a IA pode te ajudar!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AISearchBar;
