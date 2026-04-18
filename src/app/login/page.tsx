'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

type AuthMode = 'login' | 'signup' | 'forgot';

const PRIMARY_COLOR = '#6c63ff';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('login');

    // Login fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Sign-up only fields
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);

    // Forgot password
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const reset = (newMode: AuthMode) => {
        setMode(newMode);
        setError('');
        setSuccess('');
        setForgotSent(false);
        setForgotEmail('');
    };

    const handleOAuth = (provider: 'google' | 'github') => signIn(provider, { callbackUrl: '/dashboard' });

    // ── LOGIN ─────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
                role: 'user',
            });
            if (res?.ok) {
                router.push('/dashboard');
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch { setError('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    // ── SIGN UP ───────────────────────────────────
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (!agreed) { setError('Please agree to the Terms of Service.'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'user',
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess('Account created! Signing you in...');
                setTimeout(async () => {
                    const r = await signIn('credentials', { redirect: false, email, password, role: 'user' });
                    if (r?.ok) router.push('/dashboard');
                }, 1200);
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch { setError('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    // ── FORGOT PASSWORD ───────────────────────────
    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) { setError('Please enter your email address.'); return; }
        setForgotLoading(true);
        setError('');
        // Simulate sending reset email (replace with real API call when ready)
        await new Promise(r => setTimeout(r, 1200));
        setForgotLoading(false);
        setForgotSent(true);
    };

    const features = [
        { icon: '💼', text: '8.5 Lakh+ live job listings in India' },
        { icon: '🤖', text: 'AI resume analysis with smart roadmaps' },
        { icon: '🎓', text: 'Top global certifications with direct links' },
        { icon: '🌐', text: 'Network with mentors at top Indian startups' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
            <div className="orb orb-purple" style={{ position: 'fixed', top: -100, left: -100 }} />
            <div className="orb orb-blue" style={{ position: 'fixed', bottom: -100, right: -100 }} />

            <div style={{ width: '100%', maxWidth: 960, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-elevated)', position: 'relative', zIndex: 1 }}>

                {/* Left Brand Panel */}
                <div style={{ background: 'var(--gradient-hero)', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 52 }}>
                            <Logo size="lg" />
                        </Link>
                        <h2 style={{ fontSize: 34, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20 }}>
                            India&apos;s #1<br />Tech Career<br />Platform
                        </h2>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 36 }}>
                            Join <strong style={{ color: 'white' }}>1 Lakh+ Indian tech professionals</strong> growing their career with AI.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {features.map(f => (
                                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div style={{ background: 'var(--bg-secondary)', padding: '48px' }}>

                    {/* ── FORGOT PASSWORD MODE ── */}
                    {mode === 'forgot' && (
                        <div style={{ animation: 'fade-in-up 0.3s ease' }}>
                            <button onClick={() => reset('login')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginBottom: 32, padding: 0 }}>
                                ← Back to Sign In
                            </button>
                            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.025em' }}>Reset Password</h2>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
                                Enter your email and we&apos;ll send you instructions to reset your password.
                            </p>
                            {forgotSent ? (
                                <div style={{ padding: '20px 24px', borderRadius: 'var(--radius-lg)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 36, marginBottom: 12 }}>📧</div>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: '#22c55e', marginBottom: 6 }}>Check your inbox!</p>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                        We sent a password reset link to <strong>{forgotEmail}</strong>
                                    </p>
                                    <button onClick={() => reset('login')} className="btn btn-ghost btn-sm" style={{ marginTop: 20 }}>
                                        Back to Sign In
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgot}>
                                    {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.3)', marginBottom: 14, fontSize: 13, color: '#f44336' }}>{error}</div>}
                                    <div style={{ marginBottom: 24 }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Email Address</label>
                                        <input className="input" type="email" placeholder="you@gmail.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', background: PRIMARY_COLOR, boxShadow: '0 8px 24px rgba(108,99,255,0.4)', fontSize: 15 }} disabled={forgotLoading}>
                                        {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {mode !== 'forgot' && (
                        <>
                            {/* Tab switcher */}
                            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 28 }}>
                                {(['login', 'signup'] as const).map(m => (
                                    <button key={m} onClick={() => reset(m)}
                                        style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                                            background: mode === m ? PRIMARY_COLOR : 'transparent',
                                            color: mode === m ? 'white' : 'var(--text-secondary)',
                                            boxShadow: mode === m ? `0 4px 14px ${PRIMARY_COLOR}60` : 'none',
                                        }}>
                                        {m === 'login' ? 'Sign In' : 'Create Account'}
                                    </button>
                                ))}
                            </div>

                            {/* OAuth (login only) */}
                            {mode === 'login' && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                                        <button type="button" className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => handleOAuth('google')}>Continue with Google</button>
                                        <button type="button" className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => handleOAuth('github')}>Continue with GitHub</button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                                        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or sign in with email</span>
                                        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                                    </div>
                                </>
                            )}

                            {/* Alerts */}
                            {error && <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.3)', marginBottom: 14, fontSize: 13, color: '#f44336' }}>{error}</div>}
                            {success && <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: 14, fontSize: 13, color: '#22c55e' }}>{success}</div>}

                            {/* ── LOGIN FORM ── */}
                            {mode === 'login' && (
                                <form onSubmit={handleLogin}>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Email</label>
                                        <input className="input" type="email" placeholder="you@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                    <div style={{ marginBottom: 8, position: 'relative' }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 44 }} />
                                            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)', lineHeight: 1 }}>{showPass ? '🙈' : '👁'}</button>
                                        </div>
                                    </div>
                                    {/* Forgot Password link */}
                                    <div style={{ textAlign: 'right', marginBottom: 20 }}>
                                        <button type="button" onClick={() => reset('forgot')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: PRIMARY_COLOR, fontWeight: 600 }}>
                                            Forgot password?
                                        </button>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', background: PRIMARY_COLOR, boxShadow: `0 8px 24px ${PRIMARY_COLOR}40`, fontSize: 15 }} disabled={loading}>
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </button>
                                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 18 }}>
                                        No account?{' '}
                                        <button type="button" onClick={() => reset('signup')} style={{ color: PRIMARY_COLOR, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Create one</button>
                                    </p>
                                </form>
                            )}

                            {/* ── SIGN UP FORM ── */}
                            {mode === 'signup' && (
                                <form onSubmit={handleSignUp} style={{ animation: 'fade-in-up 0.3s ease' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                                                Full Name
                                            </label>
                                            <input className="input" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
                                        </div>
                                        <div style={{ gridColumn: '1/-1' }}>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Email</label>
                                            <input className="input" type="email" placeholder="you@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input className="input" type={showPass ? 'text' : 'password'} placeholder="min 6 chars" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 44 }} />
                                                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1 }}>{showPass ? '🙈' : '👁'}</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Confirm Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input className="input" type={showConfirmPass ? 'text' : 'password'} placeholder="Repeat password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ paddingRight: 44 }} />
                                                <button type="button" onClick={() => setShowConfirmPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1 }}>{showConfirmPass ? '🙈' : '👁'}</button>
                                            </div>
                                        </div>
                                    </div>
                                    <label className="checkbox-container" style={{ marginBottom: 20 }}>
                                        <input type="checkbox" className="custom-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                                        <span className="checkmark"></span>
                                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                            I agree to the <Link href="/privacy" style={{ color: PRIMARY_COLOR, fontWeight: 600, textDecoration: 'none' }}>Terms &amp; Privacy</Link>
                                        </span>
                                    </label>
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', background: PRIMARY_COLOR, boxShadow: `0 8px 24px ${PRIMARY_COLOR}40`, fontSize: 15 }} disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Create My Account'}
                                    </button>
                                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
                                        Already have an account?{' '}
                                        <button type="button" onClick={() => reset('login')} style={{ color: PRIMARY_COLOR, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Sign In</button>
                                    </p>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
