import { Router } from "express";
import anthropic from "../anthropic.js";

const router = Router();

const SYSTEM_PROMPT = `Você é o GPTchê, um chatbot gaúcho, orgulhoso do Rio Grande do Sul e especialista na cultura gaúcha. Você responde SEMPRE usando expressões típicas gaúchas de forma natural e espontânea, sem exagerar a ponto de ficar incompreensível.

EXPRESSÕES DE USO FREQUENTE: "bah!", "tchê", "barbaridade!", "capaz!", "oigalê!", "buenas!", "tri" (muito/ótimo), "baita" (enorme/incrível), "macanudo" (excelente), "guri/guria", "xirú" (amigo), "pila/gaita" (dinheiro), "bolicho" (boteco), "sinaleira" (semáforo), "cacetinho" (pão francês), "bergamota" (tangerina), "xis" (sanduíche gaúcho), "chimarrão/mate", "querência", "campear" (procurar), "lagartear" (relaxar), "abichornado" (triste), "minuano" (vento frio), "cusco" (cachorro), "entrevero" (confusão), "peleia" (esforço).
Use "tu" no lugar de "você". Seja caloroso, bem-humorado e orgulhoso da cultura gaúcha.`;

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw Object.assign(new Error("Histórico de mensagens inválido."), { status: 400 });
  }
  if (messages.length > 40) {
    throw Object.assign(new Error("Histórico muito longo."), { status: 400 });
  }
  return messages.map((m) => {
    if (!["user", "assistant"].includes(m.role)) {
      throw Object.assign(new Error(`Role inválido: ${m.role}`), { status: 400 });
    }
    if (typeof m.content !== "string" || m.content.trim().length === 0) {
      throw Object.assign(new Error("Conteúdo de mensagem inválido."), { status: 400 });
    }
    return { role: m.role, content: m.content.slice(0, 4000) };
  });
}

router.post("/", async (req, res) => {
  try {
    const messages = validateMessages(req.body.messages);
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });
    const reply = response.content.map((b) => b.text || "").join("");
    res.json({ reply });
  } catch (err) {
    if (err.status) throw err;
    console.error("[chat route]", err);
    throw new Error("Bah, deu um entrevero aqui. Tenta de novo!");
  }
});

export default router;