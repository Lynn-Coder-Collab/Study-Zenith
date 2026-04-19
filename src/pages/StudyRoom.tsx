import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Users, 
  Send, 
  MessageSquare, 
  Video, 
  Mic, 
  VideoOff, 
  MicOff,
  ScreenShare,
  X,
  Settings,
  MoreVertical,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

const StudyRoom: React.FC = () => {
  const { user } = useAppStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io(); // Connect to same host as server

    socketRef.current.emit('join-room', 'general-study');

    socketRef.current.on('user-joined', (data) => {
      setParticipants(prev => [...prev, data.userId]);
    });

    socketRef.current.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const data = {
      roomId: 'general-study',
      message: input,
      user: {
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL
      }
    };

    socketRef.current.emit('send-message', data);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-4 bg-slate-50 overflow-hidden">
      {/* Main Area */}
      <div className="lg:col-span-3 flex flex-col p-4 md:p-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Public Study Room</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">General Session • 14 Users Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Settings className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Video Placeholder Area */}
        <div className="flex-1 bg-slate-200/50 rounded-[3rem] border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
          <div className="text-center space-y-4 max-w-sm px-6">
            <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center text-slate-300 shadow-sm">
              <Video className="w-10 h-10" />
            </div>
            <p className="text-slate-500 font-bold">Video chat is currently disabled in this demo environment. Join the voice channel or use text chat.</p>
            <div className="flex justify-center gap-4">
               <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all">
                Enable Camera
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 group-hover:translate-y-0 translate-y-20 transition-all duration-300">
            <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"><Mic className="w-5 h-5" /></button>
            <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"><Video className="w-5 h-5" /></button>
            <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"><ScreenShare className="w-5 h-5" /></button>
            <div className="w-px h-8 bg-white/10 mx-1" />
            <button className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Side Area (Chat) */}
      <div className="bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-tight">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Live Chat
          </div>
          <button className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-1.5 ${msg.user.uid === user?.uid ? 'items-end' : ''}`}>
               <div className="flex items-center gap-2">
                 {msg.user.uid !== user?.uid && <span className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">{msg.user.displayName}</span>}
               </div>
               <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${
                 msg.user.uid === user?.uid 
                   ? 'bg-indigo-600 text-white rounded-tr-none' 
                   : 'bg-slate-100 text-slate-700 rounded-tl-none'
               }`}>
                 {msg.message}
               </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-xs">
              No messages yet. Be the first to say hi!
            </div>
          )}
        </div>

        <div className="p-6 pt-0">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Smile className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Send a message..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-14 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
