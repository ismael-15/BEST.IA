import { supabase } from '@/lib/supabase';

export async function saveBotMessage(
  sessionId: string,
  assistantText: string,
  userId: string,
  emotion: string = 'neutral',
  emotionScore: number = 0,
  crisisDetected: boolean = false
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      content: assistantText,
      role: 'assistant',
      emotion,
      emotion_score: emotionScore,
      crisis_detected: crisisDetected,
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