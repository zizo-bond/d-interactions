import React from 'react';
import { Activity, Sparkles, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 glass shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 blur-lg opacity-20 rounded-full"></div>
            <div className="relative bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight tracking-tight">
              دليل التداخلات <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-cyan-500">الذكـي</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full tracking-wide">
                <Sparkles className="w-3 h-3" />
                مجاني 100%
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3 text-xs font-medium">
          <div className="text-right hidden md:block">
             <span className="block text-slate-400">تقنية الذكاء الاصطناعي</span>
             <span className="block text-slate-800 font-semibold font-mono tracking-tight">Gemini 2.5 Flash</span>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          <a 
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer" 
            className="group flex items-center gap-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <span>احصل على API</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
};