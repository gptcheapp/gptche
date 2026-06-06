import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeech(onTranscript) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recogRef = useRef(null);
  const callbackRef = useRef(onTranscript);
  useEffect(() => { callbackRef.current = onTranscript; }, [onTranscript]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const r = new SR();
    r.lang = "pt-BR";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      callbackRef.current(e.results[0][0].transcript);
      setListening(false);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recogRef.current = r;
  }, []);

  const toggle = useCallback(() => {
    if (!recogRef.current) return;
    if (listening) {
      recogRef.current.stop();
      setListening(false);
    } else {
      recogRef.current.start();
      setListening(true);
    }
  }, [listening]);

  return { listening, supported, toggle };
}

export function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text.replace(/[🧉🌿]/g, ""));
  utt.lang = "pt-BR";
  utt.rate = 0.95;
  utt.pitch = 1.05;
  const trySpeak = () => {
    const ptBR = window.speechSynthesis.getVoices().find((v) => v.lang === "pt-BR");
    if (ptBR) utt.voice = ptBR;
    utt.onend = onEnd;
    utt.onerror = onEnd;
    window.speechSynthesis.speak(utt);
  };
  if (window.speechSynthesis.getVoices().length > 0) {
    trySpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = trySpeak;
  }
}