
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, BookOpen, Network, HelpCircle, Send } from 'lucide-react';
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

type MessageType = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

type ActionType = 'summarize' | 'mindmap' | 'qa';

const LegalAssistant: React.FC<LegalAssistantProps> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActionType>('qa');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load conversation history when component mounts
  useEffect(() => {
    if (isOpen && book) {
      loadConversationHistory();
    }
  }, [isOpen, book.id]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadConversationHistory = async () => {
    try {
      // Generate a random IP for demo purposes (in production, you'd use the real user IP)
      const userIp = localStorage.getItem('bibjuridica_user_id') || `demo-${Math.floor(Math.random() * 1000000)}`;
      
      const { data, error } = await supabase
        .from('book_assistant_history')
        .select('*')
        .eq('book_id', book.id)
        .eq('user_ip', userIp)
        .order('created_at', { ascending: true });

      if (error) throw new Error(error.message);
      
      if (data && data.length > 0) {
        const conversationMessages = data.map(item => {
          const messages: MessageType[] = [];
          
          // Add user message
          messages.push({
            role: 'user',
            content: item.interaction_type === 'qa' ? item.query : `Gerar ${item.interaction_type === 'summarize' ? 'resumo' : 'mapa mental'}`,
            timestamp: new Date(item.created_at)
          });
          
          // Add assistant response
          if (item.response) {
            messages.push({
              role: 'assistant',
              content: item.response,
              timestamp: new Date(item.created_at)
            });
          }
          
          return messages;
        }).flat();
        
        setMessages(conversationMessages);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de conversas:', error);
    }
  };

  // Function to simulate typing animation
  const typeResponse = (text: string) => {
    setIsTyping(true);
    let displayedText = '';
    const fullText = text;
    let i = 0;
    
    // Clear any previous response
    setResponse('');
    
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        // Add character by character to simulate typing
        displayedText += fullText.charAt(i);
        setResponse(displayedText);
        i++;
      } else {
        setIsTyping(false);
        clearInterval(intervalId);
      }
    }, 10); // Adjust speed as needed
    
    return () => clearInterval(intervalId);
  };

  const handleFetchAssistant = async (action: ActionType) => {
    setIsLoading(true);
    
    // Add user message to conversation
    const userMessage: MessageType = {
      role: 'user',
      content: action === 'qa' ? question : `Gerar ${action === 'summarize' ? 'resumo' : 'mapa mental'}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Generate a random IP for demo purposes (in production, you'd use the real user IP)
      const userIp = localStorage.getItem('bibjuridica_user_id') || `demo-${Math.floor(Math.random() * 1000000)}`;
      
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
        // Add assistant message to conversation
        const assistantMessage: MessageType = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Animate typing the response
        typeResponse(data.response);
        
        // Reset the question field for QA
        if (action === 'qa') {
          setQuestion('');
        }
        
        // Hide confirmation for summarize/mindmap
        setShowConfirmation(false);
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
      setIsLoading(false);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as ActionType);
    setResponse('');
    setShowConfirmation(value !== 'qa');
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
  
  const handleConfirmAction = () => {
    handleFetchAssistant(activeTab);
  };
  
  // Markdown components for styling
  const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mb-3 text-white" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mb-2 text-white" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-md font-bold mb-2 text-white" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-2 text-netflix-text" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2" {...props} />,
    li: ({ node, ...props }: any) => <li className="ml-2 mb-1" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-netflix-accent pl-2 italic mb-2" {...props} />,
    code: ({ node, inline, ...props }: any) => 
      inline 
        ? <code className="bg-[#333] px-1 rounded text-white font-mono text-sm" {...props} />
        : <pre className="bg-[#333] p-2 rounded text-white font-mono text-sm overflow-x-auto mb-2"><code {...props} /></pre>
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-netflix-accent text-white rounded-full p-3 shadow-lg hover:bg-[#c11119] transition-colors z-50"
        aria-label="Assistente Jurídico"
      >
        <MessageSquare size={24} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-netflix-background border-netflix-cardHover text-netflix-text sm:max-w-[650px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl text-white flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Assistente Jurídico
            </DialogTitle>
            <p className="text-sm text-netflix-text">
              Assistente para "{book.livro}" - {book.area}
            </p>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-3 mb-4 flex-shrink-0">
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

            <div className="overflow-y-auto flex-1 mb-4 conversation-container">
              {messages.length > 0 && (
                <div className="space-y-4 mb-4 p-2">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`${
                        msg.role === 'user' 
                          ? 'bg-netflix-card text-right ml-12' 
                          : 'bg-[#232323] mr-12'
                      } p-3 rounded-lg`}
                    >
                      <p className="text-xs text-netflix-secondary mb-1">
                        {msg.role === 'user' ? 'Você' : 'Assistente'}
                      </p>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown components={markdownComponents}>
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              <TabsContent value="summarize" className="m-0">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen size={40} className="mb-4 text-netflix-accent" />
                    <h3 className="text-lg font-medium mb-2">Gerar Resumo</h3>
                    <p className="text-sm mb-4">
                      Deseja criar um resumo detalhado do livro "{book.livro}"?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowConfirmation(false)}
                        className="border-netflix-cardHover text-netflix-text"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleConfirmAction}
                        className="bg-netflix-accent hover:bg-[#c11119]"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Gerando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  isTyping ? (
                    <div className="whitespace-pre-line p-4 rounded bg-netflix-card">
                      <ReactMarkdown components={markdownComponents}>
                        {response}
                      </ReactMarkdown>
                      <div className="typing-indicator mt-2">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  ) : response ? (
                    <div className="whitespace-pre-line p-4 rounded bg-netflix-card">
                      <ReactMarkdown components={markdownComponents}>
                        {response}
                      </ReactMarkdown>
                    </div>
                  ) : isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                    </div>
                  ) : null
                )}
              </TabsContent>

              <TabsContent value="mindmap" className="m-0">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Network size={40} className="mb-4 text-netflix-accent" />
                    <h3 className="text-lg font-medium mb-2">Gerar Mapa Mental</h3>
                    <p className="text-sm mb-4">
                      Deseja criar um mapa mental do livro "{book.livro}"?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowConfirmation(false)}
                        className="border-netflix-cardHover text-netflix-text"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleConfirmAction}
                        className="bg-netflix-accent hover:bg-[#c11119]"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Gerando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  isTyping ? (
                    <div className="whitespace-pre-line p-4 rounded bg-netflix-card">
                      <ReactMarkdown components={markdownComponents}>
                        {response}
                      </ReactMarkdown>
                      <div className="typing-indicator mt-2">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  ) : response ? (
                    <div className="whitespace-pre-line p-4 rounded bg-netflix-card">
                      <ReactMarkdown components={markdownComponents}>
                        {response}
                      </ReactMarkdown>
                    </div>
                  ) : isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                    </div>
                  ) : null
                )}
              </TabsContent>

              <TabsContent value="qa" className="m-0">
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Digite sua pergunta sobre este livro..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="bg-netflix-card border-netflix-cardHover text-netflix-text resize-none pr-12"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleQuestionSubmit();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleQuestionSubmit} 
                      disabled={isLoading || !question.trim()}
                      className="absolute bottom-2 right-2 bg-netflix-accent hover:bg-[#c11119] text-white p-2 rounded-full h-auto"
                      size="icon"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  
                  {isTyping && (
                    <div className="typing-indicator ml-2">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
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
        
        .conversation-container {
          scrollbar-width: thin;
          scrollbar-color: #444 #222;
        }
        
        .conversation-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .conversation-container::-webkit-scrollbar-track {
          background: #222;
        }
        
        .conversation-container::-webkit-scrollbar-thumb {
          background-color: #444;
          border-radius: 6px;
          border: 2px solid #222;
        }
      `}</style>
    </>
  );
};

export default LegalAssistant;
