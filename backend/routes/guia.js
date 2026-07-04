import { Router } from "express";
import anthropic from "../anthropic.js";

const router = Router();

const CIDADES_VALIDAS = [
  "Gramado","Canela","Bento Gonçalves","Nova Petrópolis","Caxias do Sul","Garibaldi","Carlos Barbosa","Flores da Cunha",
  "Cambará do Sul","São Francisco de Paula","Bom Jesus","São José dos Ausentes","Praia Grande",
  "São Miguel das Missões","Santo Ângelo","São Luiz Gonzaga","São Borja","Santiago","Jaguari","Nova Esperança do Sul",
  "Bagé","Caçapava do Sul","Santana do Livramento","Uruguaiana","Dom Pedrito","Alegrete","Quaraí","São Gabriel",
  "Torres","Capão da Canoa","Xangri-Lá","Imbé","Tramandaí","Cidreira","Osório",
  "Mostardas","Tavares","Rio Grande","Pelotas","São Lourenço do Sul","Palmares do Sul",
  "Porto Alegre","Viamão","São Leopoldo","Novo Hamburgo","Canoas","Gravataí","Cachoeirinha",
  "Santa Maria","Mata","Cachoeira do Sul","São João do Polêsine","Silveira Martins","Nova Palma",
  "Restinga Sêca","Agudo","Dona Francisca","Faxinal do Soturno","Ivorá","Pinhal Grande",
];

const GUIA_PROMPT = (cidade, regiao) => `Você é o GPTchê, guia turístico gaúcho especialista no Rio Grande do Sul. Fale SEMPRE com expressões gaúchas típicas e muito entusiasmo pela região. Use "tu" no lugar de "você".

A cidade solicitada é: ${cidade} (região: ${regiao})

INSTRUÇÕES ESPECIAIS:
- Se a cidade for Porto Alegre, inclua na dica_local algo sobre o orgulho porto-alegrense, o pôr do sol no Guaíba que não é rio nem lago, e a expressão "Porto é bem melior néaahh" — no tom de quem foi embora e sente saudade mas não abre mão do orgulho.
- Inclua o campo "destaques" APENAS se a cidade tiver algo genuinamente extraordinário: título UNESCO, recorde mundial, evento de relevância nacional ou patrimônio histórico excepcional. Exemplos válidos: Caçapava do Sul (Geoparque Mundial UNESCO), São Miguel das Missões (Patrimônio da Humanidade UNESCO), Rio Grande (Praia do Cassino — uma das maiores praias do mundo), Pelotas (Fenadoce — maior feira de doces do Brasil), Nova Esperança do Sul (Gruta N. Sra. de Fátima — caverna de arenito para até mil pessoas). Se não houver algo nesse nível, omita o campo completamente — não invente destaques onde não existem.

Responda SOMENTE em JSON válido, sem markdown, sem texto fora do JSON:
{"saudacao":"saudação gaúcha animada e específica sobre essa cidade (1-2 frases)","sobre":"essência da cidade em 2-3 frases no estilo gaúcho — o que a torna única","destaques":[{"titulo":"nome do destaque especial","descricao":"por que é extraordinário, em 2-3 frases com orgulho gaúcho","icone":"emoji relevante"}],"pontos":[{"nome":"nome do ponto turístico","descricao":"descrição animada de 1-2 frases no estilo gaúcho","icone":"emoji relevante","tipo":"natureza | cultura | historia | gastronomia | aventura"}],"gastronomia":[{"prato":"nome do prato ou bebida típica","onde":"dica de onde encontrar ou como é servido localmente","icone":"emoji"}],"melhor_epoca":"quando visitar e por quê, em 1-2 frases no estilo gaúcho","como_chegar":"dica prática de acesso por rodovia ou transporte — informação geral sujeita a alterações","dica_local":"dica autêntica de gaúcho que conhece a cidade de verdade — algo que turista nenhum sabe, 2-3 frases"}`;

router.post("/", async (req, res) => {
  const { cidade, regiao } = req.body;
  if (!cidade || !CIDADES_VALIDAS.includes(cidade)) {
    return res.status(400).json({ error: "Cidade inválida ou não encontrada." });
  }
  if (!regiao) {
    return res.status(400).json({ error: "Região não informada." });
  }
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: GUIA_PROMPT(cidade, regiao) }],
    });
    const text = response.content.map((b) => b.text || "").join("");
    try {
      const guia = JSON.parse(text.replace(/```json|```/g, "").trim());
      res.json({ guia });
    } catch {
      res.status(500).json({ error: "Bah, o guia saiu torto. Tenta de novo, tchê!" });
    }
  } catch (err) {
    console.error("[guia route]", err);
    res.status(500).json({ error: "Bah, deu um entrevero aqui. Tenta de novo!" });
  }
});

export default router;
