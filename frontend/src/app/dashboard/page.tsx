'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { HiPlus, HiCheckCircle, HiClock, HiExclamationTriangle, HiClipboardDocumentCheck } from 'react-icons/hi2';

import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import TodoCard from '../../components/TodoCard';
import TodoModal from '../../components/TodoModal';
import TodoFilter from '../../components/TodoFilter';

import { getTodosApi, createTodoApi, updateTodoApi, toggleTodoStatusApi, deleteTodoApi } from '../../services/todo.service';
import { Todo, PriorityLevel, User } from '../../types';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | ''>('');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTodosApi({
        search: search || undefined,
        isCompleted: statusFilter === 'all' ? undefined : statusFilter === 'completed',
        priority: priorityFilter || undefined,
      });

      if (res.success && res.data) {
        setTodos(res.data);
      }
    } catch (error: any) {
      toast.error('Failed to load tasks from server');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleModalSubmit = async (data: {
    title: string;
    description?: string;
    priority?: PriorityLevel;
    category?: string;
    dueDate?: string;
  }) => {
    try {
      if (editingTodo) {
        const res = await updateTodoApi(editingTodo.id, data);
        if (res.success) {
          toast.success('Task updated successfully! ✅');
          fetchTodos();
        }
      } else {
        const res = await createTodoApi(data);
        if (res.success) {
          toast.success('New task added successfully! 🎉');
          fetchTodos();
        }
      }
    } catch (error: any) {
      const serverMsg = error.response?.data?.message || 'Failed to save task';
      toast.error(serverMsg);
      throw error;
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await toggleTodoStatusApi(id);
      if (res.success && res.data) {
        toast.success(`Task marked as ${res.data.is_completed ? 'Completed' : 'Pending'}`);
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t))
        );
      }
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await deleteTodoApi(id);
      if (res.success) {
        toast.success('Task deleted successfully 🗑️');
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('');
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.is_completed).length;
  const pendingTasks = todos.filter((t) => !t.is_completed).length;
  const highPriorityTasks = todos.filter((t) => t.priority === 'HIGH' && !t.is_completed).length;

  return (
    <ProtectedRoute>
      {(currentUser: User) => (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar user={currentUser} />

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Task Dashboard
                </h1>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Welcome back, <span className="font-semibold text-indigo-400">{currentUser.name}</span>! Track your daily productivity goals.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTodo(null);
                  setModalOpen(true);
                }}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-95"
              >
                <HiPlus className="h-4 w-4 stroke-[3] transition-transform group-hover:rotate-90" />
                <span>Add New Task</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400">
                    <HiClipboardDocumentCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Total Tasks</p>
                    <p className="text-xl font-black text-white">{totalTasks}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400">
                    <HiCheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Completed</p>
                    <p className="text-xl font-black text-emerald-400">{completedTasks}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600/20 text-amber-400">
                    <HiClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Pending</p>
                    <p className="text-xl font-black text-amber-400">{pendingTasks}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600/20 text-red-400">
                    <HiExclamationTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">High Priority</p>
                    <p className="text-xl font-black text-red-400">{highPriorityTasks}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <TodoFilter
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onReset={handleResetFilters}
              />
            </div>

            <div className="mt-8">
              {loading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  <p className="text-xs text-slate-400">Loading tasks from PostgreSQL...</p>
                </div>
              ) : todos.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 p-8 text-center backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                    <HiClipboardDocumentCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">No tasks found</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Click &apos;Add New Task&apos; above to create your first task.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {todos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggle}
                      onEdit={(t) => {
                        setEditingTodo(t);
                        setModalOpen(true);
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>

          <TodoModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditingTodo(null);
            }}
            onSubmit={handleModalSubmit}
            initialData={editingTodo}
          />
        </div>
      )}
    </ProtectedRoute>
  );
}
