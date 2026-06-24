import { useEffect, useRef, useState } from "react";

// ─── Paleta GPTchê ───────────────────────────────────────────
const C = {
  verde:      "#1B4D2E",
  verdeErva:  "#A8D5B5",
  fundoMate:  "#E8F5EC",
  ouroPampa:  "#8B6914",
  carvao:     "#2C2C2A",
};

// ─── Estilos centralizados (padrão GPTchê) ───────────────────
const S = {
  section: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: C.verde,
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  // Imagem de fundo
  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('/hero-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center right",
    backgroundRepeat: "no-repeat",
  },

  // Overlay gradiente principal — abre espaço para o texto à esquerda
  overlayGradient: {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(
      to right,
      ${C.verde}F5 0%,
      ${C.verde}D0 28%,
      ${C.verde}80 48%,
      ${C.verde}20 65%,
      transparent 80%
    )`,
  },

  // Overlay de profundidade vertical — suaviza topo e base
  overlayVert: {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(
      to bottom,
      ${C.verde}60 0%,
      transparent 20%,
      transparent 75%,
      ${C.verde}90 100%
    )`,
  },

  // Container de conteúdo
  container: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 48px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },

  // Eyebrow
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  eyebrowLine: {
    width: 32,
    height: 1,
    backgroundColor: C.verdeErva,
    opacity: 0.6,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: C.verdeErva,
    opacity: 0.85,
  },

  // Título principal
  title: {
    fontSize: "clamp(56px, 8vw, 100px)",
    fontWeight: 700,
    color: C.fundoMate,
    letterSpacing: "-0.04em",
    lineHeight: 0.95,
    margin: "0 0 24px",
  },

  // Tagline
  tagline: {
    fontSize: "clamp(14px, 1.8vw, 19px)",
    fontWeight: 300,
    color: C.verdeErva,
    opacity: 0.85,
    lineHeight: 1.75,
    maxWidth: 420,
    margin: "0 0 40px",
  },
  taglineItalic: {
    fontStyle: "italic",
    opacity: 0.65,
    fontSize: "0.9em",
  },

  // CTA row
  ctaRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },

  // Botão primário
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.verdeErva,
    color: C.verde,
    fontSize: 14,
    fontWeight: 600,
    padding: "13px 28px",
    borderRadius: 100,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
    transition: "background-color 0.18s, transform 0.12s",
    textDecoration: "none",
  },

  // Botão secundário (outline)
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
    color: C.verdeErva,
    fontSize: 14,
    fontWeight: 400,
    padding: "12px 24px",
    borderRadius: 100,
    border: `1px solid rgba(168,213,181,0.4)`,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
    transition: "border-color 0.18s, color 0.18s",
    textDecoration: "none",
  },

  // Divider decorativo
  divider: {
    width: 1,
    height: 40,
    backgroundColor: C.verdeErva,
    opacity: 0.2,
    margin: "0 4px",
  },

  // Stats row
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 40,
    marginTop: 56,
    paddingTop: 32,
    borderTop: `1px solid rgba(168,213,181,0.15)`,
    maxWidth: 460,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 700,
    color: C.fundoMate,
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 11,
    color: C.verdeErva,
    opacity: 0.7,
    letterSpacing: "0.04em",
    fontWeight: 400,
  },

  // Badge "online" no topo direito
  badge: {
    position: "absolute",
    top: 32,
    right: 48,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(27,77,46,0.7)",
    backdropFilter: "blur(8px)",
    border: `1px solid rgba(168,213,181,0.2)`,
    borderRadius: 100,
    padding: "6px 14px 6px 10px",
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: C.verdeErva,
    animation: "pulse 2s infinite",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 500,
    color: C.verdeErva,
    letterSpacing: "0.08em",
  },

  // URL discreta no rodapé da seção
  footerUrl: {
    position: "absolute",
    bottom: 28,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    fontSize: 11,
    fontWeight: 400,
    color: C.verdeErva,
    opacity: 0.35,
    letterSpacing: "0.14em",
    textTransform: "lowercase",
  },
};

