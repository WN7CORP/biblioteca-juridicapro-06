
import { useState, useCallback } from 'react';

interface UseSpeechSynthesisOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const speak = useCallback(async (text: string) => {
    if (isPlaying) return;

    setIsLoading(true);
    
    try {
      // Using Google Text-to-Speech API with the provided key
      const apiKey = 'AIzaSyCvleLmqSuB8nXbjYnR_HUMEJeWUv6ceRY';
      
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'pt-BR',
            name: 'pt-BR-Wavenet-A', // Using Wavenet voice as requested
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: options.rate || 1.0,
            pitch: options.pitch || 0.0,
            volumeGainDb: options.volume || 0.0
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro na síntese de voz');
      }

      const data = await response.json();
      
      // Convert base64 to audio and play
      const audioData = `data:audio/mp3;base64,${data.audioContent}`;
      const audio = new Audio(audioData);
      
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        console.error('Erro ao reproduzir áudio');
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Erro na síntese de voz:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, options]);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isLoading
  };
};
