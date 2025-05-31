
import React from 'react';

const EnhancedBookCardSkeleton: React.FC = () => {
  return (
    <div className="book-card relative bg-netflix-card rounded-lg overflow-hidden animate-pulse">
      <div className="relative">
        {/* Image skeleton with shimmer effect */}
        <div className="w-full aspect-[2/3] bg-gradient-to-r from-netflix-cardHover via-netflix-cardHover/70 to-netflix-cardHover relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        
        {/* Heart button skeleton */}
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 rounded-full bg-netflix-cardHover/80 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        {/* Title skeleton */}
        <div className="space-y-1">
          <div className="h-4 bg-netflix-cardHover rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="h-4 bg-netflix-cardHover rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
        
        {/* Area skeleton */}
        <div className="h-3 bg-netflix-cardHover rounded w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: '0.8s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookCardSkeleton;
