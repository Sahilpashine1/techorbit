import Link from 'next/link';
import Logo from '@/components/Logo';

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 800 }}>
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back to Home</Link>

                <div style={{ textAlign: 'center', marginBottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Logo size="xl" style={{ marginBottom: 20 }} />
                    <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', margin: '20px 0 16px' }}>
                        About Us
                    </h1>
                    <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                        India&apos;s most intelligent tech career platform — built for Bharat&apos;s 1 crore+ tech professionals
                        navigating a rapidly evolving job market.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
                    {[
                        { icon: '🎯', title: 'Our Mission', desc: 'Make high-quality career intelligence accessible to every Indian tech professional — from IIT graduates to tier-3 college engineers.' },
                        { icon: '🌍', title: 'Our Vision', desc: 'Become the default career OS for the Indian tech ecosystem, connecting talent with opportunities across India and the globe.' },
                        { icon: '🤖', title: 'AI-First Approach', desc: 'We use cutting-edge AI (Gemini + GPT) to provide personalized career guidance, job matching, and resume analysis at scale.' },
                        { icon: '🇮🇳', title: 'Built for India', desc: 'Every feature is calibrated for the Indian job market — from LPA salary norms to IIT/NIT/BITS career trajectories.' },
                    ].map(f => (
                        <div key={f.title} className="glass-card" style={{ padding: 28 }}>
                            <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: 36, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Platform Stats</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, margin: '24px 0' }}>
                        {[
                            { value: '2L+', label: 'Active Users' },
                            { value: '8.5L+', label: 'Jobs Listed' },
                            { value: '12K+', label: 'Companies' },
                            { value: '91%', label: 'Success Rate' },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 28, fontWeight: 900, background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <Link href="/register" className="btn btn-primary">Join TechOrbit Free →</Link>
                </div>
            </div>
        </div>
    );
}
