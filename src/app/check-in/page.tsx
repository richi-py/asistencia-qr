'use client';

import { useState } from 'react';
import { UserCheck, Loader2 } from 'lucide-react';

export default function CheckInPage() {
  const [name, setName] = nameState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // using nameState so that I can copy the state line
  function nameState() { return useState(''); }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la asistencia');
      }

      setSuccess(true);
    } catch (err) {
      setError('Hubo un problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-8 rounded-2xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
            <UserCheck size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white">¡Asistencia Registrada!</h1>
          <p className="text-slate-300">Gracias, {name}. Ya puedes cerrar esta ventana.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="glass p-8 rounded-2xl max-w-md w-full relative z-10 shadow-2xl border border-slate-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Registro de Asistencia</h1>
          <p className="text-slate-400">Ingresa tus datos para registrar tu presencia en la clase de hoy.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Nombre Completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-white placeholder-slate-500"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Confirmar Asistencia</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
