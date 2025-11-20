import React from 'react';
import { AlertTriangle, Info, ShieldCheck, AlertOctagon, Activity, Stethoscope, Microscope, Printer, ArrowLeft } from 'lucide-react';
import { AnalysisResult, SeverityLevel, Interaction } from '../types';

interface InteractionResultProps {
  result: AnalysisResult;
}

const SeverityBadge: React.FC<{ level: SeverityLevel }> = ({ level }) => {
  const config = {
    [SeverityLevel.HIGH]: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertOctagon, text: 'خطير (Major)' },
    [SeverityLevel.MODERATE]: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle, text: 'متوسط (Moderate)' },
    [SeverityLevel.LOW]: { color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Info, text: 'بسيط (Minor)' },
    [SeverityLevel.UNKNOWN]: { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: Info, text: 'غير محدد' },
  }[level];

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 ${config.bg} ${config.color} ${config.border} border rounded-lg shadow-sm`}>
      <Icon className="w-4 h-4 animate-pulse" />
      <span className="font-bold text-xs sm:text-sm">{config.text}</span>
    </div>
  );
};

const InteractionCard: React.FC<{ interaction: Interaction }> = ({ interaction }) => {
  const borderColor = 
    interaction.severity === SeverityLevel.HIGH ? 'border-l-red-500' :
    interaction.severity === SeverityLevel.MODERATE ? 'border-l-orange-500' :
    'border-l-yellow-400';

  return (
    <div className={`group bg-white rounded-xl border border-slate-200 ${borderColor} border-l-[6px] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden break-inside-avoid mb-6`}>
      
      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center flex-wrap gap-3 text-lg">
            <span className="font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">{interaction.drug1}</span>
            <ArrowLeft className="w-5 h-5 text-slate-300" />
            <span className="font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">{interaction.drug2}</span>
          </div>
          <SeverityBadge level={interaction.severity} />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5 sm:p-6 grid gap-6 lg:grid-cols-3">
        
        {/* Main Description */}
        <div className="lg:col-span-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">التأثير السريري (للمريض)</h4>
              <p className="text-slate-600 leading-relaxed text-justify">{interaction.description}</p>
            </div>
          </div>
        </div>
        
        {/* Mechanism */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 lg:col-span-2 group-hover:bg-white group-hover:border-slate-200 transition-colors">
          <div className="flex items-center gap-2 mb-2 text-purple-700">
            <Microscope className="w-4 h-4" />
            <h4 className="font-bold text-sm uppercase tracking-wider">الآلية العلمية</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium font-mono" dir="ltr">{interaction.mechanism}</p>
        </div>

        {/* Management */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2 text-blue-800">
            <Stethoscope className="w-4 h-4" />
            <h4 className="font-bold text-sm uppercase tracking-wider">التوصية الطبية</h4>
          </div>
          <p className="text-sm text-blue-900 font-bold leading-relaxed">
            {interaction.management}
          </p>
        </div>
      </div>
    </div>
  );
};

export const InteractionResult: React.FC<InteractionResultProps> = ({ result }) => {
  const hasInteractions = result.interactions.length > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end border-b border-slate-200 pb-4 gap-4 no-print">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">تقرير التحليل</h2>
          <p className="text-slate-500 mt-1">تم إنشاء التقرير بواسطة الذكاء الاصطناعي</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm font-bold text-sm group"
        >
          <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
          طباعة / PDF
        </button>
      </div>

      {/* Summary Banner */}
      <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border transition-all duration-500 ${hasInteractions ? 'bg-white border-red-100 shadow-red-100/50 shadow-lg' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-emerald-100/50 shadow-lg'}`}>
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative flex gap-5 items-start">
          <div className={`p-3 rounded-2xl shrink-0 ${hasInteractions ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {hasInteractions ? <AlertTriangle className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
          </div>
          <div>
            <h2 className={`text-xl font-bold mb-2 ${hasInteractions ? 'text-red-900' : 'text-emerald-900'}`}>ملخص الحالة</h2>
            <p className={`text-lg leading-relaxed font-medium ${hasInteractions ? 'text-slate-700' : 'text-emerald-800'}`}>{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Interactions List */}
      {hasInteractions && (
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800">التفاصيل الكاملة ({result.interactions.length})</h3>
          </div>
          <div className="space-y-2">
            {result.interactions.map((interaction, idx) => (
              <InteractionCard key={idx} interaction={interaction} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-5 mt-10 print:bg-white print:border-slate-300">
        <div className="flex gap-4 items-start">
          <Info className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-500 leading-relaxed space-y-2">
            <p className="font-bold text-slate-600">إخلاء مسؤولية طبية:</p>
            <p>{result.disclaimer}</p>
            <p>هذا التطبيق أداة مساعدة ولا يعتبر بديلاً عن الاستشارة الطبية المتخصصة.</p>
          </div>
        </div>
      </div>
      
      <div className="hidden print:block text-center mt-10 pt-4 border-t text-slate-400 text-sm">
        www.drug-interaction-checker.app | تقرير آلي
      </div>
    </div>
  );
};