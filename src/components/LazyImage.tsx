
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Book } from 'lucide-react';
import { useImageCache } from '@/hooks/useImageCache';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  priority?: 'high' | 'normal' | 'low';
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  onError,
  priority = 'normal'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isLoaded, hasError, isLoading } = useImageCache(
    isVisible ? src : '', 
    priority
  );

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoadError(true);
    onError?.();
  }, [onError]);

  // Check if src is valid
  const isValidSrc = src && src !== '/placeholder.svg' && !src.includes('placeholder');

  if (!isValidSrc || hasError || imageLoadError) {
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
    <div className={`relative ${className}`} ref={imgRef}>
      {(isLoading || !isVisible) && (
        <div className="absolute inset-0 bg-netflix-cardHover flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-netflix-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 object-cover`}
          onError={handleImageError}
          loading="eager" // Since we're handling lazy loading ourselves
          style={{
            filter: isLoaded ? 'none' : 'blur(4px)',
            transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;
