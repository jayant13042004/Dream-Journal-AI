'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-default)]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-display font-semibold text-[var(--text-primary)]">
            {title || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] rounded-full transition-colors hidden md:block">
            <Search size={20} />
          </button>
          
          <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] rounded-full transition-colors hidden md:block">
            <Bell size={20} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/dream/new" className="md:hidden">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--accent)] text-white p-2 rounded-full shadow-sm"
            >
              <Plus size={20} />
            </motion.div>
          </Link>
          
          <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] border border-[var(--border-default)] md:hidden flex items-center justify-center">
            <span className="text-sm font-medium text-[var(--accent)]">J</span>
          </div>
        </div>
      </div>
    </header>
  );
}
