
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BookCardSkeleton: React.FC = () => {
  return (
    <div className="book-card relative bg-netflix-card rounded-md overflow-hidden animate-pulse">
      <div className="relative">
        <Skeleton className="w-full aspect-[2/3] bg-netflix-cardHover" />
        <div className="absolute top-2 right-2">
          <Skeleton className="w-8 h-8 rounded-full bg-netflix-cardHover" />
        </div>
      </div>
      <div className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2 bg-netflix-cardHover" />
        <Skeleton className="h-3 w-1/2 bg-netflix-cardHover" />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
