import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SubjectBar } from './components/SubjectBar';
import { ChatArea } from './components/ChatArea';
import { AskInput } from './components/AskInput';
import { QuizMode } from './components/QuizMode';
import { FlashcardMode } from './components/FlashcardMode';
import { StudyNotesDrawer } from './components/StudyNotesDrawer';
import { QAMessage, SubjectId, AnswerMode } from './types';

const STORAGE_KEY = 'student_ai_qa_messages';

export default function App() {
  const [activeTab, setActiveTab] = useState<'qa' | 'quiz' | 'flashcards' | 'notes'>('qa');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('all');
  const [messages, setMessages] = useState<QAMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved Q&A messages:', e);
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save Q&A messages:', e);
    }
  }, [messages]);

  // Handle asking a question
  const handleSendQuestion = async (
    question: string,
    subject: SubjectId,
    mode: AnswerMode,
    imageBase64?: string,
    mimeType?: string
  ) => {
    setIsLoading(true);

    const tempId = Date.now().toString();
    const newMsg: QAMessage = {
      id: tempId,
      timestamp: new Date().toISOString(),
      subject,
      mode,
      question: question || 'Solved attached image problem',
      imagePreview: imageBase64 ? `data:${mimeType || 'image/png'};base64,${imageBase64}` : undefined,
      answer: '',
      isBookmarked: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await fetch('/api/qa/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          subject,
          mode,
          imageBase64,
          mimeType,
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, answer: data.answer } : msg
        )
      );
    } catch (err: any) {
      console.error('Error asking Q&A Bot:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                answer: `⚠️ **Error:** ${
                  err.message || 'Failed to get an answer. Please check your network or try again.'
                }`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle bookmark on message
  const handleBookmarkToggle = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, isBookmarked: !msg.isBookmarked } : msg
      )
    );
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear your Q&A chat history? Saved study notes will be preserved.')) {
      setMessages((prev) => prev.filter((m) => m.isBookmarked));
    }
  };

  const savedNotes = messages.filter((m) => m.isBookmarked);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        savedNotesCount={savedNotes.length}
        onClearChat={handleClearChat}
      />

      {/* Horizontal Subject Bar */}
      {activeTab === 'qa' && (
        <SubjectBar
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
        />
      )}

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-4">
        {activeTab === 'qa' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onBookmarkToggle={handleBookmarkToggle}
              onQuickFollowUp={(prompt) =>
                handleSendQuestion(prompt, selectedSubject, 'step_by_step')
              }
            />

            <AskInput
              onSendQuestion={handleSendQuestion}
              isLoading={isLoading}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          </div>
        )}

        {activeTab === 'quiz' && <QuizMode selectedSubject={selectedSubject} />}

        {activeTab === 'flashcards' && <FlashcardMode selectedSubject={selectedSubject} />}

        {activeTab === 'notes' && (
          <StudyNotesDrawer
            notes={savedNotes}
            onRemoveBookmark={handleBookmarkToggle}
          />
        )}
      </main>

    </div>
  );
}
