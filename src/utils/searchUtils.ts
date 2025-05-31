
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

export function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
}

export function fuzzySearch(query: string, text: string, threshold: number = 0.6): boolean {
  if (!query || !text) return false;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match first
  if (textLower.includes(queryLower)) return true;
  
  // Check similarity for the whole strings
  if (calculateSimilarity(queryLower, textLower) >= threshold) return true;
  
  // Check if any word in the text matches with fuzzy search
  const words = textLower.split(/\s+/);
  const queryWords = queryLower.split(/\s+/);
  
  for (const queryWord of queryWords) {
    if (queryWord.length < 3) continue; // Skip very short words
    
    for (const word of words) {
      if (word.length < 3) continue;
      
      if (calculateSimilarity(queryWord, word) >= threshold) {
        return true;
      }
    }
  }
  
  return false;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matchType: 'exact' | 'fuzzy';
}

export function searchWithScore<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string,
  threshold: number = 0.6
): SearchResult<T>[] {
  if (!query) return items.map(item => ({ item, score: 1, matchType: 'exact' as const }));
  
  const results: SearchResult<T>[] = [];
  
  for (const item of items) {
    const text = getSearchText(item);
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Exact match gets highest score
    if (textLower.includes(queryLower)) {
      results.push({ item, score: 1, matchType: 'exact' });
      continue;
    }
    
    // Fuzzy match
    const similarity = calculateSimilarity(queryLower, textLower);
    if (similarity >= threshold) {
      results.push({ item, score: similarity, matchType: 'fuzzy' });
      continue;
    }
    
    // Word-level fuzzy matching
    const words = textLower.split(/\s+/);
    const queryWords = queryLower.split(/\s+/);
    let maxWordScore = 0;
    
    for (const queryWord of queryWords) {
      if (queryWord.length < 3) continue;
      
      for (const word of words) {
        if (word.length < 3) continue;
        const wordSimilarity = calculateSimilarity(queryWord, word);
        maxWordScore = Math.max(maxWordScore, wordSimilarity);
      }
    }
    
    if (maxWordScore >= threshold) {
      results.push({ item, score: maxWordScore * 0.8, matchType: 'fuzzy' });
    }
  }
  
  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
}
