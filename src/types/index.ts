
export interface Book {
  id: number;
  area: string;
  livro: string;
  link: string;
  imagem: string;
  sobre: string;
  download: string;
  favorito?: boolean;
  progresso?: number;
  created_at?: string;
}

export interface Note {
  id: string;
  bookId: number;
  content: string;
  createdAt: Date;
}
