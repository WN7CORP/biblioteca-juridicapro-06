
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, BookOpen, Network, HelpCircle, Send, Copy, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Book } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qaMessages, setQaMessages] = useState<MessageType[]>([]);
  const [summarizeMessages, setSummarizeMessages] = useState<MessageType[]>([]);
  const [mindmapMessages, setMindmapMessages] = useState<MessageType[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Generate suggested questions based on book area
  const generateSuggestedQuestions = (bookArea: string) => {
    const questionsByArea: { [key: string]: string[] } = {
      'Direito Civil': [
        'Quais são os principais contratos abordados?',
        'Como funciona a responsabilidade civil?',
        'Quais são os direitos da personalidade?'
      ],
      'Direito Penal': [
        'Quais crimes são abordados neste livro?',
        'Como funciona a aplicação da pena?',
        'Quais são as excludentes de ilicitude?'
      ],
      'Direito Constitucional': [
        'Quais são os direitos fundamentais tratados?',
        'Como funciona a separação dos poderes?',
        'Quais são os princípios constitucionais?'
      ],
      'default': [
        'Qual é o tema principal do livro?',
        'Quais são os conceitos mais importantes?',
        'Como aplicar esses conhecimentos na prática?'
      ]
    };
    
    return questionsByArea[bookArea] || questionsByArea['default'];
  };

  // Load conversation history and add welcome message when component mounts
  useEffect(() => {
    if (isOpen && book) {
      setSuggestedQuestions(generateSuggestedQuestions(book.area));
      
      // Add initial welcome messages if empty
      if (qaMessages.length === 0) {
        setQaMessages([{
          role: 'assistant',
          content: `Olá! Estou aqui para ajudar com "${book.livro}". Faça suas perguntas e receba respostas diretas e práticas.`,
          timestamp: new Date()
        }]);
      }
      
      if (summarizeMessages.length === 0) {
        setSummarizeMessages([{
          role: 'assistant',
          content: `Posso criar um resumo prático e objetivo de "${book.livro}" com os pontos essenciais.`,
          timestamp: new Date()
        }]);
      }
      
      if (mindmapMessages.length === 0) {
        setMindmapMessages([{
          role: 'assistant',
          content: `Vou gerar um mapa mental estruturado de "${book.livro}" para facilitar o estudo.`,
          timestamp: new Date()
        }]);
      }
    }
  }, [isOpen, book.id, activeTab]);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaMessages, summarizeMessages, mindmapMessages, activeTab]);

  const handleFetchAssistant = async (action: ActionType, customQuery?: string) => {
    setIsLoading(true);
    
    const messages = getCurrentMessages();
    const queryText = customQuery || question;
    
    const userMessage: MessageType = {
      role: 'user',
      content: action === 'qa' ? queryText : `Gerar ${action === 'summarize' ? 'resumo' : 'mapa mental'}`,
      timestamp: new Date()
    };
    
    setCurrentMessages([...messages, userMessage]);
    
    try {
      const userIp = localStorage.getItem('bibjuridica_user_id') || `demo-${Math.floor(Math.random() * 1000000)}`;
      
      let prompt = '';
      if (action === 'qa') {
        prompt = `Responda de forma CONCISA e DIRETA sobre "${book.livro}" (${book.area}). Pergunta: ${queryText}. 
        INSTRUÇÕES: Resposta máximo 150 palavras, linguagem clara, foque no essencial.`;
      } else if (action === 'summarize') {
        prompt = `Crie um resumo CONCISO de "${book.livro}" em no máximo 200 palavras. 
        FORMATO: Use tópicos numerados, linguagem objetiva, destaque apenas pontos principais.`;
      } else {
        prompt = `Crie um mapa mental estruturado de "${book.livro}" em formato de lista hierárquica.
        FORMATO: Use markdown com headers e sub-itens, máximo 250 palavras.`;
      }

      const { data, error } = await supabase.functions.invoke('legal-assistant', {
        body: {
          bookTitle: book.livro,
          bookArea: book.area,
          action,
          query: prompt,
          userIp,
          bookId: book.id
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
        const assistantMessage: MessageType = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        
        setCurrentMessages([...messages, userMessage, assistantMessage]);
        
        if (action === 'qa') {
          setQuestion('');
          // Generate new suggested questions after each response
          setSuggestedQuestions(generateSuggestedQuestions(book.area));
        }
        
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
      
      const errorMessage: MessageType = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date()
      };
      
      setCurrentMessages([...messages, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as ActionType);
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
  
  const handleSuggestedQuestion = (suggestedQ: string) => {
    handleFetchAssistant('qa', suggestedQ);
  };

  const handleConfirmAction = () => {
    handleFetchAssistant(activeTab);
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
  
  // Markdown components for styling - SMALLER FONT SIZES
  const markdownComponents = {
    h1: (props: any) => <h1 className="text-base font-bold mb-2 text-white">{props.children}</h1>,
    h2: (props: any) => <h2 className="text-sm font-bold mb-2 text-white">{props.children}</h2>,
    h3: (props: any) => <h3 className="text-sm font-bold mb-1 text-white">{props.children}</h3>,
    p: (props: any) => <p className="mb-2 text-xs text-netflix-text leading-relaxed">{props.children}</p>,
    ul: (props: any) => <ul className="list-disc list-inside mb-2 text-xs">{props.children}</ul>,
    ol: (props: any) => <ol className="list-decimal list-inside mb-2 text-xs">{props.children}</ol>,
    li: (props: any) => <li className="ml-2 mb-1 text-xs">{props.children}</li>,
    blockquote: (props: any) => <blockquote className="border-l-4 border-netflix-accent pl-2 italic mb-2 text-xs">{props.children}</blockquote>,
    code: (props: any) => {
      const { node, inline, ...rest } = props;
      return inline 
        ? <code className="bg-[#333] px-1 rounded text-white font-mono text-xs">{props.children}</code>
        : <pre className="bg-[#333] p-2 rounded text-white font-mono text-xs overflow-x-auto mb-2"><code {...rest}>{props.children}</code></pre>;
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
            <DialogTitle className="text-lg text-white flex items-center">
              <MessageSquare className="mr-2 text-netflix-accent" size={18} />
              Assistente Jurídico
              <button 
                onClick={() => setIsOpen(false)} 
                className="ml-auto text-netflix-text hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </DialogTitle>
            <p className="text-xs text-netflix-accent">
              "{book.livro}" - {book.area}
            </p>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden p-4">
            <TabsList className="grid grid-cols-3 mb-4 flex-shrink-0">
              <TabsTrigger value="qa" className="flex items-center gap-1 text-xs">
                <HelpCircle size={14} />
                <span className="hidden sm:inline">Perguntas</span>
              </TabsTrigger>
              <TabsTrigger value="summarize" className="flex items-center gap-1 text-xs">
                <BookOpen size={14} />
                <span className="hidden sm:inline">Resumo</span>
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="flex items-center gap-1 text-xs">
                <Network size={14} />
                <span className="hidden sm:inline">Mapa Mental</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 pr-4 overflow-y-auto">
              <TabsContent value="qa" className="m-0 space-y-3 mt-0 data-[state=active]:mt-0">
                {/* Suggested Questions */}
                {suggestedQuestions.length > 0 && (
                  <div className="mb-4 bg-[#1a1a1a] rounded-lg p-3 border-l-2 border-netflix-accent">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={14} className="text-netflix-accent" />
                      <h4 className="text-xs font-medium text-white">Perguntas Sugeridas</h4>
                    </div>
                    <div className="space-y-2">
                      {suggestedQuestions.map((sq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedQuestion(sq)}
                          className="block w-full text-left text-xs text-netflix-text hover:text-netflix-accent bg-netflix-card hover:bg-netflix-cardHover p-2 rounded transition-colors"
                          disabled={isLoading}
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {qaMessages.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {qaMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-netflix-card text-right ml-12 animate-fade-in rounded-lg p-2' 
                            : 'bg-[#232323] mr-12 animate-fade-in rounded-lg p-3 border-l-2 border-netflix-accent'
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
                          <p className="text-xs">{msg.content}</p>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summarize" className="m-0 space-y-3 mt-0 data-[state=active]:mt-0">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center bg-[#232323] rounded-lg border border-netflix-cardHover">
                    <BookOpen size={32} className="mb-3 text-netflix-accent" />
                    <h3 className="text-sm font-medium mb-2">Gerar Resumo</h3>
                    <p className="text-xs mb-4">
                      Criar resumo prático de "{book.livro}"?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowConfirmation(false)}
                        className="border-netflix-cardHover text-netflix-text text-xs"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleConfirmAction}
                        className="bg-netflix-accent hover:bg-[#c11119] text-xs"
                        disabled={isLoading}
                        size="sm"
                      >
                        {isLoading ? 'Gerando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {summarizeMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-netflix-card text-right ml-12 animate-fade-in rounded-lg p-2' 
                            : 'relative bg-[#232323] mr-12 animate-fade-in rounded-lg p-3 border-l-2 border-netflix-accent'
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
                                className="absolute top-3 right-3 p-1 h-auto"
                                title="Copiar texto"
                              >
                                <Copy size={12} />
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-xs">{msg.content}</p>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mindmap" className="m-0 space-y-3 mt-0 data-[state=active]:mt-0">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center bg-[#232323] rounded-lg border border-netflix-cardHover">
                    <Network size={32} className="mb-3 text-netflix-accent" />
                    <h3 className="text-sm font-medium mb-2">Gerar Mapa Mental</h3>
                    <p className="text-xs mb-4">
                      Criar mapa mental de "{book.livro}"?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowConfirmation(false)}
                        className="border-netflix-cardHover text-netflix-text text-xs"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleConfirmAction}
                        className="bg-netflix-accent hover:bg-[#c11119] text-xs"
                        disabled={isLoading}
                        size="sm"
                      >
                        {isLoading ? 'Gerando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {mindmapMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`${
                          msg.role === 'user' 
                            ? 'bg-netflix-card text-right ml-12 animate-fade-in rounded-lg p-2' 
                            : 'relative bg-[#232323] mr-12 animate-fade-in rounded-lg p-3 border-l-2 border-netflix-accent'
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
                                className="absolute top-3 right-3 p-1 h-auto"
                                title="Copiar texto"
                              >
                                <Copy size={12} />
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-xs">{msg.content}</p>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
            
            {isLoading && (
              <div className="typing-indicator ml-2 my-2">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="relative mt-auto">
                <Textarea
                  placeholder="Digite sua pergunta..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-netflix-card border-netflix-cardHover text-netflix-text resize-none pr-12 text-xs"
                  rows={2}
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
                  className="absolute bottom-1 right-1 bg-netflix-accent hover:bg-[#c11119] text-white p-1 rounded-full h-auto"
                  size="icon"
                >
                  <Send size={14} />
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
        `
      }} />
    </>
  );
};

export default LegalAssistant;
