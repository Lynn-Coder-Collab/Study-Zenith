import React from 'react';
import { Bell, Search, Flame, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const Navbar: React.FC = () => {
  const { user } = useAppStore();

  return (
    <header className="h-[72px] px-8 flex items-center justify-between border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-bg/80">
      <div className="flex items-center gap-4 bg-bg border border-border px-4 py-2 rounded-[20px] w-[320px]">
        <Search className="w-4 h-4 text-text-secondary" />
        <input 
          type="text" 
          placeholder="Search course, topics, or AI mentor..." 
          className="bg-transparent border-none text-sm focus:ring-0 w-full placeholder:text-text-secondary text-text-primary"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full font-bold text-xs uppercase tracking-wider">
          <Flame className="w-4 h-4" />
          {user?.stats.streak || 0} Streak
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full font-bold text-xs uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          {user?.stats.points || 0} XP
        </div>

        <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full border-2 border-bg" />
        </button>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-text-primary leading-tight">{user?.displayName}</div>
            <div className="text-[12px] text-text-secondary">Lvl {user?.stats.level} Pro Student</div>
          </div>
          <img 
            src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-border shadow-sm bg-surface"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
