'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import { taskAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalendar,
} from 'react-icons/hi';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

function TasksContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', dueDate: '', status: 'PENDING', assignedToId: null, customerId: null,
  });

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) fetchTasks();
  }, [user, authLoading]);

  const fetchTasks = async () => {
    try {
      const res = await taskAPI.getAll();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', dueDate: '', status: 'PENDING', assignedToId: null, customerId: null });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditingTask(t);
    setForm({
      title: t.title || '', description: t.description || '',
      dueDate: t.dueDate || '', status: t.status || 'PENDING',
      assignedToId: t.assignedToId || null, customerId: t.customerId || null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.dueDate) delete payload.dueDate;
    if (!payload.assignedToId) delete payload.assignedToId;
    if (!payload.customerId) delete payload.customerId;
    try {
      if (editingTask) {
        await taskAPI.update(editingTask.id, payload);
        toast.success('Task updated');
      } else {
        await taskAPI.create(payload);
        toast.success('Task created');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const statusColor = (status) => {
    const map = {
      PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      IN_PROGRESS: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
      COMPLETED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      CANCELLED: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    };
    return map[status] || 'bg-dark-700 text-theme-text-secondary border-dark-600';
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !['COMPLETED', 'CANCELLED'].includes(form.status);
  };

  if (authLoading || loading) {
    return <Layout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-theme-text-primary">Tasks</h2>
            <p className="text-theme-text-muted text-sm mt-1">{tasks.length} total tasks</p>
          </div>
          <button id="create-task-btn" onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover text-white rounded-xl text-sm font-medium transition-all self-start sm:self-auto">
            <HiOutlinePlus className="w-4 h-4" /> Add Task
          </button>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.length > 0 ? tasks.map((task) => (
            <div key={task.id} className="rounded-2xl p-5 transition-all group bg-theme-bg-tertiary border border-theme-card-border shadow-card hover:shadow-card-hover">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-theme-text-primary group-hover:text-primary-300 transition-colors line-clamp-1">{task.title}</h3>
                <span className={`inline-flex px-2 py-0.5 rounded-lg text-[11px] font-medium border ${statusColor(task.status)}`}>
                  {task.status?.replace('_', ' ')}
                </span>
              </div>
              {task.description && (
                <p className="text-xs text-theme-text-muted mb-4 line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-theme-text-muted">
                  {task.dueDate && (
                    <span className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-rose-400' : ''}`}>
                      <HiOutlineCalendar className="w-3.5 h-3.5" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.customerName && (
                    <span className="truncate max-w-[120px]">{task.customerName}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(task)} className="p-1.5 text-theme-text-muted hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all">
                    <HiOutlinePencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="p-1.5 text-theme-text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full rounded-2xl p-12 text-center text-theme-text-muted text-sm bg-theme-bg-tertiary border border-theme-card-border shadow-card">
              No tasks yet. Click &quot;Add Task&quot; to get started.
            </div>
          )}
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required
                className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary border border-theme-card-border rounded-xl hover:bg-theme-bg-secondary transition-all">Cancel</button>
              <button type="submit"
                className="px-6 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover text-white rounded-xl text-sm font-medium transition-all">
                {editingTask ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}

export default function TasksPage() {
  return (
    <AuthProvider>
      <TasksContent />
    </AuthProvider>
  );
}
