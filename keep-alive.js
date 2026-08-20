// keep-alive.js — mantém o Render free tier acordado
// Rodar a cada 14 minutos via cron: */14 * * * *

const BACKEND_URL = "https://gptche-backend.onrender.com/health";

const ping = async () => {
  const inicio = Date.now();
  try {
    const res = await fetch(BACKEND_URL);
    const ms = Date.now() - inicio;
    console.log(`[${new Date().toISOString()}] ✅ GPTchê backend ok — ${res.status} (${ms}ms)`);
  } catch (err) {
    console.log(`[${new Date().toISOString()}] ❌ Backend não respondeu — ${err.message}`);
  }
};

ping();
