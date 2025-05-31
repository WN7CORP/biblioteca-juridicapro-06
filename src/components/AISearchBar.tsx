
import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, X, Send, MapPin, Heart } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setShowResults(true);
    setActiveTab('results');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter books based on query - bring ALL matching results
    const filteredBooks = books.filter(book => 
      book.livro.toLowerCase().includes(query.toLowerCase()) || 
      book.area.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredBooks); // Show ALL results instead of limiting to 8

    // Generate AI response based on query
    const queryLower = query.toLowerCase();
    let response = mockAIResponses.default;
    if (queryLower.includes('administrativo')) response = mockAIResponses.administrativo;
    else if (queryLower.includes('constitucional')) response = mockAIResponses.constitucional;
    else if (queryLower.includes('civil')) response = mockAIResponses.civil;
    setAiResponse(response);
    setIsLoading(false);
  };

  const handleBookClick = (book: any) => {
    // Navigate to the book's category and highlight it
    const categoryUrl = `/categories/${encodeURIComponent(book.area)}`;
    navigate(categoryUrl, {
      state: {
        highlightBookId: book.id,
        searchQuery: query
      }
    });
  };

  const handleFavoriteClick = async (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    
    try {
      // Trigger enhanced animation for mobile
      setAnimatingBookId(book.id);
      setTimeout(() => setAnimatingBookId(null), 800);
      
      await toggleFavorite(book.id);
      
      toast({
        title: book.favorito ? "Removido dos favoritos" : "❤️ Adicionado aos favoritos",
        description: book.livro,
        duration: 2000,
      });
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    setResults([]);
    setAiResponse('');
    setActiveTab('search');
    inputRef.current?.focus();
  };

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
    <div className="relative w-full mx-auto" ref={resultsRef}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-netflix-card border border-netflix-cardHover max-w-4xl mx-auto">
          <TabsTrigger value="search" className="data-[state=active]:bg-netflix-accent data-[state=active]:text-white">
            <Search className="mr-2" size={16} />
            Busca Inteligente
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults} className="data-[state=active]:bg-netflix-accent data-[state=active]:text-white disabled:opacity-50">
            <Sparkles className="mr-2" size={16} />
            Resultados IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center bg-netflix-card border border-netflix-cardHover rounded-xl overflow-hidden transition-all duration-200 focus-within:border-netflix-accent">
              <div className="flex items-center px-4 py-4">
                <Sparkles className="text-netflix-accent mr-3" size={24} />
                <span className="text-netflix-accent text-base font-medium whitespace-nowrap">Buscar</span>
              </div>
              
              <input 
                ref={inputRef} 
                type="text" 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                onKeyPress={handleKeyPress} 
                placeholder="Digite o que você procura..." 
                className="flex-1 bg-transparent text-white placeholder-netflix-secondary px-4 py-4 text-base focus:outline-none min-w-0" 
              />
              
              {query && (
                <button 
                  onClick={clearSearch} 
                  className="p-3 text-netflix-secondary hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              
              <Button 
                onClick={handleSearch} 
                disabled={!query.trim() || isLoading} 
                className="m-3 bg-netflix-accent hover:bg-netflix-accent/90 text-white rounded-lg px-6 py-3 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <div className="w-full bg-netflix-card border border-netflix-cardHover rounded-xl overflow-hidden animate-fade-in">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="text-netflix-accent animate-pulse mr-3" size={32} />
                  <span className="text-netflix-accent text-xl font-medium">IA processando...</span>
                </div>
                <div className="animate-pulse text-netflix-secondary text-lg">
                  Analisando sua consulta e buscando os melhores resultados...
                </div>
              </div>
            ) : (
              <>
                {/* AI Response */}
                {aiResponse && (
                  <div className="p-6 border-b border-netflix-cardHover bg-netflix-cardHover/30">
                    <div className="flex items-start mb-3">
                      <Sparkles className="text-netflix-accent mt-1 mr-3 flex-shrink-0" size={20} />
                      <span className="text-netflix-accent font-semibold text-lg">Análise da IA</span>
                    </div>
                    <p className="text-white text-lg leading-relaxed ml-8">{aiResponse}</p>
                  </div>
                )}
                
                {/* Search Results - Compact List */}
                {results.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white text-lg font-semibold">
                        Livros encontrados ({results.length})
                      </h3>
                      <span className="text-netflix-secondary text-sm">
                        Clique para ir até o livro
                      </span>
                    </div>
                    
                    {/* Compact List View */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {results.map((book, index) => {
                        const isAnimating = animatingBookId === book.id;
                        
                        return (
                          <div 
                            key={book.id} 
                            onClick={() => handleBookClick(book)}
                            className="flex items-center p-3 rounded-lg hover:bg-netflix-cardHover transition-all duration-200 cursor-pointer group border border-transparent hover:border-netflix-accent animate-fade-in"
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <img 
                              src={book.imagem} 
                              alt={book.livro} 
                              className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" 
                            />
                            
                            <div className="flex-1 min-w-0 mr-3">
                              <h4 className="text-white font-medium text-sm line-clamp-1 group-hover:text-netflix-accent transition-colors">
                                {book.livro}
                              </h4>
                              <p className="text-netflix-secondary text-xs mt-1">{book.area}</p>
                              <div className="flex items-center mt-1 text-xs text-netflix-accent">
                                <MapPin size={10} className="mr-1" />
                                <span>Ir para livro</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => handleFavoriteClick(e, book)}
                              className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                book.favorito 
                                  ? 'bg-netflix-accent/90 backdrop-blur-sm' 
                                  : 'bg-black/50 backdrop-blur-sm hover:bg-black/70'
                              }`}
                            >
                              <Heart 
                                size={14} 
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
                    <p className="text-netflix-secondary text-lg">Nenhum livro específico encontrado, mas a IA pode te ajudar!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISearchBar;
