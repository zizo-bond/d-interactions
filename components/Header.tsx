import React from 'react';
import { Activity, CheckCircle2, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
            <Activity className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">دليل التداخلات الدوائية</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                مجاني (Free Tier)
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">| معلومات طبية موثوقة</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-xs text-slate-400 text-left" dir="ltr">
          Powered by<br/>
          <a 
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer" 
            className="font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            title="Get your Gemini API Key"
          >
            Google Gemini AI
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};