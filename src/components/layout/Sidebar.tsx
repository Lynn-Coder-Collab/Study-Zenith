import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  Search, 
  UserCircle, 
  MessageSquare,
  LogOut,
  Target
} from 'lucide-react';
import { auth } from '../../lib/firebase/client';
import { signOut } from 'firebase/auth';
import { useAppStore } from '../../store/useAppStore';

const Sidebar: React.FC = () => {
  const { user } = useAppStore();
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', group: 'Academy' },
    { to: '/quiz', icon: BrainCircuit, label: 'Quiz Engine', group: 'Academy' },
    { to: '/mentor', icon: MessageSquare, label: 'AI Mentor', group: 'Academy' },
    { to: '/room', icon: Users, label: 'Study Groups', group: 'Community' },
    { to: '/search', icon: Search, label: 'Search', group: 'Academy' },
    { to: '/profile', icon: UserCircle, label: 'Profile', group: 'Community' },
    { to: '/admin/quiz/create', icon: Target, label: 'Create Quiz', group: 'Admin' },
  ];

  const academyItems = navItems.filter(item => item.group === 'Academy');
  const communityItems = navItems.filter(item => item.group === 'Community');
  const adminItems = navItems.filter(item => item.group === 'Admin');

  return (
    <aside className="w-60 bg-surface border-r border-border flex flex-col h-full sticky top-0 px-6 py-6">
      <div className="logo flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg shadow-lg shadow-accent/20" />
        <span className="font-bold text-xl tracking-tight text-text-primary">Zenith</span>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <div className="text-[11px] uppercase tracking-[0.1em] text-text-secondary mb-3 px-3 font-semibold">Academy</div>
          <nav className="space-y-1">
            {academyItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.1em] text-text-secondary mb-3 px-3 font-semibold">Community</div>
          <nav className="space-y-1">
            {communityItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {user?.role === 'admin' && (
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-secondary mb-3 px-3 font-semibold">Admin Panel</div>
            <nav className="space-y-1">
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-accent/10 text-accent' 
                        : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="pt-6 mt-auto border-t border-border">
        <button
          onClick={() => signOut(auth)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-text-secondary text-sm hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
