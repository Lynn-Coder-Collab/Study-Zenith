import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ChevronLeft, 
  CheckCircle2, 
  Settings, 
  HelpCircle,
  Clock,
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAppStore } from '../../store/useAppStore';
import toast from 'react-hot-toast';
import { Question } from '../../types';

const AdminQuizCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([{
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    type: 'multiple-choice'
  }]);

  const addQuestion = () => {
    setQuestions([...questions, {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      type: 'multiple-choice'
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Omit<Question, 'id'>, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validation
    if (!title.trim()) return toast.error('Quiz title is required');
    if (questions.some(q => !q.text.trim())) return toast.error('All questions must have text');
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'quizzes'), {
        title,
        description,
        category,
        difficulty,
        questions: questions.map((q, i) => ({ ...q, id: (i + 1).toString() })),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      
      toast.success('Quiz created successfully!');
      navigate('/quiz');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to create quiz: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 theme-gradient-main min-h-full pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/quiz')}
            className="p-3 bg-surface border border-border rounded-2xl text-text-secondary hover:text-accent hover:border-accent transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-text-primary tracking-tight italic uppercase">Quiz Architect</h1>
            <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.3em]">Protocol: Create New Master Assessment</p>
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-bg rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Settings className="w-4 h-4" />
            </motion.div>
          ) : <Save className="w-4 h-4" />}
          Finalize Protocol
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Core Configuration */}
        <section className="theme-card p-10 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-text-primary uppercase tracking-widest">Metadata Config</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Quiz Identifier</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter High-Performance Title..."
                  className="w-full bg-bg border border-border rounded-2xl px-6 py-4 text-text-primary font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Mission briefing</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What should students expect from this challenge?"
                  rows={4}
                  className="w-full bg-bg border border-border rounded-2xl px-6 py-4 text-text-primary font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Academy Realm</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-bg border border-border rounded-2xl px-6 py-4 text-text-primary font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none appearance-none"
                  >
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Computer Science</option>
                    <option>Languages</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">Complexity Lvl</label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          difficulty === d 
                            ? 'bg-accent text-bg border-transparent shadow-lg shadow-accent/10' 
                            : 'bg-bg text-text-secondary border-border hover:border-accent hover:text-accent'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-bg/50 border border-border rounded-[2rem] p-8 flex items-start gap-4 italic text-sm text-text-secondary">
                <LayoutGrid className="w-5 h-5 text-accent shrink-0 mt-1" />
                <p>Architect Tip: Ensure your quiz titles are evocative and categorizations are precise for optimal neural indexing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Question Nodes */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center text-success">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-text-primary uppercase tracking-widest">Assessment Matrix</h2>
            </div>
            <div className="px-6 py-2 bg-surface border border-border rounded-full text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
              Node Count: {questions.length}
            </div>
          </div>

          <div className="space-y-8">
            <AnimatePresence>
              {questions.map((q, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="theme-card p-10 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-8 right-8 p-3 text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bg border border-border rounded-2xl flex items-center justify-center font-black text-accent text-lg">
                        {qIndex + 1}
                      </div>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                        placeholder="Enter core question logic..."
                        className="flex-1 bg-transparent text-2xl font-bold text-text-primary outline-none placeholder:opacity-20 border-b border-border focus:border-accent transition-colors pb-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="relative">
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all ${
                            q.correctAnswer === oIndex 
                              ? 'bg-success text-bg border-transparent' 
                              : 'bg-bg text-text-secondary border-border'
                          }`}>
                            {String.fromCharCode(65 + oIndex)}
                          </div>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className={`w-full bg-bg border border-border rounded-2xl pl-16 pr-6 py-4 text-text-primary font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none ${
                               q.correctAnswer === oIndex ? 'border-success ring-4 ring-success/10' : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                              q.correctAnswer === oIndex ? 'text-success' : 'text-text-secondary/20 hover:text-success'
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                       <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                         <Sparkles className="w-4 h-4 text-warning" />
                         Logic Explanation
                       </div>
                       <textarea
                        value={q.explanation}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        placeholder="Explain the neural path to the correct solution..."
                        rows={2}
                        className="w-full bg-surface/50 border border-border rounded-2xl px-6 py-4 text-text-primary font-medium text-sm focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-10 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-text-secondary hover:text-accent hover:border-accent hover:bg-accent/5 transition-all group active:scale-95"
            >
              <div className="w-16 h-16 bg-surface border border-border rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <div className="text-sm font-black uppercase tracking-[0.3em]">Integrate New Assessment Node</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminQuizCreate;
