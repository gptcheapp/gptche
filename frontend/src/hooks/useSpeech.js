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

// Referência ao áudio atual, pra poder pausar e retomar (não só parar)
let currentAudio = null;
let currentTexto = null;

export async function speak(text, onEnd) {
  const textoLimpo = text.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").trim();
  if (!textoLimpo) {
    onEnd?.();
    return;
  }

  // Mesmo texto de antes, ainda pausado (não chegou ao fim): retoma do
  // ponto onde parou, sem buscar áudio novo.
  if (currentAudio && currentTexto === textoLimpo && !currentAudio.ended) {
    currentAudio.onended = () => {
      currentAudio = null;
      currentTexto = null;
      onEnd?.();
    };
    currentAudio.play();
    return;
  }

  // Texto diferente do que estava tocando: descarta o anterior e busca um novo.
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    currentTexto = null;
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
    currentTexto = textoLimpo;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      currentTexto = null;
      onEnd?.();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      currentTexto = null;
      onEnd?.();
    };

    audio.play();
  } catch (err) {
    console.error("[ElevenLabs] Erro ao buscar áudio:", err);
    onEnd?.();
  }
}

// Só pausa — mantém o áudio guardado pra dar pra retomar depois (não zera
// currentAudio/currentTexto, diferente de antes).
export function stopSpeaking() {
  currentAudio?.pause();
}
