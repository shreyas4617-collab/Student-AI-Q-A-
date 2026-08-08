import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { QuizQuestion, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';

interface QuizModeProps {
  selectedSubject: SubjectId;
}

export const QuizMode: React.FC<QuizModeProps> = ({ selectedSubject }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState<SubjectId>(selectedSubject || 'computer_science');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Generate quiz from API
  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setIsFinished(false);
    setSelectedAnswers({});
    setCurrentIndex(0);

    try {
      const res = await fetch('/api/qa/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || 'Core Fundamentals & Exam Prep',
          subject: subject,
          count: 5,
        }),
      });

      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
      } else {
        alert('Could not generate quiz. Please try again.');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      alert('Failed to generate quiz. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Prevent changing after selection

    const updated = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(updated);

    // Check if finished
    if (Object.keys(updated).length === quizQuestions.length) {
      setIsFinished(true);
      // Trigger confetti if high score
      let score = 0;
      quizQuestions.forEach((q, idx) => {
        if (updated[idx] === q.correctOptionIndex) score++;
      });
      if (score >= quizQuestions.length * 0.7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const currentQ = quizQuestions[currentIndex];
  const userScore = quizQuestions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctOptionIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" /> Exam Practice & MCQs Hub
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Interactive Student Quizzes</h2>
          <p className="text-sm text-indigo-200 max-w-xl">
            Generate customized 5-question MCQs on any topic with instant grading and detailed explanations for every option.
          </p>
        </div>
      </div>

      {/* Quiz Topic Generator Form */}
      {quizQuestions.length === 0 && !isLoading && (
        <form onSubmit={handleGenerateQuiz} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Create a Custom Quiz
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectId)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                Quiz Topic / Chapter
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search Trees, SQL Joins, Organic Reactions..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Preset Topic Chips */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400">Popular Quick Topics:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Data Structures & Algorithms', sub: 'dsa' },
                { name: 'SQL & Database Queries', sub: 'dbms' },
                { name: 'Python OOPs & Functions', sub: 'programming' },
                { name: 'OS Process Scheduling', sub: 'operating_systems' },
                { name: 'Algebra & Calculus Equations', sub: 'mathematics' },
              ].map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setTopic(item.name);
                    setSubject(item.sub as SubjectId);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 5-Question Quiz</span>
          </button>
        </form>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">Crafting Exam Questions...</h3>
            <p className="text-xs text-slate-500">Generating 5 MCQs with option explanations for topic "{topic || 'Core'}"</p>
          </div>
        </div>
      )}

      {/* Active Quiz Player */}
      {quizQuestions.length > 0 && !isLoading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {quizQuestions.length}
              </span>
              <p className="text-xs text-slate-500">{currentQ.topic || subject}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                Score: {userScore} / {quizQuestions.length}
              </span>
              <button
                onClick={() => setQuizQuestions([])}
                className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> New Quiz
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options Grid */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const userSelected = selectedAnswers[currentIndex];
                const isSelected = userSelected === optIdx;
                const isCorrect = currentQ.correctOptionIndex === optIdx;
                const hasAnswered = userSelected !== undefined;

                let optionStyle = "bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200";

                if (hasAnswered) {
                  if (isCorrect) {
                    optionStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold";
                  } else if (isSelected) {
                    optionStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold";
                  } else {
                    optionStyle = "opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(currentIndex, optIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after selection */}
            {selectedAnswers[currentIndex] !== undefined && (
              <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  <HelpCircle className="w-4 h-4" /> Explanation:
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Quiz Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIndex < quizQuestions.length - 1 ? (
              <button
                disabled={selectedAnswers[currentIndex] === undefined}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 flex items-center gap-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsFinished(true)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>View Results</span>
              </button>
            )}
          </div>

          {/* Results Modal/Section */}
          {isFinished && (
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 text-center animate-in zoom-in-95">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Quiz Completed!</h3>
                <p className="text-sm text-slate-300">
                  You scored <span className="text-amber-400 font-bold">{userScore} out of {quizQuestions.length}</span> (
                  {Math.round((userScore / quizQuestions.length) * 100)}%)
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleGenerateQuiz()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
                >
                  Try Another Quiz
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
