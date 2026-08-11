import { useState, useEffect } from "react";
import { salvarPreferencia } from "../api/preferencias.js";

const GREEN = "#1B4D2E";
const GREEN_BG = "#E8F5EC";

const STORAGE_KEY = "gptche_pronome";

/**
 * Modal de onboarding guri/guria.
 * - Aparece só uma vez (checa localStorage) com um pequeno delay pra não parecer popup de anúncio.
 * - Salva local imediatamente (resposta instantânea) e sincroniza com Supabase em segundo plano
 *   (direto, sem passar pela API Express — mesmo padrão do histórico de chat).
 * - Pode ser reaberto manualmente passando `forceOpen` (ex: a partir de um botão em Configurações).
 */
export default function PreferenciaModal({ forceOpen = false, onEscolher }) {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (forceOpen) { setVisible(true); return; }
    const jaEscolheu = localStorage.getItem(STORAGE_KEY);
    if (!jaEscolheu) {
      const timer = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const escolher = async (pronome) => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, pronome);
    await salvarPreferencia("pronome", pronome);
    setSaving(false);
    setVisible(false);
    onEscolher?.(pronome);
  };

  if (!visible) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Como tu quer ser chamado">
      <div style={cardStyle}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🧉</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, color: GREEN, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Como tu quer ser chamado, tchê?
        </h3>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "#4A6655", lineHeight: 1.6 }}>
          O GPTchê se adapta pra falar contigo do teu jeito.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => escolher("guri")} disabled={saving} style={btnStyle}>Guri</button>
          <button onClick={() => escolher("guria")} disabled={saving} style={btnStyle}>Guria</button>
          <button onClick={() => escolher("neutro")} disabled={saving} style={btnOutlineStyle}>Tanto faz</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(27,77,46,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 20, backdropFilter: "blur(2px)",
};

const cardStyle = {
  background: "white", borderRadius: 20, padding: "30px 28px",
  maxWidth: 340, width: "100%", textAlign: "center",
  boxShadow: "0 16px 44px rgba(27,77,46,0.28)",
  fontFamily: "'Inter', system-ui, sans-serif",
};

const btnStyle = {
  background: GREEN, color: GREEN_BG, border: "none", borderRadius: 24,
  padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer",
  fontFamily: "inherit",
};

const btnOutlineStyle = {
  background: "transparent", color: GREEN, border: `1.5px solid ${GREEN}`,
  borderRadius: 24, padding: "10px 22px", fontSize: 14, fontWeight: 500,
  cursor: "pointer", fontFamily: "inherit",
};
