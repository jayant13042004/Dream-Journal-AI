'use client';

import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { MOODS } from '@/lib/utils/constants';

export interface DreamFiltersState {
  search: string;
  mood: string | null;
  startDate: string | null;
  endDate: string | null;
  sort: 'newest' | 'oldest' | 'a-z';
}

interface DreamFiltersProps {
  filters: DreamFiltersState;
  onFilterChange: (filters: DreamFiltersState) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'a-z', label: 'A-Z' },
];

export function DreamFilters({ filters, onFilterChange }: DreamFiltersProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleChange = (key: keyof DreamFiltersState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onFilterChange({
      search: '',
      mood: null,
      startDate: null,
      endDate: null,
      sort: 'newest',
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop & Mobile Header */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <Input
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search dreams..."
            className="pl-10 w-full"
          />
        </div>
        
        {/* Mobile Filter Toggle */}
        <Button
          variant="secondary"
          className="md:hidden flex items-center gap-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filter Controls Panel */}
      <div className={`
        flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-0 
        bg-[var(--bg-card)] md:bg-transparent rounded-lg md:rounded-none
        border md:border-none border-[var(--border-default)]
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
      `}>
        {/* Mood Filter */}
        <div className="w-full md:w-auto">
          <select
            value={filters.mood || ''}
            onChange={(e) => handleChange('mood', e.target.value || null)}
            className="w-full md:w-auto bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="">All Moods</option>
            {MOODS.map((mood) => (
              <option key={mood.value} value={mood.value}>
                {mood.emoji} {mood.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value || null)}
            className="w-full md:w-auto"
            placeholder="Start date"
          />
          <span className="text-[var(--text-muted)]">-</span>
          <Input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value || null)}
            className="w-full md:w-auto"
            placeholder="End date"
          />
        </div>

        {/* Sort */}
        <div className="w-full md:w-auto ml-auto">
          <select
             value={filters.sort}
             onChange={(e) => handleChange('sort', e.target.value)}
             className="w-full md:w-auto bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.mood || filters.startDate || filters.endDate || filters.search || filters.sort !== 'newest') && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] md:ml-2"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
