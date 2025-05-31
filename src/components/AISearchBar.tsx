
import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, X, Send } from 'lucide-react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Button } from '@/components/ui/button';

const AISearchBar = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const { books } = useLibrary();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock AI responses for demonstration
  const mockAIResponses = {
    'administrativo': 'Com base na sua pesquisa sobre Direito Administrativo, encontrei 25 livros relevantes. Esta área abrange temas como atos administrativos, licitações, contratos públicos e responsabilidade civil do Estado. Os livros mais atualizados incluem análises das últimas mudanças na Lei de Licitações.',
    'constitucional': 'Para Direito Constitucional, nossa biblioteca possui 18 obras especializadas. Você encontrará desde fundamentos básicos até análises avançadas sobre direitos fundamentais, controle de constitucionalidade e organização do Estado brasileiro.',
    'civil': 'Em Direito Civil, temos uma coleção robusta de 32 livros cobrindo obrigações, contratos, responsabilidade civil, direitos reais e direito de família. Inclui as mais recentes atualizações do Código Civil.',
    'default': 'Com base na sua pesquisa, encontrei conteúdos relevantes em nossa biblioteca jurídica. Use palavras-chave específicas para resultados mais precisos, como "responsabilidade civil", "licitações" ou "direitos fundamentais".'
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setShowResults(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter books based on query
    const filteredBooks = books.filter(book => 
      book.livro.toLowerCase().includes(query.toLowerCase()) ||
      book.area.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(filteredBooks.slice(0, 6)); // Show max 6 results
    
    // Generate AI response based on query
    const queryLower = query.toLowerCase();
    let response = mockAIResponses.default;
    
    if (queryLower.includes('administrativo')) response = mockAIResponses.administrativo;
    else if (queryLower.includes('constitucional')) response = mockAIResponses.constitucional;
    else if (queryLower.includes('civil')) response = mockAIResponses.civil;
    
    setAiResponse(response);
    setIsLoading(false);
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
    <div className="relative w-full max-w-2xl mx-auto" ref={resultsRef}>
      <div className="relative">
        <div className="flex items-center bg-netflix-card border border-netflix-cardHover rounded-xl overflow-hidden transition-all duration-200 focus-within:border-netflix-accent">
          <div className="flex items-center px-4 py-3">
            <Sparkles className="text-netflix-accent mr-2" size={20} />
            <span className="text-netflix-accent text-sm font-medium whitespace-nowrap">Busca Inteligente</span>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite o que você procura..."
            className="flex-1 bg-transparent text-white placeholder-netflix-secondary px-4 py-3 focus:outline-none min-w-0"
          />
          
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 text-netflix-secondary hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
          
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="m-2 bg-netflix-accent hover:bg-netflix-accent/90 text-white rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-card border border-netflix-cardHover rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="text-netflix-accent animate-pulse mr-2" size={24} />
                <span className="text-netflix-accent">IA processando...</span>
              </div>
              <div className="animate-pulse text-netflix-secondary text-lg">
                Analisando sua consulta e buscando os melhores resultados...
              </div>
            </div>
          ) : (
            <>
              {/* AI Response */}
              {aiResponse && (
                <div className="p-4 border-b border-netflix-cardHover bg-netflix-cardHover/50">
                  <div className="flex items-start mb-2">
                    <Sparkles className="text-netflix-accent mt-1 mr-2 flex-shrink-0" size={16} />
                    <span className="text-netflix-accent font-medium text-sm">Resposta da IA</span>
                  </div>
                  <p className="text-white text-base leading-relaxed ml-6">{aiResponse}</p>
                </div>
              )}
              
              {/* Search Results */}
              {results.length > 0 && (
                <div className="p-4">
                  <h3 className="text-netflix-secondary text-sm font-medium mb-3">
                    Livros encontrados ({results.length})
                  </h3>
                  <div className="space-y-2">
                    {results.map((book) => (
                      <div key={book.id} className="flex items-center p-3 rounded-lg hover:bg-netflix-cardHover transition-colors cursor-pointer">
                        <img 
                          src={book.imagem} 
                          alt={book.livro}
                          className="w-10 h-12 object-cover rounded mr-3 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm line-clamp-1">{book.livro}</h4>
                          <p className="text-netflix-secondary text-xs">{book.area}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {results.length === 0 && !isLoading && aiResponse && (
                <div className="p-4 text-center">
                  <p className="text-netflix-secondary">Nenhum livro específico encontrado, mas a IA pode te ajudar!</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
