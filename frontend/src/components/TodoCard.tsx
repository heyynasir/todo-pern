'use client';

// Icons, Types, aur Date utilities import kar rahe hain
import { HiCheck, HiTrash, HiPencilSquare, HiCalendar, HiTag } from 'react-icons/hi2';
import { Todo, PriorityLevel } from '../types';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
  
  // Priority Badges Dynamic Colors Helper
  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 ${
        todo.is_completed
          ? 'border-slate-800/80 bg-slate-900/30 opacity-75 backdrop-blur-sm'
          : 'border-slate-800 bg-slate-900/70 shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 backdrop-blur-md'
      }`}
    >
      <div>
        {/* Top Header: Category Tag & Priority Badge */}
        <div className="flex items-center justify-between gap-2">
          {/* Category Tag */}
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
            <HiTag className="h-3 w-3 text-indigo-400" />
            {todo.category || 'General'}
          </span>

          {/* Priority Badge */}
          <span
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${getPriorityStyle(
              todo.priority
            )}`}
          >
            {todo.priority}
          </span>
        </div>

        {/* Task Title & Checkbox */}
        <div className="mt-4 flex items-start gap-3">
          {/* Completion Checkbox Button */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
              todo.is_completed
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'border-slate-700 bg-slate-950 text-transparent hover:border-indigo-400'
            }`}
          >
            <HiCheck className="h-4 w-4 stroke-[3]" />
          </button>

          {/* Title & Description */}
          <div className="flex-1">
            <h3
              className={`text-base font-semibold transition-all ${
                todo.is_completed
                  ? 'text-slate-500 line-through'
                  : 'text-white group-hover:text-indigo-200'
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={`mt-1.5 text-xs leading-relaxed ${
                  todo.is_completed ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {todo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Due Date & Edit/Delete Action Buttons */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5">
        {/* Due Date Display */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <HiCalendar className="h-4 w-4 text-slate-400" />
          <span>
            {todo.due_date
              ? new Date(todo.due_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'No Due Date'}
          </span>
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(todo)}
            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-indigo-300"
            title="Edit Task"
          >
            <HiPencilSquare className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-500/20 hover:text-red-400"
            title="Delete Task"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
