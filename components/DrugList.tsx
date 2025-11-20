import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Drug } from '../types';

interface DrugListProps {
  drugs: Drug[];
  onRemoveDrug: (id: string) => void;
}

export const DrugList: React.FC<DrugListProps> = ({ drugs, onRemoveDrug }) => {
  if (drugs.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg border border-dashed border-slate-300 mt-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50">
          <AlertCircle className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-slate-900">لا توجد أدوية مضافة</h3>
        <p className="mt-1 text-sm text-slate-500">ابدأ بإضافة الأدوية التي تريد فحص تداخلاتها.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">قائمة الأدوية ({drugs.length})</h2>
      <div className="flex flex-wrap gap-3">
        {drugs.map((drug) => (
          <div
            key={drug.id}
            className="inline-flex items-center bg-white border border-slate-200 rounded-full py-2 px-4 shadow-sm group hover:border-blue-300 transition-colors"
          >
            <span className="text-slate-700 font-medium">{drug.name}</span>
            <button
              onClick={() => onRemoveDrug(drug.id)}
              className="mr-2 p-1 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="حذف"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};