'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'psychologist'>('student');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error signUp:', error);
        return;
      }

      const authUser = data.user;
      if (!authUser) {
        console.error('No se creó el usuario auth');
        return;
      }

      const { error: profileError } = await supabase.from('users').upsert({
        id: authUser.id,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Error creando perfil en users:', profileError);
        return;
      }

      console.log('Usuario registrado y sincronizado en users');
    } catch (err) {
      console.error('Error general registro:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Nombre completo"
        className="w-full border p-2 rounded"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="w-full border p-2 rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as 'student' | 'psychologist')}
        className="w-full border p-2 rounded"
      >
        <option value="student">Estudiante</option>
        <option value="psychologist">Psicólogo</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}