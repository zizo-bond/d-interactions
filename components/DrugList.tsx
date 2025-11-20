import React from 'react';
import { X, PackageOpen } from 'lucide-react';
import { Drug } from '../types';

interface DrugListProps {
  drugs: Drug[];
  onRemoveDrug: (id: string) => void;
}

export const DrugList: React.FC<DrugListProps> = ({ drugs, onRemoveDrug }) => {
  if (drugs.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 hover:bg-slate-50 transition-colors">
        <PackageOpen className="h-10 w-10 mb-3 opacity-50" />
        <p className="text-sm font-medium">قائمة الأدوية فارغة</p>
        <p className="text-xs opacity-70 mt-1">ابدأ بإضافة الأدوية للتحليل</p>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">الأدوية المضافة ({drugs.length})</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {drugs.map((drug, index) => (
          <div
            key={drug.id}
            className="group relative inline-flex items-center bg-white border border-slate-200 rounded-full py-2.5 pl-3 pr-5 shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 select-none animate-in zoom-in-95 duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 ml-3 group-hover:scale-125 transition-transform"></div>
            <span className="text-slate-700 font-bold text-base">{drug.name}</span>
            <button
              onClick={() => onRemoveDrug(drug.id)}
              className="absolute -top-1 -left-1 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm scale-90 group-hover:scale-100"
              title="إزالة الدواء"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};