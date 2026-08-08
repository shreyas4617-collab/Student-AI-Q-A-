import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  X,
  Mic,
  MicOff,
  Sigma,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Code2,
  Calculator
} from 'lucide-react';
import { SubjectId, AnswerMode } from '../types';
import { SUBJECTS, PRESET_PROMPTS } from '../data/subjects';
import { MathSolverWidget } from './MathSolverWidget';

interface AskInputProps {
  onSendQuestion: (
    question: string,
    subject: SubjectId,
    mode: AnswerMode,
    imageBase64?: string,
    mimeType?: string
  ) => void;
  isLoading: boolean;
  selectedSubject: SubjectId;
  setSelectedSubject: (subj: SubjectId) => void;
}

export const AskInput: React.FC<AskInputProps> = ({
  onSendQuestion,
  isLoading,
  selectedSubject,
  setSelectedSubject,
}) => {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<AnswerMode>('standard');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [showMathSymbols, setShowMathSymbols] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [question]);

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        const base64Data = result.split(',')[1];
        setImageBase64(base64Data);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(undefined);
    setImageMimeType(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setQuestion((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleInsertMathSymbol = (symbol: string) => {
    setQuestion((prev) => prev + ' ' + symbol + ' ');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!question.trim() && !imageBase64) || isLoading) return;

    onSendQuestion(question, selectedSubject, mode, imageBase64, imageMimeType);
    setQuestion('');
    removeImage();
    setShowMathSymbols(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Filtered preset prompts matching active subject
  const currentPresets = PRESET_PROMPTS.filter(
    (p) => selectedSubject === 'all' || p.subject === selectedSubject
  );

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-lg transition-colors">
      <div className="max-w-4xl mx-auto space-y-3">
        
        {/* Preset Prompt Chips */}
        {currentPresets.length > 0 && !question && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Examples:
            </span>
            {currentPresets.slice(0, 4).map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setQuestion(preset.prompt);
                  if (preset.subject !== 'all') setSelectedSubject(preset.subject);
                }}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-all"
              >
                {preset.title}
              </button>
            ))}
          </div>
        )}

        {/* Math Keyboard Drawer */}
        <MathSolverWidget
          isOpen={showMathSymbols}
          onClose={() => setShowMathSymbols(false)}
          onInsertSymbol={handleInsertMathSymbol}
        />

        {/* Attached Image Preview */}
        {imagePreview && (
          <div className="relative inline-block bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-300 dark:border-slate-700">
            <img
              src={imagePreview}
              alt="Problem Upload"
              className="h-20 max-w-xs object-cover rounded-lg shadow-2xs"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md hover:bg-rose-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Controls Bar: Subject & Mode Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            
            <div className="flex items-center gap-2">
              {/* Subject Select */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Select */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as AnswerMode)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="standard" className="bg-white dark:bg-slate-900">Standard Answer</option>
                  <option value="step_by_step" className="bg-white dark:bg-slate-900">Step-by-Step Explanation</option>
                  <option value="exam_ready" className="bg-white dark:bg-slate-900">Exam-Friendly Format</option>
                  <option value="programming" className="bg-white dark:bg-slate-900">Programming Breakdown</option>
                  <option value="mathematics" className="bg-white dark:bg-slate-900">Math Formula & Solution</option>
                  <option value="definition" className="bg-white dark:bg-slate-900">Definition + Example</option>
                  <option value="mcq_solver" className="bg-white dark:bg-slate-900">MCQ Answer & Reason</option>
                </select>
              </div>
            </div>

            {/* Tool Toggles */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowMathSymbols(!showMathSymbols)}
                className={`p-1.5 rounded-lg flex items-center gap-1 border transition-all ${
                  showMathSymbols
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 border-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900'
                }`}
                title="Math Symbols Helper"
              >
                <Sigma className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Math Symbols</span>
              </button>
            </div>
          </div>

          {/* Textarea + Action buttons Container */}
          <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question in Math, Science, Python, DSA, OS, DBMS... or upload an image of your assignment"
              rows={1}
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base focus:outline-none resize-none min-h-[42px] max-h-40 px-1 py-1"
            />

            {/* Input buttons */}
            <div className="flex items-center gap-1">
              
              {/* Image upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach Textbook Problem Photo"
                className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Speech recognition button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isRecording ? 'Stop Recording' : 'Voice Input'}
                className={`p-2 rounded-xl transition-colors ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={(!question.trim() && !imageBase64) || isLoading}
                className={`p-2.5 rounded-xl font-medium transition-all flex items-center justify-center ${
                  (!question.trim() && !imageBase64) || isLoading
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Enter</kbd> to ask, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Shift+Enter</kbd> for new line</span>
            <span>Accurate, step-by-step student learning assistant</span>
          </div>

        </form>
      </div>
    </div>
  );
};
