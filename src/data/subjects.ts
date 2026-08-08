import { SubjectId, PresetPrompt } from '../types';

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  iconName: string;
  badgeBg: string;
  badgeTextColor: string;
  accentColor: string;
  description: string;
}

export const SUBJECTS: SubjectConfig[] = [
  {
    id: 'all',
    name: 'All Subjects',
    iconName: 'BookOpen',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeTextColor: 'text-indigo-700 dark:text-indigo-300',
    accentColor: 'border-indigo-500',
    description: 'Ask any question across mathematics, science, technology, humanities and general knowledge.'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    iconName: 'Calculator',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeTextColor: 'text-blue-700 dark:text-blue-300',
    accentColor: 'border-blue-500',
    description: 'Algebra, Calculus, Geometry, Trigonometry, Statistics, Probability, Probability & Equations.'
  },
  {
    id: 'science',
    name: 'Science',
    iconName: 'Atom',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeTextColor: 'text-emerald-700 dark:text-emerald-300',
    accentColor: 'border-emerald-500',
    description: 'Physics, Chemistry, Biology, Environmental Sciences, Thermodynamics, Organic Chemistry.'
  },
  {
    id: 'computer_science',
    name: 'Computer Science',
    iconName: 'Laptop',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeTextColor: 'text-purple-700 dark:text-purple-300',
    accentColor: 'border-purple-500',
    description: 'Core concepts, Logic gates, Compiler design, Theory of Computation, System Design.'
  },
  {
    id: 'programming',
    name: 'Programming',
    iconName: 'Code',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    badgeTextColor: 'text-cyan-700 dark:text-cyan-300',
    accentColor: 'border-cyan-500',
    description: 'Python, Java, C, C++, JavaScript, TypeScript, Go, Rust, OOPs principles, debugging.'
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    iconName: 'Binary',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeTextColor: 'text-amber-700 dark:text-amber-300',
    accentColor: 'border-amber-500',
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting, Searching, Dynamic Programming, Greedy Algorithms.'
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    iconName: 'Sparkles',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeTextColor: 'text-rose-700 dark:text-rose-300',
    accentColor: 'border-rose-500',
    description: 'Search algorithms, Knowledge Representation, Expert Systems, NLP, Generative AI.'
  },
  {
    id: 'machine_learning',
    name: 'Machine Learning',
    iconName: 'Brain',
    badgeBg: 'bg-pink-100 dark:bg-pink-950/60',
    badgeTextColor: 'text-pink-700 dark:text-pink-300',
    accentColor: 'border-pink-500',
    description: 'Supervised & Unsupervised Learning, Regression, Classification, Neural Networks, Deep Learning.'
  },
  {
    id: 'dbms',
    name: 'Database Management',
    iconName: 'Database',
    badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
    badgeTextColor: 'text-teal-700 dark:text-teal-300',
    accentColor: 'border-teal-500',
    description: 'SQL Queries, Relational Algebra, Normalization (1NF to BCNF), Indexing, Transactions & ACID.'
  },
  {
    id: 'operating_systems',
    name: 'Operating Systems',
    iconName: 'Cpu',
    badgeBg: 'bg-violet-100 dark:bg-violet-950/60',
    badgeTextColor: 'text-violet-700 dark:text-violet-300',
    accentColor: 'border-violet-500',
    description: 'Process Scheduling, Paging & Virtual Memory, Deadlocks, Semaphores, Synchronization, Threads.'
  },
  {
    id: 'computer_networks',
    name: 'Computer Networks',
    iconName: 'Network',
    badgeBg: 'bg-orange-100 dark:bg-orange-950/60',
    badgeTextColor: 'text-orange-700 dark:text-orange-300',
    accentColor: 'border-orange-500',
    description: 'OSI Model, TCP/IP Suite, Routing Algorithms, IP Addressing & Subnetting, DNS, HTTP/HTTPS.'
  },
  {
    id: 'cyber_security',
    name: 'Cyber Security',
    iconName: 'ShieldCheck',
    badgeBg: 'bg-red-100 dark:bg-red-950/60',
    badgeTextColor: 'text-red-700 dark:text-red-300',
    accentColor: 'border-red-500',
    description: 'Cryptography, Symmetric vs Asymmetric, Network Attacks, Firewalls, Authentication Protocols.'
  },
  {
    id: 'english',
    name: 'English & Grammar',
    iconName: 'Languages',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeTextColor: 'text-sky-700 dark:text-sky-300',
    accentColor: 'border-sky-500',
    description: 'Grammar rules, Vocabulary, Reading Comprehension, Essay Structure, Rhetorical Devices.'
  },
  {
    id: 'general_knowledge',
    name: 'General Knowledge',
    iconName: 'Globe',
    badgeBg: 'bg-lime-100 dark:bg-lime-950/60',
    badgeTextColor: 'text-lime-700 dark:text-lime-300',
    accentColor: 'border-lime-500',
    description: 'World History, Geography, Current Affairs, Inventions, Scientific Discoveries, Civics.'
  }
];

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'p1',
    subject: 'mathematics',
    title: 'Quadratic Equation Solver',
    prompt: 'Solve $2x^2 + 5x - 3 = 0$ using the quadratic formula with complete step-by-step calculations.',
    category: 'Algebra'
  },
  {
    id: 'p2',
    subject: 'dsa',
    title: 'Binary Search Implementation',
    prompt: 'Explain Binary Search algorithm in C++ with code, dry run on array [2, 5, 8, 12, 16, 23, 38], and time/space complexity.',
    category: 'Algorithms'
  },
  {
    id: 'p3',
    subject: 'operating_systems',
    title: 'Deadlock & Dining Philosophers',
    prompt: 'What are the four necessary conditions for a Deadlock in Operating Systems? Explain with a real-world exam diagram example.',
    category: 'OS Theory'
  },
  {
    id: 'p4',
    subject: 'computer_networks',
    title: 'TCP vs UDP Comparison',
    prompt: 'Compare TCP vs UDP protocols in an exam-friendly table format with key differences, header sizes, and real-world use cases.',
    category: 'Networking'
  },
  {
    id: 'p5',
    subject: 'dbms',
    title: 'Database Normalization',
    prompt: 'Explain Database Normalization (1NF, 2NF, 3NF, BCNF) with clear definitions, explanations, and practical relation table examples.',
    category: 'DBMS'
  },
  {
    id: 'p6',
    subject: 'programming',
    title: 'Python OOPs Concepts',
    prompt: 'Explain Object-Oriented Programming (OOP) core pillars in Python with clean code examples for Inheritance, Encapsulation, and Polymorphism.',
    category: 'Python'
  },
  {
    id: 'p7',
    subject: 'science',
    title: 'Newton’s Laws of Motion',
    prompt: 'State and explain Newton’s Three Laws of Motion with real-life examples, formulas, and SI units.',
    category: 'Physics'
  },
  {
    id: 'p8',
    subject: 'machine_learning',
    title: 'Supervised vs Unsupervised ML',
    prompt: 'What is the difference between Supervised and Unsupervised Machine Learning? Give examples of algorithms in each category.',
    category: 'AI & ML'
  }
];
