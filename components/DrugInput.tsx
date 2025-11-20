import React, { useState, useCallback } from 'react';
import { Plus, Pill } from 'lucide-react';

interface DrugInputProps {
  onAddDrug: (name: string) => void;
  disabled?: boolean;
}

export const DrugInput: React.FC<DrugInputProps> = ({ onAddDrug, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddDrug(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onAddDrug]);

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-10">
      <div className="relative flex items-center">
        <div className="absolute right-4 pointer-events-none text-slate-400">
          <Pill className="h-6 w-6" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          dir="auto"
          placeholder="ادخل اسم الدواء هنا (مثال: Aspirin)..."
          className="block w-full py-4 pr-12 pl-32 bg-white border-2 border-slate-200 rounded-xl 
                     text-slate-900 placeholder-slate-400 shadow-sm
                     focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                     disabled:bg-slate-50 disabled:text-slate-500
                     text-lg transition-all duration-200"
        />
        
        <div className="absolute left-2">
          <button
            type="submit"
            disabled={!inputValue.trim() || disabled}
            className="h-10 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg 
                       text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 ml-1" />
            إضافة
          </button>
        </div>
      </div>
    </form>
  );
};