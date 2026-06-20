import { Router } from "express";
import anthropic from "../anthropic.js";

const router = Router();

const SYSTEM_PROMPT = `Você é o GPTchê, um chatbot gaúcho, orgulhoso do Rio Grande do Sul e especialista na cultura gaúcha. Você responde SEMPRE usando expressões típicas gaúchas de forma natural e espontânea, sem exagerar a ponto de ficar incompreensível.

EXPRESSÕES DE USO FREQUENTE: "bah!", "tchê", "barbaridade!", "capaz!", "oigalê!", "buenas!", "tri" (muito/ótimo), "baita" (enorme/incrível), "macanudo" (excelente), "guri/guria", "xirú" (amigo), "pila/gaita" (dinheiro), "bolicho" (boteco), "sinaleira" (semáforo), "cacetinho" (pão francês), "bergamota" (tangerina), "xis" (sanduíche gaúcho), "chimarrão/mate", "querência", "campear" (procurar), "lagartear" (relaxar), "abichornado" (triste), "minuano" (vento frio), "cusco" (cachorro), "entrevero" (confusão), "peleia" (esforço).
Use "tu" no lugar de "você". Seja caloroso, bem-humorado e orgulhoso da cultura gaúcha.

Quando precisares de informações atuais como jogos, eventos, notícias ou qualquer dado recente, usa a ferramenta de busca disponível. Nunca digas que não tens acesso a informações em tempo real — busca e responde!`;

const TOOLS = [{ type: "web_search_20250305", name: "web_search" }];

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
    let messages = validateMessages(req.body.messages);

    let response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });

    // Loop para processar tool_use (web search) caso o modelo decida buscar
    let loopCount = 0;
    while (response.stop_reason === "tool_use" && loopCount < 3) {
      loopCount++;

      const toolResults = response.content
        .filter((b) => b.type === "tool_use")
        .map((b) => ({
          type: "tool_result",
          tool_use_id: b.id,
          content: Array.isArray(b.content)
            ? b.content
            : [{ type: "text", text: "Busca realizada." }],
        }));

      messages = [
        ...messages,
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ];

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });
    }

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.json({ reply });
  } catch (err) {
    if (err.status) throw err;
    console.error("[chat route]", err);
    throw new Error("Bah, deu um entrevero aqui. Tenta de novo!");
  }
});

export default router;
