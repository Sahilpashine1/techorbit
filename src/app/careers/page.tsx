import Link from 'next/link';

const OPENINGS = [
    { title: 'Senior Full Stack Engineer', team: 'Platform Engineering', location: 'Bengaluru / Remote', type: 'Full-time', skills: ['React', 'Node.js', 'PostgreSQL'] },
    { title: 'ML Engineer - Recommendations', team: 'AI/ML', location: 'Bengaluru / Remote', type: 'Full-time', skills: ['Python', 'PyTorch', 'Vector DBs'] },
    { title: 'Product Manager - Career Tools', team: 'Product', location: 'Bengaluru', type: 'Full-time', skills: ['Product Strategy', 'Analytics', 'SQL'] },
    { title: 'Frontend Engineer', team: 'Growth', location: 'Remote (India)', type: 'Full-time', skills: ['Next.js', 'TypeScript', 'CSS'] },
    { title: 'Content & SEO Strategist', team: 'Marketing', location: 'Remote (India)', type: 'Part-time', skills: ['SEO', 'Content Writing', 'Tech Knowledge'] },
];

export default function CareersPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 800 }}>
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>

                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <span style={{ fontSize: 56 }}>🚀</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '16px 0 12px' }}>Join TechOrbit</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
                        Help us build the career OS for India&apos;s 1 crore+ tech professionals. Remote-first, high-ownership, competitive pay.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
                    {[
                        { icon: '🌐', label: 'Remote-First' },
                        { icon: '📈', label: 'Fast Growth' },
                        { icon: '⚡', label: 'Modern Stack' },
                    ].map(b => (
                        <div key={b.label} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
                            <div style={{ fontWeight: 700 }}>{b.label}</div>
                        </div>
                    ))}
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Open Positions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {OPENINGS.map(job => (
                        <div key={job.title} className="card" style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                                        {job.team} · {job.location} · {job.type}
                                    </p>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {job.skills.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
                                    </div>
                                </div>
                                <a href={`mailto:careers@techorbit.in?subject=Application: ${job.title}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                                    Apply →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 32 }}>
                    Don&apos;t see your role? Email us at <a href="mailto:careers@techorbit.in" style={{ color: 'var(--accent-primary)' }}>careers@techorbit.in</a>
                </p>
            </div>
        </div>
    );
}
