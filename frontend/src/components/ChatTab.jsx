import { useState, useRef, useEffect } from "react";
import { sendChat } from "../api/index.js";
import { salvarMensagem, buscarHistoricoChat } from "../api/historico.js";
import { useSpeech, speak } from "../hooks/useSpeech.js";

const initialMessage = {
  role: "assistant",
  content:
    "Buenas, tchê! Sou o GPTchê, teu parceiro gaúcho pra todas as horas! 🧉\n\nPode me perguntar o que quiser — desde dúvidas do dia a dia até dicas de turismo aqui no nosso querido Rio Grande do Sul. Tô aqui feito chimarrão quente: sempre pronto!\n\nO que tu precisas, xirú?",
};

const SUGGESTIONS = [
  "Boa tarde!",
  "O que fazer na Serra Gaúcha?",
  "Me conta sobre o chimarrão",
  "Dicas de gastronomia gaúcha",
];

export default function ChatTab({ initialInput, onInputConsumed }) {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(null);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    buscarHistoricoChat().then((historico) => {
      if (historico && historico.length > 0) {
        setMessages([initialMessage, ...historico]);
      }
      setCarregandoHistorico(false);
    });
  }, []);

  useEffect(() => {
    if (initialInput) {
      setInput(initialInput);
      inputRef.current?.focus();
      onInputConsumed?.();
    }
  }, [initialInput]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const { listening, supported, toggle } = useSpeech((transcript) => {
    setInput((prev) => (prev ? prev + " " + transcript : transcript));
    inputRef.current?.focus();
  });

  const handleSpeak = (text, idx) => {
    if (speaking === idx) {
      window.speechSynthesis?.cancel();
      setSpeaking(null);
      return;
    }
    setSpeaking(idx);
    speak(text, () => setSpeaking(null));
  };

  const sendMessage = async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput("");
    const userMsg = { role: "user", content: t };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    salvarMensagem("user", t);
    try {
      const reply = await sendChat(
        newMessages.map((m) => ({ role: m.role, content: m.content }))
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      salvarMensagem("assistant", reply);
    } catch (err) {
      const erroMsg = `Barbaridade! ${err.message || "Deu um problema na conexão. Tenta de novo!"}`;
      setMessages((prev) => [...prev, { role: "assistant", content: erroMsg }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-tab">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.role}`}>
            {m.role === "assistant" && <div className="avatar">🧉</div>}
            <div className={`message-bubble-wrap ${m.role}`}>
              <div className={`message-bubble ${m.role}`}>{m.content}</div>
              {m.role === "assistant" && (
                <button
                  className={`speak-btn ${speaking === i ? "active" : ""}`}
                  onClick={() => handleSpeak(m.content, i)}
                >
                  {speaking === i ? (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="4" y="4" width="6" height="16" />
                        <rect x="14" y="4" width="6" height="16" />
                      </svg>
                      Parar
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Ouvir
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-row assistant">
            <div className="avatar">🧉</div>
            <div className="typing-indicator">
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ animationDelay: `${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && !carregandoHistorico && (
        <div className="suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        {supported && (
          <button
            className={`mic-btn ${listening ? "listening" : ""}`}
            onClick={toggle}
            title={listening ? "Parar" : "Falar"}
          >
            {listening ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="6" height="16" rx="1" />
                <rect x="14" y="4" width="6" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            )}
          </button>
        )}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={listening ? "Te escutando, tchê..." : "Manda a mensagem, tchê..."}
          rows={1}
          className={`chat-input ${listening ? "listening" : ""}`}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
        />
        <button
          className="send-btn"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
