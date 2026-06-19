import { useState } from "react";
import { fetchGuia } from "../api/index.js";

const GREEN = "#1B4D2E";
const GREEN_LIGHT = "#A8D5B5";
const GREEN_BG = "#E8F5EC";

const REGIOES_CIDADES = [
  { id:"serra", nome:"Serra Gaúcha", icone:"🍷", desc:"Vinhos, flores e café colonial", cidades:[
    {id:"gramado",nome:"Gramado",destaque:true},
    {id:"canela",nome:"Canela",destaque:true},
    {id:"bento",nome:"Bento Gonçalves",destaque:true},
    {id:"nova-petrópolis",nome:"Nova Petrópolis"},
    {id:"caxias",nome:"Caxias do Sul"},
    {id:"garibaldi",nome:"Garibaldi"},
    {id:"carlos-barbosa",nome:"Carlos Barbosa"},
    {id:"flores",nome:"Flores da Cunha"},
  ]},
  { id:"aparados", nome:"Aparados da Serra", icone:"🏔️", desc:"Cânions e natureza selvagem", cidades:[
    {id:"cambara",nome:"Cambará do Sul",destaque:true},
    {id:"sao-francisco-paula",nome:"São Francisco de Paula"},
    {id:"bom-jesus",nome:"Bom Jesus"},
    {id:"sao-jose-ausentes",nome:"São José dos Ausentes"},
    {id:"praia-grande",nome:"Praia Grande"},
  ]},
  { id:"missoes", nome:"Missões Jesuíticas", icone:"🏛️", desc:"Patrimônio da Humanidade", cidades:[
    {id:"sao-miguel",nome:"São Miguel das Missões",destaque:true},
    {id:"santo-angelo",nome:"Santo Ângelo"},
    {id:"sao-luiz",nome:"São Luiz Gonzaga"},
    {id:"sao-borja",nome:"São Borja"},
    {id:"santiago",nome:"Santiago"},
    {id:"jaguari",nome:"Jaguari"},
    {id:"nova-esperanca",nome:"Nova Esperança do Sul",destaque:true},
  ]},
  { id:"pampa", nome:"Pampa e Fronteira", icone:"🐄", desc:"Estâncias, tradição e natureza", cidades:[
    {id:"bage",nome:"Bagé",destaque:true},
    {id:"cacapava",nome:"Caçapava do Sul",destaque:true},
    {id:"livramento",nome:"Santana do Livramento"},
    {id:"uruguaiana",nome:"Uruguaiana"},
    {id:"dom-pedrito",nome:"Dom Pedrito"},
    {id:"alegrete",nome:"Alegrete"},
    {id:"quarai",nome:"Quaraí"},
    {id:"sao-gabriel",nome:"São Gabriel"},
  ]},
  { id:"litoral", nome:"Litoral Gaúcho", icone:"🌊", desc:"Praias, lagoas e dunas", cidades:[
    {id:"torres",nome:"Torres",destaque:true,subRegiao:"Litoral Norte"},
    {id:"capao-canoa",nome:"Capão da Canoa",subRegiao:"Litoral Norte"},
    {id:"xangri-la",nome:"Xangri-Lá",subRegiao:"Litoral Norte"},
    {id:"imbe",nome:"Imbé",subRegiao:"Litoral Norte"},
    {id:"tramandai",nome:"Tramandaí",subRegiao:"Litoral Norte"},
    {id:"cidreira",nome:"Cidreira",subRegiao:"Litoral Norte"},
    {id:"osorio",nome:"Osório",subRegiao:"Litoral Norte"},
    {id:"mostardas",nome:"Mostardas",destaque:true,subRegiao:"Costa Doce"},
    {id:"tavares",nome:"Tavares",destaque:true,subRegiao:"Costa Doce"},
    {id:"rio-grande",nome:"Rio Grande",destaque:true,subRegiao:"Costa Doce"},
    {id:"pelotas",nome:"Pelotas",destaque:true,subRegiao:"Costa Doce"},
    {id:"sao-lourenco-sul",nome:"São Lourenço do Sul",subRegiao:"Costa Doce"},
    {id:"palmares-sul",nome:"Palmares do Sul",subRegiao:"Costa Doce"},
  ]},
  { id:"poa", nome:"Grande Porto Alegre", icone:"🌅", desc:"O pôr do sol no Guaíba", cidades:[
    {id:"porto-alegre",nome:"Porto Alegre",destaque:true},
    {id:"viamao",nome:"Viamão",destaque:true},
    {id:"sao-leopoldo",nome:"São Leopoldo"},
    {id:"novo-hamburgo",nome:"Novo Hamburgo"},
    {id:"canoas",nome:"Canoas"},
    {id:"gravatai",nome:"Gravataí"},
    {id:"cachoeirinha",nome:"Cachoeirinha"},
  ]},
  { id:"central", nome:"Região Central", icone:"🦕", desc:"Dinossauros, fósseis e cultura italiana", cidades:[
    {id:"santa-maria",nome:"Santa Maria",destaque:true},
    {id:"mata",nome:"Mata",destaque:true},
    {id:"cachoeira-sul",nome:"Cachoeira do Sul"},
    {id:"sao-joao-polesine",nome:"São João do Polêsine",destaque:true,subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"silveira-martins",nome:"Silveira Martins",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"nova-palma",nome:"Nova Palma",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"restinga-seca",nome:"Restinga Sêca",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"agudo",nome:"Agudo",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"dona-francisca",nome:"Dona Francisca",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"faxinal-soturno",nome:"Faxinal do Soturno",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"ivora",nome:"Ivorá",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
    {id:"pinhal-grande",nome:"Pinhal Grande",subRegiao:"Quarta Colônia — Geoparque UNESCO"},
  ]},
];

const TIPO_COR = {
  natureza:    { bg: "#E8F5EC", text: "#1B4D2E" },
  cultura:     { bg: "#E3F2FD", text: "#1565C0" },
  historia:    { bg: "#FFF8E1", text: "#7B5800" },
  gastronomia: { bg: "#FBE9E7", text: "#BF360C" },
  aventura:    { bg: "#F3E5F5", text: "#6A1B9A" },
};

function agruparCidades(cidades) {
  const grupos = {};
  cidades.forEach(c => {
    const g = c.subRegiao || "__geral";
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(c);
  });
  return grupos;
}

export default function GuiaTab({ onPerguntar }) {
  const [regiaoSel, setRegiaoSel] = useState(null);
  const [cidadeSel, setCidadeSel] = useState(null);
  const [guia, setGuia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const buscarGuia = async (cidade) => {
    setCidadeSel(cidade);
    setGuia(null);
    setErro(false);
    setLoading(true);
    try {
      const data = await fetchGuia(cidade.nome, regiaoSel.nome);
      setGuia(data);
    } catch {
      setErro(true);
    }
    setLoading(false);
  };

  const voltarParaCidades = () => { setCidadeSel(null); setGuia(null); setErro(false); };
  const voltarParaRegioes = () => { setRegiaoSel(null); setCidadeSel(null); setGuia(null); setErro(false); };

  if (!regiaoSel) return (
    <div className="tab-scroll">
      <p className="tab-hint">Escolhe a região e depois a cidade, tchê! 📍</p>
      <div className="grid-2col">
        {REGIOES_CIDADES.map(r => (
          <button key={r.id} className="region-card" onClick={() => setRegiaoSel(r)}>
            <span className="region-icon">{r.icone}</span>
            <span className="region-name">{r.nome}</span>
            <span className="region-desc">{r.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (!cidadeSel) {
    const grupos = agruparCidades(regiaoSel.cidades);
    return (
      <div className="tab-scroll">
        <button className="back-btn" onClick={voltarParaRegioes}>← Regiões</button>
        <div className="region-header">
          <span>{regiaoSel.icone}</span>
          <div>
            <div className="region-title">{regiaoSel.nome}</div>
            <div className="region-subtitle">Escolhe a cidade, tchê!</div>
          </div>
        </div>
        {Object.entries(grupos).map(([grupo, cidades]) => (
          <div key={grupo}>
            {grupo !== "__geral" && <div className="sub-label">{grupo}</div>}
            <div className="city-list">
              {cidades.map(c => (
                <button key={c.id} className="city-btn" onClick={() => buscarGuia(c)}>
                  <span className="city-name" style={{ fontWeight: c.destaque ? 500 : 400 }}>{c.nome}</span>
                  {c.destaque && <span className="destaque-badge">destaque</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) return (
    <div className="loading-center">
      <div className="loading-icon">{regiaoSel.icone}</div>
      <div className="loading-text">O GPTchê tá campando as melhores dicas de {cidadeSel.nome}...</div>
      <div className="dots">
        {[0,1,2].map(d => <div key={d} className="dot" style={{ animationDelay: `${d*0.2}s` }} />)}
      </div>
    </div>
  );

  if (erro) return (
    <div className="tab-scroll">
      <button className="back-btn" onClick={voltarParaCidades}>← Cidades</button>
      <div className="error-card">
        <div className="error-icon">😬</div>
        <div className="error-title">Barbaridade! Deu um entrevero, tchê!</div>
        <button className="retry-btn" onClick={() => buscarGuia(cidadeSel)}>Tentar de novo</button>
      </div>
    </div>
  );

  if (!guia) return null;

  return (
    <div className="tab-scroll">
      <div className="breadcrumb">
        <button className="bread-btn" onClick={voltarParaRegioes}>{regiaoSel.icone} {regiaoSel.nome}</button>
        <span className="bread-sep">›</span>
        <button className="bread-btn" onClick={voltarParaCidades}>Cidades</button>
        <span className="bread-sep">›</span>
        <span className="bread-active">{cidadeSel.nome}</span>
      </div>

      <div className="saudacao-card">
        <span className="mate-icon">🧉</span>
        <p className="saudacao-text">{guia.saudacao}</p>
      </div>

      <p className="sobre-text">{guia.sobre}</p>

      {guia.destaques?.length > 0 && (
        <div className="section">
          <div className="section-label">⭐ Destaque especial</div>
          {guia.destaques.map((d, i) => (
            <div key={i} className="destaque-card">
              <span className="destaque-icon">{d.icone}</span>
              <div>
                <div className="destaque-title">{d.titulo}</div>
                <div className="destaque-desc">{d.descricao}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <div className="section-label">Pontos turísticos</div>
        {guia.pontos?.map((p, i) => {
          const cor = TIPO_COR[p.tipo] || TIPO_COR.cultura;
          return (
            <div key={i} className="ponto-card">
              <span className="ponto-icon">{p.icone}</span>
              <div className="ponto-body">
                <div className="ponto-header">
                  <span className="ponto-nome">{p.nome}</span>
                  <span className="tipo-badge" style={{ background: cor.bg, color: cor.text }}>{p.tipo}</span>
                </div>
                <div className="ponto-desc">{p.descricao}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section">
        <div className="section-label">Gastronomia local</div>
        <div className="gast-grid">
          {guia.gastronomia?.map((g, i) => (
            <div key={i} className="gast-card">
              <div className="gast-icon">{g.icone}</div>
              <div className="gast-prato">{g.prato}</div>
              <div className="gast-onde">{g.onde}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card">
        <div className="info-label">🗓️ Melhor época para visitar</div>
        <div className="info-text">{guia.melhor_epoca}</div>
      </div>

      <div className="info-card">
        <div className="info-label">🚗 Como chegar</div>
        <div className="info-text">{guia.como_chegar}</div>
        <div className="info-aviso">⚠️ Informações sujeitas a alterações — confirma antes de partir, tchê!</div>
      </div>

      <div className="dica-card">
        <div className="dica-label">🤫 Dica de gaúcho pra gaúcho</div>
        <div className="dica-text">{guia.dica_local}</div>
      </div>

      <button className="perguntar-btn" onClick={() => onPerguntar(`Me conta mais sobre ${cidadeSel.nome}`)}>
        <span>🧉</span> Perguntar mais sobre {cidadeSel.nome}
      </button>

      <style>{`
        .tab-hint{font-size:13px;color:var(--color-text-secondary);text-align:center;padding:4px 0 8px;}
        .grid-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .region-card{padding:14px 12px;border-radius:var(--border-radius-lg);border:0.5px solid var(--color-border-tertiary);background:var(--color-background-secondary);cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:4px;transition:border-color 0.2s;}
        .region-card:hover{border-color:${GREEN};}
        .region-icon{font-size:24px;}
        .region-name{font-size:13px;font-weight:500;color:var(--color-text-primary);}
        .region-desc{font-size:11px;color:var(--color-text-secondary);}
        .back-btn{background:none;border:none;color:${GREEN};cursor:pointer;font-size:13px;display:flex;align-items:center;gap:4px;padding:0;margin-bottom:12px;}
        .region-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:24px;}
        .region-title{font-size:16px;font-weight:500;color:var(--color-text-primary);}
        .region-subtitle{font-size:12px;color:var(--color-text-secondary);}
        .sub-label{font-size:11px;font-weight:500;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:1px;margin:12px 0 7px;}
        .city-list{display:flex;flex-direction:column;gap:6px;margin-bottom:8px;}
        .city-btn{padding:11px 14px;border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary);background:var(--color-background-secondary);cursor:pointer;text-align:left;display:flex;align-items:center;justify-content:space-between;transition:border-color 0.2s;}
        .city-btn:hover{border-color:${GREEN};}
        .city-name{font-size:13px;color:var(--color-text-primary);}
        .destaque-badge{font-size:10px;padding:2px 8px;border-radius:20px;background:${GREEN_BG};color:${GREEN};border:0.5px solid ${GREEN_LIGHT};}
        .loading-center{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding-top:60px;}
        .loading-icon{font-size:32px;}
        .loading-text{font-size:14px;color:var(--color-text-secondary);text-align:center;}
        .dots{display:flex;gap:6px;}
        .dot{width:8px;height:8px;border-radius:50%;background:${GREEN};animation:bounce 1.2s infinite;}
        .error-card{text-align:center;padding:32px 20px;}
        .error-icon{font-size:36px;margin-bottom:10px;}
        .error-title{font-size:14px;color:var(--color-text-primary);margin-bottom:14px;}
        .retry-btn{padding:9px 20px;border-radius:22px;border:none;background:${GREEN};color:${GREEN_BG};font-size:13px;cursor:pointer;}
        .breadcrumb{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
        .bread-btn{background:none;border:none;color:var(--color-text-secondary);cursor:pointer;font-size:12px;padding:0;}
        .bread-sep{color:var(--color-text-tertiary);font-size:12px;}
        .bread-active{font-size:12px;color:${GREEN};font-weight:500;}
        .saudacao-card{background:${GREEN_BG};border-radius:var(--border-radius-lg);padding:12px 16px;display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;}
        .mate-icon{font-size:20px;flex-shrink:0;}
        .saudacao-text{margin:0;font-size:13px;color:${GREEN};line-height:1.6;font-style:italic;}
        .sobre-text{font-size:13px;color:var(--color-text-primary);line-height:1.7;margin-bottom:14px;}
        .section{margin-bottom:14px;}
        .section-label{font-size:12px;font-weight:500;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
        .destaque-card{background:#FFF8E1;border-radius:var(--border-radius-md);padding:12px 14px;border:0.5px solid #FFD54F;display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;}
        .destaque-icon{font-size:22px;flex-shrink:0;}
        .destaque-title{font-size:13px;font-weight:500;color:#7B5800;margin-bottom:4px;}
        .destaque-desc{font-size:12px;color:var(--color-text-primary);line-height:1.5;}
        .ponto-card{background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:10px 14px;display:flex;gap:10px;align-items:flex-start;border:0.5px solid var(--color-border-tertiary);margin-bottom:8px;}
        .ponto-icon{font-size:20px;flex-shrink:0;}
        .ponto-body{flex:1;}
        .ponto-header{display:flex;align-items:center;gap:6px;margin-bottom:2px;}
        .ponto-nome{font-size:13px;font-weight:500;color:var(--color-text-primary);}
        .tipo-badge{font-size:10px;padding:1px 7px;border-radius:20px;}
        .ponto-desc{font-size:12px;color:var(--color-text-secondary);line-height:1.5;}
        .gast-grid{display:flex;gap:8px;flex-wrap:wrap;}
        .gast-card{background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:10px 14px;flex:1 1 40%;border:0.5px solid var(--color-border-tertiary);}
        .gast-icon{font-size:18px;margin-bottom:4px;}
        .gast-prato{font-size:13px;font-weight:500;color:var(--color-text-primary);margin-bottom:2px;}
        .gast-onde{font-size:11px;color:var(--color-text-secondary);line-height:1.4;}
        .info-card{background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:12px 14px;border:0.5px solid var(--color-border-tertiary);margin-bottom:8px;}
        .info-label{font-size:12px;font-weight:500;color:var(--color-text-secondary);margin-bottom:4px;}
        .info-text{font-size:13px;color:var(--color-text-primary);line-height:1.5;}
        .info-aviso{font-size:11px;color:var(--color-text-tertiary);margin-top:6px;font-style:italic;}
        .dica-card{background:${GREEN_BG};border-radius:var(--border-radius-md);padding:12px 14px;border:0.5px solid ${GREEN_LIGHT};margin-bottom:12px;}
        .dica-label{font-size:12px;font-weight:500;color:${GREEN};margin-bottom:4px;}
        .dica-text{font-size:13px;color:${GREEN};line-height:1.5;font-style:italic;}
        .perguntar-btn{padding:11px 20px;border-radius:24px;border:none;background:${GREEN};color:${GREEN_BG};font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-bottom:8px;}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
      `}</style>
    </div>
  );
}
