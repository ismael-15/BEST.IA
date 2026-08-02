'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Send,
  Plus,
  Menu,
  Settings,
  LogOut,
  Paperclip,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getOrCreateActiveSession } from '@/lib/chatSession';
import { sendStudentMessage } from '@/lib/sendStudentMessage';
import { saveBotMessage } from '@/lib/saveBotMessage';

interface Message {
  id: string;
  sessionId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
  pending?: boolean;
  blocked?: boolean;
  crisisDetected?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
}

export default function ChatPage() {
  const pathname = usePathname();

  const [userId, setUserId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [booting, setBooting] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const hardRedirect = (to: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== to) {
      window.location.replace(to);
    }
  };

  function stringifyError(error: any) {
    if (!error) return 'Error desconocido';
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }

  function normalizeMessageRole(dbRole: string): 'user' | 'assistant' {
    return dbRole === 'assistant' ? 'assistant' : 'user';
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function loadMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('id, session_id, role, content, created_at, emotion')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error cargando mensajes FULL:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        full: error,
      });
      setUiError('No se pudieron cargar los mensajes: ' + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            '¡Hola! Soy BEST.IA, tu asistente de bienestar emocional. ¿Cómo te sientes hoy? Estoy aquí para escucharte y apoyarte.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setMessages(
      data.map((msg: any) => ({
        id: msg.id,
        sessionId: msg.session_id,
        role: normalizeMessageRole(msg.role),
        content: msg.content,
        timestamp: new Date(msg.created_at),
        emotion: msg.emotion ?? undefined,
      }))
    );
  }

  async function loadSessions(userId: string) {
    const { data: userSessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Error cargando sesiones FULL:', {
        message: sessionsError.message,
        details: sessionsError.details,
        hint: sessionsError.hint,
        code: sessionsError.code,
        full: sessionsError,
      });
      setUiError('No se pudieron cargar las sesiones: ' + sessionsError.message);
      return;
    }

    setSessions(
      (userSessions || []).map((s: any) => ({
        id: s.id,
        title: s.title || 'Nueva conversación',
        createdAt: new Date(s.created_at),
      }))
    );
  }

  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      try {
        setBooting(true);
        setUiError(null);

        if (pathname !== '/chat') return;

        const { data: { session } = {}, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error('No se pudo obtener la sesión:', sessionError);
          hardRedirect('/auth/login');
          return;
        }

        if (!session?.user) {
          hardRedirect('/auth/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, email, role, full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error obteniendo perfil:', profileError);
          hardRedirect('/auth/login');
          return;
        }

        if (!profile) {
          setUiError('El usuario autenticado no tiene perfil en public.users.');
          hardRedirect('/auth/login');
          return;
        }

        if (profile.role === 'psychologist') {
          hardRedirect('/dashboard');
          return;
        }

        if (profile.role !== 'student') {
          setUiError('Este usuario no tiene permisos para acceder al chat.');
          hardRedirect('/auth/login');
          return;
        }

        if (!isMounted || window.location.pathname !== '/chat') return;

        setUserId(profile.id);
        setAuthChecked(true);

        const sessionData = await getOrCreateActiveSession(profile.id);

        if (!isMounted || window.location.pathname !== '/chat') return;

        setCurrentSessionId(sessionData.id);

        await loadSessions(profile.id);
        await loadMessages(sessionData.id);
      } catch (error: any) {
        console.error('Error inicializando chat FULL:', error);
        setUiError('No se pudo iniciar el chat: ' + stringifyError(error));
      } finally {
        if (isMounted && typeof window !== 'undefined' && window.location.pathname === '/chat') {
          setBooting(false);
        }
      }
    };

    initChat();

    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          hardRedirect('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profile) {
          hardRedirect('/auth/login');
          return;
        }

        if (profile.role === 'psychologist') {
          hardRedirect('/dashboard');
          return;
        }

        if (profile.role !== 'student') {
          hardRedirect('/auth/login');
          return;
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [pathname]);

  useEffect(() => {
    if (!currentSessionId || !authChecked) return;

    const channel = supabase
      .channel(`messages-${currentSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${currentSessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as any;

          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.id === newMessage.id ||
                (msg.pending &&
                  msg.content === newMessage.content &&
                  msg.role === normalizeMessageRole(newMessage.role))
            );

            if (exists) return prev;

            return [
              ...prev,
              {
                id: newMessage.id,
                sessionId: newMessage.session_id,
                role: normalizeMessageRole(newMessage.role),
                content: newMessage.content,
                timestamp: new Date(newMessage.created_at),
                emotion: newMessage.emotion ?? undefined,
              },
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSessionId, authChecked]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !userId || !currentSessionId) return;

    const currentInput = input.trim();
    setInput('');
    setLoading(true);
    setUiError(null);

    const tempUserId = `temp-user-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: tempUserId,
        role: 'user',
        content: currentInput,
        timestamp: new Date(),
        pending: true,
      },
    ]);

    try {
      const savedStudentMessage = await sendStudentMessage(currentInput, userId);
      const activeSessionId = savedStudentMessage?.session_id || currentSessionId;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempUserId
            ? {
                ...msg,
                id: savedStudentMessage.id,
                sessionId: savedStudentMessage.session_id,
                pending: false,
              }
            : msg
        )
      );

      if (activeSessionId && activeSessionId !== currentSessionId) {
        setCurrentSessionId(activeSessionId);
      }

      // No se crea ningún mensaje del asistente todavía.
      // Mientras loading = true, el JSX solo muestra los 3 puntos de "escribiendo".
      let assistantText =
        'Estoy aquí para acompañarte. ¿Quieres contarme un poco más sobre cómo te sientes?';
      let assistantEmotion: string | undefined;
      let assistantBlocked = false;
      let assistantCrisisDetected = false;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          console.error('Error respuesta /api/chat:', data);
          assistantText =
            data?.error || data?.detail || 'Ocurrió un error al generar la respuesta.';
        } else {
          assistantText = data?.content || data?.reply || assistantText;
          assistantEmotion = data?.emotion;
          assistantBlocked = !!data?.blocked;
          assistantCrisisDetected = !!data?.crisisDetected;
        }
      } catch (chatApiError: any) {
        console.error('Error llamando /api/chat:', chatApiError);
        assistantText = 'No pude contactar al chat en este momento. Intenta de nuevo.';
      }

      // Recién ahora se inserta el mensaje del asistente, ya con el contenido final.
      const tempAssistantId = `temp-assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: tempAssistantId,
          role: 'assistant',
          content: assistantText,
          timestamp: new Date(),
          emotion: assistantEmotion,
          blocked: assistantBlocked,
          crisisDetected: assistantCrisisDetected,
        },
      ]);

      if (activeSessionId) {
        const savedBot = await saveBotMessage(activeSessionId, assistantText, userId);

        if (savedBot) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistantId
                ? {
                    ...msg,
                    id: savedBot.id,
                    sessionId: savedBot.session_id,
                  }
                : msg
            )
          );
        }

        await loadMessages(activeSessionId);
        await loadSessions(userId);
      }
    } catch (error: any) {
      console.error('Error enviando mensaje FULL:', error);
      setUiError('Error enviando mensaje: ' + stringifyError(error));
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserId));
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    if (!userId) return;

    try {
      setUiError(null);

      const { data: newSession, error } = await supabase
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

      if (error) {
        console.error('Error creando nuevo chat FULL:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          full: error,
        });
        setUiError('No se pudo crear el nuevo chat: ' + error.message);
        return;
      }

      setCurrentSessionId(newSession.id);
      await loadSessions(userId);

      setMessages([
        {
          id: 'welcome-new',
          role: 'assistant',
          content:
            '¡Hola! Soy BEST.IA, tu asistente de bienestar emocional. ¿Cómo te sientes hoy? Estoy aquí para escucharte y apoyarte.',
          timestamp: new Date(),
        },
      ]);

      setInput('');
    } catch (error: any) {
      console.error('Error general creando chat:', error);
      setUiError('Error creando chat: ' + stringifyError(error));
    }
  };

  async function handleSelectSession(sessionId: string) {
    setCurrentSessionId(sessionId);
    setUiError(null);
    await loadMessages(sessionId);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    hardRedirect('/auth/login');
  }

  if (booting || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando chat...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-indigo-900 to-purple-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-purple-800">
          <h1 className="text-2xl font-bold">BEST.IA</h1>
          <p className="text-purple-200 text-sm mt-1">Tu acompañante emocional</p>
        </div>

        <button
          onClick={handleNewChat}
          className="m-4 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 smooth-transition font-semibold"
        >
          <Plus size={20} /> Nuevo Chat
        </button>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-3">
            Historial
          </p>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`w-full text-left p-3 rounded-lg smooth-transition text-sm truncate ${
                currentSessionId === session.id ? 'bg-purple-700' : 'hover:bg-purple-800'
              }`}
            >
              {session.title}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-purple-800 space-y-2">
          <button className="w-full flex items-center gap-2 p-3 hover:bg-purple-800 rounded-lg smooth-transition text-sm">
            <Settings size={18} /> Configuración
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-3 hover:bg-purple-800 rounded-lg smooth-transition text-sm"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="font-bold text-lg text-gray-900">Sesión de Apoyo Emocional</h2>
              <p className="text-sm text-gray-500">Conversación privada y segura</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 font-semibold">Psicólogo supervisando</span>
          </div>
        </div>

        {uiError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div className="text-sm whitespace-pre-wrap">{uiError}</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-primary text-white rounded-br-none'
                    : message.crisisDetected
                    ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-none card-shadow'
                    : message.blocked
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-bl-none card-shadow'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none card-shadow'
                } ${message.pending ? 'opacity-70' : ''}`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.emotion && message.role === 'assistant' && (
                  <p className="text-xs mt-2 opacity-70">Emoción detectada: {message.emotion}</p>
                )}
                <p className="text-xs mt-2 opacity-60">
                  {message.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none card-shadow">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button className="p-3 hover:bg-gray-100 rounded-lg smooth-transition text-gray-600">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Cuéntame cómo te sientes..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
            />
            <button className="p-3 hover:bg-gray-100 rounded-lg smooth-transition text-gray-600">
              <Smile size={20} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="p-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Tus conversaciones son privadas y seguras. Un psicólogo supervisa para tu seguridad.
          </p>
        </div>
      </div>
    </div>
  );
}