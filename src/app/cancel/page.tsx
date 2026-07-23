'use strict';

'use client';

import React from 'react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Luces de Fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/20">
            W
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-400 to-amber-200 bg-clip-text text-transparent">
            WebhookHQ
          </span>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-md mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center z-10 flex-grow">
        
        {/* Warning Icon SVG Container */}
        <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-8 shadow-xl shadow-rose-500/5">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">
          Pago Cancelado o Interrumpido
        </h1>
        
        <p className="text-slate-400 text-sm mb-2 leading-relaxed">
          Has cancelado el proceso de pago en Stripe Checkout.
        </p>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 my-6 text-left max-w-sm">
          <div className="flex gap-3">
            <span className="text-lg">ℹ️</span>
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                ¿Qué pasa con mi orden?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                La orden creada en la base de datos PostgreSQL continuará en estado <span className="text-amber-400 font-semibold">PENDING</span>. Si la sesión de Stripe llega a expirar por inactividad, Stripe enviará el evento `checkout.session.expired` y nuestro webhook la marcará como <span className="text-rose-400 font-semibold">FAILED</span> automáticamente.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Intentar de Nuevo</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
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
