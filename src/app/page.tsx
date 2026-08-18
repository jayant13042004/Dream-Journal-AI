'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PenLine, Sparkles, TrendingUp, Shield, Lock, ChevronRight, Menu, X } from 'lucide-react';
import { InteractiveHeroOrb } from '@/components/layout/InteractiveHeroOrb';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] font-sans selection:bg-[#E8DCC4] selection:text-[#1A1A1A] overflow-x-hidden">
      {/* Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#F3E5D8]/40 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-[40%] -left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#E5ECE9]/40 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAFAF8]/80 backdrop-blur-md border-b border-black/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="Dream Journal AI Logo" 
              className="w-8 h-8 rounded-lg object-contain" 
            />
            <span className="font-display font-semibold text-xl tracking-tight">Dream Journal AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-black/60 hover:text-black transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-black/60 hover:text-black transition-colors">How It Works</Link>
            <Link href="#privacy" className="text-sm font-medium text-black/60 hover:text-black transition-colors">Privacy</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-black/80 hover:text-black transition-colors">Log In</Link>
            <Link href="/signup" className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-black/90 transition-colors shadow-lg shadow-black/10">
              Start Journaling
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAFAF8] pt-24 px-6 flex flex-col gap-6 md:hidden">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display">Features</Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display">How It Works</Link>
          <Link href="#privacy" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-display">Privacy</Link>
          <hr className="border-black/10" />
          <Link href="/login" className="text-xl">Log In</Link>
          <Link href="/signup" className="text-xl font-medium text-[#8B7355]">Start Journaling</Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-medium leading-[1.1] tracking-tight">
              Your dreams have patterns.<br />
              <span className="text-[#8B7355] italic">Start discovering them.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-black/60 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Record your dreams, explore what they might mean, and discover recurring themes across your dream history with intelligent AI reflection.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
              <Link href="/signup" className="w-full sm:w-auto text-base font-medium bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                Start Journaling <ChevronRight size={18} />
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto text-base font-medium text-black/70 hover:text-black px-8 py-4 flex items-center justify-center transition-colors">
                See How It Works
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="flex-1 w-full relative h-[450px] flex items-center justify-center">
          <motion.div 
            style={{ y }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <InteractiveHeroOrb />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium mb-4">How it works</h2>
            <p className="text-black/60 max-w-2xl mx-auto text-lg">A simple process to help you understand the deeper layers of your subconscious.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="p-8 rounded-3xl bg-[#FAFAF8] border border-black/5 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-black/5">
                <PenLine className="text-[#8B7355]" />
              </div>
              <h3 className="text-xl font-medium mb-3">Record Your Dream</h3>
              <p className="text-black/60 leading-relaxed">Write down everything you remember in our distraction-free editor. Use voice input or text as soon as you wake up.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{...fadeIn, hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }}}
              className="p-8 rounded-3xl bg-[#FAFAF8] border border-black/5 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-black/5">
                <Sparkles className="text-[#8B7355]" />
              </div>
              <h3 className="text-xl font-medium mb-3">Let AI Explore It</h3>
              <p className="text-black/60 leading-relaxed">Our AI identifies emotions, themes, symbols, and possible meanings — always presented as gentle reflections, never clinical diagnoses.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{...fadeIn, hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }}}
              className="p-8 rounded-3xl bg-[#FAFAF8] border border-black/5 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-black/5">
                <TrendingUp className="text-[#8B7355]" />
              </div>
              <h3 className="text-xl font-medium mb-3">Discover Patterns</h3>
              <p className="text-black/60 leading-relaxed">Over time, see which themes, emotions, and symbols recur across your journal. Watch your personal dream universe unfold.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analysis Showcase */}
      <section className="relative z-10 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative p-6 md:p-8 rounded-3xl bg-white border border-black/5 shadow-2xl shadow-black/5"
            >
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-[#F3E5D8] to-transparent rounded-full blur-2xl opacity-50 z-0" />
              <div className="relative z-10">
                <p className="text-sm text-black/40 font-medium mb-4">Dream Journal Entry • Oct 12</p>
                <p className="text-lg leading-relaxed text-black/80 font-display italic">
                  "I was running through an unfamiliar city. The streets kept changing and I couldn't find my way home. There was a river running through the middle of everything, glowing slightly in the dark."
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full space-y-6">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">Deep, nuanced reflections</h2>
              <p className="text-black/60 text-lg mb-8">Go beyond simple dream dictionaries. Get personalized insights tailored to your specific narrative context.</p>
              
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-black/5 shadow-lg shadow-black/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-[#8B7355]" />
                    <span className="text-sm font-medium">AI Reflection</span>
                  </div>
                  <p className="text-sm text-black/70 leading-relaxed">
                    This dream seems to touch on feelings of transition or navigating the unknown. The shifting city streets might reflect a situation in your waking life where the rules or environment keep changing...
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                    <span className="text-xs text-black/40 font-medium uppercase tracking-wider block mb-2">Key Emotions</span>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Anxiety</span><span>72%</span></div>
                        <div className="h-1.5 w-full bg-[#FAFAF8] rounded-full overflow-hidden"><div className="h-full bg-black/80 rounded-full w-[72%]" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>Curiosity</span><span>54%</span></div>
                        <div className="h-1.5 w-full bg-[#FAFAF8] rounded-full overflow-hidden"><div className="h-full bg-[#8B7355] rounded-full w-[54%]" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                    <span className="text-xs text-black/40 font-medium uppercase tracking-wider block mb-2">Symbols</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#F3E5D8]/50 text-[#8B7355] text-xs font-medium">City</span>
                      <span className="px-2.5 py-1 rounded-md bg-[#E5ECE9]/50 text-emerald-700 text-xs font-medium">River</span>
                      <span className="px-2.5 py-1 rounded-md bg-black/5 text-black/60 text-xs font-medium">Running</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pattern Discovery & Chat */}
      <section className="relative z-10 py-24 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-medium mb-4">See the bigger picture</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">Chat with your entire dream history to uncover long-term trends.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-medium">Water Theme Recurrence</span>
                </div>
                <p className="text-white/60 text-sm">Water has appeared in 7 of your dreams this month, often associated with transition.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="font-medium">Emotional Intensity Peak</span>
                </div>
                <p className="text-white/60 text-sm">Your dreams have been 30% more emotionally intense in the days leading up to deadlines.</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-white/80" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dream Analyst AI</p>
                    <p className="text-xs text-white/40">Active now</p>
                  </div>
                </div>
                <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5">
                  <div className="flex gap-3 justify-end">
                    <div className="bg-white/10 p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm text-white/90">
                      Why do I keep dreaming about being back in school?
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <Sparkles size={12} />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm max-w-[90%] text-sm text-white/80 leading-relaxed">
                      Looking at your past 15 entries, the "school" theme tends to appear when you log high stress levels at work. Interestingly, in 4 of these dreams, you were specifically looking for a locker you couldn't find, which might relate to feelings of unpreparedness...
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="relative z-10 py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-[#FAFAF8] rounded-full flex items-center justify-center mx-auto mb-6 border border-black/5">
            <Lock className="text-[#8B7355] w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">Your dreams are personal.<br />They should stay that way.</h2>
          <p className="text-black/60 text-lg leading-relaxed">
            Dream Journal AI is a private, secure vault for your subconscious. Your entries are encrypted, stored securely using row-level security, and are never shared or used to train public models. 
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FAFAF8] to-[#F3E5D8]/30 rounded-3xl p-12 md:p-20 text-center border border-black/5 shadow-2xl shadow-[#8B7355]/5">
          <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Start understanding your dreams.</h2>
          <p className="text-black/60 text-lg mb-10 max-w-xl mx-auto">
            Join today and begin recording. Your first pattern might surprise you.
          </p>
          <Link href="/signup" className="inline-block text-lg font-medium bg-black text-white px-10 py-4 rounded-full hover:bg-black/90 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
            Start Journaling Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-black/5 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Dream Journal AI Logo" 
              className="w-6 h-6 rounded object-contain opacity-80" 
            />
            <span className="font-display font-medium text-black/60">Dream Journal AI</span>
          </div>
          <div className="flex gap-8 text-sm text-black/50">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black transition-colors">About</Link>
          </div>
          <p className="text-sm text-black/40">© 2026 Dream Journal AI.</p>
        </div>
      </footer>
    </div>
  );
}

// Dummy icon component for Moon since it wasn't imported in the prompt initially but used in visual
function Moon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}
