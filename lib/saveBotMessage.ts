import { supabase } from '@/lib/supabase';

export async function saveBotMessage(
  sessionId: string,
  assistantText: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      content: assistantText,
      role: 'assistant',
      emotion: 'neutral',
      emotion_score: 0,
      crisis_detected: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error guardando respuesta IA:', error);
    throw error;
  }

  return data;
}