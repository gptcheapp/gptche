import { useState } from "react";
import ChatTab from "./components/ChatTab.jsx";
import TurismoTab from "./components/TurismoTab.jsx";
import GlossarioTab from "./components/GlossarioTab.jsx";

const TABS = [
  { id: "chat", icon: "🧉", label: "Chat" },
  { id: "turismo", icon: "🗺️", label: "Turismo RS" },
  { id: "glossario", icon: "📖", label: "Glossário" },
];

export default function App() {
  const [aba, setAba] = useState("chat");
  const [chatInput, setChatInput] = useState("");

  const handlePerguntar = (texto) => {
    setChatInput(texto);
    setAba("chat");
  };

  const handleInputConsumed = () => setChatInput("");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-avatar">🧉</div>
        <div className="header-info">
          <div className="header-title">GPTchê</div>
          <div className="header-subtitle">Teu parceiro gaúcho de plantão</div>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          <span>Online</span>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`tab-btn ${aba === id ? "active" : ""}`}
            onClick={() => setAba(id)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {aba === "chat" && (
          <ChatTab
            initialInput={chatInput}
            onInputConsumed={handleInputConsumed}
          />
        )}
        {aba === "turismo" && <TurismoTab onPerguntar={handlePerguntar} />}
        {aba === "glossario" && <GlossarioTab />}
      </main>
    </div>
  );
}
