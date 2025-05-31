
import { useState, useEffect, useCallback } from 'react';

interface ImageCacheEntry {
  url: string;
  loaded: boolean;
  error: boolean;
  timestamp: number;
}

class ImageCache {
  private cache = new Map<string, ImageCacheEntry>();
  private preloadQueue = new Set<string>();
  private maxCacheSize = 100;
  private maxAge = 10 * 60 * 1000; // 10 minutes

  preload(url: string): Promise<void> {
    if (this.cache.has(url) && this.cache.get(url)!.loaded) {
      return Promise.resolve();
    }

    if (this.preloadQueue.has(url)) {
      return Promise.resolve();
    }

    this.preloadQueue.add(url);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(url, {
          url,
          loaded: true,
          error: false,
          timestamp: Date.now()
        });
        this.preloadQueue.delete(url);
        this.cleanup();
        resolve();
      };
      img.onerror = () => {
        this.cache.set(url, {
          url,
          loaded: false,
          error: true,
          timestamp: Date.now()
        });
        this.preloadQueue.delete(url);
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  }

  getCacheStatus(url: string): ImageCacheEntry | null {
    const entry = this.cache.get(url);
    if (entry && Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(url);
      return null;
    }
    return entry || null;
  }

  private cleanup() {
    if (this.cache.size <= this.maxCacheSize) return;
    
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    );
    
    const toDelete = entries.slice(0, entries.length - this.maxCacheSize);
    toDelete.forEach(([url]) => this.cache.delete(url));
  }
}

const imageCache = new ImageCache();

export const useImageCache = (url: string, priority: 'high' | 'normal' | 'low' = 'normal') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadImage = useCallback(async () => {
    if (!url || url === '/placeholder.svg' || url.includes('placeholder')) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cached = imageCache.getCacheStatus(url);
    if (cached) {
      setIsLoaded(cached.loaded);
      setHasError(cached.error);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await imageCache.preload(url);
      setIsLoaded(true);
      setHasError(false);
    } catch (error) {
      setIsLoaded(false);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (priority === 'high') {
      loadImage();
    } else {
      // For normal/low priority, use a small delay to prioritize high priority images
      const delay = priority === 'low' ? 300 : 100;
      const timer = setTimeout(loadImage, delay);
      return () => clearTimeout(timer);
    }
  }, [loadImage, priority]);

  return { isLoaded, hasError, isLoading };
};

export { imageCache };
