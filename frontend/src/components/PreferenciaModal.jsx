import { useState, useEffect } from "react";
import { salvarPreferencia } from "../api/preferencias.js";

const STORAGE_KEY = "gptche_pronome";

const OPCOES = [
  { id: "guri", label: "Guri", frase: "Bah, guri, senta que a prosa é longa." },
  { id: "guria", label: "Guria", frase: "Bah, guria, senta que a prosa é longa." },
  { id: "neutro", label: "Tanto faz", frase: "Bah, xirú, senta que a prosa é longa." },
];

/**
 * Modal de preferência guri/guria/neutro.
 * - Aparece só uma vez (checa localStorage) com um pequeno delay pra não parecer popup de anúncio.
 * - Pode ser reaberto manualmente via `forceOpen` (botão de preferências no header).
 * - Salva local imediatamente e sincroniza com Supabase em segundo plano.
 */
export default function PreferenciaModal({ forceOpen = false, onEscolher }) {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const primeiraVez = !localStorage.getItem(STORAGE_KEY);

  useEffect(() => {
    if (forceOpen) {
      setSelecionado(localStorage.getItem(STORAGE_KEY) || null);
      setVisible(true);
      return;
    }
    if (primeiraVez) {
      const timer = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const confirmar = async () => {
    if (!selecionado) return;
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, selecionado);
    await salvarPreferencia("pronome", selecionado);
    setSaving(false);
    setVisible(false);
    onEscolher?.(selecionado);
  };

  if (!visible) return null;

  return (
    <div className="pref-overlay" role="dialog" aria-modal="true" aria-label="Como tu quer ser chamado">
      <div className="pref-card">
        <div className="pref-icone">🧉</div>
        <h3 className="pref-titulo">Como tu quer ser chamado, tchê?</h3>
        <p className="pref-sub">Assim eu acerto o trato desde a primeira prosa. Dá pra mudar quando tu quiser.</p>

        <div className="pref-opcoes">
          {OPCOES.map((op) => (
            <button
              key={op.id}
              className={`pref-opcao ${selecionado === op.id ? "selecionada" : ""}`}
              onClick={() => setSelecionado(op.id)}
            >
              <div>
                <div className="pref-opcao-label">{op.label}</div>
                <div className="pref-opcao-frase">"{op.frase}"</div>
              </div>
              <span className="pref-opcao-radio" />
            </button>
          ))}
        </div>

        <button className="pref-confirmar" onClick={confirmar} disabled={!selecionado || saving}>
          {primeiraVez ? "Bora prosear" : "Pronto, tchê"}
        </button>

        {primeiraVez && (
          <button className="pref-depois" onClick={() => setVisible(false)}>
            Depois eu escolho
          </button>
        )}
      </div>
    </div>
  );
}
