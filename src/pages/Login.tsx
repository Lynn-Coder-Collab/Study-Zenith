import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase/client';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to log in: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-0 -left-10 w-[500px] h-[500px] bg-accent rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob" />
      <div className="absolute top-0 -right-10 w-[500px] h-[500px] bg-success rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 left-40 w-[500px] h-[500px] bg-accent rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-4000" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glassmorphism p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/5"
      >
        <div className="text-center space-y-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-success rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 rotate-3">
             <div className="w-8 h-8 rounded-lg bg-bg/20 backdrop-blur-sm" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-text-primary tracking-tight">Zenith Study</h1>
            <p className="text-text-secondary font-medium">Elevate your learning experience with AI.</p>
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-text-primary text-bg py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 shadow-xl"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 transition-transform group-hover:scale-110" />
              Continue with Google
            </button>
            <p className="text-[11px] text-text-secondary uppercase tracking-widest font-black leading-none py-2">
              Trusted by 10k+ Students
            </p>
          </div>

          <div className="pt-4 grid grid-cols-3 gap-3">
             {[1,2,3].map(i => (
               <div key={i} className="h-0.5 bg-border rounded-full opacity-50" />
             ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
