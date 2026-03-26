'use client';

import { Globe, HelpCircle, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight">SIT-Bolivia</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SISTEMA DE INFORMACIÓN TERRITORIAL DE BOLIVIA</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">Uso de Suelos</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Normativa</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Conceptos</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Mapas</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Herramientas</a>
        </div>

        <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
          <button className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 overflow-hidden">
            {/* Simple user placeholder avatar */}
            <User className="w-6 h-6 mt-2" />
          </div>
        </div>
      </div>
    </nav>
  );
}
