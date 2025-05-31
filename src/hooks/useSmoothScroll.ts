
import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToResults = useCallback(async (elementRef: HTMLElement | null) => {
    if (!elementRef) return;

    // Smooth scroll down to show results
    elementRef.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Wait for scroll to complete
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Optional: scroll back up slightly for better view
    window.scrollBy({
      top: -100,
      behavior: 'smooth'
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToResults,
    scrollToTop
  };
};
