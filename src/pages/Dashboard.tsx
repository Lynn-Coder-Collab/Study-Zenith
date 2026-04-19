import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award,
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const Dashboard: React.FC = () => {
  const { user } = useAppStore();

  const stats = [
    { label: 'Courses in Progress', value: '4', icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Study Hours', value: '14.2 hrs', icon: Clock, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Current Streak', value: `${user?.stats.streak} Days`, icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Total Points', value: user?.stats.points.toString(), icon: Award, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="p-8 space-y-8 theme-gradient-main min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Student Dashboard</h1>
          <p className="text-text-secondary text-sm font-medium">Keep it up! You're in the top 15% this week.</p>
        </div>
        <button className="bg-accent text-bg px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95 text-sm uppercase tracking-wider">
          <PlayCircle className="w-4 h-4" />
          Continue Learning
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="theme-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text-primary leading-none">{stat.value}</div>
            <div className="text-[12px] font-semibold text-text-secondary mt-2 uppercase tracking-wide">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="theme-card p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Learning Velocity</h2>
                <div className="text-2xl font-bold text-text-primary">14.2 hrs</div>
              </div>
              <span className="px-2 py-1 rounded-md bg-bg border border-border text-[11px] font-bold text-text-secondary uppercase tracking-widest">Last 7 Days</span>
            </div>
            
            <div className="flex-1 flex items-end gap-3 min-h-[160px] px-2">
              {[40, 60, 35, 80, 95, 50, 70].map((height, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-md transition-all ${i === 4 ? 'bg-accent' : 'bg-gradient-to-t from-accent/60 to-transparent opacity-60'}`} 
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="text-xs font-semibold text-success mt-4">↑ 12.4% from last week</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="theme-card p-6 border-accent bg-gradient-to-br from-surface to-bg relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Active Focus Session</h3>
                <div className="text-5xl font-extrabold text-accent text-center my-6 font-mono tabular-nums drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                  24:18
                </div>
                <div className="mt-auto flex justify-center">
                  <button className="bg-accent text-bg px-6 py-2 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                    Pause Session
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full blur-[80px] opacity-10" />
            </div>

            <div className="theme-card p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">AI Mentor</h3>
                <span className="text-[10px] text-success font-bold flex items-center gap-1.5 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  Online
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="text-[13px] text-text-primary bg-bg/50 p-3 rounded-xl rounded-bl-none border border-border italic mb-2">
                  "I noticed you struggled with Neural Backpropagation yesterday. Want a review?"
                </div>
              </div>
              <div className="mt-auto border border-border bg-bg/50 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] text-text-secondary">
                <span>Type a question...</span>
                <span className="text-[10px] font-bold">⌘ K</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="theme-card p-6 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-8">Leaderboard</h2>
            <div className="space-y-6 flex-1">
              {[1, 2, 3, 4, 5].map((pos) => (
                <div key={pos} className={`flex items-center gap-4 ${pos === 1 ? 'scale-105 origin-left' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    pos === 1 ? 'bg-warning/10 text-warning border border-warning/20' : 
                    pos === 2 ? 'bg-text-secondary/10 text-text-secondary border border-border' :
                    pos === 3 ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary/50 border border-border/10'
                  }`}>
                    {pos}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-border/50 border border-border overflow-hidden p-0.5">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${pos}`} className="w-full h-full rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-text-primary">Learner {pos}</div>
                    <div className="text-[11px] text-text-secondary font-semibold uppercase tracking-wider">2,450 XP</div>
                  </div>
                  {pos === 1 && <Award className="w-4 h-4 text-warning" />}
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2.5 bg-bg/50 border border-border text-text-secondary font-bold text-[11px] rounded-xl uppercase tracking-widest hover:text-text-primary transition-all">
              View Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
