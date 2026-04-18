'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const STATS = [
    { label: 'Total Users', value: '1,24,892', change: '+2,341 this week', icon: '👥', color: '#6c63ff' },
    { label: 'Active Jobs', value: '8,543', change: '+124 today', icon: '💼', color: '#38bdf8' },
    { label: 'Companies', value: '3,218', change: '+18 this week', icon: '🏢', color: '#34d399' },
    { label: 'Applications', value: '94,201', change: '+1,821 today', icon: '📄', color: '#f472b6' },
];

const INITIAL_USERS = [
    { name: 'Priya Sharma', email: 'priya@gmail.com', role: 'user', joined: '2h ago', status: 'active' },
    { name: 'Razorpay HR', email: 'hr@razorpay.com', role: 'company', joined: '4h ago', status: 'active' },
    { name: 'Rohan Dev', email: 'rohan@gmail.com', role: 'user', joined: '6h ago', status: 'active' },
    { name: 'Ananya Singh', email: 'ananya@outlook.com', role: 'user', joined: '1d ago', status: 'suspended' },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'add'>('overview');
    const [users, setUsers] = useState(INITIAL_USERS);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as 'user' | 'company' | 'admin', status: 'active' });
    const [addSuccess, setAddSuccess] = useState('');
    const [newJob, setNewJob] = useState({ title: '', company: '', location: '', type: 'Full-time', link: '' });
    const [jobSuccess, setJobSuccess] = useState('');
    const [addSection, setAddSection] = useState<'user' | 'job'>('user');

    const toggleStatus = (email: string) => {
        setUsers(prev => prev.map(u => u.email === email ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    };
    const removeUser = (email: string) => setUsers(prev => prev.filter(u => u.email !== email));

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setUsers(prev => [...prev, { ...newUser, joined: 'just now' }]);
        setNewUser({ name: '', email: '', role: 'user', status: 'active' });
        setAddSuccess('User added successfully!');
        setTimeout(() => setAddSuccess(''), 3000);
    };

    const handleAddJob = (e: React.FormEvent) => {
        e.preventDefault();
        setJobSuccess('Job listing submitted for review!');
        setNewJob({ title: '', company: '', location: '', type: 'Full-time', link: '' });
        setTimeout(() => setJobSuccess(''), 3000);
    };

    return (
        <>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d1b2a 100%)', padding: '80px 0 28px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="container">
                    <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)' }}>← Back to Home</Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(244,114,182,0.2)', border: '1px solid rgba(244,114,182,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>⚙️</div>
                        <div>
                            <p style={{ fontSize: 11, color: '#f472b6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Admin Control Panel</p>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                                <Logo />
                                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '-0.02em', paddingBottom: 2 }}>Admin</span>
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <span style={{ padding: '6px 14px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 'var(--radius-full)', fontSize: 12, color: 'var(--accent-green)', fontWeight: 700 }}>● Live</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 32 }}>
                    {[
                        { key: 'overview', label: '📊 Overview' },
                        { key: 'users', label: '👥 Manage Users' },
                        { key: 'add', label: '➕ Add Content' },
                    ].map((t: any) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            style={{
                                padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                color: activeTab === t.key ? '#f472b6' : 'var(--text-secondary)',
                                borderBottom: activeTab === t.key ? '2px solid #f472b6' : '2px solid transparent',
                                transition: 'all 0.2s', marginBottom: -1
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Overview ── */}
                {activeTab === 'overview' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                            {STATS.map(s => (
                                <div key={s.label} className="glass-card" style={{ padding: '20px 22px' }}>
                                    <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-0.04em', marginBottom: 4 }}>{s.value}</div>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                                    <div style={{ fontSize: 11, color: 'var(--accent-green)' }}>{s.change}</div>
                                </div>
                            ))}
                        </div>
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recent Users</h3>
                            {users.slice(0, 4).map(u => (
                                <div key={u.email} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'company' ? 'rgba(56,189,248,0.15)' : 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {u.role === 'company' ? '🏢' : u.role === 'admin' ? '⚙️' : '👤'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                                    </div>
                                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-pink'}`} style={{ fontSize: 10 }}>{u.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Manage Users ── */}
                {activeTab === 'users' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Users ({users.length})</h2>
                            <button className="btn btn-primary btn-sm" onClick={() => { setActiveTab('add'); setAddSection('user'); }}>+ Add User</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {users.map(u => (
                                <div key={u.email} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                        {u.role === 'company' ? '🏢' : u.role === 'admin' ? '⚙️' : '👤'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                            <span style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</span>
                                            <span className={`badge ${u.role === 'company' ? 'badge-blue' : u.role === 'admin' ? 'badge-pink' : 'badge-purple'}`} style={{ fontSize: 9 }}>{u.role}</span>
                                            <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-pink'}`} style={{ fontSize: 9 }}>{u.status}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email} · {u.joined}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: u.status === 'active' ? 'var(--accent-orange)' : 'var(--accent-green)' }}
                                            onClick={() => toggleStatus(u.email)}>
                                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--accent-pink)' }}
                                            onClick={() => removeUser(u.email)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Add Content ── */}
                {activeTab === 'add' && (
                    <div style={{ maxWidth: 620 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Add Content</h2>

                        {/* Section toggle */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: 4 }}>
                            {[{ key: 'user', label: '👤 Add User' }, { key: 'job', label: '💼 Add Job' }].map((s: any) => (
                                <button key={s.key} onClick={() => setAddSection(s.key)}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                        background: addSection === s.key ? 'var(--accent-primary)' : 'transparent',
                                        color: addSection === s.key ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s'
                                    }}>
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Add User */}
                        {addSection === 'user' && (
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Add New User / Admin</h3>
                                {addSuccess && <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(52,211,153,0.1)', border: '1px solid var(--accent-green)', marginBottom: 20, fontSize: 14, color: 'var(--accent-green)', fontWeight: 600 }}>✅ {addSuccess}</div>}
                                <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {[
                                        { label: 'Full Name', field: 'name', placeholder: 'e.g. Ravi Kumar' },
                                        { label: 'Email', field: 'email', placeholder: 'ravi@example.com' },
                                    ].map(f => (
                                        <div key={f.field}>
                                            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>{f.label}</label>
                                            <input className="input" placeholder={f.placeholder} required
                                                value={(newUser as any)[f.field]}
                                                onChange={e => setNewUser(p => ({ ...p, [f.field]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div>
                                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Role</label>
                                        <select className="input" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value as any }))}>
                                            <option value="user">Job Seeker</option>
                                            <option value="company">Company / Recruiter</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Add User →</button>
                                </form>
                            </div>
                        )}

                        {/* Add Job */}
                        {addSection === 'job' && (
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Manually Add Job Listing</h3>
                                {jobSuccess && <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(52,211,153,0.1)', border: '1px solid var(--accent-green)', marginBottom: 20, fontSize: 14, color: 'var(--accent-green)', fontWeight: 600 }}>✅ {jobSuccess}</div>}
                                <form onSubmit={handleAddJob} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {[
                                        { label: 'Job Title', field: 'title', placeholder: 'e.g. Senior React Developer' },
                                        { label: 'Company Name', field: 'company', placeholder: 'e.g. Razorpay' },
                                        { label: 'Location', field: 'location', placeholder: 'e.g. Bengaluru / Remote' },
                                        { label: 'Apply Link (URL)', field: 'link', placeholder: 'https://linkedin.com/jobs/...' },
                                    ].map(f => (
                                        <div key={f.field}>
                                            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>{f.label}</label>
                                            <input className="input" placeholder={f.placeholder}
                                                value={(newJob as any)[f.field]}
                                                onChange={e => setNewJob(p => ({ ...p, [f.field]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div>
                                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Job Type</label>
                                        <select className="input" value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))}>
                                            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Fresher'].map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit Job Listing →</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
