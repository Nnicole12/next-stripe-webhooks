'use strict';

'use client';

import React, { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Monto de prueba: $29.99 USD = 2999 centavos
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2999,
          currency: 'usd',
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar el pago.');
      }

      if (data.url) {
        // Redirigir al usuario a Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió la URL de redirección de Stripe.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error desconocido al iniciar el pago.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Elementos Decorativos de Fondo (Efecto de Gradiente) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            W
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-200 bg-clip-text text-transparent">
            WebhookHQ
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
          Sandbox v1.0
        </span>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 z-10 flex-grow">
        
        {/* Left Side: Product Details */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Proyecto de Portafolio
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Curso de Arquitectura de{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Webhooks en Tiempo Real
            </span>
          </h1>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed">
            Aprende a recibir, validar firmas HMAC y procesar notificaciones asíncronas de Stripe actualizando bases de datos con PostgreSQL y Prisma ORM.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                🛡️
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 font-medium">Validación Criptográfica</p>
                <p className="text-sm font-semibold text-slate-300">HMAC-SHA256 con Stripe</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                🗄️
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 font-medium">Persistencia de Datos</p>
                <p className="text-sm font-semibold text-slate-300">PostgreSQL + Prisma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Checkout Form Card */}
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            $29.99 USD
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Simular Compra</h2>
          <p className="text-slate-400 text-sm mb-6">
            Ingresa tu correo para crear una orden de prueba en estado <span className="text-amber-400 font-medium">PENDING</span> y redirigirte a Stripe Checkout.
          </p>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                disabled={loading}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all disabled:opacity-55"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <span>Proceder al Pago</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-6 text-center">
            <span className="text-xs text-slate-500">
              Integración segura certificada. Conexión directa mediante Stripe Checkout.
            </span>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-md py-6 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 WebhookHQ. Desarrollado con Next.js, Prisma y Tailwind CSS.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Portafolio</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">GitHub</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Documentación</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
