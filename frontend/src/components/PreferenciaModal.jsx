import { useState, useEffect } from "react";
import { salvarPreferencia } from "../api/preferencias.js";

const STORAGE_KEY = "gptche_pronome";
const STORAGE_KEY_VOZ = "gptche_voz";

const OPCOES = [
  { id: "guri", label: "Guri", frase: "Bah, guri, senta que a prosa é longa." },
  { id: "guria", label: "Guria", frase: "Bah, guria, senta que a prosa é longa." },
  { id: "neutro", label: "Tanto faz", frase: "Bah, xirú, senta que a prosa é longa." },
];

const OPCOES_VOZ = [
  { id: "masculina", label: "Masculina" },
  { id: "feminina", label: "Feminina" },
];

/**
 * Modal de preferência guri/guria/neutro + escolha de voz do Ouvir.
 * - Aparece só uma vez (checa localStorage) com um pequeno delay pra não parecer popup de anúncio.
 * - Pode ser reaberto manualmente via `forceOpen` (botão de preferências no header).
 * - Salva local imediatamente e sincroniza com Supabase em segundo plano.
 */
export default function PreferenciaModal({ forceOpen = false, onEscolher }) {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const [vozSelecionada, setVozSelecionada] = useState("masculina");
  const primeiraVez = !localStorage.getItem(STORAGE_KEY);

  useEffect(() => {
    if (forceOpen) {
      setSelecionado(localStorage.getItem(STORAGE_KEY) || null);
      setVozSelecionada(localStorage.getItem(STORAGE_KEY_VOZ) || "masculina");
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
    localStorage.setItem(STORAGE_KEY_VOZ, vozSelecionada);
    await Promise.all([
      salvarPreferencia("pronome", selecionado),
      salvarPreferencia("voz", vozSelecionada),
    ]);
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

        <p className="pref-sub pref-sub-voz">E qual voz tu prefere ouvir nas respostas?</p>
        <div className="pref-voz-opcoes">
          {OPCOES_VOZ.map((v) => (
            <button
              key={v.id}
              className={`pref-voz-opcao ${vozSelecionada === v.id ? "selecionada" : ""}`}
              onClick={() => setVozSelecionada(v.id)}
            >
              {v.label}
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
