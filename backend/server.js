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

app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = [
  "https://gptche.app",
  "https://www.gptche.app",
  "https://gptche.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
      return cb(new Error("CORS bloqueado"));
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
  message: { error: "Limite global atingido." },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Limite de mensagens atingido. Tenta em 15 minutos." },
});

app.use(globalLimiter);
app.use(express.json({ limit: "10kb" }));

app.get("/health", function(_req, res) {
  res.json({ status: "ok", app: "GPTche" });
});

app.use("/api/chat", aiLimiter, chatRouter);
app.use("/api/turismo", aiLimiter, turismoRouter);
app.use("/api/glossario", aiLimiter, glossarioRouter);

app.use(function(_req, res) {
  res.status(404).json({ error: "Rota nao encontrada." });
});

app.use(function(err, _req, res, _next) {
  console.error("[GPTche error]", err.message);
  var status = err.status || 500;
  res.status(status).json({ error: err.message || "Erro interno." });
});

app.listen(PORT, function() {
  console.log("GPTche backend rodando na porta " + PORT);
});
