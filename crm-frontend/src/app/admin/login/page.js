'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#04020a' }}>
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, true);
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: '#04020a' }}>
      {/* Emerald gradient glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(6, 182, 212, 0.45) 0%, rgba(8, 145, 178, 0.28) 30%, rgba(14, 116, 144, 0.13) 55%, transparent 80%)',
        }}
      />

      {/* Back button */}
      <div className="relative z-10 px-6 pt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 py-2 px-3 rounded-xl text-sm text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Login Card - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[360px]">
          <div className="rounded-2xl border border-white/[0.08] p-7" style={{ background: 'rgba(13, 9, 20, 0.95)', backdropFilter: 'blur(24px)' }}>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-lg font-bold text-white mb-1">Admin Login</h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sign in with your administrator credentials.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <input
                  id="admin-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email"
                  required
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <input
                  id="admin-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              <button
                id="admin-login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign into Admin Portal'
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthProvider>
      <AdminLoginForm />
    </AuthProvider>
  );
}
