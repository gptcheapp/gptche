import { supabase, getDeviceId } from '../lib/supabase.js';

// Preferências genéricas por device_id (par chave/valor), mesmo padrão de historico.js
// — chama o Supabase direto, sem passar pela API Express.

export async function salvarPreferencia(chave, valor) {
  const deviceId = getDeviceId();
  const { error } = await supabase
    .from('preferencias')
    .upsert(
      { device_id: deviceId, chave, valor, updated_at: new Date().toISOString() },
      { onConflict: 'device_id,chave' }
    );
  if (error) console.error('Erro ao salvar preferencia:', error.message);
  return !error;
}

export async function buscarPreferencia(chave) {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('preferencias')
    .select('valor')
    .eq('device_id', deviceId)
    .eq('chave', chave)
    .maybeSingle();
  if (error) {
    console.error('Erro ao buscar preferencia:', error.message);
    return null;
  }
  return data?.valor ?? null;
}
