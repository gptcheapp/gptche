import { useEffect } from "react";

const CuiaSVG = ({ width = 26, height = 32, maskId = "m0" }) => (
  <svg viewBox="0 0 56 68" fill="none" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
    <defs>
      <mask id={maskId}>
        <rect width="56" height="68" fill="white" />
        <circle cx="28" cy="46" r="20" fill="black" />
        <rect x="8" y="24" width="40" height="8" rx="3.5" fill="black" />
      </mask>
    </defs>
    <g mask={`url(#${maskId})`}>
      <line x1="17" y1="47" x2="30" y2="29" stroke="#E8F5EC" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="30" y1="29" x2="46" y2="8" stroke="#E8F5EC" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="29" r="3.5" fill="#E8F5EC" />
      <circle cx="30" cy="29" r="2" fill="#A8D5B5" />
      <line x1="44" y1="10" x2="48" y2="5" stroke="#E8F5EC" strokeWidth="2" strokeLinecap="round" />
    </g>
    <circle cx="28" cy="46" r="20" fill="#A8D5B5" />
    <rect x="8" y="24" width="40" height="7" rx="3.5" fill="#E8F5EC" />
    <rect x="9" y="28" width="38" height="3" rx="1.5" fill="#A8D5B5" opacity="0.5" />
  </svg>
);

