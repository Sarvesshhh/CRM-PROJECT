'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import { customerAPI, userAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

const STATUSES = ['ACTIVE', 'INACTIVE', 'CHURNED'];

function CustomersContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', status: 'ACTIVE', assignedToId: null,
  });

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      fetchCustomers();
      fetchUsers();
    }
  }, [user, authLoading, page]);

  const fetchCustomers = async () => {
    try {
      const res = search
        ? await customerAPI.search(search, page, 10)
        : await customerAPI.getAll(page, 10);
      setCustomers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCustomers();
  };

  const openCreate = () => {
    setEditingCustomer(null);
    setForm({
      name: '', email: '', phone: '', company: '', status: 'ACTIVE',
      assignedToId: user?.role === 'ADMIN' ? '' : (user?.id || ''),
    });
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingCustomer(c);
    setForm({
      name: c.name || '', email: c.email || '', phone: c.phone || '',
      company: c.company || '', status: c.status || 'ACTIVE',
      assignedToId: c.assignedToId || (user?.id || ''),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, assignedToId: Number(form.assignedToId) };
    try {
      if (editingCustomer) {
        await customerAPI.update(editingCustomer.id, payload);
        toast.success('Customer updated');
      } else {
        await customerAPI.create(payload);
        toast.success('Customer created');
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    try {
      await customerAPI.delete(id);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const statusColor = (status) => {
    const map = {
      ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      INACTIVE: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      CHURNED: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    };
    return map[status] || 'bg-dark-700 text-theme-text-secondary border-dark-600';
  };

  const isAdmin = user?.role === 'ADMIN';

  if (authLoading || loading) {
    return <Layout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-theme-text-primary">Customers</h2>
            <p className="text-theme-text-muted text-sm mt-1">Manage your customer base</p>
          </div>
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
              <input
                id="customer-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="pl-9 pr-4 py-2 bg-theme-bg-tertiary border border-theme-card-border rounded-xl text-sm text-theme-text-primary placeholder:text-theme-text-muted focus:border-theme-accent-primary transition-all w-48"
              />
            </form>
            <button id="create-customer-btn" onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover text-white rounded-xl text-sm font-medium transition-all">
              <HiOutlinePlus className="w-4 h-4" /> Add Customer
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-theme-bg-tertiary border border-theme-card-border shadow-card">
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme-card-border">
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider hidden lg:table-cell">Company</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Assigned To</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-table-divider">
                {customers.length > 0 ? customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-theme-text-primary">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary">{c.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary hidden md:table-cell">{c.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary hidden lg:table-cell">{c.company || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColor(c.status)}`}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary">{c.assignedToName || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-2 text-theme-text-muted hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 text-theme-text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-theme-text-muted text-sm">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-theme-card-border">
              <p className="text-sm text-theme-text-muted">Page {page + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="p-2 text-theme-text-muted hover:text-theme-text-primary border border-theme-card-border rounded-lg hover:bg-theme-bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                  className="p-2 text-theme-text-muted hover:text-theme-text-primary border border-theme-card-border rounded-lg hover:bg-theme-bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCustomer ? 'Edit Customer' : 'New Customer'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required
                className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Company</label>
                <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Assign To *</label>
              {isAdmin ? (
                <select value={form.assignedToId} onChange={(e) => setForm({...form, assignedToId: e.target.value})} required
                  className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all">
                  <option value="">Select user</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              ) : (
                <input value={user?.name || ''} disabled
                  className="w-full px-4 py-2.5 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-muted text-sm cursor-not-allowed" />
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary border border-theme-card-border rounded-xl hover:bg-theme-bg-secondary transition-all">Cancel</button>
              <button type="submit"
                className="px-6 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover text-white rounded-xl text-sm font-medium transition-all">
                {editingCustomer ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}

export default function CustomersPage() {
  return (
    <AuthProvider>
      <CustomersContent />
    </AuthProvider>
  );
}
