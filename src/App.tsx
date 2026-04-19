/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/providers/AuthProvider';
import { useAppStore } from './store/useAppStore';
import LoginPage from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Mentor from './pages/Mentor';
import QuizList from './pages/QuizList';
import QuizEngine from './pages/QuizEngine';
import StudyRoom from './pages/StudyRoom';
import Search from './pages/Search';
import Profile from './pages/Profile';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 flex">
    <Sidebar />
    <main className="flex-1 overflow-auto h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAppStore();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
          <Route path="/quiz/:id" element={<ProtectedRoute><QuizEngine /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} />
          <Route path="/room" element={<ProtectedRoute><StudyRoom /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

