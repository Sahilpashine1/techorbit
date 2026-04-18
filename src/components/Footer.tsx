import Link from 'next/link';
import Logo from './Logo';

const footerLinks = {
    Platform: [
        { href: '/jobs', label: 'Browse Jobs' },
        { href: '/news', label: 'Tech News' },
        { href: '/career-guidance', label: 'AI Career Guidance' },
        { href: '/network', label: 'Smart Networking' },
        { href: '/dashboard', label: 'Dashboard' },
    ],
    Resources: [
        { href: '/resume-builder', label: 'Resume Builder' },
        { href: '/skill-analyzer', label: 'Skill Analyzer' },
        { href: '/salary-explorer', label: 'Salary Explorer' },
        { href: '/learning-paths', label: 'Learning Paths' },
    ],
    Company: [
        { href: '/about', label: 'About Us' },
        { href: '/blog', label: 'Blog' },
        { href: '/careers', label: 'Careers' },
        { href: '/privacy', label: 'Privacy Policy' },
    ],
};

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            marginTop: 'auto',
        }}>
            <div className="container" style={{ padding: '60px 24px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, auto)', gap: 48, marginBottom: 48 }}>
                    {/* Brand */}
                    <div>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
                            <Logo />
                        </Link>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 240 }}>
                            Your AI-powered gateway to the global tech career landscape.
                        </p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                            {['𝕏', 'in', '🐙'].map((icon, i) => (
                                <a key={i} href="#" style={{
                                    width: 36, height: 36,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'all var(--transition)',
                                }}>
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link groups */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                                {group}
                            </h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {links.map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--transition)' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        © 2026 TechOrbit. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
