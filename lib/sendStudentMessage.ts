import { supabase } from '@/lib/supabase';
import { getOrCreateActiveSession } from '@/lib/chatSession';
//import { analyzeEmotion, detectCrisis } from '@/lib/emotion';

export async function sendStudentMessage(content: string, studentId: string) {  const session = await getOrCreateActiveSession(studentId);

  /*Analizamos el mensaje antes de guardarlo para evitar que quede como "pending".
  const emotionResult = await analyzeEmotion(content);

  const crisisDetected = detectCrisis(
    content,
    emotionResult.emotion,
    emotionResult.emotionScore
  );
*/
  const payload = {
    session_id: session.id,
    user_id: studentId,
    content,
    role: 'user',
    emotion: 'neutral',
    emotion_score: 0,
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
  console.log('Payload enviado a Supabase para actualizar usuario:', {
  messageId,
  studentId,
  emotion,
  emotionScore,
  crisisDetected,
});

const { data: updatedMessage, error: updateError } = await supabase
  .from('messages')
  .update({
    emotion,
    emotion_score: emotionScore,
    crisis_detected: crisisDetected,
  })
  .eq('id', messageId)
  .select('id, role, emotion, emotion_score, crisis_detected')
  .maybeSingle();

if (updateError) {
  console.error('Error actualizando análisis del mensaje:', updateError);
  return;
}

if (!updatedMessage) {
  console.error('No se actualizo ningun mensaje', {
    messageId,
    studentId,
  });
  return;
}

console.log('Mensaje de usuario actualizado correctamente:', updatedMessage);

  if (!crisisDetected) return;

  const { data: existingAlert, error: existingAlertError } = await supabase
    .from('alerts')
    .select('id')
    .eq('message_id', messageId)
    .maybeSingle();

  if (existingAlertError) {
    console.error('Error comprobando alerta existente:', existingAlertError);
    return;
  }

  if (existingAlert) {
    return;
  }

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

  const now = new Date().toISOString();

  const alertPayload = {
    message_id: messageId,
    student_id: studentId,
    psychologist_id: psychologist.id,
    status: 'pending',
    notes: '',
    created_at: now,
    updated_at: now,
  };

  const { error: alertError } = await supabase
    .from('alerts')
    .insert(alertPayload);

  if (alertError) {
    console.error('Error creando alerta:', alertError);
  }
}