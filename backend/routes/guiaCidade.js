// backend/routes/guiaCidade.js
//
// Guia por Cidade — Opção B: dado estático, sem chamada à API do Claude.
// Cada cidade já vem 100% pesquisada e escrita (JSON em ../data/guiaCidades.json).
// Isso zera custo de API por clique e elimina risco de alucinação nas cidades cobertas.
//
// Cidades fora da lista simplesmente não existem no guia — não há fallback que gera
// conteúdo livre. Se o produto crescer pra mais cidades, a forma correta é pesquisar
// e adicionar a entrada no JSON, não deixar o Claude inventar sob demanda.

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/guiaCidades.json");
const guiaCidades = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const router = express.Router();

// Remove itens de gastronomia marcados como "não verificado" antes de servir —
// esse texto é nota interna de produção, nunca deve chegar no app do usuário final.
function limparNaoVerificados(cidade) {
  return {
    ...cidade,
    gastronomia: (cidade.gastronomia || []).filter(
      (g) => !g.onde_comer?.toLowerCase().startsWith("não verificado")
    ),
  };
}

// GET /api/guia-cidade — lista resumida, pra montar o seletor de cidades no app
// (id, nome, região, se é destaque na home do Turismo)
router.get("/", (req, res) => {
  const lista = guiaCidades.map((c) => ({
    slug: c.slug,
    cidade: c.cidade,
    regiao: c.regiao,
    destaque_home: c.destaque_home?.sugerido ?? false,
  }));
  res.json({ cidades: lista });
});

// GET /api/guia-cidade/:slug — perfil completo de uma cidade
router.get("/:slug", (req, res) => {
  const cidade = guiaCidades.find((c) => c.slug === req.params.slug);
  if (!cidade) {
    return res.status(404).json({ erro: "Cidade não encontrada no Guia por Cidade" });
  }
  res.json(limparNaoVerificados(cidade));
});

export default router;
