'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { dashboardAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineCalendar,
} from 'react-icons/hi';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchStats();
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const activityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'CALL': return <HiOutlinePhone className="w-4 h-4" />;
      case 'EMAIL': return <HiOutlineMail className="w-4 h-4" />;
      case 'MEETING': return <HiOutlineCalendar className="w-4 h-4" />;
      default: return <HiOutlineCalendar className="w-4 h-4" />;
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name || 'there'}! 👋
          </h2>
          <p className="text-dark-400 mt-1">Here&apos;s what&apos;s happening with your CRM today.</p>
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

        {/* Recent Activities */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1a2035', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', borderRadius: '14px' }}>
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
          </div>
          <div className="divide-y divide-white/5">
            {stats?.recentActivities?.length > 0 ? (
              stats.recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.15)' }}>
                    <span className="text-primary-400">{activityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {activity.type} - {activity.customerName || 'Unknown'}
                    </p>
                    <p className="text-xs text-dark-400 truncate">{activity.notes || 'No notes'}</p>
                  </div>
                  <span className="text-xs text-dark-500 whitespace-nowrap">
                    {activity.date ? new Date(activity.date).toLocaleDateString() : ''}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-dark-400">
                <p className="text-sm">No recent activities yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
