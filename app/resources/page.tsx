'use client';

import Link from 'next/link';
import {
  Phone,
  Globe,
  Heart,
  Brain,
  Users,
  BookOpen,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  contact?: string;
  link?: string;
  type: 'crisis' | 'support' | 'educational';
}

export default function ResourcesPage() {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Línea de Crisis 24/7',
      description: 'Apoyo inmediato en situaciones de crisis emocional o suicida',
      icon: <AlertTriangle size={32} />,
      contact: '+1 (555) 123-4567',
      type: 'crisis',
    },
    {
      id: '2',
      title: 'Centro de Salud Mental Universitario',
      description: 'Servicios profesionales de psicología y psiquiatría',
      icon: <Brain size={32} />,
      contact: 'salud.mental@university.edu',
      link: 'https://university.edu/mental-health',
      type: 'support',
    },
    {
      id: '3',
      title: 'Grupo de Apoyo de Pares',
      description: 'Comunidad de estudiantes que se apoyan mutuamente',
      icon: <Users size={32} />,
      contact: 'peers@university.edu',
      type: 'support',
    },
    {
      id: '4',
      title: 'Teléfono de Prevención del Suicidio',
      description: 'Línea especializada en prevención de suicidio',
      icon: <Heart size={32} />,
      contact: '+1 (555) 987-6543',
      type: 'crisis',
    },
    {
      id: '5',
      title: 'Recursos Educativos sobre Salud Mental',
      description: 'Artículos, videos y guías sobre bienestar emocional',
      icon: <BookOpen size={32} />,
      link: 'https://mentalhealth.org/resources',
      type: 'educational',
    },
    {
      id: '6',
      title: 'Plataforma de Telemedicina',
      description: 'Consultas con profesionales de salud mental en línea',
      icon: <Globe size={32} />,
      link: 'https://telehealth.university.edu',
      type: 'support',
    },
  ];

  const crisisResources = resources.filter((r) => r.type === 'crisis');
  const supportResources = resources.filter((r) => r.type === 'support');
  const educationalResources = resources.filter((r) => r.type === 'educational');

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div className="bg-white rounded-lg card-shadow p-6 hover:shadow-xl smooth-transition">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        resource.type === 'crisis'
          ? 'bg-red-100 text-red-600'
          : resource.type === 'support'
          ? 'bg-purple-100 text-purple-600'
          : 'bg-blue-100 text-blue-600'
      }`}>
        {resource.icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
      <div className="space-y-2">
        {resource.contact && (
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-gray-400" />
            <a href={`tel:${resource.contact}`} className="text-indigo-600 hover:text-indigo-700 font-semibold">
              {resource.contact}
            </a>
          </div>
        )}
        {resource.link && (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <Globe size={16} />
            Visitar Sitio
          </a>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                Recursos de Ayuda
              </h1>
              <p className="text-sm text-gray-600">Encuentra apoyo profesional y recursos útiles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Crisis Resources */}
        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Recursos de Crisis</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Si estás en una situación de crisis, contacta inmediatamente con estos servicios
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {crisisResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        {/* Support Resources */}
        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Recursos de Apoyo</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Servicios profesionales y comunitarios para tu bienestar emocional
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {supportResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        {/* Educational Resources */}
        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Recursos Educativos</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Aprende más sobre salud mental y bienestar emocional
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {educationalResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section className="bg-white rounded-2xl card-shadow p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Consejos para el Bienestar Emocional</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Mantén una Rutina',
                description: 'Establece horarios regulares para dormir, comer y estudiar',
              },
              {
                title: 'Ejercicio Regular',
                description: 'Al menos 30 minutos de actividad física diaria',
              },
              {
                title: 'Conecta con Otros',
                description: 'Pasa tiempo con amigos y familiares que te apoyan',
              },
              {
                title: 'Practica Mindfulness',
                description: 'Meditación y técnicas de respiración para reducir estrés',
              },
              {
                title: 'Limita el Estrés',
                description: 'Identifica y evita factores estresantes cuando sea posible',
              },
              {
                title: 'Busca Ayuda Profesional',
                description: 'No dudes en contactar a un psicólogo o consejero',
              },
            ].map((tip, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle size={40} />
            <h2 className="text-2xl font-bold">¿Es una Emergencia?</h2>
          </div>
          <p className="mb-6 text-lg">
            Si estás en peligro inmediato o tienes pensamientos suicidas, por favor:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Llamar a Emergencias</p>
              <p className="text-2xl font-bold">911</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Línea de Crisis</p>
              <p className="text-2xl font-bold">+1 (555) 123-4567</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Ir al Hospital</p>
              <p className="text-sm">Dirígete a la sala de emergencias más cercana</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            BEST.IA es una plataforma de apoyo emocional, no reemplaza la atención profesional.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            &copy; 2024 BEST.IA. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
