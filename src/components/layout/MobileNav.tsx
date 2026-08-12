'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, MessageCircle, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Dreams', href: '/dreams', icon: BookOpen },
    { name: 'New', href: '/dream/new', icon: Plus, isFab: true },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Profile', href: '/settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-t border-[var(--border-default)] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          if (item.isFab) {
            return (
              <Link key={item.name} href={item.href} className="relative -top-5">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[var(--accent-soft)] border-4 border-[var(--bg-primary)]"
                >
                  <item.icon size={24} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
                <item.icon
                  size={22}
                  className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}
                />
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
