'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Sparkles,
  MessageCircle,
  CalendarDays,
  Settings,
  Moon,
  Plus
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Dreams', href: '/dreams', icon: BookOpen },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'Dream Universe', href: '/dream-universe', icon: Sparkles },
  { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] fixed inset-y-0 left-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] z-20">
      <Link href="/dashboard" className="p-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img 
          src="/logo.png" 
          alt="Dream Journal AI Logo" 
          className="w-8 h-8 rounded-lg object-contain" 
        />
        <span className="font-display font-semibold text-lg text-[var(--text-primary)]">
          Dream Journal
        </span>
      </Link>

      <div className="px-4 mb-6">
        <Link href="/dream/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-white py-2.5 rounded-xl font-medium shadow-md shadow-[var(--accent-soft)]"
          >
            <Plus size={20} />
            <span>New Dream</span>
          </motion.button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative group ${
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--accent-soft)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[var(--accent)]' : ''} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-5 bg-[var(--accent)] rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-default)]">
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mb-4">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-medium">
            J
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[var(--text-primary)]">Jayant</span>
            <span className="text-xs text-[var(--text-muted)]">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
