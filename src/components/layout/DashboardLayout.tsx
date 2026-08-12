'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';
import { usePathname } from 'next/navigation';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    // Simple title mapping based on pathname
    if (pathname.includes('/dreams')) setPageTitle('My Dreams');
    else if (pathname.includes('/insights')) setPageTitle('Insights');
    else if (pathname.includes('/chat')) setPageTitle('AI Chat');
    else if (pathname.includes('/calendar')) setPageTitle('Calendar');
    else if (pathname.includes('/settings')) setPageTitle('Settings');
    else if (pathname.includes('/dream-universe')) setPageTitle('Dream Universe');
    else if (pathname.includes('/dream/new')) setPageTitle('New Dream');
    else if (pathname.includes('/dream/')) setPageTitle('Dream Detail');
    else setPageTitle('Dashboard');
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:pl-[240px] flex flex-col min-h-screen pb-16 md:pb-0">
        <Header title={pageTitle} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
