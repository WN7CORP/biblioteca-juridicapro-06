
export interface Book {
  id: string;
  area: string;
  livro: string;
  link: string;
  imagem: string;
  sobre: string;
  download: string;
  favorito?: boolean;
}

export interface Note {
  id: string;
  bookId: string;
  content: string;
  createdAt: Date;
}
