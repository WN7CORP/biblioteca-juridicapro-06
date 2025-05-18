
import React, { useState } from 'react';
import { MessageSquare, X, BookOpen, Network, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Book } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LegalAssistantProps {
  book: Book;
}

const LegalAssistant: React.FC<LegalAssistantProps> = ({ book }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summarize');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchAssistant = async (action: string) => {
    setIsLoading(true);
    setResponse('');

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
        <DialogContent className="bg-netflix-background border-netflix-cardHover text-netflix-text sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Assistente Jurídico
            </DialogTitle>
          </DialogHeader>

          <div className="my-2">
            <p className="text-sm text-netflix-text mb-4">
              Assistente para "{book.livro}" - {book.area}
            </p>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3 mb-4">
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

              <TabsContent value="summarize">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-line p-4 rounded bg-netflix-card">
                    {response || 'Gerando resumo...'}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mindmap">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-netflix-accent"></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-line p-4 rounded bg-netflix-card">
                    {response || 'Gerando mapa mental...'}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="qa">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Digite sua pergunta sobre este livro..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-netflix-card border-netflix-cardHover text-netflix-text"
                    rows={3}
                  />
                  <Button 
                    onClick={handleQuestionSubmit} 
                    disabled={isLoading}
                    className="bg-netflix-accent hover:bg-[#c11119] text-white w-full"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Pergunta'}
                  </Button>
                  
                  {response && (
                    <div className="whitespace-pre-line mt-4 p-4 rounded bg-netflix-card">
                      {response}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalAssistant;
