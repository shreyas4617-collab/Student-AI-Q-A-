import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Flashcard, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';

interface FlashcardModeProps {
  selectedSubject: SubjectId;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ selectedSubject }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState<SubjectId>(selectedSubject || 'dsa');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFlashcards = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const res = await fetch('/api/qa/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || 'Core Exam Definitions & Formulas',
          subject: subject,
          count: 6,
        }),
      });

      const data = await res.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setCards(data.flashcards);
      } else {
        alert('Could not generate flashcards. Please try again.');
      }
    } catch (err) {
      console.error('Flashcards error:', err);
      alert('Failed to generate flashcards.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentCard = cards[currentIndex];

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Exam Revision Flashcards
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Rapid Term & Concept Memorization</h2>
          <p className="text-sm text-purple-200 max-w-xl">
            Flip through key definitions, algorithms, rules, and formulas before tests and exams.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      {cards.length === 0 && !isLoading && (
        <form onSubmit={handleGenerateFlashcards} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> Generate Flashcard Deck
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectId)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {SUBJECTS.filter(s => s.id !== 'all').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Topic / Unit
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. OSI Layers, Time Complexities, Thermodynamics..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 6-Flashcard Deck</span>
          </button>
        </form>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">Creating Flashcard Deck...</h3>
        </div>
      )}

      {/* Flashcard Player */}
      {cards.length > 0 && !isLoading && (
        <div className="space-y-6">
          
          {/* Deck Status Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 dark:text-emerald-400">
                Mastered: {masteredIds.size} / {cards.length}
              </span>
              <button
                onClick={() => setCards([])}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" /> New Deck
              </button>
            </div>
          </div>

          {/* Interactive 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 min-h-[280px] sm:min-h-[320px] cursor-pointer group"
          >
            <div
              className={`relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-2xl transition-all duration-500 transform-style-3d shadow-xl border border-slate-200 dark:border-slate-800 ${
                isFlipped ? 'rotate-y-180 bg-slate-900 text-white' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
              }`}
            >
              
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full p-8 flex flex-col justify-between backface-hidden rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Concept / Term
                  </span>
                  <span className="text-[11px] text-slate-400">Click to Flip 🔄</span>
                </div>

                <div className="my-auto text-center space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="text-center text-xs text-slate-400">
                  Tap to view definition & example
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-2xl bg-indigo-950 text-indigo-100">
                <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                  <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                    Answer & Example
                  </span>
                  <span className="text-[11px] text-indigo-400">Click to Flip 🔄</span>
                </div>

                <div className="my-auto space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="text-center text-xs text-indigo-400">
                  Topic: {currentCard.topic || subject}
                </div>
              </div>

            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((prev) => prev - 1);
                setIsFlipped(false);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                masteredIds.has(currentCard.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{masteredIds.has(currentCard.id) ? 'Mastered!' : 'Mark as Mastered'}</span>
            </button>

            <button
              disabled={currentIndex === cards.length - 1}
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setIsFlipped(false);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 flex items-center gap-1.5"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
