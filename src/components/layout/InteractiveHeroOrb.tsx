'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Moon, Sparkles, Compass } from 'lucide-react';

const MOODS = [
  {
    id: 'peaceful',
    name: 'Peaceful Slumber',
    gradient: 'from-[#F3E5D8] via-[#FFF8F2] to-[#E9DFD3]',
    accent: '#8B7355',
    icon: Moon,
    shadow: 'rgba(139, 115, 85, 0.25)',
    glow: 'rgba(243, 229, 216, 0.5)',
    quote: '"What did your mind try to tell you last night?"'
  },
  {
    id: 'lucid',
    name: 'Lucid Awareness',
    gradient: 'from-[#FAD02C] via-[#FFEBB3] to-[#E8C010]',
    accent: '#B8860B',
    icon: Compass,
    shadow: 'rgba(184, 134, 11, 0.3)',
    glow: 'rgba(250, 208, 44, 0.4)',
    quote: '"You are the architect of your own night skies."'
  },
  {
    id: 'astral',
    name: 'Astral Depths',
    gradient: 'from-[#8A2BE2] via-[#E6D6FF] to-[#4B0082]',
    accent: '#4B0082',
    icon: Sparkles,
    shadow: 'rgba(75, 0, 130, 0.3)',
    glow: 'rgba(138, 43, 226, 0.4)',
    quote: '"Explore the deep, uncharted ocean of your thoughts."'
  }
];

export function InteractiveHeroOrb() {
  const [currentMoodIdx, setCurrentMoodIdx] = useState(0);
  const [activeQuote, setActiveQuote] = useState(MOODS[0].quote);
  const [showQuote, setShowQuote] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth 3D parallax tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Springs to make the movement fluid and responsive
  const springX = useSpring(rotateX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 20 });

  const currentMood = MOODS[currentMoodIdx];
  const IconComponent = currentMood.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor distance from center (-0.5 to 0.5)
    const clientX = (e.clientX - rect.left) / width - 0.5;
    const clientY = (e.clientY - rect.top) / height - 0.5;
    
    // Map to tilt angles (max 40 degrees)
    rotateX.set(-clientY * 40);
    rotateY.set(clientX * 40);
  };

  const handleMouseLeave = () => {
    // Reset to center
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleOrbClick = () => {
    // Morph to next mood
    const nextIdx = (currentMoodIdx + 1) % MOODS.length;
    setCurrentMoodIdx(nextIdx);
    setActiveQuote(MOODS[nextIdx].quote);
    
    // Show quote bounce animation
    setShowQuote(true);
  };

  // Automatically fade out quote after 4 seconds
  useEffect(() => {
    if (showQuote) {
      const timer = setTimeout(() => {
        setShowQuote(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showQuote, currentMoodIdx]);

  return (
    <div className="relative w-full max-w-[450px] aspect-square flex flex-col items-center justify-center select-none">
      
      {/* Decorative Interactive Background Text */}
      <div className="absolute top-0 text-[10px] uppercase tracking-[0.25em] text-black/30 font-semibold pointer-events-none animate-pulse">
        ✦ Click to explore dimensions ✦
      </div>

      {/* Floating subconscious message bubble */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={showQuote ? { opacity: 1, y: -60, scale: 1 } : { opacity: 0, y: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute z-30 pointer-events-none px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-black/5 shadow-xl text-center max-w-[280px]"
        style={{ top: '15%' }}
      >
        <p className="text-xs font-medium text-black/80 italic leading-relaxed">
          {activeQuote}
        </p>
      </motion.div>

      {/* 3D Interactive Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleOrbClick}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          perspective: 1000
        }}
        className="relative w-full max-w-[320px] aspect-square flex items-center justify-center cursor-pointer group"
      >
        {/* Ambient Outer Glow Layer */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-[-20px] rounded-full blur-3xl opacity-60 transition-colors duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${currentMood.glow} 0%, transparent 70%)`
          }}
        />

        {/* Orbit Ring 1 - Deep outer ring */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transform: 'translateZ(-50px)' }}
          className="absolute inset-0 rounded-full border border-black/5 scale-[1.2] group-hover:scale-[1.25] transition-transform duration-500"
        />

        {/* Orbit Ring 2 - Inner tilted ring with particles */}
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{ transform: 'translateZ(30px) rotateX(15deg)' }}
          className="absolute inset-4 rounded-full border border-black/10 scale-100 flex items-center justify-between"
        >
          {/* Decorative constellation stars on the ring */}
          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
          <div className="w-1 h-1 rounded-full bg-black/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
        </motion.div>

        {/* Main 3D Core Sphere */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ 
            transform: 'translateZ(80px)',
            boxShadow: `0 25px 60px -15px ${currentMood.shadow}, inset 0 -20px 40px -10px ${currentMood.accent}20`
          }}
          className={`relative w-48 h-48 rounded-full bg-gradient-to-tr ${currentMood.gradient} border border-white/60 p-1 flex items-center justify-center transition-all duration-1000 overflow-hidden`}
        >
          {/* Glass Gloss effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
          
          {/* Shimmer light bar sweep */}
          <motion.div 
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />

          {/* Central Glassmorphic Portal */}
          <div className="w-28 h-28 bg-white/40 backdrop-blur-xl rounded-full border border-white shadow-md flex flex-col items-center justify-center gap-1 z-10">
            <motion.div
              key={currentMood.id}
              initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <IconComponent className="w-10 h-10 transition-colors duration-1000" style={{ color: currentMood.accent }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Mini Orbs / Themes (Parallax layers) */}
        <motion.div
          style={{ transform: 'translateZ(120px) translateX(-50px) translateY(-50px)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-8 h-8 rounded-full bg-white border border-black/5 shadow-md flex items-center justify-center text-[10px] font-medium text-black/60 font-sans"
        >
          ☁️
        </motion.div>

        <motion.div
          style={{ transform: 'translateZ(40px) translateX(90px) translateY(80px)' }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg flex items-center justify-center text-[11px] font-semibold text-black/70"
        >
          👁️
        </motion.div>

        <motion.div
          style={{ transform: 'translateZ(100px) translateX(90px) translateY(-80px)' }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute w-10 h-10 rounded-full bg-white border border-black/5 shadow-md flex items-center justify-center text-[11px] font-semibold text-black/70"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Mode Status Text below */}
      <motion.div 
        key={currentMood.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex flex-col items-center gap-1"
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-black/50">
          State: {currentMood.name}
        </span>
        <span className="text-[10px] text-black/30 font-medium italic">
          Click the sphere to change the vibe
        </span>
      </motion.div>
    </div>
  );
}
