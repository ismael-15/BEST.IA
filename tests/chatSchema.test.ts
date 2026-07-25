import { validateChatRequest } from '@/lib/validation/chatSchema';

describe('validateChatRequest', () => {
  it('rechaza un body vacío', () => {
    const result = validateChatRequest({});
    expect(result.valid).toBe(false);
    expect(result.error).toBe('El mensaje es obligatorio.');
  });

  it('rechaza un body que no es objeto', () => {
    const result = validateChatRequest(null);
    expect(result.valid).toBe(false);
  });

  it('acepta un mensaje válido', () => {
    const result = validateChatRequest({ message: 'me siento agotado' });
    expect(result.valid).toBe(true);
    expect(result.data?.message).toBe('me siento agotado');
  });

  it('rechaza un mensaje demasiado largo', () => {
    const longMessage = 'a'.repeat(1001);
    const result = validateChatRequest({ message: longMessage });
    expect(result.valid).toBe(false);
  });
});