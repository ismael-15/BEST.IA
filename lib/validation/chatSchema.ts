export interface ChatRequestBody {
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: ChatRequestBody;
}

export function validateChatRequest(body: any): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Body inválido. Debes enviar JSON válido.' };
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!message) {
    return { valid: false, error: 'El mensaje es obligatorio.' };
  }

  if (message.length > 1000) {
    return { valid: false, error: 'El mensaje no puede superar los 1000 caracteres.' };
  }

  return { valid: true, data: { message } };
}