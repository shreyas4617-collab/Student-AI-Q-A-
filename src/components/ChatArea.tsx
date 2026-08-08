import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { QAMessage, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';

interface ChatAreaProps {
  messages: QAMessage[];
  isLoading: boolean;
  onBookmarkToggle: (id: string) => void;
  onQuickFollowUp: (prompt: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onBookmarkToggle,
  onQuickFollowUp,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Copy text to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-to-speech read aloud
  const handleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = text.replace(/[#*`_~\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Bot className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            What concept or question can I help you learn today?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Get clear, step-by-step educational answers, complete code examples, formulas, and exam-friendly summaries across 13+ subjects.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Step-by-Step
            </span>
            <p className="text-slate-500 dark:text-slate-400">Detailed logic, formulas, calculations & code breakdowns.</p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Exam-Ready
            </span>
            <p className="text-slate-500 dark:text-slate-400">Key points, definitions, examples & time complexities.</p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Multimodal
            </span>
            <p className="text-slate-500 dark:text-slate-400">Snap or upload textbook assignment photos for fast solving.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {messages.map((msg) => {
        const subjectMeta = SUBJECTS.find((s) => s.id === msg.subject) || SUBJECTS[0];

        return (
          <div key={msg.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-3">
            
            {/* Student Question Card */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-md space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-indigo-200 pb-1 border-b border-indigo-500/40 font-medium">
                  <User className="w-3.5 h-3.5" />
                  <span>Student Question</span>
                  <span>•</span>
                  <span className="uppercase tracking-wider">{subjectMeta.name}</span>
                </div>

                {msg.imagePreview && (
                  <img
                    src={msg.imagePreview}
                    alt="Uploaded question"
                    className="max-h-52 rounded-lg border border-indigo-400/30 object-contain my-2"
                  />
                )}

                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.question}
                </p>
              </div>
            </div>

            {/* AI Tutor Answer Card */}
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl rounded-tl-none max-w-[92%] sm:max-w-[88%] shadow-sm space-y-4 w-full">
                
                {/* Response Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${subjectMeta.badgeBg} ${subjectMeta.badgeTextColor}`}>
                      {subjectMeta.name}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeech(msg.id, msg.answer)}
                      title={speakingId === msg.id ? 'Stop Reading' : 'Read Aloud'}
                      className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        speakingId === msg.id ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800' : ''
                      }`}
                    >
                      {speakingId === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleCopy(msg.id, msg.answer)}
                      title="Copy Answer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onBookmarkToggle(msg.id)}
                      title={msg.isBookmarked ? 'Remove from Saved Notes' : 'Save to Study Notes'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        msg.isBookmarked
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {msg.isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Answer Content rendered with Markdown */}
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.answer}
                  </ReactMarkdown>
                </div>

                {/* Follow up suggestions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Deepen your understanding:
                  </span>
                  <button
                    onClick={() => onQuickFollowUp(`Can you give another real-world example of ${msg.question}?`)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium transition-all flex items-center gap-1"
                  >
                    <span>Give another example</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onQuickFollowUp(`Create a practice exam question on this exact topic with step-by-step solution.`)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium transition-all flex items-center gap-1"
                  >
                    <span>Test me with a problem</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        );
      })}

      {/* Loading Indicator Card */}
      {isLoading && (
        <div className="flex items-start gap-3 justify-start animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
            <Bot className="w-5 h-5 animate-spin" />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl rounded-tl-none max-w-md shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Solving step-by-step...
              </span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
