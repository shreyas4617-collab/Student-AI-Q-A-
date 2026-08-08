import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookMarked,
  Search,
  Download,
  Trash2,
  Copy,
  Check,
  Tag,
  BookOpen
} from 'lucide-react';
import { QAMessage, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';

interface StudyNotesDrawerProps {
  notes: QAMessage[];
  onRemoveBookmark: (id: string) => void;
}

export const StudyNotesDrawer: React.FC<StudyNotesDrawerProps> = ({
  notes,
  onRemoveBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<SubjectId>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = notes.filter((note) => {
    const matchesSubject = filterSubject === 'all' || note.subject === filterSubject;
    const matchesSearch =
      note.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportMarkdown = () => {
    if (notes.length === 0) return;

    let content = `# My AI Study Notes & Q&A Collection\nGenerated on ${new Date().toLocaleDateString()}\n\n---\n\n`;

    notes.forEach((note, idx) => {
      content += `## Note ${idx + 1}: ${note.question}\n\n**Subject:** ${note.subject}\n**Date:** ${new Date(note.timestamp).toLocaleString()}\n\n${note.answer}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Study_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <BookMarked className="w-4 h-4" /> Personal Study Notes & Bookmarks
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Saved Q&A Repository</h2>
          <p className="text-sm text-teal-200">
            {notes.length} bookmarked answer{notes.length === 1 ? '' : 's'} saved for exam revision.
          </p>
        </div>

        {notes.length > 0 && (
          <button
            onClick={handleExportMarkdown}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export as Markdown (.md)
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      {notes.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in saved notes..."
              className="w-full bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value as SubjectId)}
              className="w-full sm:w-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">No saved notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any Q&A answer to save step-by-step solutions for quick revision later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const subjectMeta = SUBJECTS.find((s) => s.id === note.subject) || SUBJECTS[0];

            return (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${subjectMeta.badgeBg} ${subjectMeta.badgeTextColor}`}>
                    {subjectMeta.name}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(note.id, note.answer)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Copy Note"
                    >
                      {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Q: {note.question}
                  </h4>
                </div>

                <div className="markdown-body pt-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {note.answer}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
