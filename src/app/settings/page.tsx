'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'danger'>('account');
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: '',
        bio: '',
        location: 'Bengaluru, Karnataka',
        website: '',
        linkedin: '',
        github: '',
        twitter: '',
    });
    const [notifs, setNotifs] = useState({
        jobAlerts: true,
        newsDigest: true,
        mentorRequests: true,
        weeklyReport: false,
        emailMarketing: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    if (status === 'loading') return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border-medium)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    );

    if (!session) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 48 }}>🔒</div>
            <h2>Sign in to access settings</h2>
            <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
    );

    const user = session.user;

    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 820 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
                    <Link href="/profile" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Profile</Link>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>Settings</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Manage your account preferences</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
                    {/* Sidebar */}
                    <div className="glass-card" style={{ padding: 16, height: 'fit-content' }}>
                        {/* User info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 16px', marginBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
                                {user?.image ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                            </div>
                        </div>
                        {[
                            { key: 'account', icon: '👤', label: 'Account' },
                            { key: 'notifications', icon: '🔔', label: 'Notifications' },
                            { key: 'privacy', icon: '🔒', label: 'Privacy' },
                            { key: 'danger', icon: '⚠️', label: 'Danger Zone' },
                        ].map((t: any) => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)}
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, textAlign: 'left',
                                    background: activeTab === t.key ? 'rgba(108,99,255,0.1)' : 'transparent',
                                    color: activeTab === t.key ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                }}>
                                <span>{t.icon}</span>{t.label}
                            </button>
                        ))}
                        <div style={{ paddingTop: 12, marginTop: 4, borderTop: '1px solid var(--border-subtle)' }}>
                            <button onClick={() => signOut({ callbackUrl: '/' })}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, textAlign: 'left', background: 'transparent', color: 'var(--accent-pink)' }}>
                                🚪 Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        {saved && (
                            <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(52,211,153,0.1)', border: '1px solid var(--accent-green)', marginBottom: 20, fontSize: 14, color: 'var(--accent-green)', fontWeight: 600 }}>
                                ✅ Settings saved successfully!
                            </div>
                        )}

                        {/* Account */}
                        {activeTab === 'account' && (
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Account Details</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {[
                                        { label: 'Display Name', field: 'name', placeholder: user?.name || 'Your name', type: 'text' },
                                        { label: 'Bio', field: 'bio', placeholder: 'e.g. Senior SDE @ Razorpay · IIT Bombay · ex-Flipkart', type: 'text' },
                                        { label: 'Location', field: 'location', placeholder: 'City, State', type: 'text' },
                                        { label: 'Website', field: 'website', placeholder: 'https://yoursite.com', type: 'url' },
                                        { label: 'LinkedIn URL', field: 'linkedin', placeholder: 'https://linkedin.com/in/yourprofile', type: 'url' },
                                        { label: 'GitHub Username', field: 'github', placeholder: 'your-github-username', type: 'text' },
                                        { label: 'X / Twitter', field: 'twitter', placeholder: '@yourhandle', type: 'text' },
                                    ].map(f => (
                                        <div key={f.field}>
                                            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>{f.label}</label>
                                            <input className="input" type={f.type} placeholder={f.placeholder}
                                                value={(form as any)[f.field]}
                                                onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email: {user?.email} (cannot be changed)</p>
                                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeTab === 'notifications' && (
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Notification Preferences</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {[
                                        { key: 'jobAlerts', label: 'Job Alerts', desc: 'New jobs matching your profile and saved searches' },
                                        { key: 'newsDigest', label: 'Tech News Digest', desc: 'Daily curated Indian tech news roundup' },
                                        { key: 'mentorRequests', label: 'Mentor Requests', desc: 'When someone requests you as a mentor' },
                                        { key: 'weeklyReport', label: 'Weekly Career Report', desc: 'Your profile views, job match score, skill trends' },
                                        { key: 'emailMarketing', label: 'Product Updates', desc: 'New features and TechOrbit announcements' },
                                    ].map((n, i) => (
                                        <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{n.label}</p>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.desc}</p>
                                            </div>
                                            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
                                                <input type="checkbox" checked={(notifs as any)[n.key]}
                                                    onChange={e => setNotifs(p => ({ ...p, [n.key]: e.target.checked }))}
                                                    style={{ opacity: 0, width: 0, height: 0 }} />
                                                <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: (notifs as any)[n.key] ? 'var(--accent-primary)' : 'var(--border-medium)', borderRadius: 12, transition: '0.3s' }}>
                                                    <span style={{ position: 'absolute', content: '', height: 18, width: 18, left: (notifs as any)[n.key] ? 23 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={handleSave}>Save Preferences</button>
                            </div>
                        )}

                        {/* Privacy */}
                        {activeTab === 'privacy' && (
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Privacy Settings</h2>
                                {[
                                    { label: 'Profile Visibility', desc: 'Who can view your profile', options: ['Public', 'Connections Only', 'Private'], default: 'Public' },
                                    { label: 'Email Visibility', desc: 'Who can see your email address', options: ['Hidden', 'Connections Only', 'Public'], default: 'Hidden' },
                                    { label: 'Resume Visibility', desc: 'Who can download your resume', options: ['All Companies', 'Invited Only', 'Hidden'], default: 'All Companies' },
                                ].map(p => (
                                    <div key={p.label} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
                                        <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 4 }}>{p.label}</label>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{p.desc}</p>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {p.options.map(opt => (
                                                <button key={opt} className={opt === p.default ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>{opt}</button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button className="btn btn-primary" onClick={handleSave}>Save Privacy Settings</button>
                            </div>
                        )}

                        {/* Danger Zone */}
                        {activeTab === 'danger' && (
                            <div className="glass-card" style={{ padding: 28, border: '1px solid rgba(244,114,182,0.3)' }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--accent-pink)' }}>⚠️ Danger Zone</h2>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>These actions are irreversible. Please be certain.</p>
                                {[
                                    { title: 'Export My Data', desc: 'Download all your data stored on TechOrbit (DPDP Act compliance).', btn: 'Export Data', color: 'var(--accent-primary)', safe: true },
                                    { title: 'Deactivate Account', desc: 'Temporarily hide your profile. You can reactivate anytime.', btn: 'Deactivate', color: 'var(--accent-orange)', safe: false },
                                    { title: 'Delete Account', desc: 'Permanently delete your account and all associated data. This cannot be undone.', btn: 'Delete Account', color: 'var(--accent-pink)', safe: false },
                                ].map(a => (
                                    <div key={a.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 12 }}>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 700 }}>{a.title}</p>
                                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400 }}>{a.desc}</p>
                                        </div>
                                        <button className="btn btn-ghost btn-sm" style={{ color: a.color, borderColor: a.color }}>{a.btn}</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
