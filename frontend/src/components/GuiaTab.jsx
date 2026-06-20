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

const S = {
  scroll: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 0 },
  hint: { fontSize: 13, color: "var(--color-text-secondary)", textAlign: "center", padding: "4px 0 12px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  regionCard: { padding: "14px 12px", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 4 },
  regionIcon: { fontSize: 24 },
  regionName: { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" },
  regionDesc: { fontSize: 11, color: "var(--color-text-secondary)" },
  backBtn: { background: "none", border: "none", color: GREEN, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4, padding: 0, marginBottom: 12 },
  regionHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  regionHeaderIcon: { fontSize: 24 },
  regionTitle: { fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)" },
  regionSubtitle: { fontSize: 12, color: "var(--color-text-secondary)" },
  subLabel: { fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 7px" },
  cityList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 },
  cityBtn: { padding: "11px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cityName: { fontSize: 13, color: "var(--color-text-primary)" },
  badge: { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: GREEN_BG, color: GREEN, border: `0.5px solid ${GREEN_LIGHT}`, marginLeft: 8, whiteSpace: "nowrap", flexShrink: 0 },
  loadingCenter: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 60 },
  loadingIcon: { fontSize: 32 },
  loadingText: { fontSize: 14, color: "var(--color-text-secondary)", textAlign: "center" },
  dots: { display: "flex", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: GREEN },
  errorCard: { textAlign: "center", padding: "32px 20px" },
  errorIcon: { fontSize: 36, marginBottom: 10 },
  errorTitle: { fontSize: 14, color: "var(--color-text-primary)", marginBottom: 14 },
  retryBtn: { padding: "9px 20px", borderRadius: 22, border: "none", background: GREEN, color: GREEN_BG, fontSize: 13, cursor: "pointer" },
  breadcrumb: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 },
  breadBtn: { background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: 12, padding: 0 },
  breadSep: { color: "var(--color-text-tertiary)", fontSize: 12 },
  breadActive: { fontSize: 12, color: GREEN, fontWeight: 500 },
  saudacaoCard: { background: GREEN_BG, borderRadius: "var(--border-radius-lg)", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 },
  mateIcon: { fontSize: 20, flexShrink: 0 },
  saudacaoText: { margin: 0, fontSize: 13, color: GREEN, lineHeight: 1.6, fontStyle: "italic" },
  sobreText: { fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.7, marginBottom: 14 },
  section: { marginBottom: 14 },
  sectionLabel: { fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  destaqueCard: { background: "#FFF8E1", borderRadius: "var(--border-radius-md)", padding: "12px 14px", border: "0.5px solid #FFD54F", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 },
  destaqueIcon: { fontSize: 22, flexShrink: 0 },
  destaqueTitle: { fontSize: 13, fontWeight: 500, color: "#7B5800", marginBottom: 4 },
  destaqueDesc: { fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 },
  pontoCard: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start", border: "0.5px solid var(--color-border-tertiary)", marginBottom: 8 },
  pontoIcon: { fontSize: 20, flexShrink: 0 },
  pontoBody: { flex: 1 },
  pontoHeader: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 },
  pontoNome: { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" },
  tipoBadge: { fontSize: 10, padding: "1px 7px", borderRadius: 20 },
  pontoDesc: { fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 },
  gastGrid: { display: "flex", gap: 8, flexWrap: "wrap" },
  gastCard: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", flex: "1 1 40%", border: "0.5px solid var(--color-border-tertiary)" },
  gastIcon: { fontSize: 18, marginBottom: 4 },
  gastPrato: { fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 },
  gastOnde: { fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.4 },
  infoCard: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px", border: "0.5px solid var(--color-border-tertiary)", marginBottom: 8 },
  infoLabel: { fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 },
  infoText: { fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.5 },
  infoAviso: { fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6, fontStyle: "italic" },
  dicaCard: { background: GREEN_BG, borderRadius: "var(--border-radius-md)", padding: "12px 14px", border: `0.5px solid ${GREEN_LIGHT}`, marginBottom: 12 },
  dicaLabel: { fontSize: 12, fontWeight: 500, color: GREEN, marginBottom: 4 },
  dicaText: { fontSize: 13, color: GREEN, lineHeight: 1.5, fontStyle: "italic" },
  perguntarBtn: { padding: "11px 20px", borderRadius: 24, border: "none", background: GREEN, color: GREEN_BG, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginBottom: 8 },
};

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
    <div style={S.scroll}>
      <p style={S.hint}>Escolhe a região e depois a cidade, tchê! 📍</p>
      <div style={S.grid}>
        {REGIOES_CIDADES.map(r => (
          <button key={r.id} style={S.regionCard} onClick={() => setRegiaoSel(r)}>
            <span style={S.regionIcon}>{r.icone}</span>
            <span style={S.regionName}>{r.nome}</span>
            <span style={S.regionDesc}>{r.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (!cidadeSel) {
    const grupos = agruparCidades(regiaoSel.cidades);
    return (
      <div style={S.scroll}>
        <button style={S.backBtn} onClick={voltarParaRegioes}>← Regiões</button>
        <div style={S.regionHeader}>
          <span style={S.regionHeaderIcon}>{regiaoSel.icone}</span>
          <div>
            <div style={S.regionTitle}>{regiaoSel.nome}</div>
            <div style={S.regionSubtitle}>Escolhe a cidade, tchê!</div>
          </div>
        </div>
        {Object.entries(grupos).map(([grupo, cidades]) => (
          <div key={grupo}>
            {grupo !== "__geral" && <div style={S.subLabel}>{grupo}</div>}
            <div style={S.cityList}>
              {cidades.map(c => (
                <button key={c.id} style={S.cityBtn} onClick={() => buscarGuia(c)}>
                  <span style={{ ...S.cityName, fontWeight: c.destaque ? 500 : 400 }}>{c.nome}</span>
                  {c.destaque && <span style={S.badge}>destaque</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) return (
    <div style={S.loadingCenter}>
      <div style={S.loadingIcon}>{regiaoSel.icone}</div>
      <div style={S.loadingText}>O GPTchê tá campando as melhores dicas de {cidadeSel.nome}...</div>
      <div style={S.dots}>
        {[0,1,2].map(d => (
          <div key={d} style={{ ...S.dot, animation: "bounce 1.2s infinite", animationDelay: `${d*0.2}s` }} />
        ))}
      </div>
    </div>
  );

  if (erro) return (
    <div style={S.scroll}>
      <button style={S.backBtn} onClick={voltarParaCidades}>← Cidades</button>
      <div style={S.errorCard}>
        <div style={S.errorIcon}>😬</div>
        <div style={S.errorTitle}>Barbaridade! Deu um entrevero, tchê!</div>
        <button style={S.retryBtn} onClick={() => buscarGuia(cidadeSel)}>Tentar de novo</button>
      </div>
    </div>
  );

  if (!guia) return null;

  return (
    <div style={S.scroll}>
      <div style={S.breadcrumb}>
        <button style={S.breadBtn} onClick={voltarParaRegioes}>{regiaoSel.icone} {regiaoSel.nome}</button>
        <span style={S.breadSep}>›</span>
        <button style={S.breadBtn} onClick={voltarParaCidades}>Cidades</button>
        <span style={S.breadSep}>›</span>
        <span style={S.breadActive}>{cidadeSel.nome}</span>
      </div>

      <div style={S.saudacaoCard}>
        <span style={S.mateIcon}>🧉</span>
        <p style={S.saudacaoText}>{guia.saudacao}</p>
      </div>

      <p style={S.sobreText}>{guia.sobre}</p>

      {guia.destaques?.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionLabel}>⭐ Destaque especial</div>
          {guia.destaques.map((d, i) => (
            <div key={i} style={S.destaqueCard}>
              <span style={S.destaqueIcon}>{d.icone}</span>
              <div>
                <div style={S.destaqueTitle}>{d.titulo}</div>
                <div style={S.destaqueDesc}>{d.descricao}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={S.section}>
        <div style={S.sectionLabel}>Pontos turísticos</div>
        {guia.pontos?.map((p, i) => {
          const cor = TIPO_COR[p.tipo] || TIPO_COR.cultura;
          return (
            <div key={i} style={S.pontoCard}>
              <span style={S.pontoIcon}>{p.icone}</span>
              <div style={S.pontoBody}>
                <div style={S.pontoHeader}>
                  <span style={S.pontoNome}>{p.nome}</span>
                  <span style={{ ...S.tipoBadge, background: cor.bg, color: cor.text }}>{p.tipo}</span>
                </div>
                <div style={S.pontoDesc}>{p.descricao}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.section}>
        <div style={S.sectionLabel}>Gastronomia local</div>
        <div style={S.gastGrid}>
          {guia.gastronomia?.map((g, i) => (
            <div key={i} style={S.gastCard}>
              <div style={S.gastIcon}>{g.icone}</div>
              <div style={S.gastPrato}>{g.prato}</div>
              <div style={S.gastOnde}>{g.onde}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.infoCard}>
        <div style={S.infoLabel}>🗓️ Melhor época para visitar</div>
        <div style={S.infoText}>{guia.melhor_epoca}</div>
      </div>

      <div style={S.infoCard}>
        <div style={S.infoLabel}>🚗 Como chegar</div>
        <div style={S.infoText}>{guia.como_chegar}</div>
        <div style={S.infoAviso}>⚠️ Informações sujeitas a alterações — confirma antes de partir, tchê!</div>
      </div>

      <div style={S.dicaCard}>
        <div style={S.dicaLabel}>🤫 Dica de gaúcho pra gaúcho</div>
        <div style={S.dicaText}>{guia.dica_local}</div>
      </div>

      <button style={S.perguntarBtn} onClick={() => onPerguntar(`Me conta mais sobre ${cidadeSel.nome}`)}>
        <span>🧉</span> Perguntar mais sobre {cidadeSel.nome}
      </button>

      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
