'use client';

import Link from 'next/link';
import { Heart, Brain, Shield, MessageCircle, TrendingUp, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">BEST.IA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/auth/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Acompañamiento
              </span>
              <br />
              <span className="text-gray-900">Emocional Inteligente</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              BEST.IA está aquí para apoyarte 24/7 con inteligencia artificial avanzada y enfoque humano. Tu bienestar emocional es nuestra prioridad.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/auth/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                Comenzar Ahora <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#features" className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Conocer Más
              </Link>
            </div>
          </div>

          {/* Right Column - Features Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué BEST.IA?</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <MessageCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Chat 24/7</h4>
                  <p className="text-gray-600 text-sm">Habla cuando lo necesites. Nuestro asistente está disponible las 24 horas del día.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Detección de Emociones</h4>
                  <p className="text-gray-600 text-sm">Identificamos tu estado emocional para ofrecerte el mejor apoyo.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Shield className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Alertas de Crisis</h4>
                  <p className="text-gray-600 text-sm">Detectamos señales de riesgo y notificamos a profesionales inmediatamente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Características Principales
              </span>
            </h2>
            <p className="text-xl text-gray-600">Una plataforma completa diseñada para el bienestar emocional de estudiantes universitarios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chat Inteligente</h3>
              <p className="text-gray-600">Conversaciones naturales con IA basada en Gemma 4 26B, disponible 24/7 para escuchar y apoyar.</p>
              <div className="mt-4 flex items-center text-indigo-600 font-semibold">
                Más información <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detección de Emociones</h3>
              <p className="text-gray-600">Análisis automático de emociones usando pysentimiento para entender mejor tu estado emocional.</p>
              <div className="mt-4 flex items-center text-purple-600 font-semibold">
                Más información <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Alertas de Crisis</h3>
              <p className="text-gray-600">Sistema inteligente que identifica riesgos y notifica a profesionales de inmediato.</p>
              <div className="mt-4 flex items-center text-pink-600 font-semibold">
                Más información <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoreo Profesional</h3>
              <p className="text-gray-600">Psicólogos supervisan en tiempo real y pueden intervenir dinámicamente en las conversaciones.</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold">
                Más información <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seguimiento de Progreso</h3>
              <p className="text-gray-600">Historial detallado de conversaciones y análisis de tendencias emocionales a lo largo del tiempo.</p>
              <div className="mt-4 flex items-center text-green-600 font-semibold">
                Más información <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Recursos de Ayuda</h3>
              <p className="text-gray-600">Acceso a ejercicios, guías y recursos diseñados para tu bienestar emocional.</p>
              <div className="mt-4 flex items-center text-red-600 font-semibold">
                Más información <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ¿Cómo Funciona?
              </span>
            </h2>
            <p className="text-xl text-gray-600">Cuatro pasos simples para comenzar tu viaje hacia el bienestar emocional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Regístrate', description: 'Crea tu cuenta de forma segura y rápida' },
              { number: '2', title: 'Consentimiento', description: 'Acepta los términos y políticas de privacidad' },
              { number: '3', title: 'Inicia Chat', description: 'Comienza a conversar con nuestro asistente IA' },
              { number: '4', title: 'Apoyo Profesional', description: 'Recibe supervisión de psicólogos certificados' },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 -right-4 w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comienza Tu Viaje Hacia el Bienestar Emocional
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Únete a miles de estudiantes que ya están recibiendo apoyo emocional inteligente y profesional.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Registrarse Ahora
            </Link>
            <Link href="/resources" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Ver Recursos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">BEST.IA</span>
              </div>
              <p className="text-gray-400">Acompañamiento emocional inteligente para estudiantes universitarios.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Características</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Seguridad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Términos</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Recursos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 BEST.IA. Todos los derechos reservados.</p>
            <p className="text-sm mt-2">⚠️ BEST.IA no reemplaza la atención profesional. En caso de emergencia, contacta a servicios de emergencia.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
