import Link from 'next/link';

const POSTS = [
    { title: 'How to Land a Job at Razorpay, CRED, or PhonePe in 2026', category: 'Interview Prep', date: 'Mar 5, 2026', readTime: '8 min', icon: '🎯' },
    { title: 'The Ultimate DSA Roadmap for Indian Product Companies', category: 'DSA', date: 'Mar 3, 2026', readTime: '12 min', icon: '⚡' },
    { title: 'Salary Negotiation in India: Never Share Your CTC', category: 'Career Growth', date: 'Mar 1, 2026', readTime: '6 min', icon: '💰' },
    { title: 'From TCS to Unicorn: A Complete Transition Guide', category: 'Career Switch', date: 'Feb 28, 2026', readTime: '10 min', icon: '🚀' },
    { title: 'Top 10 Remote Jobs in India with ₹30L+ Packages', category: 'Remote Work', date: 'Feb 25, 2026', readTime: '7 min', icon: '🌐' },
    { title: 'Gemini vs ChatGPT for Resume Writing: 2026 Guide', category: 'AI Tools', date: 'Feb 22, 2026', readTime: '5 min', icon: '🤖' },
];

export default function BlogPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container">
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>
                <div style={{ marginBottom: 40 }}>
                    <span style={{ fontSize: 48 }}>📝</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '16px 0 8px' }}>TechOrbit Blog</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Career insights, interview tips, and salary data for the Indian tech market.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                    {POSTS.map(p => (
                        <div key={p.title} className="card" style={{ padding: 24, cursor: 'pointer' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                <span className="badge badge-purple" style={{ fontSize: 10 }}>{p.category}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.readTime} read</span>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, marginBottom: 14 }}>{p.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.date}</span>
                                <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>Read →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
