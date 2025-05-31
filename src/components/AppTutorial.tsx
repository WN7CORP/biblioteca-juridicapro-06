
import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

interface AppTutorialProps {
  isFirstVisit: boolean;
}

const AppTutorial: React.FC<AppTutorialProps> = ({ isFirstVisit }) => {
  useEffect(() => {
    if (!isFirstVisit) return;
    
    // Delay tutorial start to ensure DOM elements are ready
    const timer = setTimeout(() => {
      const intro = introJs();
      
      intro.setOptions({
        steps: [
          {
            element: '[data-intro="welcome"]',
            intro: 'Bem-vindo à Biblioteca Jurídica! 🎓<br><br>Aqui você encontra milhares de livros jurídicos gratuitos, busca inteligente com IA e muito mais.',
            position: 'bottom'
          },
          {
            element: '[data-intro="search"]',
            intro: '🤖 <strong>Busca Inteligente com IA</strong><br><br>Digite o que procura e nossa IA encontra o livro perfeito para você. Experimente: "livro sobre contratos"'
          },
          {
            element: '[data-intro="areas"]',
            intro: '📚 <strong>Áreas Organizadas</strong><br><br>Explore livros por área do Direito. Cada categoria tem centenas de materiais especializados.'
          },
          {
            element: '[data-intro="navigation"]',
            intro: '🧭 <strong>Navegação Simples</strong><br><br>Use o menu para acessar suas anotações, favoritos e histórico de leitura.'
          },
          {
            element: '[data-intro="faq"]',
            intro: '❓ <strong>Dúvidas Frequentes</strong><br><br>Confira nossa seção de FAQ para esclarecer qualquer dúvida sobre o uso da plataforma.'
          }
        ],
        doneLabel: '✅ Começar a Explorar',
        nextLabel: 'Próximo →',
        prevLabel: '← Anterior',
        skipLabel: '⏭️ Pular Tutorial',
        overlayOpacity: 0.8,
        showProgress: true,
        scrollToElement: true,
        tooltipClass: 'customTooltip',
        highlightClass: 'customHighlight',
        disableInteraction: false,
        exitOnOverlayClick: false,
        showStepNumbers: true,
        keyboardNavigation: true,
      });

      intro.onexit(() => {
        localStorage.setItem('tutorialSeen', 'true');
        // Focus on search after tutorial
        const searchInput = document.querySelector('input[placeholder*="procura"]') as HTMLInputElement;
        if (searchInput) {
          setTimeout(() => {
            searchInput.focus();
          }, 500);
        }
      });

      intro.oncomplete(() => {
        localStorage.setItem('tutorialSeen', 'true');
        // Focus on search after tutorial completion
        const searchInput = document.querySelector('input[placeholder*="procura"]') as HTMLInputElement;
        if (searchInput) {
          setTimeout(() => {
            searchInput.focus();
          }, 500);
        }
      });

      intro.start();
    }, 1200); // Increased delay to ensure all components are loaded
    
    return () => clearTimeout(timer);
  }, [isFirstVisit]);

  // Add custom CSS for better tutorial appearance
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .customTooltip {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a1810 100%);
        border: 2px solid #e50914;
        border-radius: 12px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        box-shadow: 0 20px 40px rgba(0,0,0,0.8);
      }
      
      .customTooltip .introjs-tooltip-title {
        color: #e50914;
        font-weight: 700;
        border-bottom: 1px solid #333;
        padding-bottom: 8px;
        margin-bottom: 12px;
      }
      
      .customHighlight {
        border: 3px solid #e50914 !important;
        border-radius: 8px !important;
        box-shadow: 0 0 30px rgba(229, 9, 20, 0.6) !important;
      }
      
      .introjs-button {
        background: #e50914 !important;
        border: none !important;
        border-radius: 6px !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 8px 16px !important;
        transition: all 0.2s ease !important;
      }
      
      .introjs-button:hover {
        background: #c11119 !important;
        transform: translateY(-1px) !important;
      }
      
      .introjs-skipbutton {
        background: transparent !important;
        color: #999 !important;
        border: 1px solid #333 !important;
      }
      
      .introjs-skipbutton:hover {
        background: #333 !important;
        color: white !important;
      }
      
      .introjs-progressbar {
        background: #e50914 !important;
      }
      
      .introjs-progress {
        background: #333 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default AppTutorial;
