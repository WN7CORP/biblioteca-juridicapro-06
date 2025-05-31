
import React, { useState, useCallback } from 'react';
import { Book } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Check if src is valid
  const isValidSrc = src && src !== '/placeholder.svg' && !src.includes('placeholder');

  if (!isValidSrc || hasError) {
    return (
      <div className={`${className} bg-netflix-cardHover flex items-center justify-center`}>
        <div className="text-center p-4">
          <Book size={24} className="mx-auto mb-2 text-netflix-accent/60" />
          <p className="text-xs text-netflix-secondary">Capa indisponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-netflix-cardHover animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-netflix-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImage;
