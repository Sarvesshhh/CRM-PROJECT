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
    return map[status] || 'bg-dark-700 text-dark-300 border-dark-600';
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
            <h2 className="text-2xl font-bold text-white">Leads</h2>
            <p className="text-dark-400 text-sm mt-1">{leads.length} total leads</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <select
                id="lead-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-4 py-2 border border-white/10 rounded-xl text-sm text-white focus:border-primary-500 transition-all" style={{ background: '#1a2035' }}
              >
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              id="create-lead-btn"
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
            >
              <HiOutlinePlus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', borderRadius: '14px' }}>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-dark-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-dark-400 uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-dark-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.length > 0 ? leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-dark-300">{lead.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-dark-300 hidden md:table-cell">{lead.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-dark-300 hidden lg:table-cell">{lead.source || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(lead)} className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleConvert(lead.id)} className="p-2 text-dark-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Convert to Customer">
                          <HiOutlineSwitchHorizontal className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(lead.id)} className="p-2 text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-dark-400 text-sm">No leads found</td>
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
              <label className="block text-sm font-medium text-dark-300 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required
                className="w-full px-4 py-2.5 bg-dark-800/50 border border-white/10 rounded-xl text-white text-sm focus:border-primary-500 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-dark-800/50 border border-white/10 rounded-xl text-white text-sm focus:border-primary-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-dark-800/50 border border-white/10 rounded-xl text-white text-sm focus:border-primary-500 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Source</label>
                <select value={form.source} onChange={(e) => setForm({...form, source: e.target.value})}
                  className="w-full px-4 py-2.5 bg-dark-800/50 border border-white/10 rounded-xl text-white text-sm focus:border-primary-500 transition-all">
                  <option value="">Select source</option>
                  {SOURCES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-2.5 bg-dark-800/50 border border-white/10 rounded-xl text-white text-sm focus:border-primary-500 transition-all">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-dark-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button type="submit"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all">
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
