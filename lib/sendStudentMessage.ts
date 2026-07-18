import { supabase } from '@/lib/supabase';
import { getOrCreateActiveSession } from '@/lib/chatSession';

export async function sendStudentMessage(content: string, studentId: string) {
  const session = await getOrCreateActiveSession(studentId);

  const payload = {
    session_id: session.id,
    user_id: studentId,
    content,
    role: 'user',
    emotion: 'pending',
    emotion_score: null,
    crisis_detected: false,
    created_at: new Date().toISOString(),
  };

  const { data: insertedMessage, error: messageError } = await supabase
    .from('messages')
    .insert(payload)
    .select()
    .single();

  if (messageError) {
    console.error('Error guardando mensaje FULL:', {
      message: messageError.message,
      details: messageError.details,
      hint: messageError.hint,
      code: messageError.code,
      full: messageError,
    });

    throw new Error(
      `${messageError.message || 'Error insertando mensaje'} | code: ${
        messageError.code || 'sin_code'
      } | details: ${messageError.details || 'sin_details'}`
    );
  }

  const { error: sessionUpdateError } = await supabase
    .from('chat_sessions')
    .update({
      updated_at: new Date().toISOString(),
      is_active: true,
    })
    .eq('id', session.id);

  if (sessionUpdateError) {
    console.error('Error actualizando sesión:', {
      message: sessionUpdateError.message,
      details: sessionUpdateError.details,
      hint: sessionUpdateError.hint,
      code: sessionUpdateError.code,
      full: sessionUpdateError,
    });
  }

  return insertedMessage;
}

export async function updateMessageAnalysis(
  messageId: string,
  studentId: string,
  emotion: string,
  emotionScore: number,
  crisisDetected: boolean
) {
  const { error: updateError } = await supabase
    .from('messages')
    .update({
      emotion,
      emotion_score: emotionScore,
      crisis_detected: crisisDetected,
    })
    .eq('id', messageId);

  if (updateError) {
    console.error('Error actualizando análisis del mensaje:', updateError);
  }

  if (!crisisDetected) return;

  const { data: psychologist, error: psychologistError } = await supabase
    .from('users')
    .select('id, role, email')
    .eq('role', 'psychologist')
    .limit(1)
    .maybeSingle();

  if (psychologistError) {
    console.error('Error buscando psicólogo:', psychologistError);
    return;
  }

  if (!psychologist?.id) {
    console.warn('No existe psicólogo en users; no se crea alerta.');
    return;
  }

  const alertPayload = {
    message_id: messageId,
    student_id: studentId,
    psychologist_id: psychologist.id,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const { error: alertError } = await supabase.from('alerts').insert(alertPayload);

  if (alertError) {
    console.error('Error creando alerta:', alertError);
  }
}