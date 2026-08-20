import { useState, useMemo } from "react";
import { fetchTurismo, fetchGuia } from "../api/index.js";
import { salvarRegiaoVisitada } from "../api/historico.js";

const REGIOES = [
  { id: "serra", nome: "Serra Gaúcha", icone: "🍷", desc: "Vinhos, flores e café colonial" },
  { id: "aparados", nome: "Aparados da Serra", icone: "🏔️", desc: "Cânions e natureza selvagem" },
  { id: "missoes", nome: "Missões Jesuíticas", icone: "🏛️", desc: "Patrimônio da Humanidade" },
  { id: "pampa", nome: "Pampa e Fronteira", icone: "🐄", desc: "Estâncias, vinhos e tradição" },
  { id: "litoral", nome: "Litoral Gaúcho", icone: "🌊", desc: "Praias, dunas e falésias" },
  { id: "litoralnorte", nome: "Litoral Norte", icone: "🐟", desc: "Festa do Peixe e praias do RS" },
  { id: "poa", nome: "Porto Alegre", icone: "🌅", desc: "O pôr do sol no Guaíba" },
  { id: "central", nome: "Região Central", icone: "🦕", desc: "Dinossauros e história" },
  { id: "sinos", nome: "Vale do Sinos", icone: "🏘️", desc: "Imigração alemã e tradição" },
];

// Cidades verificadas (bate com CIDADES_VALIDAS do backend/routes/guia.js).
// "Praia Grande" removida — pertence a SC, não RS.
const CIDADES = [
  { nome: "Gramado", regiao: "Serra Gaúcha", destaque: true },
  { nome: "Canela", regiao: "Serra Gaúcha", destaque: true },
  { nome: "Bento Gonçalves", regiao: "Serra Gaúcha", destaque: true },
  { nome: "Nova Petrópolis", regiao: "Serra Gaúcha" },
  { nome: "Caxias do Sul", regiao: "Serra Gaúcha" },
  { nome: "Garibaldi", regiao: "Serra Gaúcha" },
  { nome: "Carlos Barbosa", regiao: "Serra Gaúcha" },
  { nome: "Flores da Cunha", regiao: "Serra Gaúcha" },
  { nome: "Cambará do Sul", regiao: "Aparados da Serra", destaque: true },
  { nome: "São Francisco de Paula", regiao: "Aparados da Serra" },
  { nome: "Bom Jesus", regiao: "Aparados da Serra" },
  { nome: "São José dos Ausentes", regiao: "Aparados da Serra" },
  { nome: "São Miguel das Missões", regiao: "Missões Jesuíticas", destaque: true },
  { nome: "Santo Ângelo", regiao: "Missões Jesuíticas" },
  { nome: "São Luiz Gonzaga", regiao: "Missões Jesuíticas" },
  { nome: "São Borja", regiao: "Missões Jesuíticas" },
  { nome: "Santiago", regiao: "Missões Jesuíticas" },
  { nome: "Jaguari", regiao: "Missões Jesuíticas" },
  { nome: "Nova Esperança do Sul", regiao: "Missões Jesuíticas", destaque: true },
  { nome: "Bagé", regiao: "Pampa e Fronteira", destaque: true },
  { nome: "Caçapava do Sul", regiao: "Pampa e Fronteira", destaque: true },
  { nome: "Santana do Livramento", regiao: "Pampa e Fronteira" },
  { nome: "Uruguaiana", regiao: "Pampa e Fronteira" },
  { nome: "Dom Pedrito", regiao: "Pampa e Fronteira" },
  { nome: "Alegrete", regiao: "Pampa e Fronteira" },
  { nome: "Quaraí", regiao: "Pampa e Fronteira" },
  { nome: "São Gabriel", regiao: "Pampa e Fronteira" },
  { nome: "Torres", regiao: "Litoral Norte", destaque: true },
  { nome: "Capão da Canoa", regiao: "Litoral Norte" },
  { nome: "Xangri-Lá", regiao: "Litoral Norte" },
  { nome: "Imbé", regiao: "Litoral Norte" },
  { nome: "Tramandaí", regiao: "Litoral Norte" },
  { nome: "Cidreira", regiao: "Litoral Norte" },
  { nome: "Osório", regiao: "Litoral Norte" },
  { nome: "Mostardas", regiao: "Litoral Gaúcho", destaque: true },
  { nome: "Tavares", regiao: "Litoral Gaúcho", destaque: true },
  { nome: "Rio Grande", regiao: "Litoral Gaúcho", destaque: true },
  { nome: "Pelotas", regiao: "Litoral Gaúcho", destaque: true },
  { nome: "São Lourenço do Sul", regiao: "Litoral Gaúcho" },
  { nome: "Palmares do Sul", regiao: "Litoral Gaúcho" },
  { nome: "Porto Alegre", regiao: "Porto Alegre", destaque: true },
  { nome: "Viamão", regiao: "Porto Alegre", destaque: true },
  { nome: "São Leopoldo", regiao: "Vale do Sinos" },
  { nome: "Novo Hamburgo", regiao: "Vale do Sinos" },
  { nome: "Canoas", regiao: "Porto Alegre" },
  { nome: "Gravataí", regiao: "Porto Alegre" },
  { nome: "Cachoeirinha", regiao: "Porto Alegre" },
  { nome: "Santa Maria", regiao: "Região Central", destaque: true },
  { nome: "Mata", regiao: "Região Central", destaque: true },
  { nome: "Cachoeira do Sul", regiao: "Região Central" },
  { nome: "São João do Polêsine", regiao: "Região Central", destaque: true },
  { nome: "Silveira Martins", regiao: "Região Central" },
  { nome: "Nova Palma", regiao: "Região Central" },
  { nome: "Restinga Sêca", regiao: "Região Central" },
  { nome: "Agudo", regiao: "Região Central" },
  { nome: "Dona Francisca", regiao: "Região Central" },
  { nome: "Faxinal do Soturno", regiao: "Região Central" },
  { nome: "Ivorá", regiao: "Região Central" },
  { nome: "Pinhal Grande", regiao: "Região Central" },
];

