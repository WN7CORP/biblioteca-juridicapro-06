
import React, { useState } from 'react';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/contexts/LibraryContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/types';

const AISearchBar: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const { books, setSelectedArea, setSearchTerm } = useLibrary();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    
    setIsSearching(true);
    
    // This is a simplified AI matching function
    // In a real implementation, this would call an edge function with a more sophisticated algorithm
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple keyword matching
      const keywords = aiQuery.toLowerCase().split(/\s+/);
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
      
      // Sort by relevance
      const sortedMatches = matches
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score);
      
      if (sortedMatches.length > 0) {
        const bestMatch = sortedMatches[0].book;
        
        toast({
          title: "Livro encontrado!",
          description: `Recomendamos: "${bestMatch.livro}"`,
        });
        
        // Reset filters
        setSelectedArea(null);
        setSearchTerm('');
        
        // Navigate to book details (or you can show it in a modal)
        // For now, let's simulate clicking it
        const bookDetailsModal = document.getElementById('bookDetailsModal');
        if (bookDetailsModal) bookDetailsModal.click();
        
        setTimeout(() => {
          // Reset state
          setAiQuery('');
          setShowAISearch(false);
        }, 500);
      } else {
        toast({
          title: "Nenhum livro encontrado",
          description: "Não encontramos livros que correspondam à sua pesquisa.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao processar sua pesquisa.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
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
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Descreva o que você quer estudar..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="bg-netflix-card border-netflix-cardHover text-sm w-full pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAISearch();
                }}
              />
              <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-netflix-secondary" size={16} />
            </div>
            <Button
              onClick={handleAISearch}
              disabled={isSearching || !aiQuery.trim()}
              className="bg-netflix-accent hover:bg-[#c11119] min-w-[100px]"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Recomendar"}
            </Button>
          </div>
          <p className="text-xs text-netflix-secondary mt-1">
            Descreva o assunto que deseja estudar e encontraremos o livro ideal para você
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
