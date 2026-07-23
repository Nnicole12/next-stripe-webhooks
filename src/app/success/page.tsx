'use strict';

'use client';

import React from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Luces de Fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20">
            W
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            WebhookHQ
          </span>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-md mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center z-10 flex-grow">
        
        {/* Animated Checkmark SVG Container */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8 shadow-xl shadow-emerald-500/5 animate-bounce">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">
          ¡Pago Iniciado con Éxito!
        </h1>
        
        <p className="text-slate-400 text-sm mb-2 leading-relaxed">
          Stripe está procesando tu transacción de forma segura.
        </p>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 my-6 text-left max-w-sm">
          <div className="flex gap-3">
            <span className="text-lg">⚡</span>
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                ¿Qué sucede ahora?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stripe enviará una petición HTTP POST en segundo plano a nuestro webhook (`/api/webhooks/stripe`). Tras validar la firma criptográfica HMAC, actualizaremos el estado de tu orden a <span className="text-emerald-400 font-semibold">PAID</span> en la base de datos de PostgreSQL de forma asíncrona.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium py-3 px-6 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span>Volver al Inicio</span>
        </Link>

      </section>

      {/* Footer */}
      <footer className="py-6 z-10 text-center">
        <p className="text-xs text-slate-600">
          Entorno de desarrollo educativo &copy; 2026.
        </p>
      </footer>
    </main>
  );
}
