
import React, { useEffect, useState } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

interface AppTutorialProps {
  isFirstVisit: boolean;
}

const AppTutorial: React.FC<AppTutorialProps> = ({ isFirstVisit }) => {
  const [enabled, setEnabled] = useState(isFirstVisit);
  const [initialStep, setInitialStep] = useState(0);

  useEffect(() => {
    // Set tutorial as seen in localStorage
    if (!isFirstVisit) return;
    
    // Slightly delay tutorial start to ensure DOM elements are ready
    const timer = setTimeout(() => {
      setEnabled(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isFirstVisit]);

  const steps = [
    {
      element: '[data-intro="welcome"]',
      intro: 'Bem-vindo à Biblioteca Jurídica! Este tutorial rápido vai te ajudar a conhecer as principais funcionalidades do app.',
      position: 'center',
    },
    {
      element: '[data-intro="navigation"]',
      intro: 'Use esta barra de navegação para acessar as principais áreas do aplicativo.',
    },
    {
      element: '[data-intro="search"]',
      intro: 'Utilize nossa pesquisa com IA para encontrar livros jurídicos facilmente.',
    },
    {
      element: '[data-intro="areas"]',
      intro: 'Navegue por áreas do Direito para encontrar livros específicos.',
    },
    {
      element: '[data-intro="faq"]',
      intro: 'Confira nossa seção de perguntas frequentes para esclarecer suas dúvidas.',
    },
  ];

  const onExit = () => {
    setEnabled(false);
    localStorage.setItem('tutorialSeen', 'true');
  };

  return (
    <Steps
      enabled={enabled}
      steps={steps}
      initialStep={initialStep}
      onExit={onExit}
      options={{
        doneLabel: 'Concluir',
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        overlayOpacity: 0.7,
        showProgress: true,
        scrollToElement: true,
        tooltipClass: 'customTooltip',
      }}
    />
  );
};

export default AppTutorial;
