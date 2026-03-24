'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function LoginForm() {
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: '#0d1117' }}>
      {/* Purple gradient glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(147, 51, 234, 0.5) 0%, rgba(126, 34, 206, 0.3) 30%, rgba(88, 28, 135, 0.15) 55%, transparent 80%)',
        }}
      />

      {/* Login Card - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[360px]">
          <div className="rounded-2xl border border-white/[0.08] p-7" style={{ background: 'rgba(26, 32, 53, 0.85)', backdropFilter: 'blur(24px)' }}>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-lg font-bold text-white mb-1">Login</h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sign in to access your CRM account.
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
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or username"
                  required
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full py-2.5 px-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4">
              <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Sign Up */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-gray-400">
                Need a new account?{' '}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Admin Login */}
            <div className="mt-3">
              <Link
                href="/admin/login"
                className="flex items-center justify-center w-full py-2 px-4 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-300 border border-white/[0.04] hover:border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200"
              >
                Sign in as Administrator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
