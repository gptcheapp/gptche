import { Router } from "express";
import anthropic from "../anthropic.js";
import { VERBETES_ANCORA } from "../data/glossarioTermos.js";

const router = Router();

const GLOSSARIO_PROMPT = (palavra) =>
  `Você é o GPTchê, especialista em cultura e linguagem gaúcha do Rio Grande do Sul.
O usuário buscou pela palavra/expressão: "${palavra}"

CRITÉRIOS DE CLASSIFICAÇÃO — use SEMPRE estes critérios, sem variação:
- "Cotidiano": uso urbano atual, qualquer gaúcho jovem conhece e usa no dia a dia
- "Regional": mais rural, de faixa etária mais velha ou de regiões específicas do RS
- "CTG/Tradicional": vocabulário do movimento nativista, lida campeira, Semana Farroupilha, CTG

Responda SOMENTE em JSON válido, sem markdown, sem texto fora do JSON:
{
  "encontrado": true,
  "termo": "palavra ou expressão exata",
  "categoria": "uma de: Interjeição | Substantivo | Adjetivo | Verbo | Expressão | Ditado",
  "nivel": "uma de: Cotidiano | Regional | CTG/Tradicional",
  "significado": "definição clara e objetiva em 1-2 frases",
  "exemplo": "uma frase de exemplo usando o termo naturalmente",
  "curiosidade": "uma curiosidade cultural ou histórica curta",
  "gptche_diz": "uma frase curta no estilo bem-humorado do GPTchê"
}
Se não encontrar: { "encontrado": false, "sugestao": "termo parecido se houver" }`;

router.post("/", async (req, res) => {
  const { palavra } = req.body;

  if (!palavra || typeof palavra !== "string" || palavra.trim().length === 0) {
    return res.status(400).json({ error: "Palavra não informada." });
  }

  const termo = palavra.trim().slice(0, 100);

  // Verbete âncora: retorna direto, sem chamar a API
  const ancora = VERBETES_ANCORA[termo.toLowerCase()];
  if (ancora) {
    return res.json({
      resultado: {
        encontrado: true,
        termo,
        ...ancora,
      },
    });
  }

  // Palavra comum: chama a API com critérios de classificação fixos
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 600,
      messages: [{ role: "user", content: GLOSSARIO_PROMPT(termo) }],
    });

    const text = response.content.map((b) => b.text || "").join("");

    try {
      const resultado = JSON.parse(text.replace(/```json|```/g, "").trim());
      res.json({ resultado });
    } catch {
      res.status(500).json({ error: "Bah, não consegui campear essa palavra direito. Tenta de novo!" });
    }
  } catch (err) {
    console.error("[glossario route]", err);
    res.status(500).json({ error: "Bah, deu um entrevero aqui. Tenta de novo!" });
  }
});

export default router;
