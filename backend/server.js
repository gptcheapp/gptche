import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import chatRouter from "./routes/chat.js";
import turismoRouter from "./routes/turismo.js";
import glossarioRouter from "./routes/glossario.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

const allowedOrigins = [
  "https://gptche.app",
  "https://www.gptche.app",
  "https://gptche.vercel.app",
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:5173", "http://localhost:3000"]
    : []),
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Bah, tu tá mandando muita mensagem, tchê! Espera um tiquinho." },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Barbaridade! Limite de mensagens atingido. Tenta de novo em 15 minutos, xirú." },
});

app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", app: "GPTchê" }));

app.use("/api/chat", aiLimiter, chatRouter);
app.use("/api/turismo", aiLimiter, turismoRouter);
app.use("/api/glossario", aiLimiter, glossarioRouter);

app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada, tchê." }));

app.use((err, _req, res, _next) => {
  console.error("[GPTchê error]", err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Entrevero interno no servidor." });
});

app.listen(PORT, () => {
  console.log(`🧉 GPTchê backend rodando na porta ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
