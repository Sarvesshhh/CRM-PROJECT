'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarExpanded');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const togglePanel = () => {
    setPanelExpanded((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarExpanded', String(next));
      return next;
    });
  };

  const expandPanel = () => {
    setPanelExpanded(true);
    localStorage.setItem('sidebarExpanded', 'true');
  };
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard', icon: HiOutlineViewGrid },
    { name: 'Leads', href: '/leads', icon: HiOutlineLightningBolt },
    { name: 'Customers', href: '/customers', icon: HiOutlineUserGroup },
    { name: 'Tasks', href: '/tasks', icon: HiOutlineClipboardList },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== TWO-PANEL SIDEBAR ===== */}
      <aside
        className={`sidebar-wrapper ${panelExpanded ? 'expanded' : ''} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* LEFT: Icon Rail */}
        <div className="sidebar-icon-rail">
          {/* Logo icon */}
          <div className="sidebar-rail-top">
            <Link href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
              <div className="sidebar-logo-icon">
                <span>C</span>
              </div>
            </Link>
          </div>

          {/* Nav icons */}
          <nav className="sidebar-rail-nav">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-rail-icon ${isActive ? 'active' : ''}`}
                  title={item.name}
                >
                  <item.icon style={{ width: 20, height: 20 }} />
                </Link>
              );
            })}
          </nav>

          {/* Bottom icons */}
          <div className="sidebar-rail-bottom">
            <button className="sidebar-rail-icon" title="Profile" onClick={() => toast('Profile page coming soon!', { icon: '👤' })}>
              <HiOutlineUser style={{ width: 20, height: 20 }} />
            </button>
            <button className="sidebar-rail-icon" title="Notifications" onClick={() => toast('No new notifications', { icon: '🔔' })}>
              <HiOutlineBell style={{ width: 20, height: 20 }} />
            </button>
            <button className="sidebar-rail-icon" title="Settings" onClick={expandPanel}>
              <HiOutlineCog style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>

        {/* RIGHT: Expanded Panel */}
        <div className="sidebar-panel">
          {/* App name header */}
          <div className="sidebar-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="sidebar-logo-icon-sm">
                <span>C</span>
              </div>
              <div>
                <div className="sidebar-app-name">CRM Suite</div>
                <div className="sidebar-app-subtitle">Workspace</div>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="sidebar-panel-nav">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon style={{ width: 18, height: 18 }} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom user section */}
          <div className="sidebar-panel-bottom">
            <div className="sidebar-divider" />
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name || 'Sarvesh'}</p>
              <p className="sidebar-user-email">{user?.email || 'user123@gmail.com'}</p>
            </div>
            <button
              onClick={logout}
              className="sidebar-signout"
            >
              <HiOutlineLogout style={{ width: 16, height: 16 }} />
              Sign out
            </button>
          </div>
        </div>

        {/* Collapse / Expand toggle button */}
        <button
          className="sidebar-toggle-btn"
          onClick={togglePanel}
          title={panelExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {panelExpanded
            ? <HiOutlineChevronLeft style={{ width: 14, height: 14 }} />
            : <HiOutlineChevronRight style={{ width: 14, height: 14 }} />
          }
        </button>
      </aside>

      {/* Main content — shifts based on sidebar state */}
      <div
        style={{
          paddingLeft: panelExpanded ? '262px' : '52px',
          transition: 'padding-left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center px-6" style={{
          height: '56px',
          background: 'rgba(13,17,23,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <button
            className="lg:hidden mr-4"
            style={{ color: '#666', transition: 'color 0.2s' }}
            onClick={() => setSidebarOpen(true)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            <HiOutlineMenu style={{ width: 22, height: 22 }} />
          </button>
          <h1 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>
            {pathname === '/dashboard' || pathname === '/admin/dashboard' ? 'Dashboard' : pathname?.split('/').pop() || ''}
          </h1>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
