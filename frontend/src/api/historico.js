import { supabase, getDeviceId } from '../lib/supabase.js';

// ── Chat ──────────────────────────────────────────────
export async function salvarMensagem(role, content) {
  const deviceId = getDeviceId();
  const { error } = await supabase
    .from('mensagens_chat')
    .insert({ device_id: deviceId, role, content });
  if (error) console.error('Erro ao salvar mensagem:', error.message);
}

export async function buscarHistoricoChat() {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('mensagens_chat')
    .select('role, content, created_at')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Erro ao buscar historico:', error.message);
    return [];
  }
  return data;
}

// ── Glossário ─────────────────────────────────────────
export async function salvarBuscaGlossario(termo, resultado) {
  const deviceId = getDeviceId();
  const { error } = await supabase
    .from('buscas_glossario')
    .insert({ device_id: deviceId, termo, resultado });
  if (error) console.error('Erro ao salvar busca:', error.message);
}

export async function buscarHistoricoGlossario() {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('buscas_glossario')
    .select('termo, created_at')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(8);
  if (error) {
    console.error('Erro ao buscar historico glossario:', error.message);
    return [];
  }
  return data;
}

// ── Turismo ───────────────────────────────────────────
export async function salvarRegiaoVisitada(regiaoId, regiaoNome) {
  const deviceId = getDeviceId();
  const { error } = await supabase
    .from('regioes_visitadas')
    .insert({ device_id: deviceId, regiao_id: regiaoId, regiao_nome: regiaoNome });
  if (error) console.error('Erro ao salvar regiao:', error.message);
}
