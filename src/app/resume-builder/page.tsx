import Link from 'next/link';

export default function ResumePage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 760 }}>
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>
                <div style={{ marginBottom: 32 }}>
                    <span style={{ fontSize: 48 }}>📄</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '16px 0 8px' }}>Resume Builder</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        Build an ATS-optimized resume tuned for Indian and global tech companies.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
                    {[
                        { icon: '🎯', title: 'ATS Optimized', desc: 'Pass Naukri, LinkedIn, and Workday ATS filters automatically.' },
                        { icon: '🇮🇳', title: 'India-Ready', desc: 'Formats accepted by TCS iBegin, Infosys, Razorpay, CRED & more.' },
                        { icon: '🤖', title: 'AI Suggestions', desc: 'Get AI-powered bullet point improvements and keyword gaps.' },
                        { icon: '📤', title: 'One-Click Export', desc: 'Export as PDF, Word, or plain text for any portal.' },
                    ].map(f => (
                        <div key={f.title} className="glass-card" style={{ padding: 24 }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Full Resume Builder Coming Soon</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
                        In the meantime, get your resume analyzed and improved by our AI Career Advisor.
                    </p>
                    <Link href="/career-guidance" className="btn btn-primary btn-lg">Try AI Resume Analyzer →</Link>
                </div>
            </div>
        </div>
    );
}
