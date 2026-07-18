'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Send,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AlertItem {
  id: string;
  studentName: string;
  studentId: string;
  severity: 'critical' | 'high' | 'medium';
  message: string;
  emotion: string;
  emotionScore: number;
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  notes: string;
  messageId: string;
  sessionId: string;
}

interface StudentSession {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'idle' | 'offline';
  lastMessage: string;
  lastActivity: string;
  emotionTrend: string[];
}

interface DashboardStats {
  activeStudents: number;
  pendingAlerts: number;
  sessionsToday: number;
  resolutionRate: number;
}

export default function PsychologistDashboard() {
  const [psychologistId, setPsychologistId] = useState<string | null>(null);
  const [psychologistName, setPsychologistName] = useState('Psicólogo');
  const [authChecked, setAuthChecked] = useState(false);

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [students, setStudents] = useState<StudentSession[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [intervention, setIntervention] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    activeStudents: 0,
    pendingAlerts: 0,
    sessionsToday: 0,
    resolutionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(
      (alert) =>
        alert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [alerts, searchTerm]);

  const hardRedirect = (to: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== to) {
      window.location.replace(to);
    }
  };

  const loadAlerts = useCallback(async () => {
    if (!psychologistId) return;

    try {
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('id, message_id, student_id, psychologist_id, status, notes, created_at, updated_at')
        .eq('psychologist_id', psychologistId)
        .order('created_at', { ascending: false });

      if (alertsError || !alertsData?.length) {
        setAlerts([]);
        setSelectedAlert(null);
        return;
      }

      const messageIds = alertsData.map((a: any) => a.message_id).filter(Boolean);
      const studentIds = [...new Set(alertsData.map((a: any) => a.student_id).filter(Boolean))];

      let messagesMap = new Map<string, any>();
      let usersMap = new Map<string, any>();

      if (messageIds.length > 0) {
        const { data: messagesData } = await supabase
          .from('messages')
          .select('id, session_id, user_id, content, role, emotion, emotion_score, crisis_detected, created_at')
          .in('id', messageIds);

        messagesMap = new Map((messagesData || []).map((m: any) => [m.id, m]));
      }

      if (studentIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, email, full_name, role')
          .in('id', studentIds as string[]);

        usersMap = new Map((usersData || []).map((u: any) => [u.id, u]));
      }

      const mapped: AlertItem[] = alertsData.map((alert: any) => {
        const msg: any = messagesMap.get(alert.message_id);
        const student: any = usersMap.get(alert.student_id);

        return {
          id: alert.id,
          studentName: student?.full_name || student?.email || 'Estudiante',
          studentId: alert.student_id || '',
          severity: getSeverity(msg?.crisis_detected, msg?.emotion, msg?.emotion_score),
          message: msg?.content || 'Mensaje no disponible',
          emotion: msg?.emotion || 'neutral',
          emotionScore: Number(msg?.emotion_score || 0),
          timestamp: msg?.created_at || alert.created_at || new Date().toISOString(),
          status: normalizeAlertStatus(alert.status),
          notes: alert.notes || '',
          messageId: alert.message_id || '',
          sessionId: msg?.session_id || '',
        };
      });

      setAlerts(mapped);
      setSelectedAlert((prev) => mapped.find((a) => a.id === prev?.id) || mapped[0] || null);
    } catch (error) {
      console.error('loadAlerts crash:', error);
      setAlerts([]);
    }
  }, [psychologistId]);

  const loadStudents = useCallback(async () => {
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('id, email, full_name, role')
        .eq('role', 'student');

      if (studentsError || !studentsData?.length) {
        setStudents([]);
        return;
      }

      const studentIds = studentsData.map((s: any) => s.id);

      const { data: sessionsData } = await supabase
        .from('chat_sessions')
        .select('id, user_id, is_active, updated_at, created_at')
        .in('user_id', studentIds);

      const { data: messagesData } = await supabase
        .from('messages')
        .select('id, user_id, content, emotion, created_at')
        .in('user_id', studentIds)
        .order('created_at', { ascending: false });

      const sessionsByUser = new Map<string, any[]>();
      const messagesByUser = new Map<string, any[]>();

      (sessionsData || []).forEach((s: any) => {
        const arr = sessionsByUser.get(s.user_id) || [];
        arr.push(s);
        sessionsByUser.set(s.user_id, arr);
      });

      (messagesData || []).forEach((m: any) => {
        const arr = messagesByUser.get(m.user_id) || [];
        arr.push(m);
        messagesByUser.set(m.user_id, arr);
      });

      const mapped: StudentSession[] = studentsData.map((student: any) => {
        const userSessions = sessionsByUser.get(student.id) || [];
        const userMessages = messagesByUser.get(student.id) || [];
        const latestMessage = userMessages[0];
        const hasActiveSession = userSessions.some((s: any) => s.is_active === true);

        return {
          id: student.id,
          name: student.full_name || student.email || 'Sin nombre',
          email: student.email || '',
          status: hasActiveSession ? 'active' : getStudentStatus(latestMessage?.created_at),
          lastMessage: latestMessage?.content || 'Sin mensajes todavía',
          lastActivity: latestMessage?.created_at || '',
          emotionTrend: userMessages.slice(0, 3).map((m: any) => m.emotion || 'neutral'),
        };
      });

      setStudents(mapped);
    } catch (error) {
      console.error('loadStudents crash:', error);
      setStudents([]);
    }
  }, []);

  const loadStats = useCallback(async () => {
    if (!psychologistId) return;

    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: activeStudents } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: pendingAlerts } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('psychologist_id', psychologistId)
        .eq('status', 'pending');

      const { count: sessionsToday } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());

      const { count: totalAlerts } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('psychologist_id', psychologistId);

      const { count: resolvedAlerts } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('psychologist_id', psychologistId)
        .eq('status', 'resolved');

      setStats({
        activeStudents: activeStudents || 0,
        pendingAlerts: pendingAlerts || 0,
        sessionsToday: sessionsToday || 0,
        resolutionRate:
          totalAlerts && totalAlerts > 0
            ? Math.round(((resolvedAlerts || 0) / totalAlerts) * 100)
            : 0,
      });
    } catch (error) {
      console.error('loadStats crash:', error);
    }
  }, [psychologistId]);

  const loadDashboard = useCallback(async () => {
    if (!psychologistId) return;
    await Promise.all([loadAlerts(), loadStudents(), loadStats()]);
  }, [psychologistId, loadAlerts, loadStudents, loadStats]);

  useEffect(() => {
    let isMounted = true;

    const resolveDashboardAccess = async () => {
      try {
        setLoading(true);

        if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') return;

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error obteniendo sesión:', sessionError);
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
          console.error('No existe perfil en public.users para este usuario.');
          hardRedirect('/auth/login');
          return;
        }

        if (profile.role !== 'psychologist') {
          hardRedirect('/chat');
          return;
        }

        if (!isMounted) return;

        setPsychologistId(profile.id);
        setPsychologistName(profile.full_name || profile.email || 'Psicólogo');
        setAuthChecked(true);
      } catch (error) {
        console.error('Error cargando acceso al dashboard:', error);
        hardRedirect('/auth/login');
      } finally {
        if (isMounted && typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
          setLoading(false);
        }
      }
    };

    resolveDashboardAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        hardRedirect('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profile) {
        hardRedirect('/auth/login');
        return;
      }

      if (profile.role !== 'psychologist') {
        hardRedirect('/chat');
        return;
      }

      setPsychologistId(profile.id);
      setPsychologistName(profile.full_name || profile.email || 'Psicólogo');
      setAuthChecked(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authChecked || !psychologistId) return;

    let mounted = true;

    const run = async () => {
      try {
        await loadDashboard();
      } catch (e) {
        console.error('Fallo inicial dashboard:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    const alertsChannel = supabase
      .channel(`dashboard-alerts-${psychologistId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        async () => {
          await loadAlerts();
          await loadStats();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'alerts' },
        async () => {
          await loadAlerts();
          await loadStats();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel(`dashboard-messages-${psychologistId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async () => {
          await loadDashboard();
        }
      )
      .subscribe();

    const sessionsChannel = supabase
      .channel(`dashboard-sessions-${psychologistId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_sessions' },
        async () => {
          await loadDashboard();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_sessions' },
        async () => {
          await loadDashboard();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(sessionsChannel);
    };
  }, [authChecked, psychologistId, loadDashboard, loadAlerts, loadStats]);

  async function handleAcknowledgeAlert(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'acknowledged', updated_at: new Date().toISOString() })
      .eq('id', alertId);

    if (error) console.error('Error reconociendo alerta:', error);
    await loadDashboard();
  }

  async function handleResolveAlert(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('id', alertId);

    if (error) console.error('Error resolviendo alerta:', error);
    await loadDashboard();
  }

  async function handleSendIntervention() {
    if (!intervention.trim() || !selectedAlert) return;

    const mergedNotes = selectedAlert.notes
      ? `${selectedAlert.notes}\n\n[${new Date().toLocaleString('es-ES')}] ${intervention.trim()}`
      : `[${new Date().toLocaleString('es-ES')}] ${intervention.trim()}`;

    const { error } = await supabase
      .from('alerts')
      .update({ notes: mergedNotes, updated_at: new Date().toISOString() })
      .eq('id', selectedAlert.id);

    if (error) console.error('Error enviando intervención:', error);
    setIntervention('');
    await loadDashboard();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    hardRedirect('/auth/login');
  }

  function normalizeAlertStatus(status: string): 'pending' | 'acknowledged' | 'resolved' {
    if (status === 'acknowledged' || status === 'resolved') return status;
    return 'pending';
  }

  function getSeverity(
    crisisDetected?: boolean,
    emotion?: string,
    emotionScore?: number
  ): 'critical' | 'high' | 'medium' {
    if (crisisDetected) return 'critical';
    if (
      ['sadness', 'fear', 'anxiety', 'neg'].includes((emotion || '').toLowerCase()) &&
      Number(emotionScore || 0) >= 0.75
    ) {
      return 'high';
    }
    return 'medium';
  }

  function getStudentStatus(lastActivity?: string): 'active' | 'idle' | 'offline' {
    if (!lastActivity) return 'offline';
    const diff = Date.now() - new Date(lastActivity).getTime();
    if (diff <= 15 * 60 * 1000) return 'active';
    if (diff <= 60 * 60 * 1000) return 'idle';
    return 'offline';
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'acknowledged':
        return <Clock className="text-orange-600" size={20} />;
      case 'resolved':
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return null;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
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

  if (loading || !authChecked || !psychologistId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              BEST.IA
            </h1>
            <p className="text-sm text-gray-600">Panel de Monitoreo para Psicólogos</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{psychologistName}</span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Estudiantes Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeStudents}</p>
              </div>
              <Users className="text-indigo-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Alertas Pendientes</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingAlerts}</p>
              </div>
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sesiones Hoy</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.sessionsToday}</p>
              </div>
              <MessageSquare className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tasa de Resolución</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolutionRate}%</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg card-shadow p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar alertas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 smooth-transition">
                  <Filter size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="mx-auto mb-2 text-gray-300" size={32} />
                    <p>No hay alertas registradas.</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 border-2 rounded-lg cursor-pointer smooth-transition ${
                        selectedAlert?.id === alert.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(alert.status)}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{alert.studentName}</h3>
                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          Emoción: {alert.emotion}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedAlert ? (
              <div className="bg-white rounded-lg card-shadow p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Panel de Intervención</h3>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Estudiante</p>
                  <p className="font-semibold text-gray-900">{selectedAlert.studentName}</p>
                  <p className="text-sm text-gray-600 mt-1 break-all">ID: {selectedAlert.studentId}</p>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Detalles</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Severidad:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(selectedAlert.severity)}`}
                      >
                        {selectedAlert.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Emoción:</span>
                      <span className="ml-2 font-semibold text-gray-900">{selectedAlert.emotion}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <span className="ml-2 font-semibold text-gray-900 capitalize">{selectedAlert.status}</span>
                    </div>
                  </div>
                </div>

                {selectedAlert.notes && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Notas anteriores</p>
                    <p className="text-sm text-gray-800 whitespace-pre-line">{selectedAlert.notes}</p>
                  </div>
                )}

                {selectedAlert.status === 'pending' && (
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => handleAcknowledgeAlert(selectedAlert.id)}
                      className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 smooth-transition text-sm font-semibold"
                    >
                      Reconocer
                    </button>
                    <button
                      onClick={() => handleResolveAlert(selectedAlert.id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 smooth-transition text-sm font-semibold"
                    >
                      Resolver
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucción para el Agente IA
                  </label>
                  <textarea
                    value={intervention}
                    onChange={(e) => setIntervention(e.target.value)}
                    placeholder="Ej: Sugiere técnicas de respiración profunda..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleSendIntervention}
                    disabled={!intervention.trim()}
                    className="w-full mt-3 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg smooth-transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={18} />
                    Enviar Intervención
                  </button>
                </div>

                <button className="w-full mt-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 smooth-transition font-semibold flex items-center justify-center gap-2">
                  <Eye size={18} />
                  Ver Chat Completo
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg card-shadow p-6 text-center text-gray-500">
                <Eye className="mx-auto mb-2 text-gray-300" size={32} />
                <p>Selecciona una alerta para ver los detalles.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg card-shadow p-6">
          <h3 className="text-xl font-bold mb-6">Actividad de Estudiantes</h3>
          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto mb-2 text-gray-300" size={32} />
              <p>No hay estudiantes registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Último Mensaje</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Actividad</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 smooth-transition">
                      <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{student.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm truncate max-w-xs">
                        {student.lastMessage}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {student.lastActivity ? formatTime(student.lastActivity) : 'Sin actividad'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}