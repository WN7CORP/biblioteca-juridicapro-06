
import { Book, Note } from "../types";

export const mockBooks: Book[] = [
  {
    id: 1,
    area: "Direito Civil",
    livro: "Código Civil Comentado",
    link: "https://drive.google.com/file/d/example1/preview",
    imagem: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&h=700",
    sobre: "Um guia completo e comentado do Código Civil brasileiro, com jurisprudência atualizada.",
    download: "https://drive.google.com/uc?export=download&id=example1",
    favorito: false,
    progresso: 25,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    area: "Direito Constitucional",
    livro: "Constituição Federal Anotada",
    link: "https://drive.google.com/file/d/example2/preview",
    imagem: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&h=700",
    sobre: "Texto integral da Constituição Federal com anotações e comentários sobre cada artigo e suas emendas.",
    download: "https://drive.google.com/uc?export=download&id=example2",
    favorito: true,
    progresso: 67,
    created_at: "2024-01-10T14:30:00Z"
  },
  {
    id: 3,
    area: "Direito Penal",
    livro: "Manual de Direito Penal",
    link: "https://drive.google.com/file/d/example3/preview",
    imagem: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=500&h=700",
    sobre: "Este manual aborda de forma abrangente os princípios do Direito Penal brasileiro e suas aplicações práticas.",
    download: "https://drive.google.com/uc?export=download&id=example3",
    favorito: false,
    progresso: 0,
    created_at: "2024-01-20T09:15:00Z"
  },
  {
    id: 4,
    area: "Direito do Trabalho",
    livro: "CLT Interpretada",
    link: "https://drive.google.com/file/d/example4/preview",
    imagem: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&h=700",
    sobre: "Consolidação das Leis do Trabalho com interpretações doutrinárias e jurisprudenciais.",
    download: "https://drive.google.com/uc?export=download&id=example4",
    favorito: false,
    progresso: 45,
    created_at: "2024-01-08T16:45:00Z"
  },
  {
    id: 5,
    area: "Direito Administrativo",
    livro: "Direito Administrativo Contemporâneo",
    link: "https://drive.google.com/file/d/example5/preview",
    imagem: "https://images.unsplash.com/photo-1532598869359-154f678bd8a3?auto=format&fit=crop&w=500&h=700",
    sobre: "Uma abordagem contemporânea do Direito Administrativo, com foco na administração pública moderna.",
    download: "https://drive.google.com/uc?export=download&id=example5",
    favorito: false,
    progresso: 12,
    created_at: "2024-01-25T11:20:00Z"
  },
  {
    id: 6,
    area: "Direito Tributário",
    livro: "Sistema Tributário Nacional",
    link: "https://drive.google.com/file/d/example6/preview",
    imagem: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&h=700",
    sobre: "Análise aprofundada do Sistema Tributário Nacional e suas implicações para pessoas físicas e jurídicas.",
    download: "https://drive.google.com/uc?export=download&id=example6",
    favorito: true,
    progresso: 89,
    created_at: "2024-01-05T13:10:00Z"
  }
];

export const mockNotes: Note[] = [
  {
    id: "1",
    bookId: 2,
    content: "Importante para concurso: artigo 5º e suas garantias fundamentais.",
    createdAt: new Date("2023-09-15")
  },
  {
    id: "2",
    bookId: 6,
    content: "Revisar capítulo sobre tributos federais para a prova da OAB.",
    createdAt: new Date("2023-10-02")
  }
];