export default function LandingPage({ onEntrar }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lp-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".lp-fade").forEach((el) => observer.observe(el));

    const bg = document.querySelector("[data-parallax]");
    const onScroll = () => {
      if (bg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        .lp * { box-sizing: border-box; margin: 0; padding: 0; }
        .lp { font-family: 'Inter', system-ui, sans-serif; color: #2C2C2A; background: #F7FAF8; scroll-behavior: smooth; }

        /* NAV */
        .lp-nav {
          background: #1B4D2E; padding: 0 48px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .lp-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .lp-nav-wordmark { font-size: 20px; font-weight: 600; color: #E8F5EC; letter-spacing: -0.3px; }
        .lp-nav-links { display: flex; align-items: center; gap: 32px; }
        .lp-nav-link { font-size: 14px; font-weight: 400; color: rgba(168,213,181,0.7); text-decoration: none; }
        .lp-nav-link:hover { color: #A8D5B5; }
        .lp-nav-cta {
          background: #E8F5EC; color: #1B4D2E; border: none; border-radius: 24px;
          padding: 9px 22px; font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: inherit; letter-spacing: -0.1px; text-decoration: none;
        }
        .lp-nav-cta:hover { background: white; }

        /* HERO */
        .lp-hero {
          min-height: 100vh; padding: 0;
          display: flex; align-items: center;
          position: relative; overflow: hidden;
          background-color: #1B4D2E;
        }
        .lp-hero-bg {
          position: absolute; inset: 0;
          background-image: url('/hero-bg.png');
          background-size: cover;
          background-position: center right;
          background-repeat: no-repeat;
          will-change: transform;
        }
        .lp-hero-overlay-h {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            to right,
            #1B4D2EF5 0%, #1B4D2ED0 28%,
            #1B4D2E80 48%, #1B4D2E20 65%,
            transparent 80%
          );
        }
        .lp-hero-overlay-v {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            to bottom,
            #1B4D2E60 0%, transparent 18%,
            transparent 75%, #1B4D2E95 100%
          );
        }
        .lp-hero-online {
          position: absolute; top: 32px; right: 48px; z-index: 20;
          display: flex; align-items: center; gap: 8px;
          background: rgba(27,77,46,0.65);
          backdrop-filter: blur(8px);
          border: 0.5px solid rgba(168,213,181,0.2);
          border-radius: 100px; padding: 6px 14px 6px 10px;
        }
        .lp-hero-online-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #A8D5B5; animation: lp-pulse 2s infinite;
        }
        .lp-hero-online-text { font-size: 11px; font-weight: 500; color: #A8D5B5; letter-spacing: 0.08em; }
        .lp-hero-content {
          position: relative; z-index: 10;
          width: 100%; max-width: 1280px; margin: 0 auto;
          padding: 120px 48px 100px;
        }
        .lp-hero-eyebrow {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
          opacity: 0; transform: translateY(14px);
          animation: lp-heroEnter 0.6s ease 0.1s forwards;
        }
        .lp-hero-eyebrow-line { width: 32px; height: 1px; background: #A8D5B5; opacity: 0.5; }
        .lp-hero-eyebrow-text { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #A8D5B5; }
        .lp-hero-h1 {
          font-size: clamp(64px, 9vw, 108px); font-weight: 700; color: #E8F5EC;
          letter-spacing: -0.04em; line-height: 0.95; margin-bottom: 24px;
          opacity: 0; transform: translateY(16px);
          animation: lp-heroEnter 0.65s ease 0.3s forwards;
        }
        .lp-hero-sub {
          font-size: clamp(15px, 1.8vw, 19px); font-weight: 300; color: #A8D5B5;
          line-height: 1.75; max-width: 420px; margin-bottom: 40px;
          opacity: 0; transform: translateY(16px);
          animation: lp-heroEnter 0.65s ease 0.48s forwards;
        }
        .lp-hero-sub em { font-style: italic; opacity: 0.65; }
        .lp-hero-ctas {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 60px;
          opacity: 0; transform: translateY(16px);
          animation: lp-heroEnter 0.65s ease 0.62s forwards;
        }
        .lp-hero-divider { width: 1px; height: 40px; background: #A8D5B5; opacity: 0.2; }
        .lp-hero-stats {
          display: flex; align-items: center; gap: 40px; flex-wrap: wrap;
          padding-top: 32px; border-top: 0.5px solid rgba(168,213,181,0.15);
          max-width: 440px;
          opacity: 0; transform: translateY(16px);
          animation: lp-heroEnter 0.65s ease 0.78s forwards;
        }
        .lp-hero-stat-num { font-size: 28px; font-weight: 700; color: #E8F5EC; letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
        .lp-hero-stat-label { font-size: 11px; color: #A8D5B5; opacity: 0.7; letter-spacing: 0.04em; }
        .lp-hero-url {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 10; font-size: 11px; color: #A8D5B5; opacity: 0.3;
          letter-spacing: 0.14em;
        }

        @keyframes lp-heroEnter { to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes lp-pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.35; }
        }

        .lp-btn-primary {
          background: #E8F5EC; color: #1B4D2E; border: none; border-radius: 28px;
          padding: 15px 34px; font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: inherit; display: inline-flex; align-items: center; gap: 8px;
          letter-spacing: -0.1px; text-decoration: none;
        }
        .lp-btn-primary:hover { background: white; }
        .lp-btn-secondary {
          background: rgba(168,213,181,0.1); color: #E8F5EC;
          border: 1px solid rgba(168,213,181,0.55);
          border-radius: 28px; padding: 15px 30px; font-size: 15px; font-weight: 400;
          cursor: pointer; font-family: inherit; letter-spacing: -0.1px; text-decoration: none;
          backdrop-filter: blur(4px);
        }
        .lp-btn-secondary:hover { background: rgba(168,213,181,0.18); border-color: rgba(168,213,181,0.8); }

        /* FEATURES */
        .lp-features { background: #F7FAF8; padding: 96px 48px; }
        .lp-sec-header { text-align: center; margin-bottom: 60px; }
        .lp-eyebrow { font-size: 11px; font-weight: 600; color: #8B6914; text-transform: uppercase; letter-spacing: 1.8px; margin-bottom: 12px; }
        .lp-sec-title { font-size: 38px; font-weight: 700; color: #1B4D2E; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 14px; }
        .lp-sec-sub { font-size: 16px; font-weight: 300; color: #4A6655; line-height: 1.7; max-width: 480px; margin: 0 auto; }
        .lp-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 960px; margin: 0 auto; }
        .lp-card {
          background: white; border-radius: 20px; border: 1px solid #D8EAE0;
          padding: 32px 28px 28px; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .lp-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(27,77,46,0.1); }
        .lp-card-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 20px 20px 0 0; }
        .lp-feat-icon { width: 48px; height: 48px; border-radius: 14px; background: #E8F5EC; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; flex-shrink: 0; }
        .lp-feat-label { font-size: 11px; font-weight: 600; color: #A8D5B5; letter-spacing: 1.4px; text-transform: uppercase; margin-bottom: 8px; }
        .lp-feat-title { font-size: 22px; font-weight: 600; color: #1B4D2E; letter-spacing: -0.02em; margin-bottom: 12px; }
        .lp-feat-desc { font-size: 14px; color: #4A6655; line-height: 1.7; margin-bottom: 24px; flex: 1; }
        .lp-feat-preview { background: #F7FAF8; border-radius: 12px; padding: 14px 16px; border: 0.5px solid #D8EAE0; }
        .lp-chat-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 8px; }
        .lp-avatar { width: 24px; height: 24px; border-radius: 50%; background: #1B4D2E; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .lp-bubble-bot { background: white; border: 0.5px solid #D8EAE0; border-radius: 12px 12px 12px 3px; padding: 8px 12px; font-size: 12px; color: #2C2C2A; line-height: 1.5; max-width: 180px; }
        .lp-bubble-user { background: #1B4D2E; border-radius: 12px 12px 3px 12px; padding: 8px 12px; font-size: 12px; color: #E8F5EC; line-height: 1.5; max-width: 160px; margin-left: auto; }
        .lp-region-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .lp-tag { background: white; border: 0.5px solid #D8EAE0; border-radius: 20px; padding: 4px 10px; font-size: 11px; color: #1B4D2E; font-weight: 500; }
        .lp-tag.active { background: #1B4D2E; color: #E8F5EC; border-color: #1B4D2E; }
        .lp-glos-term { font-size: 18px; font-weight: 600; color: #1B4D2E; letter-spacing: -0.02em; }
        .lp-glos-cat { font-size: 10px; color: #A8D5B5; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 4px 0; }
        .lp-glos-def { font-size: 12px; color: #4A6655; line-height: 1.5; padding-top: 8px; border-top: 0.5px solid #D8EAE0; margin-top: 6px; }
        .lp-nivel { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 10px; margin-top: 6px; background: #E8F5EC; color: #1B4D2E; }

        /* ABOUT */
        .lp-about { background: white; padding: 96px 48px; }
        .lp-about-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .lp-about-title { font-size: 38px; font-weight: 700; color: #1B4D2E; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 24px; }
        .lp-about-text { font-size: 16px; font-weight: 300; color: #4A6655; line-height: 1.85; margin-bottom: 16px; }
        .lp-divider { width: 40px; height: 2px; background: #A8D5B5; margin: 28px 0; border-radius: 2px; }
        .lp-quote { font-size: 17px; font-weight: 400; color: #1B4D2E; line-height: 1.7; font-style: italic; padding-left: 20px; border-left: 3px solid #1B4D2E; }
        .lp-about-right { display: flex; flex-direction: column; gap: 16px; }
        .lp-stat { background: #F7FAF8; border-radius: 16px; border: 1px solid #D8EAE0; padding: 24px 28px; display: flex; align-items: center; gap: 20px; transition: transform 0.2s ease, border-color 0.2s ease; }
        .lp-stat:hover { transform: translateY(-3px); border-color: #A8D5B5; }
        .lp-stat-icon { width: 48px; height: 48px; border-radius: 14px; background: #E8F5EC; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .lp-stat-num { font-size: 28px; font-weight: 700; color: #1B4D2E; letter-spacing: -0.04em; line-height: 1; margin-bottom: 4px; }
        .lp-stat-label { font-size: 13px; color: #4A6655; line-height: 1.4; }
        .lp-origin { background: #1B4D2E; border-radius: 16px; padding: 24px 28px; position: relative; overflow: hidden; }
        .lp-origin-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(168,213,181,0.07) 1.5px, transparent 1.5px); background-size: 20px 20px; pointer-events: none; }
        .lp-origin-content { position: relative; z-index: 1; }
        .lp-origin-eye { font-size: 10px; font-weight: 600; color: #A8D5B5; letter-spacing: 1.4px; text-transform: uppercase; margin-bottom: 8px; }
        .lp-origin-text { font-size: 14px; color: #A8D5B5; line-height: 1.7; font-weight: 300; }
        .lp-origin-text strong { color: #E8F5EC; font-weight: 500; }

        /* PWA */
        .lp-pwa { background: #F7FAF8; padding: 96px 48px; }
        .lp-pwa-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .lp-pwa-title { font-size: 38px; font-weight: 700; color: #1B4D2E; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 16px; }
        .lp-pwa-text { font-size: 16px; font-weight: 300; color: #4A6655; line-height: 1.85; margin-bottom: 36px; }
        .lp-steps { display: flex; flex-direction: column; gap: 18px; }
        .lp-step { display: flex; align-items: flex-start; gap: 14px; }
        .lp-step-num { width: 28px; height: 28px; border-radius: 50%; background: #1B4D2E; color: #E8F5EC; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .lp-step-text { font-size: 14px; color: #4A6655; line-height: 1.6; padding-top: 4px; }
        .lp-step-text strong { color: #1B4D2E; font-weight: 500; }
        .lp-phone-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .lp-phone { width: 210px; background: #1B4D2E; border-radius: 36px; padding: 12px; border: 3px solid #0d2e1a; }
        .lp-phone-notch { width: 60px; height: 6px; background: #0d2e1a; border-radius: 3px; margin: 0 auto 10px; }
        .lp-phone-screen { background: #F7FAF8; border-radius: 26px; overflow: hidden; }
        .lp-phone-header { background: #1B4D2E; padding: 10px 14px; display: flex; align-items: center; gap: 8px; }
        .lp-phone-logo-text { font-size: 13px; font-weight: 600; color: #E8F5EC; letter-spacing: -0.2px; }
        .lp-phone-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .lp-phone-bot { background: white; border: 0.5px solid #D8EAE0; border-radius: 10px 10px 10px 3px; padding: 8px 10px; font-size: 11px; color: #2C2C2A; line-height: 1.5; max-width: 145px; }
        .lp-phone-user { background: #1B4D2E; border-radius: 10px 10px 3px 10px; padding: 8px 10px; font-size: 11px; color: #E8F5EC; line-height: 1.5; max-width: 135px; align-self: flex-end; }
        .lp-phone-input { margin: 4px 12px 12px; background: white; border: 0.5px solid #D8EAE0; border-radius: 20px; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; }
        .lp-phone-input-text { font-size: 10px; color: #A8B5A0; }
        .lp-phone-send { width: 22px; height: 22px; border-radius: 50%; background: #1B4D2E; display: flex; align-items: center; justify-content: center; }
        .lp-install { display: flex; align-items: center; gap: 12px; background: white; border: 1px solid #D8EAE0; border-radius: 14px; padding: 12px 18px; }
        .lp-install-icon { width: 36px; height: 36px; border-radius: 10px; background: #1B4D2E; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .lp-install-label { font-size: 11px; color: #4A6655; }
        .lp-install-label strong { display: block; font-size: 13px; color: #1B4D2E; font-weight: 600; }

        /* FOOTER */
        .lp-footer { background: #1B4D2E; padding: 64px 48px 36px; position: relative; overflow: hidden; }
        .lp-footer-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(168,213,181,0.06) 1.5px, transparent 1.5px); background-size: 24px 24px; pointer-events: none; }
        .lp-footer-inner { max-width: 960px; margin: 0 auto; position: relative; z-index: 1; }
        .lp-footer-top { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 48px; padding-bottom: 44px; border-bottom: 0.5px solid rgba(168,213,181,0.2); margin-bottom: 28px; }
        .lp-footer-brand { display: flex; flex-direction: column; gap: 14px; }
        .lp-footer-wordmark { font-size: 22px; font-weight: 700; color: #E8F5EC; letter-spacing: -0.3px; display: flex; align-items: center; gap: 10px; }
        .lp-footer-tagline { font-size: 13px; color: #A8D5B5; font-weight: 300; line-height: 1.7; max-width: 240px; }
        .lp-footer-col-title { font-size: 11px; font-weight: 600; color: #A8D5B5; text-transform: uppercase; letter-spacing: 1.4px; margin-bottom: 16px; }
        .lp-footer-links { display: flex; flex-direction: column; gap: 10px; }
        .lp-footer-link { font-size: 14px; color: rgba(168,213,181,0.65); font-weight: 300; text-decoration: none; }
        .lp-footer-link:hover { color: #A8D5B5; }
        .lp-footer-bottom { display: flex; align-items: center; justify-content: space-between; }
        .lp-footer-copy { font-size: 12px; color: rgba(168,213,181,0.35); }
        .lp-footer-made { font-size: 12px; color: rgba(168,213,181,0.35); }
        .lp-footer-made strong { color: rgba(168,213,181,0.6); font-weight: 400; }

        /* FADE-IN */
        .lp-fade { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .lp-fade:nth-child(2) { transition-delay: 0.1s; }
        .lp-fade:nth-child(3) { transition-delay: 0.2s; }
        .lp-fade:nth-child(4) { transition-delay: 0.3s; }
        .lp-fade.lp-visible { opacity: 1; transform: translateY(0); }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .lp-nav { padding: 0 20px; }
          .lp-nav-links { display: none; }
          .lp-hero-content { padding: 100px 24px 80px; }
          .lp-hero-online { top: 20px; right: 20px; }
          .lp-hero-overlay-h {
            background: linear-gradient(
              to right,
              #1B4D2EF8 0%, #1B4D2EE0 50%, #1B4D2E90 80%, transparent 100%
            );
          }
          .lp-hero-url { display: none; }
          .lp-hero-ctas { flex-direction: column; align-items: flex-start; gap: 12px; }
          .lp-hero-divider { display: none; }
          .lp-btn-primary, .lp-btn-secondary { width: 100%; justify-content: center; }
          .lp-features, .lp-about, .lp-pwa { padding: 64px 24px; }
          .lp-cards { grid-template-columns: 1fr; }
          .lp-about-inner, .lp-pwa-inner { grid-template-columns: 1fr; gap: 48px; }
          .lp-footer { padding: 48px 24px 28px; }
          .lp-footer-top { grid-template-columns: 1fr; gap: 32px; }
          .lp-footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lp-fade { opacity: 1; transform: none; transition: none; }
          .lp-hero-eyebrow, .lp-hero-h1, .lp-hero-sub, .lp-hero-ctas, .lp-hero-stats { opacity: 1; transform: none; animation: none; }
          .lp-hero-online-dot { animation: none; }
          .lp-hero-bg { will-change: auto; }
          .lp-card:hover, .lp-stat:hover { transform: none; }
        }
      `}</style>

      <div className="lp">
        {/* NAV */}
        <nav className="lp-nav">
          <a href="#" className="lp-nav-logo">
            <CuiaSVG maskId="lp-nm" width={26} height={32} />
            <span className="lp-nav-wordmark">GPTchê</span>
          </a>
          <div className="lp-nav-links">
            <a href="#funcionalidades" className="lp-nav-link">Funcionalidades</a>
            <a href="#sobre" className="lp-nav-link">Sobre</a>
            <a href="#instalar" className="lp-nav-link">Instalar</a>
          </div>
          <button className="lp-nav-cta" onClick={onEntrar}>Abrir o GPTchê</button>
        </nav>

        {/* HERO */}
        <section className="lp-hero" aria-label="GPTchê — O primeiro chat gaúcho com IA">
          <div className="lp-hero-bg" data-parallax />
          <div className="lp-hero-overlay-h" />
          <div className="lp-hero-overlay-v" />

          <div className="lp-hero-online">
            <div className="lp-hero-online-dot" />
            <span className="lp-hero-online-text">Online agora</span>
          </div>

          <div className="lp-hero-content">
            <div className="lp-hero-eyebrow">
              <div className="lp-hero-eyebrow-line" />
              <span className="lp-hero-eyebrow-text">O Gaúcho Digital</span>
            </div>

            <h1 className="lp-hero-h1">GPTchê</h1>

            <p className="lp-hero-sub">
              O primeiro chat com IA que fala gaúcho de verdade.{" "}
              <em>Tradição e tecnologia, juntas como cuia e bomba.</em>
            </p>

            <div className="lp-hero-ctas">
              <button className="lp-btn-primary" onClick={onEntrar}>
                Começar a conversar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <div className="lp-hero-divider" />
              <a href="#funcionalidades" className="lp-btn-secondary">Como funciona →</a>
            </div>

            <div className="lp-hero-stats">
              {[
                { n: "4",   l: "módulos de conteúdo" },
                { n: "8",   l: "regiões do RS"       },
                { n: "∞",   l: "conversas gaúchas"   },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="lp-hero-stat-num">{n}</div>
                  <div className="lp-hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <span className="lp-hero-url">gptche.app</span>
        </section>

        {/* FEATURES */}
        <section className="lp-features" id="funcionalidades">
          <div className="lp-sec-header">
            <p className="lp-eyebrow">O que o GPTchê faz</p>
            <h2 className="lp-sec-title">Tudo num só lugar, tchê</h2>
            <p className="lp-sec-sub">Três modos pra te atender — do papo do dia a dia até o guia turístico mais gaúcho que existe.</p>
          </div>
          <div className="lp-cards">
            {/* Chat */}
            <div className="lp-card lp-fade">
              <div className="lp-card-accent" style={{ background: "#1B4D2E" }} />
              <div className="lp-feat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="lp-feat-label">01</p>
              <h3 className="lp-feat-title">Chat Gaúcho</h3>
              <p className="lp-feat-desc">Conversa com IA que fala o teu idioma — com tchê, bah e toda a expressividade gaúcha.</p>
              <div className="lp-feat-preview">
                <div className="lp-chat-row">
                  <div className="lp-avatar">
                    <svg viewBox="0 0 56 68" fill="none" width="14" height="17">
                      <defs><mask id="lp-cm"><rect width="56" height="68" fill="white" /><circle cx="28" cy="46" r="20" fill="black" /><rect x="8" y="24" width="40" height="8" rx="3.5" fill="black" /></mask></defs>
                      <g mask="url(#lp-cm)">
                        <line x1="17" y1="47" x2="30" y2="29" stroke="#E8F5EC" strokeWidth="4" strokeLinecap="round" />
                        <line x1="30" y1="29" x2="46" y2="8" stroke="#E8F5EC" strokeWidth="3.5" strokeLinecap="round" />
                      </g>
                      <circle cx="28" cy="46" r="20" fill="#A8D5B5" />
                      <rect x="8" y="24" width="40" height="7" rx="3.5" fill="#E8F5EC" />
                    </svg>
                  </div>
                  <div className="lp-bubble-bot">Buenas, xirú! O que tu precisas hoje?</div>
                </div>
                <div className="lp-bubble-user">Bah, me fala do chimarrão!</div>
              </div>
            </div>

            {/* Turismo */}
            <div className="lp-card lp-fade">
              <div className="lp-card-accent" style={{ background: "#A8D5B5" }} />
              <div className="lp-feat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </svg>
              </div>
              <p className="lp-feat-label">02</p>
              <h3 className="lp-feat-title">Turismo RS</h3>
              <p className="lp-feat-desc">Guia turístico gaúcho pra cada região do Rio Grande do Sul — pontos, gastronomia e dicas de quem é daqui.</p>
              <div className="lp-feat-preview">
                <div className="lp-region-tags">
                  <span className="lp-tag active">🍷 Serra Gaúcha</span>
                  <span className="lp-tag">🏔️ Aparados</span>
                  <span className="lp-tag">🌊 Litoral</span>
                  <span className="lp-tag">🏛️ Missões</span>
                  <span className="lp-tag">🐄 Pampa</span>
                </div>
              </div>
            </div>

            {/* Glossário */}
            <div className="lp-card lp-fade">
              <div className="lp-card-accent" style={{ background: "#8B6914" }} />
              <div className="lp-feat-icon" style={{ background: "#FFF8E1" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <p className="lp-feat-label" style={{ color: "#D4A820" }}>03</p>
              <h3 className="lp-feat-title">Glossário Gaúcho</h3>
              <p className="lp-feat-desc">O dicionário do gauchês — significado, exemplo e curiosidade cultural de cada expressão.</p>
              <div className="lp-feat-preview">
                <span className="lp-glos-term">Bagual</span>
                <p className="lp-glos-cat">Substantivo · Cotidiano</p>
                <p className="lp-glos-def">Cavalo xucro ou pessoa corajosa e brava. Usado com orgulho no RS.</p>
                <span className="lp-nivel">Cotidiano</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="lp-about" id="sobre">
          <div className="lp-about-inner">
            <div className="lp-fade">
              <p className="lp-eyebrow">A história</p>
              <h2 className="lp-about-title">A alma gaúcha em código</h2>
              <p className="lp-about-text">O GPTchê nasceu da vontade de criar uma inteligência artificial com sotaque, história e orgulho. Mais do que um chatbot, é um companheiro digital que fala gaúcho.</p>
              <p className="lp-about-text">A IA já chegou pra todo mundo — mas nenhuma falava a língua do Rio Grande do Sul de verdade. O GPTchê veio mudar isso.</p>
              <div className="lp-divider" />
              <p className="lp-quote">"Tradição e tecnologia, juntas como cuia e bomba."</p>
            </div>
            <div className="lp-about-right lp-fade">
              <div className="lp-stat lp-fade">
                <div className="lp-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="lp-stat-num">11M+</div>
                  <div className="lp-stat-label">Gaúchos que merecem uma IA que fala a sua língua</div>
                </div>
              </div>
              <div className="lp-stat lp-fade">
                <div className="lp-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                </div>
                <div>
                  <div className="lp-stat-num">8</div>
                  <div className="lp-stat-label">Regiões turísticas do RS mapeadas com dicas locais</div>
                </div>
              </div>
              <div className="lp-stat lp-fade">
                <div className="lp-stat-icon" style={{ background: "#FFF8E1" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <div className="lp-stat-num">∞</div>
                  <div className="lp-stat-label">Expressões gaúchas pra tu aprender e ensinar</div>
                </div>
              </div>
              <div className="lp-origin">
                <div className="lp-origin-dots" />
                <div className="lp-origin-content">
                  <p className="lp-origin-eye">De onde veio</p>
                  <p className="lp-origin-text">Feito por um gaúcho de verdade — <strong>do interior ao mundo digital</strong>, com o RS no coração.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PWA */}
        <section className="lp-pwa" id="instalar">
          <div className="lp-pwa-inner">
            <div className="lp-fade">
              <p className="lp-eyebrow">No teu bolso</p>
              <h2 className="lp-pwa-title">Instala no celular, tchê</h2>
              <p className="lp-pwa-text">Sem App Store, sem Play Store. O GPTchê é um PWA — instala direto pelo navegador em dois toques e funciona como um app de verdade.</p>
              <div className="lp-steps">
                <div className="lp-step">
                  <div className="lp-step-num">1</div>
                  <p className="lp-step-text">Abre o <strong>gptche.app</strong> no navegador do teu celular</p>
                </div>
                <div className="lp-step">
                  <div className="lp-step-num">2</div>
                  <p className="lp-step-text">Toca em <strong>Compartilhar</strong> (iOS) ou no menu do navegador (Android)</p>
                </div>
                <div className="lp-step">
                  <div className="lp-step-num">3</div>
                  <p className="lp-step-text">Seleciona <strong>"Adicionar à tela inicial"</strong> — pronto, tchê!</p>
                </div>
              </div>
            </div>

            <div className="lp-fade">
              <div className="lp-phone-wrap">
                <div className="lp-phone">
                  <div className="lp-phone-notch" />
                  <div className="lp-phone-screen">
                    <div className="lp-phone-header">
                      <svg viewBox="0 0 56 68" fill="none" width="16" height="20">
                        <defs><mask id="lp-pm"><rect width="56" height="68" fill="white" /><circle cx="28" cy="46" r="20" fill="black" /><rect x="8" y="24" width="40" height="8" rx="3.5" fill="black" /></mask></defs>
                        <g mask="url(#lp-pm)">
                          <line x1="17" y1="47" x2="30" y2="29" stroke="#E8F5EC" strokeWidth="4" strokeLinecap="round" />
                          <line x1="30" y1="29" x2="46" y2="8" stroke="#E8F5EC" strokeWidth="3.5" strokeLinecap="round" />
                          <circle cx="30" cy="29" r="4" fill="#E8F5EC" />
                          <circle cx="30" cy="29" r="2.2" fill="#A8D5B5" />
                        </g>
                        <circle cx="28" cy="46" r="20" fill="#A8D5B5" />
                        <rect x="8" y="24" width="40" height="7" rx="3.5" fill="#E8F5EC" />
                      </svg>
                      <span className="lp-phone-logo-text">GPTchê</span>
                      <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#A8D5B5" }} />
                    </div>
                    <div className="lp-phone-body">
                      <div className="lp-phone-bot">Buenas, xirú! Tô aqui pra ajudar. O que tu quer saber?</div>
                      <div className="lp-phone-user">Me conta sobre a Serra Gaúcha!</div>
                      <div className="lp-phone-bot">Bah, que lugar tri! A Serra tem...</div>
                    </div>
                    <div className="lp-phone-input">
                      <span className="lp-phone-input-text">Escreve aqui, tchê...</span>
                      <div className="lp-phone-send">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E8F5EC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lp-install">
                  <div className="lp-install-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8F5EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v13M5 9l7 7 7-7" /><path d="M3 20h18" /></svg>
                  </div>
                  <div className="lp-install-label">
                    <strong>Instalar GPTchê</strong>
                    Adicionar à tela inicial
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-dots" />
          <div className="lp-footer-inner">
            <div className="lp-footer-top">
              <div className="lp-footer-brand">
                <div className="lp-footer-wordmark">
                  <CuiaSVG maskId="lp-fm" width={22} height={27} />
                  GPTchê
                </div>
                <p className="lp-footer-tagline">O primeiro chat gaúcho com IA. Feito com orgulho no Rio Grande do Sul.</p>
              </div>
              <div>
                <p className="lp-footer-col-title">O app</p>
                <div className="lp-footer-links">
                  <a href="#funcionalidades" className="lp-footer-link">Chat Gaúcho</a>
                  <a href="#funcionalidades" className="lp-footer-link">Turismo RS</a>
                  <a href="#funcionalidades" className="lp-footer-link">Glossário</a>
                  <a href="#instalar" className="lp-footer-link">Instalar PWA</a>
                </div>
              </div>
              <div>
                <p className="lp-footer-col-title">Contato</p>
                <div className="lp-footer-links">
                  <a href="https://instagram.com/gptche.app" className="lp-footer-link">Instagram</a>
                  <a href="https://tiktok.com/@gptche.app" className="lp-footer-link">TikTok</a>
                  <a href="https://x.com/gptcheapp" className="lp-footer-link">X</a>
                  <a href="mailto:contato@gptche.app" className="lp-footer-link">contato@gptche.app</a>
                </div>
              </div>
            </div>
            <div className="lp-footer-bottom">
              <span className="lp-footer-copy">© 2026 GPTchê. Todos os direitos reservados.</span>
              <span className="lp-footer-made">Feito com mate e orgulho no <strong>RS</strong></span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
