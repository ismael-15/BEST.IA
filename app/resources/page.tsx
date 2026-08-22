'use client';

import Link from 'next/link';
import {
  Phone,
  Heart,
  Brain,
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
  type: 'crisis' | 'support' | 'educational';
}

export default function ResourcesPage() {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Emergencias nacionales',
      description:
        'Si hay peligro inmediato, riesgo de autolesión o una situación que requiere atención urgente, llama al 911.',
      icon: <AlertTriangle size={32} />,
      contact: '911',
      type: 'crisis',
    },
    {
      id: '2',
      title: 'Apoyo en salud mental — MINSAL',
      description:
        'Para orientación y atención en salud mental, llama al 131. También puedes acudir al establecimiento de salud más cercano.',
      icon: <Heart size={32} />,
      contact: '131',
      type: 'crisis',
    },
    {
      id: '3',
      title: 'Ministerio de Salud de El Salvador',
      description:
        'Para información general y orientación sobre servicios públicos de salud, puedes comunicarte con el Ministerio de Salud.',
      icon: <Brain size={32} />,
      contact: '+503 2591 7000',
      type: 'support',
    },
    {
      id: '4',
      title: 'Atención presencial',
      description:
        'Si necesitas apoyo profesional, acude al hospital o establecimiento de salud más cercano a tu comunidad.',
      icon: <Heart size={32} />,
      type: 'support',
    },
    {
      id: '5',
      title: 'Información sobre salud mental',
      description:
        'Infórmate sobre salud mental, bienestar emocional y la importancia de pedir ayuda cuando la necesites.',
      icon: <BookOpen size={32} />,
      type: 'educational',
    },
  ];

  const crisisResources = resources.filter((resource) => resource.type === 'crisis');
  const supportResources = resources.filter((resource) => resource.type === 'support');
  const educationalResources = resources.filter(
    (resource) => resource.type === 'educational'
  );

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div className="bg-white rounded-lg card-shadow p-6 hover:shadow-xl smooth-transition">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          resource.type === 'crisis'
            ? 'bg-red-100 text-red-600'
            : resource.type === 'support'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-blue-100 text-blue-600'
        }`}
      >
        {resource.icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

      {resource.contact && (
        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="text-gray-400" />
          <a
            href={`tel:${resource.contact.replace(/\s/g, '')}`}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            {resource.contact}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Volver al inicio"
              className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                Recursos de Ayuda
              </h1>
              <p className="text-sm text-gray-600">
                Información y apoyo para El Salvador
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Recursos de Crisis</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Si existe peligro inmediato, llama al 911. Para orientación en salud mental,
              llama al 131 o acude al establecimiento de salud más cercano.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {crisisResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Recursos de Apoyo</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Opciones de atención y orientación para buscar apoyo profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {supportResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Información Educativa</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Recursos breves para comprender la importancia del bienestar emocional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {educationalResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl card-shadow p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recomendaciones de Bienestar
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Habla con alguien de confianza',
                description:
                  'Compartir cómo te sientes con una persona cercana puede ayudarte a no enfrentar la situación a solas.',
              },
              {
                title: 'Busca atención profesional',
                description:
                  'Si el malestar persiste, aumenta o afecta tu vida diaria, busca orientación en un establecimiento de salud.',
              },
              {
                title: 'Cuida tus necesidades básicas',
                description:
                  'Descansar, alimentarte e hidratarte puede apoyar tu bienestar físico y emocional.',
              },
              {
                title: 'En una crisis, actúa de inmediato',
                description:
                  'Si hay riesgo de hacerte daño, llama al 911, busca a una persona de confianza o acude a emergencias.',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg"
              >
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle size={40} />
            <h2 className="text-2xl font-bold">¿Es una Emergencia?</h2>
          </div>

          <p className="mb-6 text-lg">
            Si existe peligro inmediato, riesgo de hacerte daño o de que alguien más resulte
            herido, llama al 911. Para orientación o atención en salud mental, llama al 131 o
            acude al establecimiento de salud más cercano.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Llamar a Emergencias</p>
              <a href="tel:911" className="text-2xl font-bold hover:underline">
                911
              </a>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Apoyo en Salud Mental</p>
              <a href="tel:131" className="text-2xl font-bold hover:underline">
                131
              </a>
            </div>

            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Atención presencial</p>
              <p className="text-sm">
                Acude al hospital o establecimiento de salud más cercano.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            BEST.IA es una plataforma de apoyo emocional y no reemplaza la atención profesional
            ni los servicios de emergencia.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            &copy; 2026 BEST.IA. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}


