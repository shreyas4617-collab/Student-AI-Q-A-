import React from 'react';
import { SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';
import {
  BookOpen,
  Calculator,
  Atom,
  Laptop,
  Code,
  Binary,
  Sparkles,
  Brain,
  Database,
  Cpu,
  Network,
  ShieldCheck,
  Languages,
  Globe
} from 'lucide-react';

interface SubjectBarProps {
  selectedSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Calculator,
  Atom,
  Laptop,
  Code,
  Binary,
  Sparkles,
  Brain,
  Database,
  Cpu,
  Network,
  ShieldCheck,
  Languages,
  Globe
};

export const SubjectBar: React.FC<SubjectBarProps> = ({ selectedSubject, onSelectSubject }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6 shadow-2xs overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Subject:
        </span>
        {SUBJECTS.map((sub) => {
          const IconComponent = ICON_MAP[sub.iconName] || BookOpen;
          const isSelected = selectedSubject === sub.id;

          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 ring-2 ring-indigo-600/30 font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
