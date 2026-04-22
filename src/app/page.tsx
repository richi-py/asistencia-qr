'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, ArrowRight, Users, Loader2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/class/${data.session.id}`);
      } else {
        console.error('Failed to create session');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-4xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 transform rotate-3 hover:rotate-6 transition-transform">
            <QrCode size={48} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Asistencia en Segundos
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Crea una sala al instante, muestra el código QR a tus alumnos y observa cómo se registran en tiempo real. Sin instalaciones, sin registros, totalmente gratis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
          <button
            onClick={handleCreateSession}
            disabled={loading}
            className="group w-full sm:w-auto bg-primary hover:bg-primary-hover text-white text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl shadow-primary/25 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>Creando Sala...</span>
              </>
            ) : (
              <>
                <span>Crear Nueva Clase</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
          <FeatureCard 
            icon={<QrCode size={24} className="text-primary" />}
            title="Código QR Dinámico"
            description="Se genera un código único para cada sesión que crees."
          />
          <FeatureCard 
            icon={<Users size={24} className="text-purple-400" />}
            title="Registro en Tiempo Real"
            description="Ve aparecer a tus alumnos en pantalla al instante."
          />
          <FeatureCard 
            icon={<ArrowRight size={24} className="text-blue-400" />}
            title="Fácil para Alumnos"
            description="Solo escanean, escriben su nombre y listo. Sin descargar apps."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-6 rounded-2xl text-left border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
      <div className="bg-slate-900/80 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
