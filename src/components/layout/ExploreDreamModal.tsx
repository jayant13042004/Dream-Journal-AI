'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ExploreDreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExploreDreamModal({ isOpen, onClose }: ExploreDreamModalProps) {
  const [step, setStep] = useState(0); // 0: typing, 1: mapping, 2: cards, 3: call-to-action
  const [typedText, setTypedText] = useState('');
  
  const fullText = "I was walking through a city I had never seen before. I could hear the ocean nearby, but I couldn't find it.";

  // Typewriter effect in Step 0
  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setTypedText('');
      return;
    }

    if (step === 0) {
      let index = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
          // Transition to Step 1 (mapping) after 1.5s pause
          setTimeout(() => {
            setStep(1);
          }, 1500);
        }
      }, 35); // 35ms per character typing speed
      
      return () => clearInterval(interval);
    }
  }, [isOpen, step]);

  // Transition from Step 1 (mapping) to Step 2 (cards/analysis)
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 4500); // give 4.5 seconds to show visual map
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#17151C]/40 dark:bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-2xl bg-[#F8F6F2] dark:bg-[#0E0E0D] border border-black/5 dark:border-white/5 rounded-3xl shadow-2xl p-8 md:p-10 overflow-hidden z-10 text-[#17151C] dark:text-[#F3F3F3]"
          >
            
            {/* Header / Brand */}
            <div className="flex justify-between items-center mb-8 border-b border-black/5 dark:border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Compass className="text-[#7565A8] w-5 h-5 animate-spin-slow" />
                <span className="font-display font-semibold tracking-wider text-xs uppercase text-[#7565A8]">
                  Lucida Interactive Explorer
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stage Contents */}
            <div className="min-h-[260px] flex flex-col justify-center">
              
              {/* Step 0: Typewriter typing of sample dream */}
              {step === 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#7565A8] font-bold block">
                    User Dream Input
                  </span>
                  <p className="text-xl md:text-2xl font-display font-medium leading-relaxed italic border-l-2 border-[#7565A8] pl-4 py-1 text-black/80 dark:text-white/80">
                    "{typedText}"
                    <span className="animate-pulse font-sans font-normal text-[#7565A8] ml-0.5">|</span>
                  </p>
                </div>
              )}

              {/* Step 1: Mapping Dream Fragments */}
              {step === 1 && (
                <div className="flex flex-col items-center justify-center space-y-8 py-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#7565A8] font-bold block self-start">
                    Extracting Core Fragments
                  </span>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
                    {/* Node 1: City */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="px-5 py-3 rounded-2xl bg-white dark:bg-[#181817] border border-black/5 dark:border-white/5 shadow-md flex flex-col items-center"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40">Setting</span>
                      <span className="text-sm font-semibold tracking-wider">CITY</span>
                    </motion.div>

                    {/* Flow arrow 1 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-[#7565A8] rotate-90 md:rotate-0"
                    >
                      <ArrowRight size={18} />
                    </motion.div>

                    {/* Node 2: Searching */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.1 }}
                      className="px-5 py-3 rounded-2xl bg-[#E9E3F4] dark:bg-[#1C1A24] border border-[#B7A9D9]/30 shadow-md flex flex-col items-center"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-[#7565A8]">Action</span>
                      <span className="text-sm font-semibold tracking-wider text-[#7565A8]">SEARCHING</span>
                    </motion.div>

                    {/* Flow arrow 2 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                      className="text-[#7565A8] rotate-90 md:rotate-0"
                    >
                      <ArrowRight size={18} />
                    </motion.div>

                    {/* Node 3: Ocean */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="px-5 py-3 rounded-2xl bg-white dark:bg-[#181817] border border-black/5 dark:border-white/5 shadow-md flex flex-col items-center"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40">Symbol</span>
                      <span className="text-sm font-semibold tracking-wider">OCEAN</span>
                    </motion.div>

                    {/* Flow arrow 3 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.6 }}
                      className="text-[#7565A8] rotate-90 md:rotate-0"
                    >
                      <ArrowRight size={18} />
                    </motion.div>

                    {/* Node 4: Uncertainty */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 2.9 }}
                      className="px-5 py-3 rounded-2xl bg-[#30265C] text-white shadow-lg flex flex-col items-center"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-white/50">Emotion</span>
                      <span className="text-sm font-semibold tracking-wider">UNCERTAINTY</span>
                    </motion.div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ delay: 0.5, duration: 3.5 }}
                    className="text-xs text-black/50 dark:text-white/50 italic"
                  >
                    AI model is establishing theme associations...
                  </motion.p>
                </div>
              )}

              {/* Step 2: Insight / Meaning mapping reveal */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#7565A8] font-bold block w-full mb-1">
                      Identified Patterns
                    </span>
                    <span className="px-3 py-1 bg-white dark:bg-[#181817] border border-black/5 dark:border-white/5 rounded-full text-xs font-semibold">
                      🧭 Exploration
                    </span>
                    <span className="px-3 py-1 bg-white dark:bg-[#181817] border border-black/5 dark:border-white/5 rounded-full text-xs font-semibold">
                      ❓ Uncertainty
                    </span>
                    <span className="px-3 py-1 bg-white dark:bg-[#181817] border border-black/5 dark:border-white/5 rounded-full text-xs font-semibold">
                      🌊 Longing
                    </span>
                  </div>

                  {/* AI Reflection Text Card */}
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-white dark:bg-[#121211] border border-black/5 dark:border-white/5 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E9E3F4] dark:bg-[#30265C]/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-3 z-10 relative">
                      <Sparkles size={16} className="text-[#7565A8]" />
                      <span className="text-xs font-semibold tracking-wider uppercase text-[#7565A8]">
                        AI Reflection
                      </span>
                    </div>

                    <p className="text-sm md:text-base leading-relaxed text-black/80 dark:text-white/80 italic z-10 relative">
                      "One possible interpretation is that the dream combines unfamiliar surroundings (the unknown city) with a search for something familiar or meaningful (the ocean you hear but cannot find), pointing to feelings of navigation or transition in your waking life."
                    </p>
                  </motion.div>

                  {/* Call to action conversion link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/5 dark:border-white/5 mt-4"
                  >
                    <span className="text-xs text-black/60 dark:text-white/60">
                      Understand your own subconscious maps.
                    </span>
                    <Link 
                      href="/signup" 
                      onClick={onClose}
                      className="px-5 py-2.5 bg-[#30265C] dark:bg-white text-white dark:text-[#0A0A09] rounded-full text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#30265C]/10"
                    >
                      Try it with your own dream <ChevronRight size={14} />
                    </Link>
                  </motion.div>
                </motion.div>
              )}

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
