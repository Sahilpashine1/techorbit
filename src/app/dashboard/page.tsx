'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// ── Market data (kept — not personal fake data) ───────────────────────────────
const skillDemand = [
    { skill: 'AI/ML Engineering', demand: 94, change: '+18%', hot: true },
    { skill: 'Kubernetes / DevOps', demand: 87, change: '+12%', hot: true },
    { skill: 'TypeScript', demand: 82, change: '+9%', hot: false },
    { skill: 'Rust', demand: 76, change: '+23%', hot: true },
    { skill: 'Go', demand: 71, change: '+6%', hot: false },
    { skill: 'React / Next.js', demand: 68, change: '+3%', hot: false },
];

export default function DashboardPage() {
    const { data: session } = useSession();
    const [lcStats, setLcStats] = useState<any>(null);
    const [ghStats, setGhStats] = useState<any>(null);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [userSkills, setUserSkills] = useState<any[]>([]);

    useEffect(() => {
        const savedExp = localStorage.getItem('to_experience');
        if (savedExp) setExperiences(JSON.parse(savedExp));
        const savedSkills = localStorage.getItem('to_skills');
        if (savedSkills) setUserSkills(JSON.parse(savedSkills));
        const lcUser = localStorage.getItem('to_lc');
        const ghUser = localStorage.getItem('to_gh');
        if (lcUser) fetch(`/api/scrape/leetcode?username=${lcUser}`).then(r => r.ok ? r.json() : null).then(d => d && setLcStats(d));
        if (ghUser) fetch(`/api/scrape/github?username=${ghUser}`).then(r => r.ok ? r.json() : null).then(d => d && setGhStats(d));
    }, []);

    const name = session?.user?.name || 'there';

    return (
        <>
            {/* Header */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 40px' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <p className="section-label">Welcome Back</p>
                            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
                                Hey, {name} 👋
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                                Your career hub — connect more accounts to unlock live stats
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Link href="/career-guidance" className="btn btn-ghost">Update Resume</Link>
                            <Link href="/jobs" className="btn btn-primary">Find Jobs →</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

                {/* ── Quick Stats — real data or "—" placeholders ── */}
                <div className="grid-4" style={{ marginBottom: 16 }}>
                    {[
                        { label: 'LeetCode Solved', value: lcStats?.solved ?? '—', icon: '🧩', color: '#FFA116', connected: !!lcStats },
                        { label: 'GitHub Repos', value: ghStats?.repos ?? '—', icon: '🐙', color: '#6c63ff', connected: !!ghStats },
                        { label: 'Profile Views', value: '—', icon: '👁', color: '#38bdf8', connected: false },
                        { label: 'Roles Added', value: experiences.length || '—', icon: '💼', color: '#22c55e', connected: experiences.length > 0 },
                    ].map(s => (
                        <div key={s.label} className="glass-card" style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <span style={{ fontSize: 28 }}>{s.icon}</span>
                                {!s.connected && (
                                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                                        Not connected
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', color: s.connected ? s.color : 'var(--text-muted)', marginBottom: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Stats nudge */}
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 32, textAlign: 'center' }}>
                    Connect your accounts to see live stats —{' '}
                    <Link href="/network" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Connect now →</Link>
                </p>

                {/* Connect accounts nudge (if nothing connected) */}
                {!lcStats && !ghStats && (
                    <div className="card" style={{ padding: 28, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, border: '1px dashed var(--border-medium)' }}>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Connect your developer accounts</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Link LeetCode and GitHub to see your live stats, repos, and coding activity here.
                            </p>
                        </div>
                        <Link href="/network" className="btn btn-primary" style={{ flexShrink: 0, textDecoration: 'none' }}>Connect Accounts →</Link>
                    </div>
                )}

                {/* Main grid — Skills + Market Demand */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
                    {/* Skills Progress */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>🛠 Your Skills</h3>
                            <Link href="/career-guidance" style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Analyze Resume</Link>
                        </div>
                        {userSkills.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div style={{ fontSize: 36, marginBottom: 12 }}>🛠</div>
                                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 14 }}>No skills detected yet</p>
                                <Link href="/career-guidance" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', fontSize: 13 }}>Upload Resume to Auto-Detect →</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {userSkills.slice(0, 6).map((s: any) => (
                                    <div key={s.name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                                            <span style={{ fontSize: 12, color: s.color || 'var(--accent-primary)', fontWeight: 700 }}>{s.level}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${s.level}%`, background: s.color || 'var(--accent-primary)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Skill Demand — market data (kept) */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>🔥 Market Demand</h3>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-card)', padding: '3px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                                Market data · Updated weekly
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {skillDemand.map(s => (
                                <div key={s.skill}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{s.skill}</span>
                                            {s.hot && <span className="badge badge-orange" style={{ fontSize: 9 }}>Hot</span>}
                                        </div>
                                        <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 700 }}>{s.change}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${s.demand}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Second row — Saved Jobs + Job Alerts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
                    {/* Saved Jobs — empty state */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>🔖 Saved Jobs</h3>
                            <Link href="/jobs" style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Browse Jobs</Link>
                        </div>
                        <div style={{ textAlign: 'center', padding: '28px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔖</div>
                            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No saved jobs yet</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Bookmark jobs you like to revisit them here</p>
                            <Link href="/jobs" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', fontSize: 13 }}>Browse Jobs →</Link>
                        </div>
                    </div>

                    {/* Job Alerts — empty state */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>🔔 Job Alerts</h3>
                            <Link href="/settings" style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Settings</Link>
                        </div>
                        <div style={{ textAlign: 'center', padding: '28px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No alerts yet</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>Set up job alerts to get notified when matching roles appear</p>
                            <Link href="/settings" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', fontSize: 13 }}>Set Up Alerts →</Link>
                        </div>
                    </div>
                </div>

                {/* Third row — Salary Growth + Work Experience */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
                    {/* Salary Growth — replace fake chart with actionable message */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>💹 Salary Growth</h3>
                            <Link href="/salary-explorer" style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Market Rates</Link>
                        </div>
                        <div style={{ textAlign: 'center', padding: '28px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px dashed var(--border-medium)' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
                            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Track your salary growth</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                                Update your profile with your current role and experience to track salary growth over time
                            </p>
                            <Link href="/profile" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', fontSize: 13 }}>Update Profile →</Link>
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>💼 Work Experience</h3>
                            <Link href="/profile" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Manage →</Link>
                        </div>
                        {experiences.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 14 }}>No experience added yet</p>
                                <Link href="/profile" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', fontSize: 13 }}>Add Experience →</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {experiences.slice(0, 3).map((exp: any) => (
                                    <div key={exp.id} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: 'white', flexShrink: 0 }}>
                                            {exp.company?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{exp.role}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{exp.company} · {exp.from} — {exp.to}</div>
                                        </div>
                                    </div>
                                ))}
                                {experiences.length > 3 && (
                                    <Link href="/profile" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                                        +{experiences.length - 3} more →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom — Quick Actions */}
                <div className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚡ Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                        {[
                            { href: '/jobs', label: 'Browse Jobs', icon: '💼', color: '#38bdf8' },
                            { href: '/career-guidance', label: 'AI Resume', icon: '🤖', color: '#6c63ff' },
                            { href: '/certifications', label: 'Certifications', icon: '🎓', color: '#FFA116' },
                            { href: '/people', label: 'Network', icon: '👥', color: '#22c55e' },
                            { href: '/news', label: 'Tech News', icon: '📰', color: '#f472b6' },
                            { href: '/profile', label: 'My Profile', icon: '👤', color: '#8b5cf6' },
                        ].map(item => (
                            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'all 0.2s', fontSize: 13, fontWeight: 600 }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = item.color; el.style.color = item.color; el.style.background = `${item.color}10`; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-subtle)'; el.style.color = 'var(--text-secondary)'; el.style.background = 'var(--bg-card)'; }}>
                                <span style={{ fontSize: 20 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
