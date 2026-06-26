import { Router } from "express";
import anthropic from "../anthropic.js";

const router = Router();

const REGIOES_VALIDAS = [
  "Serra Gaúcha",
  "Aparados da Serra",
  "Missões Jesuíticas",
  "Pampa e Fronteira",
  "Litoral Gaúcho",
  "Litoral Norte",
  "Porto Alegre",
  "Região Central",
  "Caminhos de Pedra",
];

const EVENTOS_POR_REGIAO = {
  "Litoral Norte": [
    {
      nome: "34ª Festa Nacional do Peixe",
      local: "Parque Municipal de Eventos Dr. Eliseu Lemos Padilha, Tramandaí/RS",
      periodo: "25 de junho a 19 de julho de 2026",
      descricao:
        "A maior festa gastronômica do Rio Grande do Sul. Prato símbolo: Tainha Assada na Brasa, servida todo dia a partir das 10h. Quinta e sexta com entrada gratuita. Shows nacionais: Armandinho (27/06), Menos é Mais (10/07) e Ana Castela (17/07). Também tem CTG Gaúcho Litorâneo, Torneiro de Bocha, Fest Doce, artesanato e o famoso Trapiche com vista pro Rio Tramandaí.",
      site: "https://festadopeixe.tramandai.rs.gov.br",
    },
  ],
};

const TURISMO_PROMPT = (regiao, eventos) => {
  const contextoEventos =
    eventos && eventos.length > 0
      ? `\n\nEVENTOS ACONTECENDO AGORA NA REGIÃO:\n${eventos
          .map(
            (e) =>
              `- ${e.nome} (${e.periodo}): ${e.descricao} | Site: ${e.site}`
          )
          .join("\n")}\n\nSe houver eventos, inclua o campo "evento_destaque" no JSON com as informações do evento mais relevante.`
      : "";

  return `Você é o GPTchê, guia turístico gaúcho especialista no Rio Grande do Sul. Fale SEMPRE com expressões gaúchas típicas e muito entusiasmo pela região.

A região solicitada é: ${regiao}${contextoEventos}

Responda SOMENTE em JSON válido, sem markdown, sem texto fora do JSON:
{
  "saudacao": "uma saudação gaúcha animada sobre essa região (1-2 frases)",
  "pontos": [
    {"nome": "nome do ponto turístico", "descricao": "descrição curta e animada de 1-2 frases no estilo gaúcho", "icone": "um emoji relevante"},
    {"nome": "...", "descricao": "...", "icone": "..."},
    {"nome": "...", "descricao": "...", "icone": "..."},
    {"nome": "...", "descricao": "...", "icone": "..."}
  ],
  "gastronomia": [
    {"prato": "nome do prato ou bebida típica", "dica": "dica curta no estilo gaúcho", "icone": "emoji"},
    {"prato": "...", "dica": "...", "icone": "..."},
    {"prato": "...", "dica": "...", "icone": "..."}
  ],
  "melhor_epoca": "quando visitar e por quê, em 1-2 frases no estilo gaúcho",
  "dica_gaucha": "uma dica especial 'de gaúcho pra gaúcho' que turista nenhum sabe, algo autêntico e local (2-3 frases)",
  "evento_destaque": {
    "nome": "nome do evento (só incluir se houver evento atual)",
    "periodo": "datas do evento",
    "descricao": "descrição animada no estilo gaúcho",
    "destaque": "o que não pode perder no evento",
    "site": "url do site oficial",
    "entrada_gratuita": true
  }
}

Obs: o campo "evento_destaque" só deve aparecer no JSON se houver um evento listado acima. Caso contrário, omita-o completamente.`;
};

router.post("/", async (req, res) => {
  const { regiao } = req.body;
  if (!regiao || !REGIOES_VALIDAS.includes(regiao)) {
    return res.status(400).json({ error: "Região inválida ou não encontrada." });
  }

  const eventos = EVENTOS_POR_REGIAO[regiao] || [];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1400,
    messages: [{ role: "user", content: TURISMO_PROMPT(regiao, eventos) }],
  });

  const text = response.content.map((b) => b.text || "").join("");
  try {
    const guia = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json({ guia });
  } catch {
    res.status(500).json({ error: "Bah, o guia saiu torto. Tenta de novo, tchê!" });
  }
});

export default router;