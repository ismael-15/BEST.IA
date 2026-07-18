'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'student', // siempre student desde registro público
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess(true);

    } catch (err) {
      setError('Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }; // <-- handleSubmit termina aquí

  // Pantalla de éxito — FUERA del handleSubmit
  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl card-shadow p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado un correo de confirmación a {formData.email}. Por favor, verifica tu correo para completar el registro.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-8 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg smooth-transition font-semibold"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Formulario de registro — FUERA del handleSubmit
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              BEST.IA
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Únete a BEST.IA</h2>
          <p className="text-gray-600 mt-2">Comienza tu viaje hacia el bienestar emocional</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl card-shadow p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
              >
                <option value="student">Estudiante</option>
                {/* Psicólogo se asigna solo por admin */}
              </select>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent smooth-transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                required
              />
              <span className="text-sm text-gray-700">
                Acepto los{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                  Términos de Servicio
                </a>
                {' '}y la{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                  Política de Privacidad
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.agreeTerms}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg hover:shadow-lg smooth-transition font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

