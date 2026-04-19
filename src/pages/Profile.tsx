import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  User as UserIcon, 
  Settings, 
  Award, 
  Clock, 
  Calendar,
  ChevronRight,
  Shield,
  Bell,
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';

const ProfilePage: React.FC = () => {
  const { user } = useAppStore();

  const achievements = [
    { title: 'Fast Learner', desc: 'Completed 5 quizzes in a day', icon: '⚡', color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Night Owl', desc: 'Studied after 10 PM for 3 days', icon: '🦉', color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Perfect Score', desc: 'Got 100% on a hard quiz', icon: '🎯', color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 pb-24 theme-gradient-main min-h-full">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
        <div className="relative group">
          <div className="w-44 h-44 rounded-[3rem] bg-gradient-to-br from-accent to-success p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-[2.8rem] bg-surface"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-surface rounded-2xl border border-border shadow-xl flex items-center justify-center text-text-secondary hover:text-accent transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 space-y-8 pt-4">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-5xl font-black text-text-primary tracking-tighter italic">{user?.displayName}</h1>
              <div className="px-4 py-1.5 bg-accent/20 text-accent text-[11px] font-black uppercase tracking-[0.2em] rounded-full border border-accent/20">Pro Student</div>
            </div>
            <p className="text-text-secondary font-bold text-lg flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-5 h-5 text-accent" />
              {user?.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-3 bg-surface px-6 py-4 rounded-[1.5rem] border border-border shadow-sm">
              <Award className="w-6 h-6 text-warning" />
              <div className="text-lg font-bold text-text-primary leading-none">{user?.stats.points} <span className="text-[10px] uppercase text-text-secondary font-black ml-1">XP</span></div>
            </div>
            <div className="flex items-center gap-3 bg-surface px-6 py-4 rounded-[1.5rem] border border-border shadow-sm">
              <Shield className="w-6 h-6 text-success" />
              <div className="text-lg font-bold text-text-primary leading-none">Lvl {user?.stats.level}</div>
            </div>
            <div className="flex items-center gap-3 bg-surface px-6 py-4 rounded-[1.5rem] border border-border shadow-sm">
              <Calendar className="w-6 h-6 text-accent" />
              <div className="text-lg font-bold text-text-primary leading-none">Class of '26</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="theme-card p-10 space-y-10 flex flex-col">
          <h2 className="text-2xl font-black text-text-primary flex items-center gap-4">
            <Award className="w-7 h-7 text-accent" />
            Hall of Achievements
          </h2>
          <div className="space-y-8 flex-1">
            {achievements.map((acc, i) => (
              <motion.div 
                key={acc.title}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="flex items-center gap-6 group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] ${acc.color} flex items-center justify-center text-3xl shadow-sm transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-accent/5`}>
                  {acc.icon}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">{acc.title}</div>
                  <div className="text-xs text-text-secondary font-bold uppercase tracking-widest">{acc.desc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-border group-hover:text-accent transition-all group-hover:translate-x-1" />
              </motion.div>
            ))}
          </div>
          <button className="w-full py-4 border border-border text-text-secondary font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-surface hover:text-text-primary hover:border-accent transition-all">
            Unlock More Badges
          </button>
        </div>

        <div className="theme-card p-10 space-y-10">
          <h2 className="text-2xl font-black text-text-primary flex items-center gap-4">
            <Clock className="w-7 h-7 text-accent" />
            Learning Velocity
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-bg border border-border p-7 rounded-[2rem]">
              <div className="text-4xl font-black text-text-primary tracking-tighter">42</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mt-2">Sessions Logged</div>
            </div>
            <div className="bg-bg border border-border p-7 rounded-[2rem]">
              <div className="text-4xl font-black text-text-primary tracking-tighter">14.2h</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mt-2">Focus Time</div>
            </div>
            <div className="bg-gradient-to-br from-accent to-success p-10 rounded-[2.5rem] text-bg col-span-2 shadow-2xl shadow-accent/10 relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="flex justify-between items-center mb-6">
                   <div className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Weekly Mastery Goal</div>
                   <div className="text-2xl font-black italic">75%</div>
                 </div>
                 <div className="h-4 bg-bg/20 rounded-full overflow-hidden mb-4 border border-white/10">
                   <div className="h-full bg-white w-3/4 rounded-full" />
                 </div>
                 <p className="text-sm font-bold leading-tight opacity-90">Outstanding performance! You are only 2 quizzes away from hitting your weekly mastery peak.</p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-[80px] opacity-20 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
