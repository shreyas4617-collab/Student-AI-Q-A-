import React from 'react';
import { Sigma, X } from 'lucide-react';

interface MathSolverWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSymbol: (symbol: string) => void;
}

const MATH_SYMBOLS = [
  { label: 'Fraction', symbol: '\\frac{a}{b}', preview: 'a/b' },
  { label: 'Square Root', symbol: '\\sqrt{x}', preview: '√x' },
  { label: 'Power', symbol: 'x^{2}', preview: 'x²' },
  { label: 'Subscript', symbol: 'x_{1}', preview: 'x₁' },
  { label: 'Integral', symbol: '\\int_{a}^{b}', preview: '∫' },
  { label: 'Summation', symbol: '\\sum_{i=1}^{n}', preview: '∑' },
  { label: 'Limit', symbol: '\\lim_{x \\to 0}', preview: 'lim' },
  { label: 'Pi', symbol: '\\pi', preview: 'π' },
  { label: 'Theta', symbol: '\\theta', preview: 'θ' },
  { label: 'Infinity', symbol: '\\infty', preview: '∞' },
  { label: 'Not Equal', symbol: '\\neq', preview: '≠' },
  { label: 'Less Equal', symbol: '\\le', preview: '≤' },
  { label: 'Greater Equal', symbol: '\\ge', preview: '≥' },
  { label: 'Plus Minus', symbol: '\\pm', preview: '±' },
  { label: 'Quadratic Formula', symbol: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', preview: 'Quadratic' },
  { label: 'Pythagorean', symbol: 'a^2 + b^2 = c^2', preview: 'a²+b²=c²' },
];

export const MathSolverWidget: React.FC<MathSolverWidgetProps> = ({
  isOpen,
  onClose,
  onInsertSymbol,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-slate-900 text-slate-100 border border-slate-700 rounded-xl p-3 shadow-xl mb-3 transition-all animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sigma className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200">
            Math Formula & Symbol Keyboard
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-xs p-1 rounded-md hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto pr-1">
        {MATH_SYMBOLS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onInsertSymbol(item.symbol)}
            title={item.label}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/40 hover:border-indigo-500 border border-slate-700 transition-all text-xs font-mono text-indigo-300 hover:text-white"
          >
            <span className="font-semibold">{item.preview}</span>
            <span className="text-[9px] text-slate-400 truncate w-full text-center mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
