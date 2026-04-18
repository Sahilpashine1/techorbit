import Link from 'next/link';

const PATHS = [
    {
        title: 'AI/ML Engineer', icon: '🤖', duration: '9-12 months', salary: '₹35L-₹90L', color: '#6c63ff',
        steps: ['Python & Math Foundations (4 wks)', 'NumPy, Pandas, Scikit-learn (4 wks)', 'Deep Learning with PyTorch (8 wks)', 'NLP & Transformers (6 wks)', 'MLOps & Production ML (4 wks)', 'Build 2 end-to-end projects'],
    },
    {
        title: 'Full Stack Engineer', icon: '💻', duration: '6-9 months', salary: '₹18L-₹55L', color: '#38bdf8',
        steps: ['HTML/CSS/JS Mastery (3 wks)', 'React + TypeScript (6 wks)', 'Node.js + Express APIs (4 wks)', 'Databases: PostgreSQL + MongoDB (4 wks)', 'System Design Basics (3 wks)', 'Deploy on AWS/Vercel'],
    },
    {
        title: 'DevOps / SRE', icon: '⚡', duration: '8-10 months', salary: '₹25L-₹70L', color: '#34d399',
        steps: ['Linux & Shell Scripting (3 wks)', 'Docker & Containers (3 wks)', 'Kubernetes (6 wks)', 'CI/CD: GitHub Actions (3 wks)', 'Terraform & IaC (4 wks)', 'Cloud: AWS / GCP (6 wks)'],
    },
    {
        title: 'FAANG Interview Track', icon: '🎯', duration: '4-6 months', salary: '₹60L-₹2Cr', color: '#f472b6',
        steps: ['Data Structures & Algorithms (8 wks)', 'LeetCode 150 problems (daily)', 'System Design: Grokking (6 wks)', 'Behavioral prep + STAR method', 'Mock interviews on Pramp', 'Apply to Google, Amazon, Meta India'],
    },
];

export default function LearningPathsPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container">
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>
                <div style={{ marginBottom: 48 }}>
                    <span style={{ fontSize: 48 }}>🗺</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: '16px 0 8px' }}>Learning Paths</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        Step-by-step career roadmaps for 2026 — built for Indian developers targeting top companies.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                    {PATHS.map(p => (
                        <div key={p.title} className="glass-card" style={{ padding: 28, borderTop: `3px solid ${p.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                <span style={{ fontSize: 36 }}>{p.icon}</span>
                                <div>
                                    <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{p.title}</h2>
                                    <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>⏱ {p.duration}</span>
                                        <span style={{ color: p.color, fontWeight: 700 }}>{p.salary}</span>
                                    </div>
                                </div>
                            </div>
                            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {p.steps.map((step, i) => (
                                    <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Step {i + 1}:</span> {step}
                                    </li>
                                ))}
                            </ol>
                            <Link href="/career-guidance" className="btn btn-primary btn-sm" style={{ marginTop: 20, display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                Get AI Personalized Plan →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
