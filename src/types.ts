export type SubjectId = 
  | 'all'
  | 'mathematics'
  | 'science'
  | 'computer_science'
  | 'ai'
  | 'programming'
  | 'dsa'
  | 'dbms'
  | 'operating_systems'
  | 'computer_networks'
  | 'machine_learning'
  | 'cyber_security'
  | 'english'
  | 'general_knowledge';

export type AnswerMode = 
  | 'standard'
  | 'step_by_step'
  | 'exam_ready'
  | 'programming'
  | 'mathematics'
  | 'definition'
  | 'mcq_solver';

export interface QAMessage {
  id: string;
  timestamp: string;
  subject: SubjectId;
  mode: AnswerMode;
  question: string;
  imagePreview?: string;
  answer: string;
  formattedSections?: {
    questionRestated?: string;
    answerBody?: string;
    example?: string;
    keyPoints?: string[];
    // Programming specific
    algorithm?: string;
    code?: string;
    codeLanguage?: string;
    output?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    // Mathematics specific
    formula?: string;
    stepByStepSolution?: string;
    finalAnswer?: string;
    // MCQ specific
    mcqAnswer?: string;
    mcqExplanation?: string;
  };
  isBookmarked?: boolean;
}

export interface PresetPrompt {
  id: string;
  subject: SubjectId;
  title: string;
  prompt: string;
  category: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topic: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: SubjectId;
  topic: string;
}

export interface StudyNote {
  id: string;
  title: string;
  subject: SubjectId;
  date: string;
  content: string;
  tags: string[];
}
