import { useState, useEffect, useMemo } from "react";
import { fetchGlossario } from "../api/index.js";
import { salvarBuscaGlossario, buscarHistoricoGlossario } from "../api/historico.js";
import termosData from "../data/glossarioTermos.json";

const TERMOS = termosData.termos;
const SUGESTOES = ["bah", "chimarrão", "tchê", "guri", "barbaridade", "xis", "bagual", "querência", "minuano", "oigalê"];

const PALAVRA_DO_DIA_POOL = TERMOS.map((t) => t.termo);
const palavraDoDia = PALAVRA_DO_DIA_POOL[new Date().getDate() % PALAVRA_DO_DIA_POOL.length];
const palavraDoDiaMeta = TERMOS.find((t) => t.termo === palavraDoDia);

// Categorias na ordem de aparição em TERMOS, com "Tudo" na frente.
const CATS_GLOSS = [
  { id: "todas", label: "Tudo" },
  ...[...new Set(TERMOS.map((t) => t.categoria))].map((c) => ({ id: c, label: c })),
];

const NIVEL_CORES = {
  Cotidiano:         { cls: "nivel-cotidiano" },
  Regional:          { cls: "nivel-regional" },
  "CTG/Tradicional": { cls: "nivel-ctg" },
};

export default function GlossarioTab() {
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [catGloss, setCatGloss] = useState("todas");

  useEffect(() => {
    buscarHistoricoGlossario().then((dados) => {
      const termos = dados.map((d) => d.termo);
      setHistorico(termos);
    });
  }, []);

  const termosFiltrados = useMemo(() => {
    if (catGloss === "todas") return TERMOS;
    return TERMOS.filter((t) => t.categoria === catGloss);
  }, [catGloss]);

  const buscarTermo = async (termo) => {
    const t = (termo || busca).trim();
    if (!t || loading) return;
    setBusca(t);
    setLoading(true);
    setResultado(null);
    try {
      const data = await fetchGlossario(t);
      setResultado(data);
      if (data.encontrado) {
        salvarBuscaGlossario(t, data);
        if (!historico.includes(t.toLowerCase())) {
          setHistorico((prev) => [t, ...prev].slice(0, 8));
        }
      }
    } catch {
      setResultado({ encontrado: false, erro: true });
    }
    setLoading(false);
  };

  const voltarLista = () => {
    setResultado(null);
    setBusca("");
  };

  const nivelCls = resultado?.encontrado
    ? (NIVEL_CORES[resultado.nivel] || NIVEL_CORES["Cotidiano"]).cls
    : "";

  return (
    <div className="glossario-tab">
      <div className="tela-header">
        <h1 className="tela-titulo">Glossário</h1>
        <p className="tela-subtitulo">O dicionário do gauchês, explicado com estilo campeiro.</p>
      </div>

      <div className="glossario-search-area">
        <div className="search-row">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarTermo()}
            placeholder="Busca uma palavra gaúcha..."
            className="search-input"
          />
          <button
            className="search-btn"
            onClick={() => buscarTermo()}
            disabled={!busca.trim() || loading}
          >
            {loading ? "..." : "Buscar"}
          </button>
        </div>
        <div className="chips-row">
          <span className="chips-label">Sugestões:</span>
          {SUGESTOES.map((s) => (
            <button key={s} className="chip" onClick={() => buscarTermo(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="glossario-result">
        {!resultado && !loading && (
          <>
            <div className="glossario-empty">
              <div className="empty-icon">🧉</div>
              <h3>Dicionário do Gauchês</h3>
              <p>Digita uma palavra ou expressão gaúcha e o GPTchê explica com todo o estilo campeiro!</p>

              <button className="palavra-dia-card" onClick={() => buscarTermo(palavraDoDia)}>
                <span className="palavra-dia-label">✨ Palavra do dia</span>
                <span className="palavra-dia-termo">{palavraDoDia}</span>
                {palavraDoDiaMeta?.significado_curto && (
                  <span className="palavra-dia-gloss">{palavraDoDiaMeta.significado_curto}</span>
                )}
                <span className="palavra-dia-cta">Toca pra ver o verbete →</span>
              </button>

              {historico.length > 0 && (
                <div className="historico">
                  <span className="chips-label">Buscados recentemente:</span>
                  <div className="chips-row center">
                    {historico.map((h) => (
                      <button key={h} className="chip" onClick={() => buscarTermo(h)}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="galpao-section">
              <div className="galpao-header">
                <span className="galpao-titulo">Todo o galpão</span>
                <span className="galpao-contagem">{termosFiltrados.length} palavras</span>
              </div>
              <div className="chips-row cats-row">
                {CATS_GLOSS.map((c) => (
                  <button
                    key={c.id}
                    className={`chip-cat ${catGloss === c.id ? "active" : ""}`}
                    onClick={() => setCatGloss(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="galpao-lista">
                {termosFiltrados.map((t) => (
                  <button key={t.termo} className="galpao-item" onClick={() => buscarTermo(t.termo)}>
                    <div className="galpao-item-top">
                      <span className="galpao-item-termo">{t.termo}</span>
                      <span className={`nivel-badge ${(NIVEL_CORES[t.nivel] || NIVEL_CORES.Cotidiano).cls}`}>
                        {t.nivel}
                      </span>
                    </div>
                    <p className="galpao-item-desc">{t.significado_curto}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="loading-state">
            <p>O GPTchê tá campando a palavra nos pampas...</p>
            <div className="dots">
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ animationDelay: `${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {resultado && !loading && !resultado.encontrado && (
          <div className="not-found">
            <div className="empty-icon">🤔</div>
            <h3>Bah, essa não tá no meu galpão, tchê!</h3>
            <p>
              {resultado.sugestao ? (
                <>
                  Mas quem sabe tu quis dizer{" "}
                  <button className="link-btn" onClick={() => buscarTermo(resultado.sugestao)}>
                    {resultado.sugestao}
                  </button>
                  ?
                </>
              ) : (
                "Tenta outra palavra gaúcha!"
              )}
            </p>
            <button className="btn-voltar" onClick={voltarLista}>← Voltar pro galpão</button>
          </div>
        )}

        {resultado?.encontrado && !loading && (
          <div className={`verbete ${nivelCls}`}>
            <button className="btn-voltar" onClick={voltarLista}>← Voltar pro galpão</button>
            <div className="verbete-header">
              <div>
                <div className="verbete-termo">{resultado.termo}</div>
                <div className="verbete-categoria">{resultado.categoria}</div>
              </div>
              <span className={`nivel-badge ${nivelCls}`}>{resultado.nivel}</span>
            </div>
            <p className="verbete-significado">{resultado.significado}</p>
            <div className="verbete-bloco exemplo">
              <div className="bloco-label">Exemplo de uso</div>
              <p>"{resultado.exemplo}"</p>
            </div>
            <div className="verbete-bloco curiosidade">
              <div className="bloco-label">Curiosidade cultural</div>
              <p>{resultado.curiosidade}</p>
            </div>
            <div className="verbete-bloco gptche-diz">
              <span>🧉</span>
              <p>{resultado.gptche_diz}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
