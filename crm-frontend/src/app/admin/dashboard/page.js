'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { dashboardAPI, customerAPI, leadAPI, taskAPI, activityAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

function AdminDashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    if (user && user.role === 'ADMIN') {
      fetchAllData();
    }
  }, [user, authLoading]);

  const fetchAllData = async () => {
    try {
      const [statsRes, custRes, leadRes, taskRes, actRes] = await Promise.all([
        dashboardAPI.getStats(),
        customerAPI.getAll(0, 500),
        leadAPI.getAll(),
        taskAPI.getAll(),
        activityAPI.getAll()
      ]);
      setStats(statsRes.data);
      setCustomers(custRes.data?.content || custRes.data || []);
      setLeads(leadRes.data || []);
      setTasks(taskRes.data || []);
      setActivities(actRes.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const activityIcon = (type) => type; // simplify

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'customers', label: 'Customers', count: customers.length },
    { id: 'leads', label: 'Leads', count: leads.length },
    { id: 'tasks', label: 'Tasks', count: tasks.length },
    { id: 'activities', label: 'Activities', count: activities.length },
  ];

  return (
    <Layout>
      <div className="animate-fadeIn space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-theme-text-primary">
            Admin Dashboard
          </h2>
          <p className="text-theme-text-muted mt-1">System-wide overview and data access.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Leads"
            value={stats?.totalLeads ?? 0}
            icon={HiOutlineLightningBolt}
            color="primary"
          />
          <StatsCard
            title="Total Customers"
            value={stats?.totalCustomers ?? 0}
            icon={HiOutlineUserGroup}
            color="emerald"
          />
          <StatsCard
            title="Pending Tasks"
            value={stats?.pendingTasks ?? 0}
            icon={HiOutlineClipboardList}
            color="amber"
          />
          <StatsCard
            title="Completed Tasks"
            value={stats?.completedTasks ?? 0}
            icon={HiOutlineCheckCircle}
            color="cyan"
          />
        </div>

        {/* Detailed Data Tabs */}
        <div className="rounded-2xl overflow-hidden bg-theme-bg-tertiary border border-theme-card-border shadow-card">
          {/* Tab Headers */}
          <div className="flex border-b border-theme-card-border overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-theme-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-500/20' : 'bg-dark-800'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-0 overflow-x-auto">
            {activeTab === 'customers' && (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-theme-text-muted uppercase bg-dark-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Sales Rep</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-table-divider">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-theme-text-primary">{c.name}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{c.company || '-'}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{c.email}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{c.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-theme-text-secondary">{c.assignedToName || 'Unassigned'}</td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-theme-text-muted">No Customers Found</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'leads' && (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-theme-text-muted uppercase bg-dark-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Sales Rep</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-table-divider">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-theme-text-primary">{l.name}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{l.email}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{l.phone}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{l.source || '-'}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{l.status}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{l.assignedToName || 'Unassigned'}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-theme-text-muted">No Leads Found</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'tasks' && (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-theme-text-muted uppercase bg-dark-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-table-divider">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-theme-text-primary">{t.title}</td>
                      <td className="px-6 py-4 text-theme-text-secondary truncate max-w-xs">{t.description}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{t.status}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{t.assignedToName || 'Unassigned'}</td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-theme-text-muted">No Tasks Found</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'activities' && (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-theme-text-muted uppercase bg-dark-900/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-table-divider">
                  {activities.map((a) => (
                    <tr key={a.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-theme-text-primary">{a.type}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{a.customerName}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 text-theme-text-secondary">{a.notes}</td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-theme-text-muted">No Activities Found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  );
}
