import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Zap, Server } from 'lucide-react';

const ContinuousTypewriter = ({ textArray, loopDelay = 2000 }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = textArray[textIndex];
    let speed = isDeleting ? 30 : 60;
    
    if (!isDeleting && displayedText === currentText) {
      speed = loopDelay;
      setTimeout(() => setIsDeleting(true), loopDelay);
      return;
    }

    if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % textArray.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(prev => 
        isDeleting 
        ? currentText.substring(0, prev.length - 1) 
        : currentText.substring(0, prev.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex, textArray, loopDelay]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
      {displayedText}
      <span className="animate-pulse opacity-50 ml-1 text-primary">|</span>
    </span>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

const cardHover = {
  rest: { scale: 1, boxShadow: "0px 4px 15px rgba(0,0,0,0.2)" },
  hover: { scale: 1.03, boxShadow: "0px 12px 30px rgba(28, 77, 141, 0.15)", transition: { duration: 0.2 } }
};

export default function Landing() {
  return (
    <motion.div 
      initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen flex flex-col font-sans text-foreground bg-background"
    >
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-lg cursor-default">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="tracking-tight">AutoGrade</span>
          </div>
          <div className="flex items-center space-x-5">
            <Link to="/login" className="text-xs font-semibold text-muted hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-xs font-bold bg-white text-black px-4 py-1.5 rounded hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col pt-20 pb-20 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span>Gemini Vision Network</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-[1.15]">
            Intelligent evaluations, <br />
            <ContinuousTypewriter textArray={["perfect accuracy.", "zero bias.", "lightning fast."]} loopDelay={2500} />
          </h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm md:text-base text-muted mb-10 max-w-xl mx-auto font-medium leading-relaxed">
            Extract handwritten text flawlessly and score answers using high-dimensional semantic similarity. Native integration for modern academic workflows.
          </motion.p>
        </div>

        <div className="mt-16 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {[
            { icon: Zap, color: 'text-primary', title: 'Lightning Fast', text: 'Evaluate a 100-mark paper in seconds instead of hours, instantly eliminating backlog fatigue.' },
            { icon: Server, color: 'text-blue-500', title: 'Semantic Matching', text: 'Our pipeline maps Sentence-BERT embeddings to precisely calculate context and meaning.' },
            { icon: CheckCircle, color: 'text-blue-400', title: 'Zero Implicit Bias', text: 'Deliver absolutely consistent distributions across all students without susceptibility to drift.' }
          ].map((feat, i) => (
            <motion.div 
              key={i} initial="rest" whileHover="hover" animate="rest" variants={cardHover}
              className="bg-card/80 backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group cursor-default"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-300"><feat.icon className="w-24 h-24" /></div>
              <feat.icon className={`w-6 h-6 ${feat.color} mb-4`} />
              <h3 className="text-sm font-bold text-foreground mb-2 tracking-wide">{feat.title}</h3>
              <p className="text-muted text-xs leading-relaxed font-medium">{feat.text}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-auto z-10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-1.5 opacity-70">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-bold text-xs tracking-tight text-foreground">AutoGrade</span>
          </div>
          <p className="text-[10px] font-medium text-muted">Advanced infrastructure for semantic grading.</p>
          <p className="text-[10px] text-muted/50 pt-2">&copy; {new Date().getFullYear()} AutoGrade Secure Platform</p>
        </div>
      </footer>
    </motion.div>
  );
}
