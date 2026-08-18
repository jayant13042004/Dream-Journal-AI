'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  PenLine, Sparkles, TrendingUp, Shield, Lock, 
  ChevronRight, Menu, X, Sun, Moon, Compass, Eye, Heart 
} from 'lucide-react';
import { LivingDreamCanvas } from '@/components/layout/LivingDreamCanvas';
import { ExploreDreamModal } from '@/components/layout/ExploreDreamModal';
import { useTheme } from '@/components/layout/ThemeProvider';

export default function LandingPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreModalOpen, setExploreModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reference for scroll-driven narrative timeline
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the interactive hero
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress to a narrative stage (1 to 4)
  const [scrollStage, setScrollStage] = useState(1);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest < 0.25) {
        setScrollStage(1);
      } else if (latest >= 0.25 && latest < 0.55) {
        setScrollStage(2);
      } else if (latest >= 0.55 && latest < 0.85) {
        setScrollStage(3);
      } else {
        setScrollStage(4);
      }
    });
  }, [scrollYProgress]);

  // Navbar scroll background trigger
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Typography Motion Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  // Text transitions based on Scroll Stage
  const STAGE_TEXTS = [
    {
      stage: 1,
      title: "Scattered Fragments",
      description: "Every dream begins as scattered, mysterious fragments of memory."
    },
    {
      stage: 2,
      title: "Subconscious Patterns",
      description: "Connections only begin appearing when you track them over time."
    },
    {
      stage: 3,
      title: "Visual Clarity",
      description: "Lucida aligns and interprets these patterns, showing you what maps your thoughts."
    },
    {
      stage: 4,
      title: "Your Subconscious Journal",
      description: "A secure, beautiful space designed for quiet, mindful reflection."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0A0A09] text-[#17151C] dark:text-[#F3F3F3] font-sans selection:bg-[#B7A9D9]/30 overflow-x-hidden transition-colors duration-300">
      
      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F8F6F2]/80 dark:bg-[#0A0A09]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
            <Compass className="text-[#30265C] dark:text-[#B7A9D9] w-6 h-6 animate-spin-slow" />
            <span className="font-display font-bold text-xl tracking-wider text-[#17151C] dark:text-white uppercase">
              Lucida
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">How It Works</Link>
            <Link href="#privacy" className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/login" className="text-sm font-semibold hover:opacity-80 transition-opacity">Log In</Link>
            <Link href="/signup" className="text-xs font-bold uppercase tracking-wider bg-[#30265C] dark:bg-white text-white dark:text-[#0A0A09] px-6 py-3 rounded-full hover:opacity-95 transition-all shadow-md">
              Start Journaling
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors rounded-full"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 text-black/80 dark:text-white/80" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F8F6F2] dark:bg-[#0A0A09] pt-24 px-6 flex flex-col gap-6 md:hidden text-[#17151C] dark:text-white transition-colors duration-300">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display font-medium">Features</Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display font-medium">How It Works</Link>
          <Link href="#privacy" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display font-medium">Privacy</Link>
          <hr className="border-black/10 dark:border-white/10" />
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl">Log In</Link>
          <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-[#7565A8] dark:text-[#B7A9D9]">Start Journaling</Link>
        </div>
      )}

      {/* ========================================================
          THE LIVING DREAM - STICKY SCROLL CONTAINER (350vh space)
         ======================================================== */}
      <section ref={scrollContainerRef} className="relative h-[350vh] w-full z-10">
        
        {/* Sticky wrapper pinning the viewport on screen */}
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          
          {/* Immersive interactive Canvas particles */}
          <LivingDreamCanvas stage={scrollStage} />

          {/* Foreground UI container */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full h-full flex flex-col justify-center pt-24 pb-8 pointer-events-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              
              {/* Left Column: Typography Content */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6 z-10 pointer-events-auto">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
                  
                  {/* Eyebrow */}
                  <motion.span variants={fadeIn} className="text-xs font-bold uppercase tracking-[0.3em] text-[#7565A8] dark:text-[#B7A9D9] block">
                    Lucida
                  </motion.span>
                  
                  {/* Headline */}
                  <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-medium leading-[1.1] tracking-tight">
                    Your dreams have patterns.<br />
                    <span className="text-[#7565A8] dark:text-[#B7A9D9] italic font-normal">Start discovering them.</span>
                  </motion.h1>
                  
                  {/* Supporting text */}
                  <motion.p variants={fadeIn} className="text-base md:text-lg text-black/60 dark:text-white/60 max-w-md leading-relaxed">
                    Record your dreams, explore what they might mean, and discover recurring patterns over time with clean conceptual mappings.
                  </motion.p>
                  
                  {/* CTA Buttons */}
                  <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <Link 
                      href="/signup" 
                      className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider bg-[#30265C] dark:bg-white text-white dark:text-[#0A0A09] px-8 py-4 rounded-full hover:opacity-90 active:scale-98 transition-all shadow-xl shadow-[#30265C]/10 dark:shadow-none flex items-center justify-center gap-2"
                    >
                      Start Journaling <ChevronRight size={14} />
                    </Link>
                    <button 
                      onClick={() => setExploreModalOpen(true)}
                      className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider text-[#30265C] dark:text-white/70 hover:text-black dark:hover:text-white border border-[#30265C]/25 dark:border-white/10 px-8 py-4 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                      Explore a Dream
                    </button>
                  </motion.div>

                </motion.div>
                
                {/* Scroll Narrative Overlay Card */}
                <div className="pt-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={scrollStage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="p-5 rounded-2xl bg-white/70 dark:bg-[#121211]/50 backdrop-blur-md border border-black/5 dark:border-white/5 max-w-sm shadow-md"
                    >
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[#7565A8] dark:text-[#B7A9D9] block mb-1">
                        Timeline State 0{scrollStage}
                      </span>
                      <h4 className="text-sm font-semibold text-black dark:text-white uppercase tracking-wider mb-1.5">
                        {(STAGE_TEXTS[scrollStage - 1] || STAGE_TEXTS[0]).title}
                      </h4>
                      <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed font-serif italic">
                        "{(STAGE_TEXTS[scrollStage - 1] || STAGE_TEXTS[0]).description}"
                      </p>
                      
                      {/* Interactive scroll progress indicators */}
                      <div className="flex items-center gap-1.5 mt-4">
                        {[1, 2, 3, 4].map((s) => (
                          <div 
                            key={s} 
                            className={`h-1 rounded-full transition-all duration-300 ${s === scrollStage ? 'w-6 bg-[#30265C] dark:bg-white' : 'w-2 bg-black/10 dark:bg-white/10'}`} 
                          />
                        ))}
                        <span className="text-[9px] uppercase tracking-widest text-black/30 dark:text-white/30 font-semibold ml-2">
                          {scrollStage < 4 ? "Scroll to connect" : "Ready to explore"}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Right Column: Fading UI Mockup at Stage 4 */}
              <div className="lg:col-span-6 w-full flex items-center justify-center relative min-h-[300px]">
                <AnimatePresence>
                  {scrollStage === 4 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 30 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                      className="absolute w-full max-w-[420px] bg-white dark:bg-[#121211] border border-black/5 dark:border-white/5 shadow-2xl p-6 rounded-3xl pointer-events-auto overflow-hidden"
                    >
                      {/* Gradient ambient back-light */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9E3F4] dark:bg-[#30265C]/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-[10px] text-[#7565A8] uppercase tracking-wider font-semibold">Dream Decoded</p>
                          <h3 className="text-base font-bold text-black dark:text-white">Recent Reflections</h3>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] bg-[#E9E3F4] dark:bg-[#201C30] text-[#30265C] dark:text-[#B7A9D9] font-bold rounded-md">
                          Pro Analyst
                        </span>
                      </div>

                      {/* Content Item */}
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[#F8F6F2] dark:bg-[#1C1C1B] border border-black/5 dark:border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye size={12} className="text-[#7565A8]" />
                            <span className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40">October 12 • Shifting City</span>
                          </div>
                          <p className="text-xs text-black/70 dark:text-white/70 italic leading-relaxed">
                            "I was searching for a doorway in an endless corridor. Every door opened to a different ocean shoreline..."
                          </p>
                        </div>

                        {/* Themes */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 p-3.5 rounded-xl bg-[#F8F6F2] dark:bg-[#1C1C1B] border border-black/5 dark:border-white/5">
                            <span className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 block mb-1">Top Theme</span>
                            <span className="text-xs font-semibold text-black dark:text-white">🌊 Shorelines (5 entries)</span>
                          </div>
                          <div className="flex-1 p-3.5 rounded-xl bg-[#F8F6F2] dark:bg-[#1C1C1B] border border-black/5 dark:border-white/5">
                            <span className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 block mb-1">Emotion</span>
                            <span className="text-xs font-semibold text-rose-500">❤️ Nostalgia (62%)</span>
                          </div>
                        </div>

                        {/* Prompt */}
                        <div className="p-4 bg-[#30265C] text-white rounded-xl text-xs flex items-start gap-2.5 shadow-lg shadow-[#30265C]/15">
                          <Sparkles size={14} className="shrink-0 mt-0.5" />
                          <p className="leading-relaxed text-white/90">
                            "Water recurred across 5 of your dreams this week, usually associated with high workload stress. Reflect on transitions."
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS SECTION
         ======================================================== */}
      <section id="how-it-works" className="relative z-20 py-24 bg-white dark:bg-[#0E0E0D] border-y border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium mb-4">How it works</h2>
            <p className="text-black/60 dark:text-white/60 max-w-2xl mx-auto text-lg">A simple process to help you understand the deeper layers of your subconscious.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="p-8 rounded-3xl bg-[#F8F6F2] dark:bg-[#151514] border border-black/5 dark:border-white/5 hover:shadow-xl dark:hover:shadow-none transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-white dark:bg-[#1C1C1B] rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-black/5 dark:border-white/5">
                <PenLine className="text-[#30265C] dark:text-[#B7A9D9]" />
              </div>
              <h3 className="text-xl font-medium mb-3">Record Your Dream</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed">Write down everything you remember in our distraction-free editor. Use voice input or text as soon as you wake up.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{...fadeIn, hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}}
              className="p-8 rounded-3xl bg-[#F8F6F2] dark:bg-[#151514] border border-black/5 dark:border-white/5 hover:shadow-xl dark:hover:shadow-none transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-white dark:bg-[#1C1C1B] rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-black/5 dark:border-white/5">
                <Sparkles className="text-[#30265C] dark:text-[#B7A9D9]" />
              </div>
              <h3 className="text-xl font-medium mb-3">Let AI Explore It</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed">Our AI identifies emotions, themes, symbols, and possible meanings — always presented as gentle reflections, never clinical diagnoses.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{...fadeIn, hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }}}
              className="p-8 rounded-3xl bg-[#F8F6F2] dark:bg-[#151514] border border-black/5 dark:border-white/5 hover:shadow-xl dark:hover:shadow-none transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-white dark:bg-[#1C1C1B] rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-black/5 dark:border-white/5">
                <TrendingUp className="text-[#30265C] dark:text-[#B7A9D9]" />
              </div>
              <h3 className="text-xl font-medium mb-3">Discover Patterns</h3>
              <p className="text-black/60 dark:text-white/60 leading-relaxed">Over time, see which themes, emotions, and symbols recur across your journal. Watch your personal dream universe unfold.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ANALYSIS SHOWCASE SECTION
         ======================================================== */}
      <section id="features" className="relative z-20 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121211] border border-black/5 dark:border-white/5 shadow-2xl shadow-black/5 dark:shadow-none"
            >
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-[#E9E3F4] dark:bg-[#30265C]/10 rounded-full blur-2xl opacity-50 z-0 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-sm text-black/40 dark:text-white/40 font-medium mb-4">Dream Journal Entry • Oct 12</p>
                <p className="text-lg leading-relaxed text-black/80 dark:text-white/80 font-display italic">
                  "I was running through an unfamiliar city. The streets kept changing and I couldn't find my way home. There was a river running through the middle of everything, glowing slightly in the dark."
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full space-y-6">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">Deep, nuanced reflections</h2>
              <p className="text-black/60 dark:text-white/60 text-lg mb-8">Go beyond simple dream dictionaries. Get personalized insights tailored to your specific narrative context.</p>
              
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#F8F6F2] dark:bg-[#121211] border border-black/5 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-none">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-[#30265C] dark:text-[#B7A9D9]" />
                    <span className="text-sm font-medium">AI Reflection</span>
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">
                    This dream seems to touch on feelings of transition or navigating the unknown. The shifting city streets might reflect a situation in your waking life where the rules or environment keep changing...
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 p-5 rounded-2xl bg-[#F8F6F2] dark:bg-[#121211] border border-black/5 dark:border-white/5 shadow-sm">
                    <span className="text-xs text-black/40 dark:text-white/40 font-medium uppercase tracking-wider block mb-2">Key Emotions</span>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Anxiety</span><span>72%</span></div>
                        <div className="h-1.5 w-full bg-white dark:bg-[#1C1C1B] rounded-full overflow-hidden"><div className="h-full bg-[#30265C] dark:bg-[#B7A9D9] rounded-full w-[72%]" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Curiosity</span><span>54%</span></div>
                        <div className="h-1.5 w-full bg-white dark:bg-[#1C1C1B] rounded-full overflow-hidden"><div className="h-full bg-black/40 dark:bg-white/40 rounded-full w-[54%]" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-5 rounded-2xl bg-[#F8F6F2] dark:bg-[#121211] border border-black/5 dark:border-white/5 shadow-sm">
                    <span className="text-xs text-black/40 dark:text-white/40 font-medium uppercase tracking-wider block mb-2">Symbols</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#E9E3F4] dark:bg-[#30265C]/20 text-[#30265C] dark:text-[#B7A9D9] text-xs font-semibold">City</span>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">River</span>
                      <span className="px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 text-xs font-semibold font-sans">Running</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRIVACY & SECURE VAULT SECTION
         ======================================================== */}
      <section id="privacy" className="relative z-20 py-24 bg-white dark:bg-[#0E0E0D] border-y border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-[#F8F6F2] dark:bg-[#151514] rounded-full flex items-center justify-center mx-auto mb-6 border border-black/5 dark:border-white/5">
            <Lock className="text-[#30265C] dark:text-[#B7A9D9] w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">Your dreams are personal.<br />They should stay that way.</h2>
          <p className="text-black/60 dark:text-white/60 text-lg leading-relaxed font-serif italic">
            Dream Journal AI is a private, secure vault for your subconscious. Your entries are encrypted, stored securely using row-level security, and are never shared or used to train public models. 
          </p>
        </div>
      </section>

      {/* ========================================================
          CALL TO ACTION (CTA) SECTION
         ======================================================== */}
      <section className="relative z-20 py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#F8F6F2] dark:from-[#151514] to-[#E9E3F4]/40 dark:to-[#30265C]/5 rounded-3xl p-12 md:p-20 text-center border border-black/5 dark:border-white/5 shadow-2xl shadow-[#30265C]/5 dark:shadow-none transition-colors duration-300">
          <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Start understanding your dreams.</h2>
          <p className="text-black/60 dark:text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join today and begin recording. Your first pattern might surprise you.
          </p>
          <Link href="/signup" className="inline-block text-xs font-bold uppercase tracking-wider bg-[#30265C] dark:bg-white text-white dark:text-[#0A0A09] px-10 py-4.5 rounded-full hover:opacity-90 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-[#30265C]/15 dark:shadow-none">
            Start Journaling Free
          </Link>
        </div>
      </section>

      {/* ========================================================
          FOOTER
         ======================================================== */}
      <footer className="relative z-20 py-12 px-6 border-t border-black/5 dark:border-white/5 bg-[#F8F6F2] dark:bg-[#0A0A09] transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Compass className="text-[#30265C] dark:text-[#B7A9D9] w-5 h-5 animate-spin-slow" />
            <span className="font-display font-bold uppercase tracking-wider text-xs text-black/60 dark:text-white/60">
              Lucida
            </span>
          </div>
          <div className="flex gap-8 text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
          </div>
          <p className="text-xs text-black/40 dark:text-white/45">© 2026 Lucida. All rights reserved.</p>
        </div>
      </footer>

      {/* Interactive explore dream pop-up modal */}
      <ExploreDreamModal 
        isOpen={exploreModalOpen}
        onClose={() => setExploreModalOpen(false)}
      />

    </div>
  );
}
