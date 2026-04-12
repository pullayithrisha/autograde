import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle, Check, Plus, Trash2, ArrowRight } from 'lucide-react';

const CBIT_CSE_CURRICULUM = {
  1: {
    1: ['Mathematics-I', 'Physics', 'Programming for Problem Solving', 'Basic Electrical', 'Eng Graphics'],
    2: ['Mathematics-II', 'Chemistry', 'English', 'Object Oriented Programming', 'Data Structures']
  },
  2: {
    1: ['Data Structures', 'Digital Logic', 'Discrete Mathematics', 'Computer Architecture', 'C++'],
    2: ['Algorithms', 'Database Management', 'Operating Systems', 'Software Engineering', 'Java']
  },
  3: {
    1: ['Computer Networks', 'Automata Theory', 'Web Technologies', 'Artificial Intelligence', 'Testing'],
    2: ['Compiler Design', 'Machine Learning', 'Information Security', 'Cloud Computing', 'Data Mining']
  },
  4: {
    1: ['Deep Learning', 'Big Data', 'Internet of Things', 'Blockchain', 'Elective-I'],
    2: ['Tech Seminar', 'Project Work', 'Elective-II', 'Elective-III']
  }
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', employeeId: '', password: '' });
  const [teachingConfigs, setTeachingConfigs] = useState([{ id: Date.now(), year: '', semester: '', subjects: [] }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfigChange = (id, field, value) => {
    setTeachingConfigs(prev => prev.map(tc => tc.id === id ? { ...tc, [field]: value, subjects: [] } : tc));
  };

  const removeConfig = (id) => {
    setTeachingConfigs(prev => prev.filter(tc => tc.id !== id));
  };

  const toggleSubject = (id, subject) => {
    setTeachingConfigs(prev => prev.map(tc => {
      if (tc.id === id) {
        const isSelected = tc.subjects.includes(subject);
        return { ...tc, subjects: isSelected ? tc.subjects.filter(s => s !== subject) : [...tc.subjects, subject] };
      }
      return tc;
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const cleanConfigs = teachingConfigs.filter(tc => tc.year && tc.semester && tc.subjects.length > 0);
    if (cleanConfigs.length === 0) return setError('Configure at least one Evaluation mapping correctly.');

    try {
      setLoading(true); setError('');
      const payload = { 
        ...formData, 
        teachingConfig: cleanConfigs.map(c => ({ year: parseInt(c.year), semester: parseInt(c.semester), subjects: c.subjects }))
      };
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('faculty', JSON.stringify(res.data.faculty));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="min-h-[100vh] h-screen bg-background flex flex-col items-center justify-center p-2 sm:p-4 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-4xl bg-card rounded-2xl border border-border subtle-shadow flex flex-col md:flex-row relative z-10 w-full h-full max-h-[95vh] md:max-h-[85vh] overflow-hidden">
        
        <div className="md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-border bg-card/60 flex flex-col relative shrink-0 md:shrink md:overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          
          <div className="flex items-center space-x-2 mb-6 mt-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">AutoGrade Platform</h2>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">Faculty Setup</h3>
          <p className="text-xs text-muted mb-6">Create credentials for evaluation access.</p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start text-[10px] text-red-500 font-bold uppercase tracking-widest"><AlertCircle className="w-3.5 h-3.5 mr-2 shrink-0"/> {error}</motion.div>
          )}

          <div className="space-y-4 flex-grow shrink-0">
            {['name', 'email', 'employeeId', 'password'].map((field, idx) => {
              const type = field === 'password' ? 'password' : field === 'email' ? 'email' : 'text';
              const autoComplete = field === 'email' ? 'email' : field === 'password' ? 'new-password' : field === 'name' ? 'name' : 'off';
              return (
                <div key={idx} className="relative group shrink-0">
                  <input 
                    type={type} 
                    id={field}
                    name={field}
                    autoComplete={autoComplete}
                    required 
                    className="block w-full px-4 pt-4 pb-1.5 text-xs text-foreground bg-background border border-border hover:border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all peer font-medium" 
                    placeholder=" " 
                    value={formData[field]} 
                    onChange={e => setFormData({...formData, [field]: e.target.value})} 
                  />
                  <label htmlFor={field} className="absolute text-[10px] text-muted duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-primary font-bold uppercase tracking-widest">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-[10px] font-bold text-muted uppercase tracking-widest pt-4 border-t border-white/5 shrink-0">
            Existing Account? <Link to="/login" className="text-primary hover:text-cyan-400 transition-colors ml-1">Sign In</Link>
          </p>
        </div>

        <div className="md:w-7/12 flex flex-col bg-background/50 h-full min-h-0 overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-card/50 shrink-0">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Curriculum Mapping</h3>
          </div>
          
          <div className="p-4 overflow-y-auto flex-grow space-y-4 min-h-0">
            <AnimatePresence>
              {teachingConfigs.map((tc, index) => {
                const subjects = (tc.year && tc.semester) ? CBIT_CSE_CURRICULUM[tc.year][tc.semester] : [];
                return (
                  <motion.div key={tc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Evaluation {index + 1}</span>
                      {teachingConfigs.length > 1 && (<button type="button" onClick={() => removeConfig(tc.id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>)}
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <select className="w-full bg-background border border-border text-[11px] font-semibold rounded-lg px-2 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer transition-all" value={tc.year} onChange={(e) => handleConfigChange(tc.id, 'year', e.target.value)}>
                          <option value="" disabled className="bg-card">Select Year</option>
                          {[1, 2, 3, 4].map(y => <option key={y} value={y} className="bg-card text-foreground">Year {y}</option>)}
                        </select>
                      </div>
                      <div className="w-1/2">
                        <select disabled={!tc.year} className="w-full bg-background border border-border text-[11px] font-semibold rounded-lg px-2 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer disabled:opacity-40 transition-all" value={tc.semester} onChange={(e) => handleConfigChange(tc.id, 'semester', e.target.value)}>
                          <option value="" disabled className="bg-card">Select Sem</option>
                          {[1, 2].map(s => <option key={s} value={s} className="bg-card text-foreground">Semester {s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="border border-border bg-background/50 rounded-lg p-3 min-h-[80px]">
                      {(!tc.year || !tc.semester) ? (
                        <div className="flex h-full items-center justify-center text-muted text-[10px] font-bold uppercase tracking-widest opacity-50">Select coordinates</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {subjects.map(sub => {
                            const isSelected = tc.subjects.includes(sub);
                            return (
                              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} key={sub} type="button" onClick={() => toggleSubject(tc.id, sub)} className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all border flex items-center shadow-sm ${isSelected ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(28,77,141,0.3)]' : 'bg-transparent border-border text-muted hover:text-foreground hover:border-gray-500'}`}>
                                {isSelected && <Check className="w-3 h-3 mr-1" />} {sub}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="button" onClick={() => setTeachingConfigs(p => [...p, { id: Date.now(), year: '', semester: '', subjects: [] }])} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-[10px] font-bold text-muted hover:text-foreground hover:border-gray-500 transition-colors flex items-center justify-center uppercase tracking-widest shrink-0">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Year / Semester / Subjects
            </motion.button>
          </div>

          <div className="p-4 border-t border-white/5 bg-card/80 shrink-0">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleRegister} disabled={loading} className="w-full bg-foreground text-background hover:bg-gray-200 text-xs font-extrabold tracking-widest uppercase py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50">
              {loading ? 'Processing...' : <>Create Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></>}
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
