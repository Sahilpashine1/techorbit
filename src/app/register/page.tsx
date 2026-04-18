'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const PRIMARY_COLOR = '#6c63ff';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    const update = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }));

    const handleOAuth = (provider: 'google' | 'github') => {
        signIn(provider, { callbackUrl: '/dashboard' });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: 'user',
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(data.message || 'Account created! Redirecting to login...');
                setTimeout(() => router.push('/login'), 1800);
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
            <div className="orb orb-purple" style={{ position: 'fixed', top: -100, right: -100 }} />
            <div className="orb orb-green" style={{ position: 'fixed', bottom: -100, left: -100 }} />

            <div style={{ width: '100%', maxWidth: 540, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <Logo size="lg" />
                    </Link>
                </div>

                <div className="glass-card" style={{ padding: '48px 40px' }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 6, textAlign: 'center' }}>Create your account</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, textAlign: 'center' }}>Join 1L+ Indian tech professionals on TechOrbit 🇮🇳</p>

                    {/* OAuth */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                        <button className="btn btn-ghost" style={{ fontSize: 13, gap: 8 }} onClick={() => handleOAuth('google')}>
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Continue with Google
                        </button>
                        <button className="btn btn-ghost" style={{ fontSize: 13, gap: 8 }} onClick={() => handleOAuth('github')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                            Continue with GitHub
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or register with email</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                    </div>

                    {/* Success / Error banners */}
                    {success && (
                        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(52,211,153,0.1)', border: '1px solid var(--accent-green)', marginBottom: 20, fontSize: 14, color: 'var(--accent-green)', fontWeight: 600 }}>
                            ✅ {success}
                        </div>
                    )}
                    {error && (
                        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.3)', marginBottom: 20, fontSize: 13, color: '#f44336' }}>
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Full Name</label>
                            <input className="input" placeholder="Rahul Sharma" value={form.name} onChange={e => update('name', e.target.value)} required />
                        </div>

                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                Email Address
                            </label>
                            <input className="input" type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Min 6 chars" value={form.password} onChange={e => update('password', e.target.value)} required style={{ paddingRight: 40 }} />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>
                                        {showPassword ? '🙈' : '👁'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Confirm</label>
                                <input className="input" type="password" placeholder="Re-enter" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
                            </div>
                        </div>

                        {form.password.length > 0 && (
                            <div>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: form.password.length >= i * 3 ? (i <= 2 ? 'var(--accent-orange)' : 'var(--accent-green)') : 'var(--border-subtle)', transition: 'background 0.3s' }} />
                                    ))}
                                </div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{form.password.length < 6 ? 'Weak' : form.password.length < 10 ? 'Fair' : 'Strong'} password</p>
                            </div>
                        )}

                        <label className="checkbox-container">
                            <input type="checkbox" className="custom-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                            <span className="checkmark"></span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                I agree to TechOrbit&apos;s{' '}
                                <Link href="/privacy" style={{ color: PRIMARY_COLOR, fontWeight: 600 }}>Privacy Policy</Link>
                            </span>
                        </label>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ background: PRIMARY_COLOR, boxShadow: `0 8px 24px ${PRIMARY_COLOR}40`, fontSize: 15 }} disabled={loading || !agreed}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account →'
                            )}
                        </button>
                    </form>

                    <p style={{ fontSize: 13, textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>Sign in →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
