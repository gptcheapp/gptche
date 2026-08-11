import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL ou SUPABASE_ANON_KEY nao definida.");
}

// Client usado só para leitura server-side (ex: buscar preferências pra montar
// o system prompt). Escrita de preferências acontece direto do frontend.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
