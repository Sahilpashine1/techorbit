'use client';
import { useState } from 'react';
import Link from 'next/link';

const postedJobs = [
    { id: 1, title: 'Senior React Developer', status: 'Active', applicants: 47, views: 312, posted: '3d ago', daysLeft: 27 },
    { id: 2, title: 'Backend Engineer (Node.js)', status: 'Active', applicants: 89, views: 654, posted: '1w ago', daysLeft: 23 },
    { id: 3, title: 'DevOps Engineer', status: 'Paused', applicants: 23, views: 198, posted: '2w ago', daysLeft: 0 },
    { id: 4, title: 'Product Manager - Platform', status: 'Closed', applicants: 134, views: 1024, posted: '1mo ago', daysLeft: 0 },
];

const applicants = [
    { name: 'Priya Sharma', role: 'Senior React Developer', score: 92, status: 'Interview Scheduled', date: 'Mar 8, 2026', avatar: '👩‍💻' },
    { name: 'Rahul Gupta', role: 'Backend Engineer', score: 87, status: 'Resume Screened', date: 'Mar 7, 2026', avatar: '👨‍💼' },
    { name: 'Ananya Iyer', role: 'Senior React Developer', score: 95, status: 'Offer Extended', date: 'Mar 6, 2026', avatar: '👩‍🎨' },
    { name: 'Vikram Mehta', role: 'DevOps Engineer', score: 78, status: 'Applied', date: 'Mar 6, 2026', avatar: '👨‍🔧' },
    { name: 'Sneha Patel', role: 'Backend Engineer', score: 83, status: 'Technical Round', date: 'Mar 5, 2026', avatar: '👩‍🔬' },
];

const statusColor: Record<string, string> = {
    'Applied': 'badge-blue',
    'Resume Screened': 'badge-purple',
    'Technical Round': 'badge-orange',
    'Interview Scheduled': 'badge-orange',
    'Offer Extended': 'badge-green',
    'Rejected': 'badge-pink',
};

const stats = [
    { label: 'Active Jobs', value: '2', icon: '💼', color: '#6c63ff' },
    { label: 'Total Applicants', value: '293', icon: '👥', color: '#38bdf8' },
    { label: 'Interviews This Week', value: '8', icon: '📅', color: '#34d399' },
    { label: 'Offers Sent', value: '3', icon: '🎉', color: '#f472b6' },
];

