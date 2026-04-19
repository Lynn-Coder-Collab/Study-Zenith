import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Timer as TimerIcon, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ArrowLeft,
  Trophy,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const MOCK_QUESTIONS = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    explanation: 'Paris is the most populous city of France and its capital.'
  },
  {
    id: '2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    explanation: 'Mars is often called the Red Planet because iron minerals in the Martian soil oxidize, or rust, causing the soil and atmosphere to look red.'
  },
  {
    id: '3',
    text: 'What is the largest ocean on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
    explanation: 'The Pacific Ocean is the largest and deepest of Earths oceanic divisions.'
  }
];

const QuizEngine: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    if (isFinished || isAnswered) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isAnswered]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 100 + (streak * 10));
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981']
      });
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      if (lives <= 1) {
        setIsFinished(true);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl max-w-lg w-full text-center space-y-8"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center text-white rotate-12 shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900">Quiz Completed!</h1>
            <p className="text-slate-500 font-bold">You did an amazing job today.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[2rem]">
              <div className="text-3xl font-black text-indigo-600">{score}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Score</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem]">
              <div className="text-3xl font-black text-orange-600">{Math.round((score / (MOCK_QUESTIONS.length * 100)) * 100)}%</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/quiz')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Back to Quizzes
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-bg p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto theme-gradient-main">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/quiz')}
          className="p-3 bg-surface border border-border rounded-2xl text-text-secondary hover:text-text-primary transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2.5 rounded-2xl border border-red-500/20 font-black text-xs uppercase tracking-widest">
            <Heart className={`w-4 h-4 ${lives < 3 ? 'animate-pulse' : ''} fill-current`} />
            {lives} Lives
          </div>
          <div className="flex items-center gap-2 bg-warning/10 text-warning px-5 py-2.5 rounded-2xl border border-warning/20 font-black text-xs uppercase tracking-widest">
            <Flame className="w-4 h-4 fill-current" />
            {streak} streak
          </div>
          <div className="flex items-center gap-2 bg-accent/10 text-accent px-5 py-2.5 rounded-2xl border border-accent/20 font-black w-32 justify-center text-xs uppercase tracking-widest">
            <TimerIcon className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-400 animate-pulse' : ''}`} />
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="relative h-2 bg-surface rounded-full overflow-hidden shadow-inner border border-border">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-success"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 space-y-10"
      >
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-accent">Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary leading-[1.2]">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = selectedOption === index;
            
            let variant = 'default';
            if (isAnswered) {
              if (isCorrect) variant = 'correct';
              else if (isSelected) variant = 'wrong';
              else variant = 'dimmed';
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`group relative p-8 rounded-[2rem] text-left border-2 transition-all ${
                  variant === 'default' ? 'bg-surface border-border hover:border-accent hover:bg-accent/5 active:scale-95' :
                  variant === 'correct' ? 'bg-success/10 border-success text-success' :
                  variant === 'wrong' ? 'bg-red-500/10 border-red-500 text-red-400' : 
                  'bg-surface/50 border-border opacity-30 scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-success" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bottom-0 left-0 right-0 p-10 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] z-20 ${
              selectedOption === currentQuestion.correctAnswer ? 'bg-success text-bg' : 'bg-red-500 text-bg'
            }`}
          >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-bg/20 rounded-3xl flex items-center justify-center shrink-0 border border-bg/10">
                  {selectedOption === currentQuestion.correctAnswer ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </div>
                <div>
                  <div className="text-3xl font-black italic tracking-tighter uppercase mb-2">{selectedOption === currentQuestion.correctAnswer ? 'Brilliant!' : 'Not Quite'}</div>
                  <div className="text-bg/80 font-bold text-lg max-w-2xl leading-snug">{currentQuestion.explanation}</div>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="bg-bg text-text-primary px-12 py-5 rounded-2xl font-black text-xl shadow-2xl active:scale-95 transition-all whitespace-nowrap group"
              >
                {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'See Results' : 'Next Protocol'}
                <ChevronRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizEngine;
