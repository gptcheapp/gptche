import { Router } from "express";
import { ElevenLabsClient } from "elevenlabs";

const router = Router();

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const VOICE_ID = "W7t9oLns7EqMdVWmwGUE";

const VOICE_SETTINGS = {
  stability: 0.72,
  similarity_boost: 0.60,
  style: 0.25,
  use_speaker_boost: true,
};

// Ajustes fonéticos — corrige pronúncias que o modelo de voz erra
// "GPTchê" era lido separado (GPT - chê); "Gepetchê" soa corrido e correto
function aplicarAjustesFoneticos(texto) {
  return texto.replace(/GPTch[eê]/gi, "Gepetchê");
}

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Texto inválido ou ausente." });
  }

  if (text.length > 2500) {
    return res.status(400).json({ error: "Texto muito longo para síntese de voz." });
  }

  try {
    const textoParaVoz = aplicarAjustesFoneticos(text.trim());

    const audioStream = await client.textToSpeech.convert(VOICE_ID, {
      text: textoParaVoz,
      model_id: "eleven_multilingual_v2",
      voice_settings: VOICE_SETTINGS,
      output_format: "mp3_44100_128",
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache");

    // SDK novo retorna Web ReadableStream — converte pra Buffer e envia
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    res.end(buffer);

  } catch (err) {
    console.error("[ElevenLabs] Erro na chamada da API:", err);
    return res.status(500).json({ error: "Erro ao sintetizar voz. Tenta de novo, tchê!" });
  }
});

export default router;