export default function CompanyDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants' | 'post'>('overview');
    const [jobForm, setJobForm] = useState({ title: '', description: '', location: '', salary: '', type: 'Full-time', tags: '', remote: false });
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        await new Promise(r => setTimeout(r, 1500));
        setPosting(false);
        setPosted(true);
        setTimeout(() => { setPosted(false); setActiveTab('jobs'); }, 2000);
    };

    return (
        <>
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 32px' }}>
                <div className="container">
                    <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back to Home</Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 28 }}>🏢</span>
                                <p className="section-label" style={{ margin: 0 }}>Company Dashboard</p>
                            </div>
                            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em' }}>Recruiter Portal</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Manage your job postings and applicants</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setActiveTab('post')}>+ Post a Job</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 36 }}>
                    {[
                        { key: 'overview', label: '📊 Overview' },
                        { key: 'jobs', label: '💼 My Jobs' },
                        { key: 'applicants', label: '👥 Applicants' },
                        { key: 'post', label: '+ Post Job' },
                    ].map((t: any) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            style={{ padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: activeTab === t.key ? 'var(--accent-secondary)' : 'var(--text-secondary)', borderBottom: activeTab === t.key ? '2px solid var(--accent-primary)' : '2px solid transparent', transition: 'all 0.2s', marginBottom: -1 }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid-4" style={{ marginBottom: 32 }}>
                            {stats.map(s => (
                                <div key={s.label} className="glass-card" style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <span style={{ fontSize: 28 }}>{s.icon}</span>
                                    </div>
                                    <div style={{ fontSize: 36, fontWeight: 900, color: s.color, letterSpacing: '-0.04em' }}>{s.value}</div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div className="glass-card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Active Job Performance</h3>
                                {postedJobs.filter(j => j.status === 'Active').map(job => (
                                    <div key={job.id} style={{ marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{job.title}</span>
                                            <span style={{ fontSize: 13, color: 'var(--accent-green)' }}>{job.applicants} applied</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(job.applicants, 100)}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recent Applicants</h3>
                                {applicants.slice(0, 4).map(a => (
                                    <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                        <span style={{ fontSize: 24 }}>{a.avatar}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.role}</div>
                                        </div>
                                        <span className={`badge ${statusColor[a.status]} `} style={{ fontSize: 9 }}>{a.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* My Jobs */}
                {activeTab === 'jobs' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Posted Jobs ({postedJobs.length})</h2>
                            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('post')}>+ Post New Job</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {postedJobs.map(job => (
                                <div key={job.id} className="card" style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                <h3 style={{ fontSize: 15, fontWeight: 700 }}>{job.title}</h3>
                                                <span className={`badge ${job.status === 'Active' ? 'badge-green' : job.status === 'Paused' ? 'badge-orange' : 'badge-blue'}`} style={{ fontSize: 10 }}>{job.status}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-muted)' }}>
                                                <span>Posted {job.posted}</span>
                                                <span>{job.views} views</span>
                                                <span>{job.applicants} applicants</span>
                                                {job.daysLeft > 0 && <span>{job.daysLeft} days left</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-ghost btn-sm">Edit</button>
                                            <button className="btn btn-primary btn-sm">View Applicants</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Applicants */}
                {activeTab === 'applicants' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700 }}>All Applicants ({applicants.length})</h2>
                            <input className="input" placeholder="Search applicants..." style={{ maxWidth: 240 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {applicants.map(a => (
                                <div key={a.name} className="card" style={{ padding: '18px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <span style={{ fontSize: 36 }}>{a.avatar}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <span style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</span>
                                                <span className={`badge ${statusColor[a.status]}`} style={{ fontSize: 10 }}>{a.status}</span>
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Applied for {a.role} on {a.date}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 22, fontWeight: 900, color: a.score >= 90 ? 'var(--accent-green)' : 'var(--accent-primary)' }}>{a.score}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI Score</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-ghost btn-sm">View Resume</button>
                                            <button className="btn btn-primary btn-sm">Schedule Interview</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Post Job */}
                {activeTab === 'post' && (
                    <div style={{ maxWidth: 680, margin: '0 auto' }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Post a New Job</h2>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>Your job will be listed on TechOrbit and shown to matching candidates.</p>
                        {posted ? (
                            <div style={{ padding: 40, textAlign: 'center', background: 'rgba(52,211,153,0.08)', border: '1px solid var(--accent-green)', borderRadius: 'var(--radius-xl)' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>Job Posted Successfully!</h3>
                                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Redirecting to your jobs...</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePost} className="glass-card" style={{ padding: 32 }}>
                                {[
                                    { label: 'Job Title *', field: 'title', placeholder: 'e.g. Senior Backend Engineer', type: 'text' },
                                    { label: 'Location *', field: 'location', placeholder: 'e.g. Bengaluru, Karnataka', type: 'text' },
                                    { label: 'Salary Range', field: 'salary', placeholder: 'e.g. Rs 30L - Rs 50L', type: 'text' },
                                    { label: 'Tech Stack / Skills (comma-separated)', field: 'tags', placeholder: 'e.g. Node.js, AWS, MongoDB, Docker', type: 'text' },
                                ].map(f => (
                                    <div key={f.field} style={{ marginBottom: 20 }}>
                                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>{f.label}</label>
                                        <input className="input" type={f.type} placeholder={f.placeholder} value={(jobForm as any)[f.field]}
                                            onChange={e => setJobForm(p => ({ ...p, [f.field]: e.target.value }))} required={f.label.includes('*')} />
                                    </div>
                                ))}
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Job Type</label>
                                    <select className="input" value={jobForm.type} onChange={e => setJobForm(p => ({ ...p, type: e.target.value }))}>
                                        {['Full-time', 'Part-time', 'Contract', 'Internship', 'Fresher'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label className="checkbox-container">
                                        <input type="checkbox" className="custom-checkbox" checked={jobForm.remote} onChange={e => setJobForm(p => ({ ...p, remote: e.target.checked }))} />
                                        <span className="checkmark"></span>
                                        <span style={{ fontSize: 14 }}>Remote / Work From Home</span>
                                    </label>
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Job Description *</label>
                                    <textarea className="input" placeholder="Describe the role, responsibilities, and requirements..." rows={5} style={{ resize: 'vertical' }}
                                        value={jobForm.description} onChange={e => setJobForm(p => ({ ...p, description: e.target.value }))} required />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={posting}>
                                    {posting ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                            Publishing Job...
                                        </span>
                                    ) : 'Publish Job Listing'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
