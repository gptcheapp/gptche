import { useState } from "react";
import { fetchTurismo } from "../api/index.js";
import { salvarRegiaoVisitada } from "../api/historico.js";

const REGIOES = [
  { id: "serra", nome: "Serra Gaúcha", icone: "🍷", desc: "Vinhos, flores e café colonial" },
  { id: "aparados", nome: "Aparados da Serra", icone: "🏔️", desc: "Cânions e natureza selvagem" },
  { id: "missoes", nome: "Missões Jesuíticas", icone: "🏛️", desc: "Patrimônio da Humanidade" },
  { id: "pampa", nome: "Pampa e Fronteira", icone: "🐄", desc: "Estâncias, vinhos e tradição" },
  { id: "litoral", nome: "Litoral Gaúcho", icone: "🌊", desc: "Praias, dunas e falésias" },
  { id: "poa", nome: "Porto Alegre", icone: "🌅", desc: "O pôr do sol no Guaíba" },
  { id: "central", nome: "Região Central", icone: "🦕", desc: "Dinossauros e história" },
  { id: "caminho", nome: "Caminhos de Pedra", icone: "🏡", desc: "Arquitetura e imigração italiana" },
];

export default function TurismoTab({ onPerguntar }) {
  const [regiaoSel, setRegiaoSel] = useState(null);
  const [guia, setGuia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarGuia = async (regiao) => {
    setRegiaoSel(regiao);
    setGuia(null);
    setErro(null);
    setLoading(true);
    try {
      const data = await fetchTurismo(regiao.nome);
      setGuia(data);
      salvarRegiaoVisitada(regiao.id, regiao.nome);
    } catch (err) {
      setErro(err.message || "Bah, deu um entrevero. Tenta de novo!");
    }
    setLoading(false);
  };

  const voltar = () => {
    setRegiaoSel(null);
    setGuia(null);
    setErro(null);
  };

  return (
    <div className="turismo-tab">
      {!regiaoSel && (
        <>
          <p className="turismo-intro">
            Escolhe uma região do RS, tchê, e o GPTchê te conta tudo! 🧉
          </p>
          <div className="regioes-grid">
            {REGIOES.map((r) => (
              <button key={r.id} className="regiao-card" onClick={() => buscarGuia(r)}>
                <span className="regiao-icone">{r.icone}</span>
                <span className="regiao-nome">{r.nome}</span>
                <span className="regiao-desc">{r.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {regiaoSel && loading && (
        <div className="loading-state">
          <div className="loading-icone">{regiaoSel.icone}</div>
          <p>O GPTchê tá preparando o guia da {regiaoSel.nome}...</p>
          <div className="dots">
            {[0, 1, 2].map((d) => (
              <span key={d} style={{ animationDelay: `${d * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {regiaoSel && erro && !loading && (
        <div className="erro-state">
          <p>😬 {erro}</p>
          <button className="btn-voltar" onClick={voltar}>Voltar</button>
        </div>
      )}

      {regiaoSel && guia && !loading && (
        <div className="guia">
          <div className="guia-header">
            <button className="btn-voltar" onClick={voltar}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Voltar
            </button>
            <span>{regiaoSel.icone}</span>
            <span className="guia-titulo">{regiaoSel.nome}</span>
          </div>

          <div className="guia-saudacao">
            <span>🧉</span>
            <p>{guia.saudacao}</p>
          </div>

          <section className="guia-section">
            <h3 className="section-label">Pontos turísticos</h3>
            <div className="pontos-list">
              {guia.pontos?.map((p, i) => (
                <div key={i} className="ponto-card">
                  <span className="ponto-icone">{p.icone}</span>
                  <div>
                    <div className="ponto-nome">{p.nome}</div>
                    <div className="ponto-desc">{p.descricao}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="guia-section">
            <h3 className="section-label">Gastronomia local</h3>
            <div className="gastro-grid">
              {guia.gastronomia?.map((g, i) => (
                <div key={i} className="gastro-card">
                  <div className="gastro-icone">{g.icone}</div>
                  <div className="gastro-prato">{g.prato}</div>
                  <div className="gastro-dica">{g.dica}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="info-card neutral">
            <div className="info-label">🗓️ Melhor época para visitar</div>
            <p>{guia.melhor_epoca}</p>
          </div>

          <div className="info-card destaque">
            <div className="info-label">⭐ Dica de gaúcho pra gaúcho</div>
            <p>{guia.dica_gaucha}</p>
          </div>

          <button
            className="btn-perguntar"
            onClick={() => onPerguntar(`Me conta mais sobre o turismo na região: ${regiaoSel.nome}`)}
          >
            <span>🧉</span> Perguntar mais sobre {regiaoSel.nome}
          </button>
        </div>
      )}
    </div>
  );
}
