
import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

interface AppTutorialProps {
  isFirstVisit: boolean;
}

const AppTutorial: React.FC<AppTutorialProps> = ({ isFirstVisit }) => {
  useEffect(() => {
    // Set tutorial as seen in localStorage
    if (!isFirstVisit) return;
    
    // Slightly delay tutorial start to ensure DOM elements are ready
    const timer = setTimeout(() => {
      const intro = introJs();
      
      intro.setOptions({
        steps: [
          {
            element: '[data-intro="welcome"]',
            intro: 'Bem-vindo à Biblioteca Jurídica! Este tutorial rápido vai te ajudar a conhecer as principais funcionalidades do app.',
            position: 'bottom' // Changed from 'center' to 'bottom' to fix type error
          },
          {
            element: '[data-intro="navigation"]',
            intro: 'Use esta barra de navegação para acessar as principais áreas do aplicativo.'
          },
          {
            element: '[data-intro="search"]',
            intro: 'Utilize nossa pesquisa com IA para encontrar livros jurídicos facilmente.'
          },
          {
            element: '[data-intro="areas"]',
            intro: 'Navegue por áreas do Direito para encontrar livros específicos.'
          },
          {
            element: '[data-intro="faq"]',
            intro: 'Confira nossa seção de perguntas frequentes para esclarecer suas dúvidas.'
          },
        ],
        doneLabel: 'Concluir',
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        overlayOpacity: 0.7,
        showProgress: true,
        scrollToElement: true,
        tooltipClass: 'customTooltip',
      });

      intro.onexit(() => {
        localStorage.setItem('tutorialSeen', 'true');
      });

      intro.start();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isFirstVisit]);

  return null; // This component doesn't render anything, it just initializes the tutorial
};

export default AppTutorial;
