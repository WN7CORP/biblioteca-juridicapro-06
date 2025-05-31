
import React from 'react';
import { Search, Book, Brain, FileText, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuickStartGuide: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Search,
      title: "Busque com IA",
      description: "Digite o que procura e nossa IA encontra o livro ideal",
      action: () => {
        const searchElement = document.querySelector('[data-intro="search"]');
        if (searchElement) {
          searchElement.scrollIntoView({ behavior: 'smooth' });
        }
      },
      color: "text-netflix-accent",
      bgColor: "bg-netflix-accent/10"
    },
    {
      icon: Book,
      title: "Explore Áreas",
      description: "Navegue por todas as áreas do Direito organizadas",
      action: () => navigate('/categories'),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Brain,
      title: "IA Jurídica",
      description: "Converse com nossa IA para tirar dúvidas específicas",
      action: () => {
        // Scroll to a book and open its details to access AI
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: FileText,
      title: "Suas Anotações",
      description: "Faça anotações em qualquer livro e acesse depois",
      action: () => navigate('/annotations'),
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <Target className="text-netflix-accent mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-4">Como Começar</h2>
        <p className="text-netflix-secondary max-w-2xl mx-auto">
          Escolha uma das opções abaixo para começar sua jornada de estudos jurídicos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index}
            className="bg-netflix-card border-netflix-cardHover hover:border-netflix-accent transition-all duration-300 cursor-pointer group transform hover:scale-105"
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <div className={`${action.bgColor} ${action.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={32} />
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-netflix-accent transition-colors">
                {action.title}
              </h3>
              <p className="text-netflix-secondary text-sm leading-relaxed">
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips for new users */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-3">💡 Dica para Novos Usuários</h3>
          <p className="text-netflix-secondary">
            Comece explorando sua área de interesse, marque livros como favoritos e use nossa IA para tirar dúvidas específicas. 
            Tudo é gratuito e sem limite de uso!
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;
