const CARDS = [
  { icone: "🧉", titulo: "Chat com sotaque gaúcho", texto: "Converse na hora, com tchê, bah e toda a expressividade do RS." },
  { icone: "🗺️", titulo: "Turismo por região ou cidade", texto: "Guia completo de 9 regiões e dezenas de cidades — pontos, gastronomia e dicas de local." },
  { icone: "📖", titulo: "Dicionário do gauchês", texto: "Busca qualquer expressão gaúcha e recebe significado, exemplo e curiosidade cultural." },
];

export default function OnboardingScreen({ onEntrar }) {
  return (
    <div className="onboarding-screen">
      <div className="onboarding-avatar">🧉</div>
      <h1 className="onboarding-titulo">Buenas, tchê!</h1>
      <p className="onboarding-sub">Sou o GPTchê, teu parceiro gaúcho de plantão.</p>

      <div className="onboarding-cards">
        {CARDS.map((c) => (
          <div key={c.titulo} className="onboarding-card">
            <span className="onboarding-card-icone">{c.icone}</span>
            <div>
              <div className="onboarding-card-titulo">{c.titulo}</div>
              <div className="onboarding-card-texto">{c.texto}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="onboarding-cta" onClick={onEntrar}>
        Bora começar 🧉
      </button>
    </div>
  );
}
