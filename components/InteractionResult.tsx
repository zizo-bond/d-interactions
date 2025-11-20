import React from 'react';
import { AlertTriangle, Info, ShieldCheck, AlertOctagon, Activity, Stethoscope, Microscope, Printer } from 'lucide-react';
import { AnalysisResult, SeverityLevel, Interaction } from '../types';

interface InteractionResultProps {
  result: AnalysisResult;
}

const SeverityBadge: React.FC<{ level: SeverityLevel }> = ({ level }) => {
  switch (level) {
    case SeverityLevel.HIGH:
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md shadow-sm print:border-red-500">
          <AlertOctagon className="w-5 h-5" />
          <span className="font-bold text-sm">تداخل خطير (High Risk)</span>
        </div>
      );
    case SeverityLevel.MODERATE:
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md shadow-sm print:border-orange-500">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold text-sm">متوسط الخطورة (Moderate)</span>
        </div>
      );
    case SeverityLevel.LOW:
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md shadow-sm print:border-yellow-500">
          <Info className="w-5 h-5" />
          <span className="font-bold text-sm">تداخل بسيط (Minor)</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md shadow-sm">
          <span className="font-bold text-sm">غير معروف</span>
        </div>
      );
  }
};

const InteractionCard: React.FC<{ interaction: Interaction }> = ({ interaction }) => {
  const borderColor = 
    interaction.severity === SeverityLevel.HIGH ? 'border-red-500' :
    interaction.severity === SeverityLevel.MODERATE ? 'border-orange-500' :
    'border-yellow-400';

  return (
    <div className={`bg-white rounded-lg border-r-4 shadow-sm hover:shadow-md transition-all duration-300 p-5 mb-6 border border-slate-200 ${borderColor} break-inside-avoid`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center flex-wrap gap-3 text-lg">
          <span className="font-bold text-slate-800">{interaction.drug1}</span>
          <span className="text-slate-300 px-2">⚡</span>
          <span className="font-bold text-slate-800">{interaction.drug2}</span>
        </div>
        <SeverityBadge level={interaction.severity} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Description */}
        <div className="lg:col-span-3">
          <div className="flex gap-2 mb-2 text-slate-800">
            <Activity className="w-5 h-5 text-blue-600 shrink-0" />
            <h4 className="font-bold">ماذا يحدث (للمريض):</h4>
          </div>
          <p className="text-slate-700 leading-relaxed pr-7 text-justify font-medium">{interaction.description}</p>
        </div>
        
        {/* Mechanism */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 lg:col-span-2 print:bg-white print:border-slate-300">
          <div className="flex items-center gap-2 mb-2 text-slate-700">
            <Microscope className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-sm">التفسير العلمي (للطبيب):</h4>
          </div>
          {/* Fixed: Removed duplicate className attribute */}
          <p className="text-sm text-slate-600 leading-relaxed" dir="ltr">{interaction.mechanism}</p>
        </div>

        {/* Management */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 lg:col-span-1 print:bg-white print:border-blue-300">
          <div className="flex items-center gap-2 mb-2 text-blue-800">
            <Stethoscope className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-sm">التوصية:</h4>
          </div>
          <p className="text-sm text-blue-900/80 leading-relaxed font-bold">
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
    <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold text-slate-800">نتائج التحليل</h2>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm font-medium"
        >
          <Printer className="w-4 h-4" />
          طباعة التقرير
        </button>
      </div>

      {/* Summary Banner */}
      <div className={`rounded-xl p-6 border ${hasInteractions ? 'bg-white border-red-100 shadow-sm' : 'bg-green-50 border-green-200'} print:border-2`}>
        <div className="flex gap-4">
          <div className={`shrink-0 mt-1 ${hasInteractions ? 'text-red-500' : 'text-green-600'}`}>
            {hasInteractions ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-8 w-8" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">الخلاصة</h2>
            <p className="text-slate-700 leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Interactions List */}
      {hasInteractions && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full print:border print:border-blue-500">{result.interactions.length}</span>
            التداخلات المكتشفة
          </h3>
          <div className="space-y-4">
            {result.interactions.map((interaction, idx) => (
              <InteractionCard key={idx} interaction={interaction} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-8 print:bg-white print:border-slate-300">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed text-justify">
            <strong>إخلاء مسؤولية:</strong> {result.disclaimer}
            <br className="mt-2"/>
            هذه المعلومات للأغراض التعليمية والإرشادية فقط ولا تغني بأي حال عن استشارة الطبيب أو الصيدلي المختص. لا تقم أبداً بتغيير جرعاتك الدوائية بناءً على هذه النتائج فقط.
          </p>
        </div>
      </div>
      
      <div className="hidden print:block text-center mt-10 text-xs text-slate-400 border-t pt-4">
        تم إنشاء هذا التقرير بواسطة "دليل التداخلات الدوائية الذكي" - يساعدك على فهم أدويتك بشكل أفضل.
      </div>
    </div>
  );
};