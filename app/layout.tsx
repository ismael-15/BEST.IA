import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BEST.IA - Acompañamiento Estudiantil',
  description: 'Plataforma de acompañamiento psicológico con IA para estudiantes universitarios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
