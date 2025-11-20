import React, { useState, useCallback } from 'react';
import { Plus, Search, Pill } from 'lucide-react';

interface DrugInputProps {
  onAddDrug: (name: string) => void;
  disabled?: boolean;
}

export const DrugInput: React.FC<DrugInputProps> = ({ onAddDrug, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddDrug(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onAddDrug]);

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-10 group">
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'transform -translate-y-1' : ''}`}>
        {/* Decorative Icon */}
        <div className={`absolute right-5 pointer-events-none transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-slate-400'}`}>
          {inputValue ? <Pill className="h-6 w-6" /> : <Search className="h-6 w-6" />}
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          dir="auto"
          placeholder="اكتب اسم الدواء هنا (مثل: Panadol, Aspirin)..."
          className="block w-full py-5 pr-14 pl-36 bg-white border border-slate-200 rounded-2xl 
                     text-slate-800 placeholder-slate-400 shadow-sm
                     focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                     disabled:bg-slate-50 disabled:text-slate-500
                     text-lg font-medium transition-all duration-300 hover:border-blue-300"
        />
        
        <div className="absolute left-2.5">
          <button
            type="submit"
            disabled={!inputValue.trim() || disabled}
            className="h-11 flex items-center bg-slate-900 hover:bg-blue-600 text-white px-6 rounded-xl
                       text-sm font-bold shadow-md shadow-slate-200 hover:shadow-blue-500/30
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                       transition-all duration-200 active:scale-95"
          >
            <Plus className="h-5 w-5 ml-1.5" />
            إضافة
          </button>
        </div>
      </div>
      {isFocused && (
        <div className="absolute -bottom-6 right-4 text-xs text-slate-400 animate-in fade-in slide-in-from-top-1">
          اضغط Enter للإضافة السريعة
        </div>
      )}
    </form>
  );
};