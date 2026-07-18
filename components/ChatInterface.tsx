'use client';

import { useEffect, useState } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getOrCreateActiveSession } from '@/lib/chatSession';
import { sendStudentMessage } from '@/lib/sendStudentMessage';
import { saveBotMessage } from '@/lib/saveBotMessage';

interface ChatMessage {
  id: string;
  session_id?: string;
  content: string;
  role: string;
  created_at: string;
}

export default function ChatInterface() {
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let channel: any;

    const initChat = async () => {
      try {
        setBooting(true);
        setErrorMessage('');

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error('No hay usuario autenticado:', error);
          setErrorMessage('No hay usuario autenticado.');
          return;
        }

        setUserId(user.id);

        const session = await getOrCreateActiveSession(user.id);
        setSessionId(session.id);

        const { data: previousMessages, error: messagesError } = await supabase
          .from('messages')
          .select('id, session_id, content, role, created_at')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error cargando mensajes:', messagesError);
          setErrorMessage('No se pudieron cargar los mensajes previos.');
        }

        setMessages(previousMessages || []);

        channel = supabase
          .channel(`messages:${session.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `session_id=eq.${session.id}`,
            },
            (payload) => {
              setMessages((prev) => {
                const exists = prev.some((msg) => msg.id === payload.new.id);
                if (exists) return prev;
                return [...prev, payload.new as ChatMessage];
              });
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error inicializando chat:', error);
        setErrorMessage('No se pudo iniciar el chat.');
      } finally {
        setBooting(false);
      }
    };

    initChat();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  async function handleSend() {
    if (!input.trim() || !userId) return;

    setLoading(true);
    setErrorMessage('');

    const text = input.trim();
    setInput('');

    try {
      const savedStudentMessage = await sendStudentMessage(text, userId);

      const currentSessionId = savedStudentMessage.session_id || sessionId;
      if (currentSessionId) {
        setSessionId(currentSessionId);
      }

      const botResponse = await generateBotReply(text);

      if (currentSessionId) {
        await saveBotMessage(currentSessionId, botResponse, userId);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setErrorMessage('No se pudo enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  }

  async function generateBotReply(text: string) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      return data.reply || 'Estoy aquí para escucharte. ¿Quieres contarme un poco más?';
    } catch (error) {
      console.error('Error generando respuesta IA:', error);
      return 'Estoy aquí para escucharte. ¿Quieres contarme un poco más?';
    }
  }

  function formatTime(timestamp: string) {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }

  if (booting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Chat de Acompañamiento</h1>
            <p className="text-sm text-gray-600 mt-1">
              Espacio seguro para conversar con el agente de apoyo emocional.
            </p>
          </div>

          {errorMessage && (
            <div className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle size={18} className="mt-0.5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="h-[520px] overflow-y-auto px-6 py-6 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                <div>
                  <Bot className="mx-auto mb-3 text-indigo-400" size={36} />
                  <p className="font-medium">Todavía no hay mensajes.</p>
                  <p className="text-sm mt-1">Escribe para comenzar la conversación.</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isStudent = msg.role === 'student';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        isStudent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isStudent ? <User size={16} /> : <Bot size={16} />}
                        <span className="text-xs font-semibold opacity-80">
                          {isStudent ? 'Tú' : 'Agente IA'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[11px] mt-2 ${
                          isStudent ? 'text-indigo-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe cómo te sientes..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}