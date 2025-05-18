
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, BookOpen, Network, HelpCircle, Send, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Book } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

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
  const [qaMessages, setQaMessages] = useState<MessageType[]>([]);
  const [summarizeMessages, setSummarizeMessages] = useState<MessageType[]>([]);
  const [mindmapMessages, setMindmapMessages] = useState<MessageType[]>([]);
  const [matchedBooks, setMatchedBooks] = useState<Book[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get the current messages array based on active tab
  const getCurrentMessages = () => {
    switch (activeTab) {
      case 'qa':
        return qaMessages;
      case 'summarize':
        return summarizeMessages;
      case 'mindmap':
        return mindmapMessages;
      default:
        return qaMessages;
    }
  };

  // Set messages based on active tab
  const setCurrentMessages = (messages: MessageType[]) => {
    switch (activeTab) {
      case 'qa':
        setQaMessages(messages);
        break;
      case 'summarize':
        setSummarizeMessages(messages);
        break;
      case 'mindmap':
        setMindmapMessages(messages);
        break;
    }
  };

  // Load conversation history and add welcome message when component mounts
  useEffect(() => {
    if (isOpen && book) {
      // Add initial welcome messages if empty
      if (qaMessages.length === 0) {
        setQaMessages([{
          role: 'assistant',
          content: `Olá! Estou pronto para responder suas perguntas sobre "${book.livro}". O que você gostaria de saber?`,
          timestamp: new Date()
        }]);
      }
      
      if (summarizeMessages.length === 0) {
        setSummarizeMessages([{
          role: 'assistant',
          content: `Posso criar um resumo completo do livro "${book.livro}". Isso ajudará você a compreender os principais conceitos e pontos-chave da obra.`,
          timestamp: new Date()
        }]);
      }
      
      if (mindmapMessages.length === 0) {
        setMindmapMessages([{
          role: 'assistant',
          content: `Posso gerar um mapa mental organizado do conteúdo de "${book.livro}", facilitando a visualização da estrutura e dos conceitos principais do material.`,
          timestamp: new Date()
        }]);
      }
      
      loadConversationHistory();
    }
  }, [isOpen, book.id, activeTab]);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaMessages, summarizeMessages, mindmapMessages, activeTab]);

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
        // Group conversations by interaction type
        const qaConversation: MessageType[] = [];
        const summarizeConversation: MessageType[] = [];
        const mindmapConversation: MessageType[] = [];
        
        data.forEach(item => {
          const userMessage: MessageType = {
            role: 'user',
            content: item.interaction_type === 'qa' ? item.query : `Gerar ${item.interaction_type === 'summarize' ? 'resumo' : 'mapa mental'}`,
            timestamp: new Date(item.created_at)
          };
          
          const assistantMessage: MessageType = {
            role: 'assistant',
            content: item.response || '',
            timestamp: new Date(item.created_at)
          };
          
          // Add messages to the appropriate conversation
          switch (item.interaction_type) {
            case 'qa':
              qaConversation.push(userMessage, assistantMessage);
              break;
            case 'summarize':
              summarizeConversation.push(userMessage, assistantMessage);
              break;
            case 'mindmap':
              mindmapConversation.push(userMessage, assistantMessage);
              break;
          }
        });
        
        // Only update if we have actual conversations
        if (qaConversation.length > 0) setQaMessages(qaConversation);
        if (summarizeConversation.length > 0) setSummarizeMessages(summarizeConversation);
        if (mindmapConversation.length > 0) setMindmapMessages(mindmapConversation);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de conversas:', error);
    }
  };

  // Function to copy content to clipboard
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Conteúdo copiado",
        description: "O texto foi copiado para a área de transferência.",
      });
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
        variant: "destructive",
      });
    });
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
    
    return () => {
      clearInterval(intervalId);
      setIsTyping(false);
    };
  };

  const handleFetchAssistant = async (action: ActionType) => {
    setIsLoading(true);
    
    // Get current messages array based on active tab
    const messages = getCurrentMessages();
    
    // Add user message to conversation
    const userMessage: MessageType = {
      role: 'user',
      content: action === 'qa' ? question : `Gerar ${action === 'summarize' ? 'resumo' : 'mapa mental'}`,
      timestamp: new Date()
    };
    
    setCurrentMessages([...messages, userMessage]);
    
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
        
        setCurrentMessages([...messages, userMessage, assistantMessage]);
        
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
      
      // Add error message to conversation
      const errorMessage: MessageType = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.',
        timestamp: new Date()
      };
      
      setCurrentMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as ActionType);
    setResponse('');
    setShowConfirmation(value !== 'qa');
    setMatchedBooks([]);
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
    h1: (props: any) => <h1 className="text-xl font-bold mb-3 text-white">{props.children}</h1>,
    h2: (props: any) => <h2 className="text-lg font-bold mb-2 text-white">{props.children}</h2>,
    h3: (props: any) => <h3 className="text-md font-bold mb-2 text-white">{props.children}</h3>,
    p: (props: any) => <p className="mb-2 text-netflix-text">{props.children}</p>,
    ul: (props: any) => <ul className="list-disc list-inside mb-2">{props.children}</ul>,
    ol: (props: any) => <ol className="list-decimal list-inside mb-2">{props.children}</ol>,
    li: (props: any) => <li className="ml-2 mb-1">{props.children}</li>,
    blockquote: (props: any) => <blockquote className="border-l-4 border-netflix-accent pl-2 italic mb-2">{props.children}</blockquote>,
    code: (props: any) => {
      const { node, inline, ...rest } = props;
      return inline 
        ? <code className="bg-[#333] px-1 rounded text-white font-mono text-sm">{props.children}</code>
        : <pre className="bg-[#333] p-2 rounded text-white font-mono text-sm overflow-x-auto mb-2"><code {...rest}>{props.children}</code></pre>;
    }
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

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <DialogContent className="bg-netflix-background border-netflix-cardHover text-netflix-text max-w-full w-[95vw] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 p-4 border-b border-netflix-cardHover">
            <DialogTitle className="text-xl text-white flex items-center">
              <MessageSquare className="mr-2 text-netflix-accent" size={20} />
              Assistente Jurídico
              <button 
                onClick={() => setIsOpen(false)} 
                className="ml-auto text-netflix-text hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </DialogTitle>
            <p className="text-sm text-netflix-accent">
              Assistente para "{book.livro}" - {book.area}
            </p>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden p-4">
            <TabsList className="grid grid-cols-3 mb-4 flex-shrink-0">
              <TabsTrigger value="qa" className="flex items-center gap-1">
                <HelpCircle size={16} />
                <span className="hidden sm:inline">Perguntas</span>
              </TabsTrigger>
              <TabsTrigger value="summarize" className="flex items-center gap-1">
                <BookOpen size={16} />
                <span className="hidden sm:inline">Resumo</span>
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="flex items-center gap-1">
                <Network size={16} />
                <span className="hidden sm:inline">Mapa Mental</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 pr-4 overflow-y-auto" ref={scrollAreaRef}>
              {/* Books recommendation section - will be shown when available */}
              {matchedBooks.length > 0 && (
                <div className="mb-6 bg-[#1a1a1a] rounded-lg p-4 border-l-2 border-netflix-accent animate-scale-in">
                  <h3 className="text-lg font-medium mb-3 text-white">Livros Recomendados</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {matchedBooks.map((book) => (
                      <div 
                        key={book.id}
                        className="bg-netflix-card rounded-lg overflow-hidden border border-netflix-cardHover hover:border-netflix-accent transition-all duration-300 hover:scale-105"
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={book.imagem} 
                            alt={book.livro} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-netflix-accent line-clamp-2">{book.livro}</h4>
                          <p className="text-xs text-netflix-secondary mt-1">{book.area}</p>
                          <p className="text-xs mt-1 line-clamp-2">{book.sobre || 'Livro recomendado baseado na sua consulta'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <TabsContent value="qa" className="m-0 space-y-4 mt-0 data-[state=active]:mt-0">
                {qaMessages.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {qaMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-netflix-card text-right ml-12 animate-fade-in rounded-lg p-3' 
                            : 'bg-[#232323] mr-12 animate-fade-in rounded-lg p-4 border-l-2 border-netflix-accent'
                        }`}
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
              </TabsContent>

              <TabsContent value="summarize" className="m-0 space-y-4 mt-0 data-[state=active]:mt-0">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center bg-[#232323] rounded-lg border border-netflix-cardHover">
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
                  <div className="space-y-4 mb-4">
                    {summarizeMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-netflix-card text-right ml-12 animate-fade-in rounded-lg p-3' 
                            : 'relative bg-[#232323] mr-12 animate-fade-in rounded-lg p-4 border-l-2 border-netflix-accent'
                        }`}
                      >
                        <p className="text-xs text-netflix-secondary mb-1">
                          {msg.role === 'user' ? 'Você' : 'Assistente'}
                        </p>
                        {msg.role === 'assistant' ? (
                          <>
                            <ReactMarkdown components={markdownComponents}>
                              {msg.content}
                            </ReactMarkdown>
                            {msg.content.length > 100 && (
                              <Button
                                onClick={() => handleCopyContent(msg.content)}
                                variant="outline"
                                size="sm"
                                className="absolute top-4 right-4 p-2 h-auto"
                                title="Copiar texto"
                              >
                                <Copy size={16} />
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mindmap" className="m-0 space-y-4 mt-0 data-[state=active]:mt-0">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center bg-[#232323] rounded-lg border border-netflix-cardHover">
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
                  <div className="space-y-4 mb-4">
                    {mindmapMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-netflix-card text-right ml-12 animate-fade-in rounded-lg p-3' 
                            : 'relative bg-[#232323] mr-12 animate-fade-in rounded-lg p-4 border-l-2 border-netflix-accent'
                        }`}
                      >
                        <p className="text-xs text-netflix-secondary mb-1">
                          {msg.role === 'user' ? 'Você' : 'Assistente'}
                        </p>
                        {msg.role === 'assistant' ? (
                          <>
                            <ReactMarkdown components={markdownComponents}>
                              {msg.content}
                            </ReactMarkdown>
                            {msg.content.length > 100 && (
                              <Button
                                onClick={() => handleCopyContent(msg.content)}
                                variant="outline"
                                size="sm"
                                className="absolute top-4 right-4 p-2 h-auto"
                                title="Copiar texto"
                              >
                                <Copy size={16} />
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
            
            {/* Only show typing indicator when actually typing */}
            {isTyping && (
              <div className="typing-indicator ml-2 my-2">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="relative mt-auto">
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
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

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
          
          @keyframes scale-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }
        `
      }} />
    </>
  );
};

export default LegalAssistant;
