'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import { leadAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSwitchHorizontal,
  HiOutlineFilter,
} from 'react-icons/hi';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];
const SOURCES = ['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'COLD_CALL', 'OTHER'];

function LeadsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', status: 'NEW', assignedToId: null,
  });

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) fetchLeads();
  }, [user, authLoading, filterStatus]);

  const fetchLeads = async () => {
    try {
      const res = await leadAPI.getAll(filterStatus || undefined);
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingLead(null);
    setForm({ name: '', email: '', phone: '', source: '', status: 'NEW', assignedToId: null });
    setModalOpen(true);
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source || '',
      status: lead.status || 'NEW',
      assignedToId: lead.assignedToId || null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await leadAPI.update(editingLead.id, form);
        toast.success('Lead updated');
      } else {
        await leadAPI.create(form);
        toast.success('Lead created');
      }
      setModalOpen(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await leadAPI.delete(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  const handleConvert = async (id) => {
    if (!confirm('Convert this lead to a customer?')) return;
    try {
      await leadAPI.convert(id);
      toast.success('Lead converted to customer!');
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed');
    }
  };

  const statusColor = (status) => {
    const map = {
      NEW: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
      CONTACTED: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      QUALIFIED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
      LOST: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    };
    return map[status] || 'bg-dark-700 text-theme-text-secondary border-dark-600';
  };

  if (authLoading || loading) {
    return <Layout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="animate-fadeIn space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-theme-text-primary">Leads</h2>
            <p className="text-theme-text-muted text-sm mt-1">{leads.length} total leads</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
              <select
                id="lead-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-4 py-2 bg-theme-bg-tertiary border border-theme-card-border rounded-xl text-sm text-theme-text-primary focus:border-theme-accent-primary transition-all"
              >
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              id="create-lead-btn"
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover text-white rounded-xl text-sm font-medium transition-all"
            >
              <HiOutlinePlus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden bg-theme-bg-tertiary border border-theme-card-border shadow-card">
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme-card-border">
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-theme-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-table-divider">
                {leads.length > 0 ? leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-theme-text-primary">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary">{lead.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary hidden md:table-cell">{lead.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-theme-text-secondary hidden lg:table-cell">{lead.source || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(lead)} className="p-2 text-theme-text-muted hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleConvert(lead.id)} className="p-2 text-theme-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Convert to Customer">
                          <HiOutlineSwitchHorizontal className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(lead.id)} className="p-2 text-theme-text-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-theme-text-muted text-sm">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingLead ? 'Edit Lead' : 'New Lead'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required
                className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Source</label>
                <select value={form.source} onChange={(e) => setForm({...form, source: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all">
                  <option value="">Select source</option>
                  {SOURCES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-theme-input-bg border border-theme-card-border rounded-xl text-theme-text-primary text-sm focus:border-theme-accent-primary transition-all">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary border border-theme-card-border rounded-xl hover:bg-theme-bg-secondary transition-all">
                Cancel
              </button>
              <button type="submit"
                className="px-6 py-2 bg-theme-accent-primary hover:bg-theme-accent-hover text-white rounded-xl text-sm font-medium transition-all">
                {editingLead ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}

export default function LeadsPage() {
  return (
    <AuthProvider>
      <LeadsContent />
    </AuthProvider>
  );
}
