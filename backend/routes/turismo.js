import { Router } from "express";
import anthropic from "../anthropic.js";

const router = Router();

const REGIOES_VALIDAS = [
  "Serra Gaúcha",
  "Aparados da Serra",
  "Missões Jesuíticas",
  "Pampa e Fronteira",
  "Litoral Gaúcho",
  "Porto Alegre",
  "Região Central",
  "Caminhos de Pedra",
];

const TURISMO_PROMPT = (regiao) => `Você é o GPTchê, guia turístico gaúcho especialista no Rio Grande do Sul. Fale SEMPRE com expressões gaúchas típicas e muito entusiasmo pela região.

A região solicitada é: ${regiao}

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
  "dica_gaucha": "uma dica especial 'de gaúcho pra gaúcho' que turista nenhum sabe, algo autêntico e local (2-3 frases)"
}`;

router.post("/", async (req, res) => {
  const { regiao } = req.body;
  if (!regiao || !REGIOES_VALIDAS.includes(regiao)) {
    return res.status(400).json({ error: "Região inválida ou não encontrada." });
  }
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
    messages: [{ role: "user", content: TURISMO_PROMPT(regiao) }],
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
