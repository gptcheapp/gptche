import { useState } from "react";

const CARDS_ETAPA1 = [
  { icone: "🧉", titulo: "Prosa de verdade", texto: "Pergunta o que quiser, por escrito ou falando. Eu respondo — e leio em voz alta, se tu quiser." },
  { icone: "🗺️", titulo: "Turismo do RS inteiro", texto: "Nove regiões e as cidades de cada uma, com dica de gaúcho pra gaúcho." },
  { icone: "📖", titulo: "Dicionário do gauchês", texto: "De \"bah\" a \"querência\": significado, exemplo e a curiosidade que ninguém te contou." },
];

export default function OnboardingScreen({ onEntrar }) {
  const [etapa, setEtapa] = useState(1);

  return (
    <div className="onboarding-screen">
      <button className="onboarding-pular" onClick={onEntrar}>Pular</button>

      {etapa === 1 && (
        <div className="onboarding-conteudo onboarding-conteudo-centro">
          <div className="onboarding-avatar-final">🧉</div>
          <h1 className="onboarding-titulo">Buenas, tchê!</h1>
          <p className="onboarding-sub">
            Sou o GPTchê, teu parceiro gaúcho de plantão. Chimarrão pronto, prosa liberada.
          </p>
        </div>
      )}

      {etapa === 2 && (
        <div className="onboarding-conteudo">
          <h1 className="onboarding-titulo">Três coisas que eu faço bem</h1>
          <div className="onboarding-cards">
            {CARDS_ETAPA1.map((c) => (
              <div key={c.titulo} className="onboarding-card">
                <span className="onboarding-card-icone">{c.icone}</span>
                <div>
                  <div className="onboarding-card-titulo">{c.titulo}</div>
                  <div className="onboarding-card-texto">{c.texto}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="onboarding-rodape">
        <div className="onboarding-dots">
          <span className={`dot ${etapa === 1 ? "ativo" : ""}`} />
          <span className={`dot ${etapa === 2 ? "ativo" : ""}`} />
        </div>
        {etapa === 1 ? (
          <button className="onboarding-cta" onClick={() => setEtapa(2)}>Bora, xirú!</button>
        ) : (
          <button className="onboarding-cta" onClick={onEntrar}>Começar a prosa</button>
        )}
      </div>
    </div>
  );
}
