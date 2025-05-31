
import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
}

const LazyImage: React.FC<LazyImageProps> = memo(({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/placeholder.svg',
  aspectRatio = '2/3'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px' // Load images earlier for smoother experience
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    setIsLoading(false);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden bg-netflix-card transition-smooth", className)}
      style={{ aspectRatio }}
    >
      {/* Enhanced loading skeleton with shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-card via-netflix-cardHover to-netflix-card relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="h-full w-full bg-gradient-to-t from-netflix-background/20 to-transparent" />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-netflix-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? fallbackSrc : src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
      
      {/* Error state */}
      {hasError && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-netflix-cardHover">
          <div className="text-netflix-secondary text-xs text-center p-2">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">📚</div>
            Imagem não disponível
          </div>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
