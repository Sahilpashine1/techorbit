import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
            <div className="container" style={{ maxWidth: 780 }}>
                <Link href="/" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>← Back</Link>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Privacy Policy</h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 40 }}>Last updated: March 6, 2026</p>

                {[
                    { title: '1. Information We Collect', content: 'We collect information you provide directly (name, email, resume data), information from OAuth providers (Google, GitHub), usage data (pages visited, features used), and job application data.' },
                    { title: '2. How We Use Your Information', content: 'We use your data to provide personalized job recommendations, AI-powered career guidance, send relevant job alerts and newsletters (only if you opt in), and improve our platform.' },
                    { title: '3. Data Storage & Security', content: 'Your data is stored securely in MongoDB Atlas (hosted in India/Singapore). We use industry-standard encryption for data in transit (TLS) and at rest. Passwords are hashed using bcrypt.' },
                    { title: '4. Third-Party Services', content: 'We use: Google & GitHub (OAuth login), RapidAPI/JSearch (job listings), GNews/NewsData.io (news), OpenAI/Google Gemini (AI responses). We never sell your personal data to third parties.' },
                    { title: '5. Your Rights (Indian IT Act & DPDP 2023)', content: 'You have the right to access your personal data, request correction or deletion, opt out of marketing emails, and data portability. Email privacy@techorbit.in to exercise your rights.' },
                    { title: '6. Cookies', content: 'We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.' },
                    { title: '7. Contact', content: 'For privacy concerns: privacy@techorbit.in | TechOrbit Technologies Pvt. Ltd., Bengaluru, Karnataka, India - 560001' },
                ].map(section => (
                    <div key={section.title} style={{ marginBottom: 36 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>{section.title}</h2>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{section.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
