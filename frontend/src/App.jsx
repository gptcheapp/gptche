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

// TWA (app instalado via Play Store) e qualquer PWA instalado abrem em
// display-mode "standalone" — navegador comum nunca abre assim.
const ehAppInstalado = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(display-mode: standalone)").matches;

export default function App() {
  const [showLanding, setShowLanding] = useState(
    () => !ehAppInstalado() && !localStorage.getItem("gptche_visited")
  );
  const [showOnboarding, setShowOnboarding] = useState(
    () => ehAppInstalado() && !localStorage.getItem("gptche_onboarding_visto")
  );
  const [aba, setAba] = useState("chat");
  const [chatInput, setChatInput] = useState("");

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
      <PreferenciaModal />
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

      <nav className="tab-nav-bottom">
        {TABS.map(({ id, icon, label }) => (
          <button
            key={id}
            className={`tab-btn-bottom ${aba === id ? "active" : ""}`}
            onClick={() => setAba(id)}
          >
            <span className="tab-icon">{icon}</span>
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
