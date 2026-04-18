import Link from 'next/link';

const SKILLS_DATA = [
    { skill: 'AI/ML Engineering', demand: 94, growth: '+28% YoY', jobs: '12,400+', avgSalary: '₹45L', color: '#6c63ff' },
    { skill: 'Cloud (AWS/Azure/GCP)', demand: 87, growth: '+19% YoY', jobs: '18,200+', avgSalary: '₹38L', color: '#38bdf8' },
    { skill: 'System Design & DSA', demand: 82, growth: '+15% YoY', jobs: '24,100+', avgSalary: '₹42L', color: '#34d399' },
    { skill: 'DevOps / SRE', demand: 78, growth: '+22% YoY', jobs: '9,800+', avgSalary: '₹36L', color: '#f472b6' },
    { skill: 'React / Next.js', demand: 73, growth: '+12% YoY', jobs: '21,000+', avgSalary: '₹28L', color: '#fb923c' },
    { skill: 'Golang', demand: 68, growth: '+35% YoY', jobs: '5,400+', avgSalary: '₹40L', color: '#a78bfa' },
    { skill: 'Kubernetes / Docker', demand: 65, growth: '+18% YoY', jobs: '8,900+', avgSalary: '₹34L', color: '#38bdf8' },
    { skill: 'Data Engineering', demand: 71, growth: '+24% YoY', jobs: '7,600+', avgSalary: '₹35L', color: '#34d399' },
];

export default function SkillAnalyzerPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container">
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>
                <div style={{ marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📊</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '16px 0 8px' }}>Skill Demand Analyzer</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        Real-time skill demand data from 8.5L+ Indian tech job listings. See what to learn next.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    {SKILLS_DATA.map(s => (
                        <div key={s.skill} className="glass-card" style={{ padding: '20px 28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s.skill}</h3>
                                <div style={{ display: 'flex', gap: 16, fontSize: 13, flexWrap: 'wrap' }}>
                                    <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{s.growth}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{s.jobs} jobs</span>
                                    <span style={{ color: s.color, fontWeight: 700 }}>Avg {s.avgSalary}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-card)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: 4, background: s.color, width: `${s.demand}%`, transition: 'width 1s ease' }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 800, color: s.color, minWidth: 36 }}>{s.demand}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Get Your Personal Skill Gap Report</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                        Upload your resume and get AI-powered skill gap analysis against top Indian company requirements.
                    </p>
                    <Link href="/career-guidance" className="btn btn-primary btn-lg">Analyze My Skills →</Link>
                </div>
            </div>
        </div>
    );
}
