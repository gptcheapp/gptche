import { useState } from "react";
import ChatTab from "./components/ChatTab.jsx";
import TurismoTab from "./components/TurismoTab.jsx";
import GlossarioTab from "./components/GlossarioTab.jsx";
import LandingPage from "./components/LandingPage.jsx";
import OnboardingScreen from "./components/OnboardingScreen.jsx";
import PreferenciaModal from "./components/PreferenciaModal.jsx";

const TABS = [
  { id: "chat", icon: "🧉", label: "Chat" },
  { id: "turismo", icon: "🗺️", label: "Turismo" },
  { id: "glossario", icon: "📖", label: "Glossário" },
];

const ehAppInstalado = () => {
  if (typeof window === "undefined") return false;
  // Atalho pra testar localmente sem precisar instalar de verdade:
  // http://localhost:5173/?standalone=1
  if (new URLSearchParams(window.location.search).get("standalone") === "1") return true;
  return window.matchMedia?.("(display-mode: standalone)").matches;
};

export default function App() {
  const [showLanding, setShowLanding] = useState(
    () => !ehAppInstalado() && !localStorage.getItem("gptche_visited")
  );
  const [showOnboarding, setShowOnboarding] = useState(
    () => ehAppInstalado() && !localStorage.getItem("gptche_onboarding_visto")
  );
  const [aba, setAba] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [prefsAberta, setPrefsAberta] = useState(false);

  if (showLanding) {
    return (
      <LandingPage
        onEntrar={() => {
          localStorage.setItem("gptche_visited", "1");
          setShowLanding(false);
        }}
      />
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onEntrar={() => {
          localStorage.setItem("gptche_onboarding_visto", "1");
          setShowOnboarding(false);
        }}
      />
    );
  }

  const handlePerguntar = (texto) => {
    setChatInput(texto);
    setAba("chat");
  };

  const handleInputConsumed = () => setChatInput("");

  return (
    <div className="app-shell">
      <PreferenciaModal forceOpen={prefsAberta} onEscolher={() => setPrefsAberta(false)} />
      <header className="app-header">
        <div className="gp-avatar">
          <img src="/icons/icon-192.png" alt="" />
          <div className="gp-avatar__gloss" />
          <div className="gp-avatar__brilho" />
          <div className="gp-avatar__rim" />
          <div className="gp-avatar__online" />
        </div>
        <div className="header-info">
          <div className="header-title">GPTchê</div>
          <div className="header-subtitle">Teu parceiro gaúcho de plantão</div>
        </div>
        <button
          className="gp-btn-vidro"
          onClick={() => setPrefsAberta(true)}
          aria-label="Preferências"
        >
          <div className="gp-btn-vidro__sheen" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
            <line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
            <line x1="4" y1="18" x2="20" y2="18" /><circle cx="11" cy="18" r="2" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </header>

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

      <nav className="gp-tabbar">
        {TABS.map(({ id, icon, label }) => (
          <button
            key={id}
            className="gp-tab"
            aria-selected={aba === id}
            onClick={() => setAba(id)}
          >
            <span className="gp-tab__sheen" />
            <span className="gp-tab__icone">{icon}</span>
            <span className="gp-tab__label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
