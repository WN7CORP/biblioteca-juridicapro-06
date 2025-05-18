
import React, { useState, useEffect } from 'react';
import { MessageSquare, BookOpen, Network, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Book } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface LegalAssistantProps {
  book: Book;
}

const TypingAnimation = () => (
  <div className="flex items-center space-x-1 py-2">
    <div className="w-2 h-2 bg-netflix-accent rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-netflix-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-netflix-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const LegalAssistant: React.FC<LegalAssistantProps> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('summarize');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const { toast } = useToast();

  // Simulação de digitação do texto
  useEffect(() => {
    if (response && !isLoading) {
      setIsTyping(true);
      setDisplayText('');
      
      let i = 0;
      const typeSpeed = Math.max(10, Math.floor(30000 / response.length)); // Ajuste dinâmico baseado no tamanho do texto
      
      const typeWriter = () => {
        if (i < response.length) {
          setDisplayText(prev => prev + response.charAt(i));
          i++;
          setTimeout(typeWriter, typeSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      typeWriter();
    }
  }, [response, isLoading]);

  // Carrega a resposta inicial automaticamente
  useEffect(() => {
    if (isOpen && activeTab !== 'qa' && !response) {
      handleFetchAssistant(activeTab);
    }
  }, [isOpen, activeTab]);

  const handleFetchAssistant = async (action: string) => {
    setIsLoading(true);
    setResponse('');
    setDisplayText('');

    try {
      // Generate a random IP for demo purposes (in production, you'd use the real user IP)
      const userIp = `demo-${Math.floor(Math.random() * 1000000)}`;
      
      const { data, error } = await supabase.functions.invoke('legal-assistant', {
        body: {
          bookTitle: book.livro,
          bookArea: book.area,
          action,
          query: action === 'qa' ? question : '',
          userIp,
          bookId: book.id
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
        setResponse(data.response);
      } else {
        throw new Error('Resposta inválida do assistente');
      }
    } catch (error) {
      console.error('Erro ao consultar o assistente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível obter resposta do assistente jurídico.',
        variant: 'destructive',
      });
      setResponse('Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResponse('');
    setDisplayText('');

    if (value !== 'qa') {
      handleFetchAssistant(value);
    }
  };

  const handleQuestionSubmit = () => {
    if (!question.trim()) {
      toast({
        title: 'Atenção',
        description: 'Por favor, insira uma pergunta.',
        variant: 'default',
      });
      return;
    }
    handleFetchAssistant('qa');
  };

  // Define the common markdown component styles
  const markdownComponents = {
    // Add custom components for the markdown renderer
    h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold text-netflix-accent mb-4" />,
    h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold text-netflix-accent mb-3" />,
    h3: ({ node, ...props }) => <h3 {...props} className="text-md font-bold text-netflix-accent mb-2" />,
    p: ({ node, ...props }) => <p {...props} className="mb-4 text-netflix-text" />,
    ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 mb-4" />,
    ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 mb-4" />,
    li: ({ node, ...props }) => <li {...props} className="mb-1" />,
    a: ({ node, ...props }) => <a {...props} className="text-blue-400 hover:underline" />,
    blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-netflix-accent pl-4 italic my-4" />,
    code: ({ node, inline, ...props }) => (
      inline 
        ? <code {...props} className="bg-netflix-card px-1 py-0.5 rounded text-sm" />
        : <pre className="bg-netflix-card p-4 rounded-md overflow-x-auto my-4"><code {...props} /></pre>
    )
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-netflix-accent text-white rounded-full p-3 shadow-lg hover:bg-[#c11119] transition-all transform ${isOpen ? 'scale-0' : 'scale-100'} z-50`}
        aria-label="Assistente Jurídico"
      >
        <MessageSquare size={24} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-netflix-background border-netflix-cardHover text-netflix-text sm:max-w-[600px] max-h-[80vh] overflow-y-auto animate-fade-in">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Assistente Jurídico
            </DialogTitle>
          </DialogHeader>

          <div className="my-2">
            <p className="text-sm text-netflix-text mb-4 animate-fade-in">
              <span className="font-semibold">{book.livro}</span> - {book.area}
            </p>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3 mb-4 animate-fade-in">
                <TabsTrigger value="summarize" className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span className="hidden sm:inline">Resumo</span>
                </TabsTrigger>
                <TabsTrigger value="mindmap" className="flex items-center gap-1">
                  <Network size={16} />
                  <span className="hidden sm:inline">Mapa Mental</span>
                </TabsTrigger>
                <TabsTrigger value="qa" className="flex items-center gap-1">
                  <HelpCircle size={16} />
                  <span className="hidden sm:inline">Perguntas</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summarize" className="animate-fade-in">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                  </div>
                ) : isTyping ? (
                  <div className="p-4 rounded bg-netflix-card">
                    <ReactMarkdown components={markdownComponents}>
                      {displayText}
                    </ReactMarkdown>
                    <TypingAnimation />
                  </div>
                ) : (
                  <div className="p-4 rounded bg-netflix-card">
                    <ReactMarkdown components={markdownComponents}>
                      {displayText || 'Gerando resumo...'}
                    </ReactMarkdown>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mindmap" className="animate-fade-in">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                  </div>
                ) : isTyping ? (
                  <div className="p-4 rounded bg-netflix-card">
                    <ReactMarkdown components={markdownComponents}>
                      {displayText}
                    </ReactMarkdown>
                    <TypingAnimation />
                  </div>
                ) : (
                  <div className="p-4 rounded bg-netflix-card">
                    <ReactMarkdown components={markdownComponents}>
                      {displayText || 'Gerando mapa mental...'}
                    </ReactMarkdown>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="qa" className="animate-fade-in space-y-4">
                <Textarea
                  placeholder="Digite sua pergunta sobre este livro..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-netflix-card border-netflix-cardHover text-netflix-text focus:border-netflix-accent transition-colors"
                  rows={3}
                />
                <Button 
                  onClick={handleQuestionSubmit} 
                  disabled={isLoading}
                  className="bg-netflix-accent hover:bg-[#c11119] text-white w-full transition-colors"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Pergunta'}
                </Button>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                  </div>
                ) : isTyping && displayText ? (
                  <div className="p-4 rounded bg-netflix-card">
                    <ReactMarkdown components={markdownComponents}>
                      {displayText}
                    </ReactMarkdown>
                    <TypingAnimation />
                  </div>
                ) : displayText ? (
                  <div className="p-4 rounded bg-netflix-card">
                    <ReactMarkdown components={markdownComponents}>
                      {displayText}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalAssistant;
