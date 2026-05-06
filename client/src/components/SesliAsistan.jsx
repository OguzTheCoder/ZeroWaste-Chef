import React, { useState, useEffect, useRef } from 'react';
import { voiceQuery } from '../api';

const SesliAsistan = ({ recipeId }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('Hazır');
  
  const recognitionRef = useRef(null);

  // Ses Tanıma Nesnesini Bir Kez Oluştur
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('Tarayıcı desteklenmiyor');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = true; // Daha iyi algılama için continuous yapalım
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('Dinliyor...');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        handleVoiceCommand(finalTranscript);
        // Otomatik durdur (isteğe bağlı)
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      console.error("Hata:", event.error);
      setStatus(`Hata: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('Hazır');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [recipeId]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        recognitionRef.current?.stop();
        setTimeout(() => recognitionRef.current?.start(), 100);
      }
    }
  };

  const handleVoiceCommand = async (text) => {
    try {
      setStatus("Cevap bekleniyor...");
      const data = await voiceQuery(text, recipeId);
      const reply = data.reply || "Anlayamadım.";
      setResponse(reply);
      speak(reply);
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      setResponse("Backend'e ulaşılamadı ama duyduğum: " + text);
      speak("Sunucuya bağlanılamadı.");
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="sesli-asistan-container">
      <div className={`voice-panel ${isListening ? 'active' : ''}`}>
        <button 
          onClick={toggleListening} 
          className={`mic-button ${isListening ? 'listening' : ''}`}
        >
          {isListening ? "🛑" : "🎤"}
        </button>
        
        <div className="voice-info">
          <p className="status-badge">{status}</p>
          <p className="transcript-text">{transcript || "Komut verin..."}</p>
          {response && <p className="response-text">Chef: {response}</p>}
        </div>
      </div>
    </div>
  );
};

export default SesliAsistan;
