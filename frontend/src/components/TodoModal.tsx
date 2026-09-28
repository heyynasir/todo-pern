'use client';

// Hooks, Icons, Types, aur Toasts import kar rahe hain
import { useState, useEffect } from 'react';
import { HiXMark, HiPlus, HiPencilSquare, HiCalendar } from 'react-icons/hi2';
import { Todo, PriorityLevel } from '../types';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority?: PriorityLevel;
    category?: string;
    dueDate?: string;
  }) => Promise<void>;
  initialData?: Todo | null;
}

export default function TodoModal({ isOpen, onClose, onSubmit, initialData }: TodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('MEDIUM');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'MEDIUM');
      setCategory(initialData.category || 'General');
      setDueDate(
        initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('General');
      setDueDate('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description ? description.trim() : undefined,
        priority,
        category: category ? category.trim() : 'General',
        dueDate: dueDate ? dueDate : undefined,
      });
      onClose();
    } catch (error) {
      // Handled in parent page
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              {initialData ? <HiPencilSquare className="h-5 w-5" /> : <HiPlus className="h-5 w-5" />}
            </div>
            <h3 className="text-lg font-bold text-white">
              {initialData ? 'Edit Todo Task' : 'Create New Todo Task'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete PERN Backend APIs"
              className="mt-2 block w-full rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra details..."
              className="mt-2 block w-full rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Priority Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="mt-2 block w-full rounded-xl border border-slate-800 bg-slate-950 py-3 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>

            {/* Category Tag */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Category Tag
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Work, Personal, Shopping..."
                className="mt-2 block w-full rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Due Date with Interactive Calendar Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Due Date (Optional)
            </label>
            <div className="relative mt-2">
              <input
                type="date"
                value={dueDate}
                onClick={(e) => {
                  if ('showPicker' in e.currentTarget) {
                    try {
                      (e.currentTarget as any).showPicker();
                    } catch (err) {}
                  }
                }}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
