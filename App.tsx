import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DrugInput } from './components/DrugInput';
import { DrugList } from './components/DrugList';
import { InteractionResult } from './components/InteractionResult';
import { analyzeDrugInteractions } from './services/geminiService';
import { Drug, AnalysisResult } from './types';
import { Loader2, SearchCheck, Trash2, AlertCircle, RefreshCw, BookOpen, Share2, Shield } from 'lucide-react';

export default function App() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDrug = useCallback((name: string) => {
    // Basic duplicate check (case-insensitive)
    if (drugs.some(d => d.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    const newDrug: Drug = {
      id: crypto.randomUUID(),
      name: name
    };
    setDrugs(prev => [...prev, newDrug]);
    // Clear previous analysis when list changes to avoid confusion
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
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع أثناء التحليل. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [drugs]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <section className="mb-10 no-print">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">قائمة الأدوية</h2>
              {drugs.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  مسح القائمة
                </button>
              )}
            </div>
            
            <DrugInput onAddDrug={handleAddDrug} disabled={loading} />
            
            <DrugList drugs={drugs} onRemoveDrug={handleRemoveDrug} />
            
            {/* Empty State / Onboarding Instructions */}
            {drugs.length === 0 && !analysis && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">1. أضف أدويتك</h3>
                  <p className="text-xs text-slate-500">اكتب اسم الدواء (عربي أو إنجليزي) واضغط إضافة.</p>
                </div>
                <div className="p-4 bg-purple-50/50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <SearchCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">2. افحص التداخلات</h3>
                  <p className="text-xs text-slate-500">سيقوم الذكاء الاصطناعي بتحليل القائمة بدقة.</p>
                </div>
                <div className="p-4 bg-green-50/50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">3. احمِ صحتك</h3>
                  <p className="text-xs text-slate-500">اقرأ التوصيات أو اطبع التقرير للطبيب.</p>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-4">
              {drugs.length === 1 && (
                 <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                   يجب إضافة دواء آخر للتحليل
                 </span>
              )}
              <button
                onClick={handleAnalyze}
                disabled={drugs.length < 2 || loading}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all transform active:scale-95 shadow-md
                  ${drugs.length < 2 || loading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    جاري فحص التداخلات...
                  </>
                ) : (
                  <>
                    <SearchCheck className="h-6 w-6" />
                    تحليل التداخلات الآن
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-red-700 animate-in fade-in slide-in-from-top-2 no-print">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">تنبيه</h3>
                <p className="mt-0.5 text-sm">{error}</p>
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-bold text-red-700 hover:bg-red-50 transition-colors shadow-sm shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <section className="scroll-mt-24" id="results">
            <InteractionResult result={analysis} />
          </section>
        )}
      </main>
    </div>
  );
}