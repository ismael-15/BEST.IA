const CRISIS_KEYWORDS = [
  'suicidio',
  'muerte',
  'autolesión',
  'autolesion',
  'quiero morir',
  'me quiero morir',
  'quiero desaparecer',
  'desaparecer',
  'no aguanto',
  'no aguanto más',
  'no aguanto mas',
  'quiero acabar con todo',
  'hacerme daño',
  'hacerme dano',
  'lastimarme',
];

export async function analyzeEmotion(content: string) {
  try {
    const res = await fetch(`${process.env.PYSENTIMIENTO_API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }),
    });

    if (!res.ok) {
      throw new Error(`Error analizando emoción: ${res.status}`);
    }

    const data = await res.json();

    return {
      emotion: data.emotion || 'neutral',
      emotionScore: Number(data.score || data.emotionScore || 0.5),
    };
  } catch (error) {
    console.error('Error en analyzeEmotion:', error);

    return {
      emotion: 'neutral',
      emotionScore: 0.5,
    };
  }
}

export function detectCrisis(
  message: string,
  emotion: string,
  emotionScore: number
) {
  const normalized = message.toLowerCase().trim();

  const hasKeyword = CRISIS_KEYWORDS.some((keyword) =>
    normalized.includes(keyword)
  );

  if (hasKeyword) {
    return true;
  }

  const severeEmotion =
    ['sadness', 'fear', 'anger', 'anxiety', 'depression'].includes(
      (emotion || '').toLowerCase()
    ) && Number(emotionScore || 0) >= 0.92;

  if (severeEmotion) {
    return true;
  }

  return false;
}