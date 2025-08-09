
import React from 'react';
import { useLibrary } from '@/contexts/LibraryContext';
import { Book, TrendingUp, Clock, Star } from 'lucide-react';

const CategoryStats: React.FC = () => {
  const { books } = useLibrary();

  // Calculate statistics
  const areaCounts = books.reduce((acc: Record<string, number>, book) => {
    const area = book.area;
    if (!acc[area]) {
      acc[area] = 0;
    }
    acc[area]++;
    return acc;
  }, {});

  // Get top areas
  const topAreas = Object.entries(areaCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  // Recent additions (last 30 days)
  const recentBooks = books.filter(book => {
    const bookDate = new Date(book.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return bookDate > thirtyDaysAgo;
  });

  const favoriteBooks = books.filter(book => book.favorito);

  return (
    <div className="mb-8 bg-netflix-card rounded-2xl p-6 border border-netflix-accent/10">
      <div className="flex items-center mb-6">
        <TrendingUp className="text-netflix-accent mr-3" size={24} />
        <h2 className="text-xl font-bold text-netflix-text">Insights da Biblioteca</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Areas Chart */}
        <div className="bg-netflix-background rounded-xl p-4">
          <h3 className="text-sm font-medium text-netflix-secondary mb-4 flex items-center">
            <Book size={16} className="mr-2" />
            Áreas Mais Populares
          </h3>
          <div className="space-y-3">
            {topAreas.map(([area, count], index) => {
              const percentage = (count / books.length) * 100;
              return (
                <div key={area} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-netflix-text truncate">{area}</span>
                    <span className="text-xs text-netflix-secondary">{count}</span>
                  </div>
                  <div className="w-full bg-netflix-secondary/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-netflix-accent to-netflix-accent/70 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${percentage}%`,
                        animationDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-netflix-background rounded-xl p-4">
          <h3 className="text-sm font-medium text-netflix-secondary mb-4 flex items-center">
            <Clock size={16} className="mr-2" />
            Atualizações Recentes
          </h3>
          <div className="space-y-3">
            {recentBooks.slice(0, 4).map((book) => (
              <div key={book.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-netflix-text truncate">{book.livro}</div>
                  <div className="text-xs text-netflix-secondary">{book.area}</div>
                </div>
              </div>
            ))}
            {recentBooks.length === 0 && (
              <div className="text-center text-netflix-secondary text-xs py-4">
                Nenhuma atualização recente
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-netflix-background rounded-xl p-4">
          <h3 className="text-sm font-medium text-netflix-secondary mb-4 flex items-center">
            <Star size={16} className="mr-2" />
            Estatísticas Rápidas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-netflix-secondary">Total de Livros</span>
              <span className="text-lg font-bold text-netflix-accent">{books.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-netflix-secondary">Áreas Disponíveis</span>
              <span className="text-lg font-bold text-netflix-accent">{Object.keys(areaCounts).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-netflix-secondary">Favoritos</span>
              <span className="text-lg font-bold text-netflix-accent">{favoriteBooks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-netflix-secondary">Novos (30 dias)</span>
              <span className="text-lg font-bold text-netflix-accent">{recentBooks.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;