// ─── Ícone bomba SVG inline ──────────────────────────────────
function IcoBomba({ size = 18, color = C.verde }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <mask id="hm">
          <rect width="56" height="68" fill="white"/>
          <circle cx="28" cy="46" r="20" fill="black"/>
          <rect x="8" y="24" width="40" height="8" rx="3.5" fill="black"/>
        </mask>
      </defs>
      <g mask="url(#hm)">
        <line x1="17" y1="47" x2="30" y2="29" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="30" y1="29" x2="46" y2="8" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="30" cy="29" r="3.5" fill={color}/>
        <line x1="44" y1="10" x2="48" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </g>
      <circle cx="28" cy="46" r="20" fill={color}/>
      <rect x="8" y="24" width="40" height="7" rx="3.5" fill={color}/>
    </svg>
  );
}

// ─── Componente principal ────────────────────────────────────
export default function HeroSection() {
  const [hoverPrimary, setHoverPrimary] = useState(false);
  const [hoverSecondary, setHoverSecondary] = useState(false);
  const sectionRef = useRef(null);

  // Parallax suave no scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const bg = el.querySelector("[data-parallax]");
    const onScroll = () => {
      const y = window.scrollY;
      if (bg) bg.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .hero-title    { font-size: 52px !important; }
          .hero-container { padding: 0 24px !important; }
          .hero-stats    { gap: 24px !important; }
          .hero-badge    { top: 20px !important; right: 20px !important; }
          .hero-footer   { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-parallax] { transform: none !important; }
          .hero-badge-dot { animation: none !important; }
        }
      `}</style>

      <section ref={sectionRef} style={S.section} aria-label="GPTchê — O primeiro chat gaúcho com IA">

        {/* ── Fundo com imagem + parallax ── */}
        <div data-parallax style={{ ...S.bgImage, willChange: "transform" }} role="presentation" />

        {/* ── Overlays ── */}
        <div style={S.overlayGradient} />
        <div style={S.overlayVert} />

        {/* ── Badge online ── */}
        <div style={S.badge} className="hero-badge">
          <div style={S.badgeDot} className="hero-badge-dot" />
          <span style={S.badgeText}>Online agora</span>
        </div>

        {/* ── Conteúdo ── */}
        <div style={S.container} className="hero-container">

          {/* Eyebrow */}
          <div style={S.eyebrow}>
            <div style={S.eyebrowLine} />
            <span style={S.eyebrowText}>O Gaúcho Digital</span>
          </div>

          {/* Título */}
          <h1 style={S.title} className="hero-title">GPTchê</h1>

          {/* Tagline */}
          <p style={S.tagline}>
            O primeiro chat com IA que fala gaúcho de verdade.{" "}
            <span style={S.taglineItalic}>
              Tradição e tecnologia, juntas como cuia e bomba.
            </span>
          </p>

          {/* CTAs */}
          <div style={S.ctaRow}>
            <a
              href="https://gptche.app"
              style={{
                ...S.btnPrimary,
                ...(hoverPrimary ? { backgroundColor: C.fundoMate, transform: "scale(1.02)" } : {}),
              }}
              onMouseEnter={() => setHoverPrimary(true)}
              onMouseLeave={() => setHoverPrimary(false)}
            >
              <IcoBomba size={17} color={C.verde} />
              Começar a conversar
            </a>

            <div style={S.divider} />

            <a
              href="#sobre"
              style={{
                ...S.btnSecondary,
                ...(hoverSecondary
                  ? { borderColor: "rgba(168,213,181,0.7)", color: C.fundoMate }
                  : {}),
              }}
              onMouseEnter={() => setHoverSecondary(true)}
              onMouseLeave={() => setHoverSecondary(false)}
            >
              Como funciona →
            </a>
          </div>

          {/* Stats */}
          <div style={S.statsRow} className="hero-stats">
            {[
              { n: "4",  l: "módulos de conteúdo" },
              { n: "RS", l: "Rio Grande do Sul"   },
              { n: "∞",  l: "conversas gaúchas"   },
            ].map(({ n, l }) => (
              <div key={l} style={S.statItem}>
                <span style={S.statNumber}>{n}</span>
                <span style={S.statLabel}>{l}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── URL discreta ── */}
        <span style={S.footerUrl} className="hero-footer">gptche.app</span>

      </section>
    </>
  );
}
