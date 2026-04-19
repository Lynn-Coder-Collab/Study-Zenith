import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Book, FileText, Layout, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FlexSearch from 'flexsearch';

const MOCK_DATA = [
  { id: 1, title: 'Calculus I - Integrals', type: 'Course', difficulty: 'Hard', icon: Book },
  { id: 2, title: 'Web Development Basics', type: 'Quiz', difficulty: 'Easy', icon: Layout },
  { id: 3, title: 'Quantum Mechanics Intro', type: 'Module', difficulty: 'Master', icon: Sparkles },
  { id: 4, title: 'Advanced React Patterns', type: 'Course', difficulty: 'Medium', icon: FileText },
  { id: 5, title: 'History of the Silk Road', type: 'Reading', difficulty: 'Easy', icon: Book },
];

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(MOCK_DATA);
  const [index, setIndex] = useState<any>(null);

  useEffect(() => {
    // Initialize FlexSearch
    const idx = new (FlexSearch as any).Index({
      tokenize: 'forward',
    });

    MOCK_DATA.forEach(item => {
      idx.add(item.id, item.title);
    });

    setIndex(idx);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (!val) {
      setResults(MOCK_DATA);
      return;
    }

    if (index) {
      const searchResultsIds = index.search(val);
      const filtered = MOCK_DATA.filter(item => searchResultsIds.includes(item.id));
      setResults(filtered);
    }
  };

  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto theme-gradient-main min-h-full">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-black text-text-primary tracking-tighter">Search Protocol</h1>
        <p className="text-text-secondary font-bold text-lg">Instant discovery across courses, notes, and AI modules.</p>
      </div>

      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-8 h-8 text-border group-focus-within:text-accent transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="I want to learn about..." 
          className="w-full bg-surface border border-border rounded-[2.5rem] pl-16 pr-8 py-8 text-2xl font-bold text-text-primary focus:ring-8 focus:ring-accent/5 focus:border-accent transition-all shadow-2xl outline-none placeholder:text-text-secondary/50"
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-bg px-3 py-1.5 rounded-full text-[10px] font-black text-text-secondary border border-border uppercase tracking-widest">
            ⌘ K
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {results.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-surface p-6 rounded-[2rem] border border-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-bg border border-border rounded-2xl flex items-center justify-center text-text-secondary group-hover:text-accent group-hover:border-accent/20 transition-all">
                <item.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{item.type}</span>
                  <span className="w-1 h-1 bg-border rounded-full" />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    item.difficulty === 'Easy' ? 'text-success' :
                    item.difficulty === 'Hard' ? 'text-warning' : 'text-text-secondary'
                  }`}>{item.difficulty}</span>
                </div>
                <h3 className="text-xl font-bold text-text-primary group-hover:text-accent transition-colors">{item.title}</h3>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-border group-hover:text-accent group-hover:bg-bg transition-all transform group-hover:translate-x-1">
                <ArrowRight className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {results.length === 0 && (
          <div className="text-center py-24 opacity-50">
            <div className="text-6xl mb-6 grayscale">🔍</div>
            <h3 className="text-2xl font-bold text-text-primary">No matching protocols</h3>
            <p className="text-text-secondary font-medium mt-2">Try different keywords or check your spelling.</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-8 pb-12">
        {['Mathematics', 'Science', 'Programming', 'History', 'Physics'].map(tag => (
          <button 
            key={tag}
            onClick={() => handleSearch(tag)}
            className="px-6 py-2.5 bg-surface border border-border text-text-secondary rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent hover:border-transparent hover:text-bg transition-all active:scale-95"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
