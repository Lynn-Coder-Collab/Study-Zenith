import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, 
  Timer, 
  ChevronRight, 
  Target,
  Trophy,
  History
} from 'lucide-react';

const QuizListPage: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'math', name: 'Mathematics', icon: '📐', count: 12, color: 'bg-blue-50 text-blue-600' },
    { id: 'science', name: 'Science', icon: '🧪', count: 8, color: 'bg-green-50 text-green-600' },
    { id: 'history', name: 'History', icon: '📜', count: 15, color: 'bg-amber-50 text-amber-600' },
    { id: 'cs', name: 'Computer Science', icon: '💻', count: 20, color: 'bg-purple-50 text-purple-600' },
  ];

  const featuredQuizzes = [
    { id: 'q1', title: 'Calculus Fundamentals', questions: 15, time: '20 min', difficulty: 'Medium', participants: 450 },
    { id: 'q2', title: 'Modern Web Development', questions: 25, time: '30 min', difficulty: 'Hard', participants: 1200 },
    { id: 'q3', title: 'Ancient Civilizations', questions: 10, time: '10 min', difficulty: 'Easy', participants: 800 },
  ];

  return (
    <div className="p-8 space-y-12 theme-gradient-main min-h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Quiz Engine</h1>
          <p className="text-text-secondary font-medium text-lg">Test your knowledge and climb the leaderboard.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl font-bold text-xs text-text-secondary hover:text-text-primary transition-all uppercase tracking-widest">
            <History className="w-4 h-4 text-accent" />
            My History
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl font-black text-xs shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all uppercase tracking-widest active:scale-95">
            <BrainCircuit className="w-4 h-4" />
            Random Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group cursor-pointer"
          >
            <div className={`p-8 rounded-[2rem] bg-surface border border-border flex flex-col items-center justify-center gap-4 transition-all group-hover:border-accent group-hover:bg-accent/5 shadow-sm group-hover:shadow-xl group-hover:shadow-accent/5`}>
              <span className="text-5xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <div className="text-center">
                <div className="font-bold text-text-primary text-sm group-hover:text-accent transition-colors">{cat.name}</div>
                <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">{cat.count} Quizzes</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-[12px] font-black text-text-secondary flex items-center gap-2 uppercase tracking-[0.2em] mb-8">
          <Target className="w-4 h-4 text-accent" />
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredQuizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="group theme-card p-8 hover:border-accent hover:shadow-2xl hover:shadow-accent/5 transition-all cursor-pointer flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    quiz.difficulty === 'Easy' ? 'text-success' :
                    quiz.difficulty === 'Medium' ? 'text-warning' : 'text-red-400'
                  }`}>
                    {quiz.difficulty} Level
                  </span>
                  <h3 className="text-2xl font-bold text-text-primary leading-tight group-hover:text-accent transition-colors">
                    {quiz.title}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-bg border border-border rounded-2xl flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:bg-accent/10 transition-colors shrink-0">
                  <BrainCircuit className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center gap-6 text-[11px] font-black text-text-secondary uppercase tracking-widest mb-10 relative z-10">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  {quiz.questions} Qs
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-accent" />
                  {quiz.time}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  {quiz.participants}
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-border mt-auto relative z-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(p => (
                    <div key={p} className="w-8 h-8 rounded-full border-2 border-surface bg-border/30 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=p${p}`} className="w-full h-full" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-surface bg-accent text-[10px] font-black text-bg flex items-center justify-center">+12</div>
                </div>
                <div className="w-11 h-11 bg-bg border border-border rounded-2xl flex items-center justify-center text-text-secondary group-hover:bg-accent group-hover:text-bg group-hover:border-transparent transition-all group-hover:translate-x-1">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizListPage;
