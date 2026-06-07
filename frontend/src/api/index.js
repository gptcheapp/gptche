const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status}`);
  }

  return res.json();
}

export async function sendChat(messages) {
  const data = await request("/api/chat", { messages });
  return data.reply;
}

export async function fetchTurismo(regiao) {
  const data = await request("/api/turismo", { regiao });
  return data.guia;
}

export async function fetchGlossario(palavra) {
  const data = await request("/api/glossario", { palavra });
  return data.resultado;
}
