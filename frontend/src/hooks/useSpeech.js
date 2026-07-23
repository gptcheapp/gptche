import { useState, useRef, useEffect, useCallback } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

// Referência ao áudio atual para poder parar
let currentAudio = null;

export async function speak(text, onEnd) {
  // Para qualquer áudio em andamento
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Remove emojis antes de enviar
  const textoLimpo = text.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").trim();
  if (!textoLimpo) {
    onEnd?.();
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/voice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textoLimpo }),
    });

    if (!res.ok) {
      console.error("[ElevenLabs] Resposta inválida:", res.status);
      onEnd?.();
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      onEnd?.();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      onEnd?.();
    };

    audio.play();
  } catch (err) {
    console.error("[ElevenLabs] Erro ao buscar áudio:", err);
    onEnd?.();
  }
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
