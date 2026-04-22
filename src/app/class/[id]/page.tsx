'use client';

import { useEffect, useState, use } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Clock, MonitorSmartphone, ArrowLeft } from 'lucide-react';
import { Student } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClassDashboard({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Poll for new attendance every 3 seconds
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch attendance', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Generate QR URL based on current window location
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.protocol}//${window.location.host}/check-in/${id}`;
      setQrUrl(url);
    }
  }, [id]);

  if (error && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Clase no encontrada</h1>
        <p className="text-slate-400 mb-8">Esta sesión no existe o ya ha expirado.</p>
        <Link href="/" className="bg-primary hover:bg-primary-hover px-6 py-3 rounded-xl text-white transition-colors">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors border border-slate-700">
              <ArrowLeft size={24} className="text-slate-300" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                Panel de Asistencia
                <span className="text-sm px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full font-mono uppercase">
                  ID: {id}
                </span>
              </h1>
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg border border-slate-700">
            <Users className="text-primary" />
            <span className="font-semibold text-xl">{students.length} Asistentes</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl border border-slate-700/50">
              <div className="bg-white p-6 rounded-2xl mb-6 shadow-lg transform transition-transform hover:scale-105 duration-300">
                {qrUrl && !loading ? (
                  <QRCodeSVG 
                    value={qrUrl} 
                    size={280}
                    level="H"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[280px] h-[280px] bg-slate-200 animate-pulse rounded-lg" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Escanea para Asistencia</h2>
              <p className="text-slate-400 text-sm flex items-center justify-center space-x-2">
                <MonitorSmartphone size={16} />
                <span>Pide a los alumnos que escaneen este código.</span>
              </p>
            </div>
            
            <div className="glass p-6 rounded-2xl border border-slate-700/50">
               <h3 className="text-lg font-semibold mb-2">¿Problemas escaneando?</h3>
               <p className="text-slate-400 text-sm mb-4">También pueden ingresar a esta dirección desde su navegador:</p>
               <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-center break-all text-sm">
                 <a href={qrUrl} target="_blank" rel="noreferrer" className="text-primary font-mono hover:underline">
                   {qrUrl}
                 </a>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass p-8 rounded-3xl h-full min-h-[500px] border border-slate-700/50 shadow-xl flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                Registro en Tiempo Real
                {loading && <span className="ml-4 w-2 h-2 bg-primary rounded-full animate-ping" />}
              </h2>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {students.length === 0 && !loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <Clock size={48} className="opacity-50" />
                    <p>Esperando a que los alumnos se registren...</p>
                  </div>
                ) : (
                  students.map((student, index) => (
                    <div 
                      key={student.id}
                      className="bg-slate-800/40 border border-slate-700 hover:bg-slate-800/80 transition-colors p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-right-4 fade-in duration-300"
                      style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-lg text-slate-200">{student.name}</span>
                      </div>
                      <div className="text-sm text-slate-400 flex items-center bg-slate-900/50 px-3 py-1 rounded-full">
                        <Clock size={14} className="mr-2" />
                        {new Date(student.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