const TIPO_COR = {
  natureza: { bg: "#E8F5EC", text: "#1B4D2E" },
  cultura: { bg: "#E3F2FD", text: "#1565C0" },
  historia: { bg: "#FFF8E1", text: "#7B5800" },
  gastronomia: { bg: "#FBE9E7", text: "#BF360C" },
  aventura: { bg: "#F3E5F5", text: "#6A1B9A" },
};

export default function TurismoTab({ onPerguntar }) {
  const [modo, setModo] = useState("regiao"); // "regiao" | "cidade"

  // ── estado modo Região ──
  const [regiaoSel, setRegiaoSel] = useState(null);
  const [guiaRegiao, setGuiaRegiao] = useState(null);

  // ── estado modo Cidade ──
  const [busca, setBusca] = useState("");
  const [cidadeSel, setCidadeSel] = useState(null);
  const [guiaCidade, setGuiaCidade] = useState(null);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const cidadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return CIDADES.filter((c) => c.destaque);
    return CIDADES.filter((c) => c.nome.toLowerCase().includes(termo)).slice(0, 12);
  }, [busca]);

  const buscarGuiaRegiao = async (regiao) => {
    setRegiaoSel(regiao);
    setGuiaRegiao(null);
    setErro(null);
    setLoading(true);
    try {
      const data = await fetchTurismo(regiao.nome);
      setGuiaRegiao(data);
      salvarRegiaoVisitada(regiao.id, regiao.nome);
    } catch (err) {
      setErro(err.message || "Bah, deu um entrevero. Tenta de novo!");
    }
    setLoading(false);
  };

  const buscarGuiaCidade = async (cidade) => {
    setCidadeSel(cidade);
    setGuiaCidade(null);
    setErro(null);
    setLoading(true);
    try {
      const data = await fetchGuia(cidade.nome, cidade.regiao);
      setGuiaCidade(data);
    } catch (err) {
      setErro(err.message || "Bah, deu um entrevero. Tenta de novo!");
    }
    setLoading(false);
  };

  const voltar = () => {
    setRegiaoSel(null);
    setGuiaRegiao(null);
    setCidadeSel(null);
    setGuiaCidade(null);
    setErro(null);
  };

  const trocarModo = (novoModo) => {
    voltar();
    setBusca("");
    setModo(novoModo);
  };

  const selecionado = modo === "regiao" ? regiaoSel : cidadeSel;
  const guia = modo === "regiao" ? guiaRegiao : guiaCidade;
  const nomeSelecionado = modo === "regiao" ? regiaoSel?.nome : cidadeSel?.nome;
  const iconeSelecionado = modo === "regiao" ? regiaoSel?.icone : "📍";

  return (
    <div className="turismo-tab">
      <div className="turismo-toggle">
        <button
          className={`toggle-btn ${modo === "regiao" ? "active" : ""}`}
          onClick={() => trocarModo("regiao")}
        >
          Por Região
        </button>
        <button
          className={`toggle-btn ${modo === "cidade" ? "active" : ""}`}
          onClick={() => trocarModo("cidade")}
        >
          Por Cidade
        </button>
      </div>

      {/* ── LISTA: Região ── */}
      {modo === "regiao" && !selecionado && (
        <>
          <p className="turismo-intro">
            Escolhe uma região do RS, tchê, e o GPTchê te conta tudo! 🧉
          </p>
          <div className="regioes-grid">
            {REGIOES.map((r) => (
              <button key={r.id} className="regiao-card" onClick={() => buscarGuiaRegiao(r)}>
                <span className="regiao-icone">{r.icone}</span>
                <span className="regiao-nome">{r.nome}</span>
                <span className="regiao-desc">{r.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── LISTA: Cidade (busca + destaques) ── */}
      {modo === "cidade" && !selecionado && (
        <>
          <input
            className="cidade-busca"
            type="text"
            placeholder="Busca uma cidade do RS..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {!busca.trim() && <p className="turismo-intro">Cidades em destaque 🧉</p>}
          <div className="cidades-lista">
            {cidadesFiltradas.map((c) => (
              <button key={c.nome} className="cidade-item" onClick={() => buscarGuiaCidade(c)}>
                <span className="cidade-nome">{c.nome}</span>
                <span className="cidade-regiao">{c.regiao}</span>
              </button>
            ))}
            {busca.trim() && cidadesFiltradas.length === 0 && (
              <p className="cidade-vazio">Nenhuma cidade encontrada, tchê. Tenta outro nome!</p>
            )}
          </div>
        </>
      )}

      {/* ── LOADING ── */}
      {selecionado && loading && (
        <div className="loading-state">
          <div className="loading-icone">{iconeSelecionado}</div>
          <p>O GPTchê tá campando as melhores dicas de {nomeSelecionado}...</p>
          <div className="dots">
            {[0, 1, 2].map((d) => (
              <span key={d} style={{ animationDelay: `${d * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── ERRO ── */}
      {selecionado && erro && !loading && (
        <div className="erro-state">
          <p>😬 {erro}</p>
          <button className="btn-voltar" onClick={voltar}>Voltar</button>
        </div>
      )}

      {/* ── GUIA DE REGIÃO ── */}
      {modo === "regiao" && regiaoSel && guiaRegiao && !loading && (
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
            <p>{guiaRegiao.saudacao}</p>
          </div>

          {guiaRegiao.evento_destaque && (
            <div className="info-card evento">
              <div className="info-label">🎉 Evento rolando agora</div>
              <div className="evento-nome">{guiaRegiao.evento_destaque.nome}</div>
              <div className="evento-periodo">{guiaRegiao.evento_destaque.periodo}</div>
              <p>{guiaRegiao.evento_destaque.descricao}</p>
              {guiaRegiao.evento_destaque.destaque && (
                <p><strong>Não perca:</strong> {guiaRegiao.evento_destaque.destaque}</p>
              )}
              {guiaRegiao.evento_destaque.entrada_gratuita && (
                <span className="badge-gratuito">✅ Entrada gratuita</span>
              )}
              {guiaRegiao.evento_destaque.site && (
                <a href={guiaRegiao.evento_destaque.site} target="_blank" rel="noopener noreferrer" className="evento-link">
                  Ver programação →
                </a>
              )}
            </div>
          )}

          <section className="guia-section">
            <h3 className="section-label">Pontos turísticos</h3>
            <div className="pontos-list">
              {guiaRegiao.pontos?.map((p, i) => (
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
              {guiaRegiao.gastronomia?.map((g, i) => (
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
            <p>{guiaRegiao.melhor_epoca}</p>
          </div>

          <div className="info-card destaque">
            <div className="info-label">⭐ Dica de gaúcho pra gaúcho</div>
            <p>{guiaRegiao.dica_gaucha}</p>
          </div>

          <button
            className="btn-perguntar"
            onClick={() => onPerguntar(`Me conta mais sobre o turismo na região: ${regiaoSel.nome}`)}
          >
            <span>🧉</span> Perguntar mais sobre {regiaoSel.nome}
          </button>
        </div>
      )}

      {/* ── GUIA DE CIDADE ── */}
      {modo === "cidade" && cidadeSel && guiaCidade && !loading && (
        <div className="guia">
          <div className="guia-header">
            <button className="btn-voltar" onClick={voltar}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Voltar
            </button>
            <span>📍</span>
            <span className="guia-titulo">{cidadeSel.nome}</span>
          </div>

          <div className="guia-saudacao">
            <span>🧉</span>
            <p>{guiaCidade.saudacao}</p>
          </div>

          <p className="guia-sobre">{guiaCidade.sobre}</p>

          {guiaCidade.destaques?.length > 0 && (
            <section className="guia-section">
              <h3 className="section-label">⭐ Destaque especial</h3>
              {guiaCidade.destaques.map((d, i) => (
                <div key={i} className="info-card destaque">
                  <div className="info-label">{d.icone} {d.titulo}</div>
                  <p>{d.descricao}</p>
                </div>
              ))}
            </section>
          )}

          <section className="guia-section">
            <h3 className="section-label">Pontos turísticos</h3>
            <div className="pontos-list">
              {guiaCidade.pontos?.map((p, i) => {
                const cor = TIPO_COR[p.tipo] || TIPO_COR.cultura;
                return (
                  <div key={i} className="ponto-card">
                    <span className="ponto-icone">{p.icone}</span>
                    <div>
                      <div className="ponto-nome-linha">
                        <span className="ponto-nome">{p.nome}</span>
                        <span className="tipo-badge" style={{ background: cor.bg, color: cor.text }}>{p.tipo}</span>
                      </div>
                      <div className="ponto-desc">{p.descricao}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="guia-section">
            <h3 className="section-label">Gastronomia local</h3>
            <div className="gastro-grid">
              {guiaCidade.gastronomia?.map((g, i) => (
                <div key={i} className="gastro-card">
                  <div className="gastro-icone">{g.icone}</div>
                  <div className="gastro-prato">{g.prato}</div>
                  <div className="gastro-dica">{g.onde}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="info-card neutral">
            <div className="info-label">🗓️ Melhor época para visitar</div>
            <p>{guiaCidade.melhor_epoca}</p>
          </div>

          <div className="info-card neutral">
            <div className="info-label">🚗 Como chegar</div>
            <p>{guiaCidade.como_chegar}</p>
            <p className="info-aviso">⚠️ Informações sujeitas a alterações — confirma antes de partir, tchê!</p>
          </div>

          <div className="info-card destaque">
            <div className="info-label">🤫 Dica de gaúcho pra gaúcho</div>
            <p>{guiaCidade.dica_local}</p>
          </div>

          <button
            className="btn-perguntar"
            onClick={() => onPerguntar(`Me conta mais sobre ${cidadeSel.nome}`)}
          >
            <span>🧉</span> Perguntar mais sobre {cidadeSel.nome}
          </button>
        </div>
      )}
    </div>
  );
}
