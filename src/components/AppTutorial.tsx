
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
      
      // Check if mobile
      const isMobile = window.innerWidth <= 768;
      
      intro.setOptions({
        steps: [
          {
            element: '[data-intro="welcome"]',
            intro: 'Bem-vindo à Biblioteca Jurídica! 🎓<br><br>Aqui você encontra milhares de livros jurídicos gratuitos, busca inteligente com IA e muito mais.',
            position: isMobile ? 'bottom' : 'bottom'
          },
          {
            element: '[data-intro="search"]',
            intro: '🤖 <strong>Busca Inteligente com IA</strong><br><br>Digite o que procura e nossa IA encontra o livro perfeito para você. Experimente: "livro sobre contratos"',
            position: isMobile ? 'bottom' : 'bottom'
          },
          {
            element: '[data-intro="areas"]',
            intro: '📚 <strong>Áreas Organizadas</strong><br><br>Explore livros por área do Direito. Cada categoria tem centenas de materiais especializados.',
            position: isMobile ? 'top' : 'bottom'
          },
          {
            element: '[data-intro="navigation"]',
            intro: '🧭 <strong>Navegação Simples</strong><br><br>Use o menu para acessar suas anotações, favoritos e histórico de leitura.',
            position: isMobile ? 'bottom' : 'right'
          },
          {
            element: '[data-intro="faq"]',
            intro: '❓ <strong>Dúvidas Frequentes</strong><br><br>Confira nossa seção de FAQ para esclarecer qualquer dúvida sobre o uso da plataforma.',
            position: isMobile ? 'top' : 'left'
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
        scrollPadding: isMobile ? 20 : 30,
        autoPosition: true,
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
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [isFirstVisit]);

  // Add responsive custom CSS for better tutorial appearance
  useEffect(() => {
    const style = document.createElement('style');
    const isMobile = window.innerWidth <= 768;
    
    style.textContent = `
      .customTooltip {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a1810 100%);
        border: 2px solid #e50914;
        border-radius: 12px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        max-width: ${isMobile ? '90vw' : '350px'} !important;
        margin: ${isMobile ? '10px' : '0'} !important;
        padding: ${isMobile ? '12px' : '16px'} !important;
        font-size: ${isMobile ? '14px' : '15px'} !important;
        line-height: 1.4 !important;
        z-index: 999999 !important;
      }
      
      .customTooltip .introjs-tooltip-title {
        color: #e50914;
        font-weight: 700;
        border-bottom: 1px solid #333;
        padding-bottom: 8px;
        margin-bottom: 12px;
        font-size: ${isMobile ? '16px' : '18px'} !important;
      }
      
      .customHighlight {
        border: 3px solid #e50914 !important;
        border-radius: 8px !important;
        box-shadow: 0 0 30px rgba(229, 9, 20, 0.6) !important;
        z-index: 999998 !important;
      }
      
      .introjs-button {
        background: #e50914 !important;
        border: none !important;
        border-radius: 6px !important;
        color: white !important;
        font-weight: 600 !important;
        padding: ${isMobile ? '10px 16px' : '8px 16px'} !important;
        transition: all 0.2s ease !important;
        font-size: ${isMobile ? '14px' : '13px'} !important;
        margin: ${isMobile ? '4px 2px' : '2px'} !important;
        min-width: ${isMobile ? '80px' : 'auto'} !important;
      }
      
      .introjs-button:hover {
        background: #c11119 !important;
        transform: translateY(-1px) !important;
      }
      
      .introjs-skipbutton {
        background: transparent !important;
        color: #999 !important;
        border: 1px solid #333 !important;
        font-size: ${isMobile ? '12px' : '13px'} !important;
      }
      
      .introjs-skipbutton:hover {
        background: #333 !important;
        color: white !important;
      }
      
      .introjs-progressbar {
        background: #e50914 !important;
        height: ${isMobile ? '3px' : '2px'} !important;
      }
      
      .introjs-progress {
        background: #333 !important;
        height: ${isMobile ? '3px' : '2px'} !important;
      }
      
      .introjs-tooltipbuttons {
        text-align: center !important;
        padding-top: ${isMobile ? '12px' : '8px'} !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: ${isMobile ? '8px' : '4px'} !important;
      }
      
      .introjs-tooltip {
        min-width: ${isMobile ? '280px' : '300px'} !important;
        max-width: ${isMobile ? '90vw' : '400px'} !important;
      }
      
      .introjs-arrow {
        border-color: #1a1a1a !important;
      }
      
      /* Mobile-specific adjustments */
      @media (max-width: 768px) {
        .introjs-tooltip {
          position: fixed !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: ${isMobile ? '20px' : 'auto'} !important;
          top: auto !important;
          margin: 10px !important;
        }
        
        .introjs-arrow {
          display: none !important;
        }
        
        .customTooltip {
          border-radius: 16px !important;
          backdrop-filter: blur(10px) !important;
        }
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
