import Link from 'next/link';

const SALARY_DATA = [
    { role: 'Software Engineer (SDE-1)', fresher: '₹7L-₹18L', mid: '₹18L-₹35L', senior: '₹35L-₹55L', faang: '₹60L-₹1.2Cr' },
    { role: 'Machine Learning Engineer', fresher: '₹10L-₹22L', mid: '₹25L-₹50L', senior: '₹50L-₹90L', faang: '₹80L-₹2Cr' },
    { role: 'DevOps / SRE / Platform', fresher: '₹8L-₹16L', mid: '₹20L-₹40L', senior: '₹40L-₹70L', faang: '₹65L-₹1.4Cr' },
    { role: 'Product Manager', fresher: '₹10L-₹20L', mid: '₹22L-₹45L', senior: '₹45L-₹85L', faang: '₹70L-₹1.5Cr' },
    { role: 'Data Engineer', fresher: '₹7L-₹14L', mid: '₹18L-₹35L', senior: '₹35L-₹60L', faang: '₹55L-₹1.1Cr' },
    { role: 'Frontend Engineer', fresher: '₹6L-₹14L', mid: '₹15L-₹30L', senior: '₹30L-₹50L', faang: '₹50L-₹1Cr' },
    { role: 'Full Stack Engineer', fresher: '₹7L-₹16L', mid: '₹18L-₹35L', senior: '₹35L-₹60L', faang: '₹55L-₹1.1Cr' },
    { role: 'Android / iOS Engineer', fresher: '₹7L-₹15L', mid: '₹18L-₹35L', senior: '₹35L-₹60L', faang: '₹55L-₹1.1Cr' },
];

const COMPANIES = [
    { name: 'CRED', range: '₹30L-₹80L', tier: 'Unicorn' },
    { name: 'Razorpay', range: '₹28L-₹75L', tier: 'Unicorn' },
    { name: 'PhonePe', range: '₹25L-₹70L', tier: 'Unicorn' },
    { name: 'Google India', range: '₹60L-₹2Cr+', tier: 'FAANG' },
    { name: 'Microsoft India', range: '₹40L-₹1.5Cr', tier: 'FAANG' },
    { name: 'Flipkart', range: '₹25L-₹70L', tier: 'Unicorn' },
    { name: 'Zomato/Blinkit', range: '₹22L-₹60L', tier: 'Unicorn' },
    { name: 'TCS', range: '₹3.5L-₹18L', tier: 'IT Services' },
];

export default function SalaryExplorerPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container">
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>
                <div style={{ marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>💰</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '16px 0 8px' }}>Salary Explorer</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        Real salary ranges for Indian tech roles in 2026 — across companies, experience levels, and cities.
                    </p>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: 48 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-secondary)' }}>
                                {['Role', 'Fresher (0-2yr)', 'Mid (3-6yr)', 'Senior (6yr+)', 'FAANG / Unicorn'].map(h => (
                                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SALARY_DATA.map((r, i) => (
                                <tr key={r.role} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>{r.role}</td>
                                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{r.fresher}</td>
                                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{r.mid}</td>
                                    <td style={{ padding: '14px 20px', color: 'var(--accent-green)', fontWeight: 600 }}>{r.senior}</td>
                                    <td style={{ padding: '14px 20px', color: 'var(--accent-primary)', fontWeight: 700 }}>{r.faang}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>By Company</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
                    {COMPANIES.map(c => (
                        <div key={c.name} className="glass-card" style={{ padding: 20 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{c.name}</h3>
                            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-primary)', marginBottom: 6 }}>{c.range}</div>
                            <span className={`badge ${c.tier === 'FAANG' ? 'badge-purple' : c.tier === 'Unicorn' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: 10 }}>{c.tier}</span>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
                    Sources: Glassdoor India, AmbitionBox, Levels.fyi India, LinkedIn Salary Insights · Data as of 2026
                </p>
            </div>
        </div>
    );
}
