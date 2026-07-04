import { Router } from "express";
import anthropic from "../anthropic.js";

const router = Router();

// Verbetes âncora: definições fixas para expressões com história específica.
// Evitam que o modelo invente ou varie o significado em buscas repetidas.
const VERBETES_ANCORA = {
  "buenas e me espalho": {
    categoria: "Expressão",
    nivel: "Regional",
    significado: "Expressão de chegada animada e confiante, como quem entra num ambiente e logo se sente em casa. Carrega um tom de valentia e descontração.",
    exemplo: "Ele entrou na festa gritando 'buenas e me espalho!' e já foi puxando conversa com todo mundo.",
    curiosidade: "Imortalizou pelo escritor gaúcho Érico Veríssimo no personagem Capitão Rodrigo Cambará (O Tempo e o Vento). A frase completa é: 'Buenas e me espalho! Nos pequenos dou de prancha e nos grandes dou de talho!' — 'prancha' é bater com o lado plano do facão (só assustar) e 'talho' é o golpe de verdade.",
    gptche_diz: "Quando o gaúcho diz 'buenas e me espalho', tchê, não é pra sair — é pra chegar com tudo!",
  },
  "me caiu os butiá do bolso": {
    categoria: "Expressão",
    nivel: "Regional",
    significado: "Ficar extremamente surpreso ou chocado com algo inacreditável. Equivale a 'cair da cadeira' ou 'ficar de queixo caído'.",
    exemplo: "Quando ele me contou que vendeu a estância, me caiu os butiá do bolso, tchê!",
    curiosidade: "O butiá é um coquinho amarelo típico do pampa gaúcho. Antigamente os gaúchos carregavam esses coquinhos nos bolsos largos da bombacha para comer nas viagens. A ideia é que um susto tão grande fazia a pessoa estremecer, derrubando os butiás no chão.",
    gptche_diz: "Bah, quando isso acontece, nem o butiá aguenta no bolso!",
  },
  "não tá morto quem peleia": {
    categoria: "Ditado",
    nivel: "Regional",
    significado: "Ditado de resistência e esperança: enquanto a pessoa estiver lutando, ainda existe chance de virar o jogo. Equivale a 'enquanto há vida há esperança'.",
    exemplo: "O time tá perdendo de dois a zero, mas não tá morto quem peleia — ainda tem o segundo tempo!",
    curiosidade: "Expressão muito usada na música nativista gaúcha e no campo para encorajar quem enfrenta dificuldades financeiras, climáticas ou pessoais. Peleia vem de 'pelear' (espanhol platino), que significa lutar, batalhar.",
    gptche_diz: "Esse ditado é a alma do gaúcho, tchê — bagual não se afrouxa!",
  },
  "preteou o olho da gateada": {
    categoria: "Expressão",
    nivel: "Regional",
    significado: "A situação se complicou, ficou tensa ou saiu do controle. Usado quando algo toma um rumo perigoso e exige atenção redobrada.",
    exemplo: "A negociação tava indo bem, mas preteou o olho da gateada quando ele viu o preço.",
    curiosidade: "A 'gateada' é uma pelagem do cavalo crioulo — marrom-amarelada com extremidades mais escuras. Quando o cavalo está assustado ou acuado, as pupilas dilatam e os olhos ficam totalmente escuros ('preteiam'). A expressão compara uma pessoa diante de um grande problema com esse cavalo em estado de alerta máximo.",
    gptche_diz: "Quando preteou o olho da gateada, tchê, é hora de segurar as rédeas!",
  },
  "faca na bota": {
    categoria: "Expressão",
    nivel: "Regional",
    significado: "Pessoa de atitude firme, valente e de pavio curto. Alguém que não leva desaforo para casa e está sempre pronto para resolver qualquer situação.",
    exemplo: "Cuidado com ela, é guria faca na bota — não aceita injustiça de ninguém.",
    curiosidade: "Desde o século XIX viajantes como Jean-Baptiste Debret registravam em pinturas o hábito gaúcho de carregar uma faca na parte interna da bota. Na lida campeira, se o peão caísse do cavalo era mais rápido sacar a faca da bota do que da cintura. Hoje a expressão saiu do campo para a vida urbana.",
    gptche_diz: "Gaúcho faca na bota não precisa falar alto, tchê — o silêncio já avisa!",
  },
  "frio de renguear cusco": {
    categoria: "Expressão",
    nivel: "Cotidiano",
    significado: "Frio intensíssimo, tão rigoroso que seria capaz de entortar até um cachorro. A expressão mais icônica para descrever o inverno gaúcho.",
    exemplo: "Bah, hoje tá frio de renguear cusco — botei três cobertores e ainda tô tremendo!",
    curiosidade: "Rengo significa algo torto ou capenga em gauchês. Cusco é como os gaúchos chamam os cachorros. A imagem é cômica e exagerada: um frio tão bravo que até os cachorros ficariam tortos de tanto tremer.",
    gptche_diz: "Quando tá frio de renguear cusco, tchê, nem o minuano avisa — ele simplesmente chega!",
  },
  "capaz / bem capaz": {
    categoria: "Interjeição",
    nivel: "Cotidiano",
    significado: "Expressão de negação enfática ('de jeito nenhum', 'jamais') ou de incredulidade ('não acredito'). Também pode funcionar como modéstia ao receber um elogio ('imagina, não é pra tanto').",
    exemplo: "Vai na festa hoje? — Bem capaz! Tô morto de cansado.",
    curiosidade: "A ambiguidade é a graça: o mesmo 'bem capaz' pode ser uma recusa firme, uma expressão de espanto ou até um agradecimento modesto. O tom de voz e o contexto definem tudo — é um dos regionalismos mais fascinantes do Sul do Brasil.",
    gptche_diz: "Capaz que tu vai entender o 'bem capaz' na primeira vez, tchê — precisa ouvir bastante!",
  },
  "talagaço": {
    categoria: "Substantivo",
    nivel: "Cotidiano",
    significado: "O ato de tomar algo de uma vez só, num único gole longo e decidido. Também usado para descrever qualquer ação feita de uma vez com força e determinação.",
    exemplo: "Ele chegou na mesa, deu um talagaço no mate e foi embora sem dizer nada.",
    curiosidade: "Expressão muito associada ao churrasco e ao chimarrão gaúcho. Revela o jeito direto e sem enrolação do gaúcho — quando quer, faz de uma vez.",
    gptche_diz: "Gaúcho não toma em golinho, tchê — dá o talagaço e segue em frente!",
  },
  "ginete": {
    categoria: "Substantivo",
    nivel: "CTG/Tradicional",
    significado: "Cavaleiro habilidoso que monta com destreza e elegância. O ginete domina o cavalo com maestria, seja no trabalho do campo ou nas competições.",
    exemplo: "O guri virou um ginete de respeito — nenhum potro consegue derrubá-lo.",
    curiosidade: "Ser chamado de ginete é um dos maiores elogios na cultura gaúcha. A habilidade com os cavalos sempre foi símbolo de status e identidade no RS. Nos CTGs, as provas de gineteada e rodeio celebram essa tradição.",
    gptche_diz: "Bah, ginete de verdade não domina o cavalo pela força, tchê — domina pelo respeito!",
  },
  "chasque": {
    categoria: "Substantivo",
    nivel: "CTG/Tradicional",
    significado: "Mensageiro ou a própria mensagem enviada — um aviso, convite ou carta. Hoje usado no sentido de recado ou notícia importante.",
    exemplo: "Chegou um chasque do estancieiro chamando todos para o rodeio no sábado.",
    curiosidade: "Na época das guerras e das estâncias do século XIX, os chasques eram mensageiros a cavalo que levavam recados urgentes entre as fazendas e acampamentos. A palavra vem do espanhol platino 'chasqui', de origem quéchua (mensageiro do Império Inca).",
    gptche_diz: "Hoje em dia o chasque chegou pelo WhatsApp, tchê — mas o gaúcho ainda chama de chasque!",
  },
  "pandorga": {
    categoria: "Substantivo",
    nivel: "Cotidiano",
    significado: "Pipa ou papagaio — o brinquedo de papel e varetas que voa no vento preso a um cordão.",
    exemplo: "No fim de semana levei meu guri soltar pandorga no campo — ele ficou a tarde toda lá.",
    curiosidade: "Enquanto o resto do Brasil chama de pipa ou papagaio, no Rio Grande do Sul é pandorga. A palavra é de origem portuguesa e remete à tradição das crianças gaúchas brincando nos campos abertos com o vento do sul.",
    gptche_diz: "Pandorga no céu azul do RS, tchê — isso é infância gaúcha de verdade!",
  },
  "pilcha": {
    categoria: "Substantivo",
    nivel: "CTG/Tradicional",
    significado: "O traje típico completo do gaúcho — bombacha, camisa, bota campeira, lenço, guaiaca e chapéu. Vestir a pilcha é honrar a tradição gaúcha.",
    exemplo: "Na Semana Farroupilha todo mundo veste a pilcha completa para os desfiles e bailes.",
    curiosidade: "Cada peça da pilcha tem regras e significados na tradição CTG. A cor do lenço, o tipo de chapéu e o estilo da guaiaca variam por região e ocasião. Existem manuais de pilcha publicados pelo MTG (Movimento Tradicionalista Gaúcho) que regulamentam o vestuário.",
    gptche_diz: "Gaúcho de pilcha completa, tchê, não precisa dizer de onde é — o traje já conta a história!",
  },
  "prenda": {
    categoria: "Substantivo",
    nivel: "CTG/Tradicional",
    significado: "A mulher gaúcha prendada — habilidosa, elegante e conhecedora das tradições. No CTG, a prenda é a dançarina que faz par com o peão nas danças tradicionais.",
    exemplo: "A prenda do CTG ganhou o primeiro lugar na invernada artística de Porto Alegre.",
    curiosidade: "O título de prenda no CTG não é só estético — exige conhecimento das danças, da história gaúcha e do uso correto da pilcha feminina. As competições entre prendas e peões são uma das principais atividades dos CTGs espalhados pelo mundo.",
    gptche_diz: "Prenda gaúcha é garra e tradição, tchê — não é à toa que o RS tem CTG até na China!",
  },
};

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
