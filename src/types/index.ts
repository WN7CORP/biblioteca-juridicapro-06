
export interface Book {
  id: number;
  area: string;
  livro: string;
  link: string;
  imagem: string;
  sobre: string;
  download: string;
  favorito: boolean;
  progresso: number; // Changed from string to number for consistency
  created_at: string;
  isNew?: boolean; // Optional property for new books
}

export interface Note {
  id: string;
  bookId: number;
  content: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ReadingProgress {
  bookId: number;
  currentPage: number;
  totalPages: number;
  lastRead: Date;
  progressPercentage: number;
}
