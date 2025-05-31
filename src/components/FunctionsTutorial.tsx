
import React from 'react';
import { Search, Heart, BookOpen, FileText, Grid, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FunctionsTutorial: React.FC = () => {
  const functions = [
    {
      icon: <Search className="w-5 h-5 text-netflix-accent" />,
      title: "Busca Inteligente com IA",
      description: "Digite o que procura e nossa IA encontra o livro perfeito para você"
    },
    {
      icon: <Heart className="w-5 h-5 text-red-500" />,
      title: "Favoritos",
      description: "Salve seus livros preferidos clicando no coração"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      title: "Categorias",
      description: "Explore livros organizados por áreas do Direito"
    },
    {
      icon: <FileText className="w-5 h-5 text-green-500" />,
      title: "Anotações",
      description: "Faça suas anotações pessoais em cada livro"
    },
    {
      icon: <Grid className="w-5 h-5 text-purple-500" />,
      title: "Visualização em Grade",
      description: "Veja os livros em formato de cartões visuais"
    },
    {
      icon: <List className="w-5 h-5 text-yellow-500" />,
      title: "Visualização em Lista",
      description: "Visualize os livros em formato de lista detalhada"
    }
  ];

  return (
    <Card className="bg-netflix-card border-netflix-cardHover mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-netflix-accent">Funções da Plataforma</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {functions.map((func, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-netflix-background/50 hover:bg-netflix-cardHover transition-colors">
              {func.icon}
              <div>
                <h3 className="font-medium text-sm text-white">{func.title}</h3>
                <p className="text-xs text-netflix-secondary">{func.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionsTutorial;
