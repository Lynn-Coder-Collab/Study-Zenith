import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, Cpu, Settings } from 'lucide-react';
import { getAIResponse, AIProvider, AIMessage } from '../services/aiService';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

const MentorPage: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('groq');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAppStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: AIMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(newMessages.map(m => ({ 
        role: m.role, 
        content: m.content 
      })), provider);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${error.message}. Please ensure the API key for ${provider} is configured in the Secrets panel.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] bg-bg theme-gradient-main">
      {/* Provider Selector */}
      <div className="bg-bg/50 border-b border-border px-6 py-3 flex flex-wrap items-center justify-between backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">AI Protocol:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['gemini', 'openrouter', 'groq', 'featherless'] as AIProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                provider === p 
                  ? 'bg-accent text-bg border-transparent shadow-lg shadow-accent/20' 
                  : 'text-text-secondary border-border hover:border-accent hover:text-text-primary bg-surface/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-8 pb-32 pt-4">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-success rounded-[2rem] flex items-center justify-center text-bg shadow-2xl shadow-accent/20 mb-8 rotate-3">
                <Sparkles className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-text-primary tracking-tight mb-3">Zenith AI Mentor</h1>
              <p className="text-text-secondary font-medium text-lg max-w-md">Your personal high-performance learning companion powered by {provider.toUpperCase()}.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-2xl px-4">
                {[
                  "Explain quantum physics simply",
                  "Top 5 memory retention techniques",
                  "Plan a 4-hour Deep Work session",
                  "Solve for X: 2x² + 5x - 3 = 0"
                ].map((q) => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="p-5 bg-surface border border-border rounded-2xl text-left text-[13px] font-bold text-text-primary hover:border-accent hover:bg-accent/5 transition-all active:scale-95 group flex items-center justify-between"
                  >
                    {q}
                    <div className="w-6 h-6 rounded-lg bg-bg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Send className="w-3 h-3 text-accent" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                  message.role === 'user' 
                    ? 'bg-surface border-border' 
                    : 'bg-accent/10 border-accent/20'
                }`}>
                  {message.role === 'user' ? <User className="w-5 h-5 text-text-secondary" /> : <Bot className="w-5 h-5 text-accent" />}
                </div>
                
                <div className={`max-w-[85%] rounded-[2rem] p-6 shadow-sm border ${
                  message.role === 'user'
                    ? 'bg-accent text-bg font-bold rounded-tr-none border-transparent'
                    : 'bg-surface border-border text-text-primary rounded-tl-none'
                }`}>
                  <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert text-bg' : 'prose-invert text-text-primary'}`}>
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              </div>
              <div className="bg-surface border border-border p-5 rounded-[2rem] rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-10 border-t border-border bg-bg/80 backdrop-blur-md sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto w-full">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask Zenith ${provider.toUpperCase()} a high-performance study question...`}
              className="w-full bg-surface border border-border text-text-primary rounded-[1.5rem] pl-6 pr-16 py-5 focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all shadow-2xl outline-none placeholder:text-text-secondary font-medium"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-accent text-bg rounded-xl flex items-center justify-center hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-xl shadow-accent/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center gap-1">
            <p className="text-[10px] text-center text-text-secondary font-bold uppercase tracking-[0.2em]">
              Neural Processing Active • Zenith Lvl 42 Engine
            </p>
            <p className="text-[8px] text-text-secondary/50 uppercase tracking-widest">
              Server-Side Secure Protocol • Keys Hidden
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPage;
