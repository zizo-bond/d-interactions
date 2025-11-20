import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DrugInput } from './components/DrugInput';
import { DrugList } from './components/DrugList';
import { InteractionResult } from './components/InteractionResult';
import { analyzeDrugInteractions } from './services/geminiService';
import { Drug, AnalysisResult } from './types';
import { Loader2, SearchCheck, Trash2, AlertCircle, RefreshCw, BookOpen, Shield, Stethoscope } from 'lucide-react';

export default function App() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDrug = useCallback((name: string) => {
    if (drugs.some(d => d.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    const newDrug: Drug = {
      id: crypto.randomUUID(),
      name: name
    };
    setDrugs(prev => [...prev, newDrug]);
    setAnalysis(null);
    setError(null);
  }, [drugs]);

  const handleRemoveDrug = useCallback((id: string) => {
    setDrugs(prev => prev.filter(d => d.id !== id));
    setAnalysis(null);
  }, []);
  
  const handleClearAll = useCallback(() => {
    setDrugs([]);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (drugs.length < 2) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const drugNames = drugs.map(d => d.name);
      const result = await analyzeDrugInteractions(drugNames);
      setAnalysis(result);
      // Smooth scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع أثناء التحليل.");
    } finally {
      setLoading(false);
    }
  }, [drugs]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Hero / Intro Section (Only show if no results yet) */}
        {!analysis && (
          <div className="text-center mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              تحقق من سلامة أدويتك <span className="text-blue-600">بذكاء</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              أداة متطورة تساعدك على اكتشاف التداخلات بين الأدوية باستخدام أحدث تقنيات الذكاء الاصطناعي لضمان سلامتك وسلامة عائلتك.
            </p>
          </div>
        )}

        {/* Main Interaction Area */}
        <section className="mb-12 no-print">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/80">
            {/* Header of Card */}
            <div className="bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">قائمة الأدوية</h3>
                <p className="text-sm text-slate-500 mt-1">أضف جميع الأدوية التي تتناولها حالياً</p>
              </div>
              {drugs.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="group text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  <span className="hidden sm:inline">مسح الكل</span>
                </button>
              )}
            </div>

            {/* Body of Card */}
            <div className="p-6 sm:p-8">
              <DrugInput onAddDrug={handleAddDrug} disabled={loading} />
              
              <DrugList drugs={drugs} onRemoveDrug={handleRemoveDrug} />
              
              {/* Steps (Only show when empty) */}
              {drugs.length === 0 && !analysis && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', title: 'أدخل الأسماء', desc: 'سجل أسماء الأدوية والفيتامينات' },
                    { icon: SearchCheck, color: 'text-purple-600', bg: 'bg-purple-50', title: 'تحليل فوري', desc: 'فحص شامل خلال ثوانٍ معدودة' },
                    { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'نتائج دقيقة', desc: 'توصيات طبية وعلمية موثوقة' }
                  ].map((step, i) => (
                    <div key={i} className="group p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 bg-slate-50/50 hover:bg-white text-center">
                      <div className={`w-14 h-14 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <step.icon className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2 text-lg">{step.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer of Card (Action Area) */}
            <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                {drugs.length === 1 ? (
                   <span className="text-amber-600 flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                     <AlertCircle className="w-4 h-4" />
                     يرجى إضافة دواء آخر للبدء
                   </span>
                ) : (
                  <span className="opacity-0 sm:opacity-100">نظام ذكي مدعوم بـ Gemini AI</span>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={drugs.length < 2 || loading}
                className={`relative overflow-hidden w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform active:scale-95
                  ${drugs.length < 2 || loading 
                    ? 'bg-slate-300 cursor-not-allowed opacity-80' 
                    : 'bg-slate-900 hover:bg-blue-600 shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>جاري التحليل...</span>
                  </>
                ) : (
                  <>
                    <SearchCheck className="h-6 w-6" />
                    <span>فحص التداخلات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-red-700 animate-in fade-in slide-in-from-top-2 shadow-sm no-print">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm text-red-500 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">عذراً، حدث خطأ</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-red-200 rounded-xl text-sm font-bold text-red-700 hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0 whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <section id="results" className="scroll-mt-32">
            <InteractionResult result={analysis} />
          </section>
        )}
      </main>
    </div>
  );
}