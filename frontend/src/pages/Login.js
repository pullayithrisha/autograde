import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError('');
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('faculty', JSON.stringify(res.data.faculty));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center p-4 bg-background font-sans relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-[360px] bg-card rounded-2xl border border-border subtle-shadow overflow-hidden flex flex-col relative shrink-0">
        <div className="absolute h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500 top-0 left-0"></div>
        
        <div className="p-6 pb-4 bg-transparent border-b border-white/5">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(28,77,141,0.15)]">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-center text-foreground tracking-tight">Access Dashboard</h2>
        </div>
        
        <div className="px-6 py-6 border-b border-white/5">
          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-start text-xs font-medium">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0"/> {error}
            </motion.div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <input type="email" id="email" required className="block w-full px-4 pt-5 pb-1.5 text-xs text-foreground bg-background border border-border hover:border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all peer font-medium" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="email" className="absolute text-[10px] text-muted duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary font-bold uppercase tracking-widest">Email</label>
            </div>
            
            <div className="relative group">
              <input type="password" id="password" required className="block w-full px-4 pt-5 pb-1.5 text-xs text-foreground bg-background border border-border hover:border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all peer font-medium" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="password" className="absolute text-[10px] text-muted duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary font-bold uppercase tracking-widest">Password</label>
            </div>
            
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-widest py-3 rounded-lg transition-all mt-2 flex items-center justify-center disabled:opacity-70 shadow-[0_0_15px_rgba(28,77,141,0.25)]">
              {loading ? 'Authenticating...' : <>Sign In <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
            </motion.button>
          </form>
        </div>

        <div className="p-4 bg-background/30 text-center">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
            New faculty? <Link to="/register" className="text-foreground hover:text-primary ml-1 transition-colors">Create account</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
