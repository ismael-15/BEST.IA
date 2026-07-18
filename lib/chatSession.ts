import { supabase } from '@/lib/supabase';

export async function getOrCreateActiveSession(userId: string) {
  const { data: existingSession, error: existingError } = await supabase
    .from('chat_sessions')
    .select('id, user_id, title, is_active, created_at, updated_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error('Error buscando sesión activa:', existingError);
    throw existingError;
  }

  if (existingSession) return existingSession;

  const { data: newSession, error: createError } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      title: 'Nueva conversación',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creando sesión:', createError);
    throw createError;
  }

  return newSession;
}