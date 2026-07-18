'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('SIGNIN DATA:', data);
      console.log('SIGNIN ERROR:', signInError);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        setError('No se pudo obtener la sesión del usuario.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, role, full_name, email')
        .eq('id', userId)
        .maybeSingle();

      console.log('PROFILE DATA:', profile);
      console.log('PROFILE ERROR:', profileError);

      if (profileError) {
        setError(`Error al cargar perfil: ${profileError.message}`);
        return;
      }

      if (!profile) {
        setError('El usuario inició sesión, pero no tiene perfil en la tabla users.');
        return;
      }

      if (profile.role === 'psychologist') {
        router.refresh();
        router.push('/dashboard');
        return;
      }

      if (profile.role === 'student') {
        router.refresh();
        router.push('/chat');
        return;
      }

      setError(`Rol inválido o vacío: ${profile.role ?? 'sin rol'}`);
    } catch (err) {
      console.error('LOGIN CATCH:', err);
      setError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              BEST.IA
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h2>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg hover:shadow-lg smooth-transition font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}