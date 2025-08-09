
import React from 'react';
import { Filter, Grid, List, SortAsc, SortDesc, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryFiltersProps {
  sortBy: 'alphabetic' | 'count' | 'recent';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  showFavoritesOnly: boolean;
  onSortByChange: (sortBy: 'alphabetic' | 'count' | 'recent') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFavoritesToggle: () => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  sortBy,
  sortOrder,
  viewMode,
  showFavoritesOnly,
  onSortByChange,
  onSortOrderChange,
  onViewModeChange,
  onFavoritesToggle
}) => {
  return (
    <div className="mb-6 bg-netflix-card rounded-xl p-4 border border-netflix-accent/10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="text-netflix-accent" size={18} />
          <span className="text-sm font-medium text-netflix-text">Filtros e Ordenação</span>
        </div>
        
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* Sort Options */}
          <div className="flex items-center bg-netflix-background rounded-lg">
            <Button
              variant={sortBy === 'alphabetic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortByChange('alphabetic')}
              className="text-xs"
            >
              A-Z
            </Button>
            <Button
              variant={sortBy === 'count' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortByChange('count')}
              className="text-xs"
            >
              Quantidade
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortByChange('recent')}
              className="text-xs"
            >
              <Clock size={12} className="mr-1" />
              Recente
            </Button>
          </div>

          {/* Sort Order */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2"
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>

          {/* Favorites Filter */}
          <Button
            variant={showFavoritesOnly ? 'default' : 'ghost'}
            size="sm"
            onClick={onFavoritesToggle}
            className="text-xs"
          >
            <Star size={12} className="mr-1" />
            Favoritos
          </Button>

          {/* View Mode */}
          <div className="flex items-center bg-netflix-background rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="p-2"
            >
              <Grid size={14} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="p-2"
            >
              <List size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
