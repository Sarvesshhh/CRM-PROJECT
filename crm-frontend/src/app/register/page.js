'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SALES');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-theme-bg-primary">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: '#9B3EFF' }} />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: '#3B1A5A' }} />
      </div>

      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-2xl mb-4" style={{ background: 'linear-gradient(180deg, #B066FF 0%, #9B3EFF 100%)', boxShadow: '0 10px 25px -5px rgba(155, 62, 255, 0.3)' }}>
            <span className="text-theme-text-primary font-bold text-xl">CRM</span>
          </div>
          <h1 className="text-2xl font-bold text-theme-text-primary">Create account</h1>
          <p className="text-theme-text-muted mt-1">Get started with CRM Suite</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-5 bg-theme-bg-tertiary border border-theme-card-border shadow-card">
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-2">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-11 pr-4 py-3 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary placeholder:text-theme-text-muted focus:border-theme-accent-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-2">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary placeholder:text-theme-text-muted focus:border-theme-accent-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-2">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-theme-bg-input border border-theme-card-border rounded-xl text-theme-text-primary placeholder:text-theme-text-muted focus:border-theme-accent-primary transition-all"
              />
            </div>
          </div>



          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ background: 'linear-gradient(180deg, #B066FF 0%, #9B3EFF 100%)', boxShadow: '0 4px 14px 0 rgba(155, 62, 255, 0.3)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-center text-sm text-theme-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-[#8B5CF6] hover:text-[#B066FF] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
