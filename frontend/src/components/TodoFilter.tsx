'use client';

// Icons import kar rahe hain
import { HiMagnifyingGlass, HiFunnel, HiXMark } from 'react-icons/hi2';
import { PriorityLevel } from '../types';

interface TodoFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'pending' | 'completed';
  onStatusChange: (status: 'all' | 'pending' | 'completed') => void;
  priorityFilter: PriorityLevel | '';
  onPriorityChange: (priority: PriorityLevel | '') => void;
  onReset: () => void;
}

export default function TodoFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onReset,
}: TodoFilterProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      
      {/* 1. Search Bar Input */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <HiMagnifyingGlass className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search todos by title..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pr-4 pl-11 text-xs text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white"
          >
            <HiXMark className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. Status Segmented Tabs */}
      <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-950/80 p-1">
        <button
          onClick={() => onStatusChange('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            statusFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onStatusChange('pending')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            statusFilter === 'pending'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onStatusChange('completed')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            statusFilter === 'completed'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed
        </button>
      </div>

      {/* 3. Priority Dropdown Filter */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as PriorityLevel | '')}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 pr-8 pl-4 text-xs font-semibold text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(search || statusFilter !== 'all' || priorityFilter) && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-800/50 px-3 py-2.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            title="Reset Filters"
          >
            <HiXMark className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
