
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Como usar a biblioteca para estudar para o exame da OAB?",
    answer: "Nossa biblioteca contém diversos livros atualizados com a legislação mais recente e questões comentadas para o exame da OAB. Recomendamos começar pelos materiais específicos de Direito Constitucional, Civil e Processual Civil, que costumam ter maior peso na prova. Utilize o assistente jurídico para gerar resumos e mapas mentais para otimizar seu estudo."
  },
  {
    question: "Os livros são atualizados para concursos públicos?",
    answer: "Sim, nossa biblioteca é regularmente atualizada com as mudanças legislativas e jurisprudências mais recentes. Os livros mais recentes são marcados com um indicador 'Atualizado'. Para concursos, recomendamos filtrar pelas áreas específicas do edital do concurso e aproveitar os recursos de resumo para revisão rápida."
  },
  {
    question: "Posso fazer anotações nos livros para estudos na faculdade?",
    answer: "Sim, todos os livros possuem sistema de anotações. Enquanto estiver lendo, selecione o texto e escolha a opção de adicionar anotação. Você pode revisar todas as suas anotações na página dedicada acessível pelo menu. Essa funcionalidade é especialmente útil para criar fichamentos e resumos para disciplinas da faculdade."
  },
  {
    question: "Como funciona o assistente jurídico?",
    answer: "O assistente jurídico utiliza inteligência artificial para ajudar em seus estudos. Ele pode gerar resumos completos de livros, criar mapas mentais organizados e responder perguntas específicas sobre o conteúdo dos materiais. Basta selecionar um livro e clicar no ícone do assistente no canto inferior direito para começar."
  },
  {
    question: "Posso baixar os livros para leitura offline?",
    answer: "Sim, a maioria dos livros oferece opção de download para leitura offline. Procure pelo botão de download na página de detalhes do livro. Lembre-se que mesmo offline, você pode acessar o conteúdo pelo aplicativo, mas algumas funcionalidades como o assistente jurídico necessitam de conexão com internet."
  },
  {
    question: "Como encontrar livros sobre um tema específico?",
    answer: "Você pode usar a barra de pesquisa para localizar livros por título, autor ou área. Adicionalmente, temos a busca por IA onde você pode descrever o tema que deseja estudar e o sistema recomendará os melhores livros disponíveis na biblioteca."
  }
];

const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="mb-10">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <HelpCircle className="mr-2" size={20} />
        Perguntas Frequentes
      </h2>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-netflix-card rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 text-left flex justify-between items-center"
            >
              <span className="font-medium">{faq.question}</span>
              {openItem === index ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            
            {openItem === index && (
              <div className="px-4 pb-4 text-sm text-netflix-secondary">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
