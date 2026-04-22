'use client';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ThemeContext } from './ThemeProvider';
import Logo from './Logo';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/resume-analyzer', label: 'Resume' },
    { href: '/news', label: 'News' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/network', label: 'Network' },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [localAvatar, setLocalAvatar] = useState<string | null>(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMobileOpen(false);
        setUserMenuOpen(false);
        
        // Sync local avatar proactively on every navigation
        if (typeof window !== 'undefined') {
            const avatar = localStorage.getItem('to_avatar');
            if (avatar) setLocalAvatar(avatar);
        }
    }, [pathname]);

    // Listen for real-time avatar updates from the profile page
    useEffect(() => {
        const handleAvatarUpdate = () => {
            const avatar = localStorage.getItem('to_avatar');
            if (avatar) setLocalAvatar(avatar);
        };
        window.addEventListener('avatar-updated', handleAvatarUpdate);
        window.addEventListener('storage', handleAvatarUpdate);
        return () => {
            window.removeEventListener('avatar-updated', handleAvatarUpdate);
            window.removeEventListener('storage', handleAvatarUpdate);
        };
    }, []);

    const user = session?.user;

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                height: 64,
                background: scrolled ? 'var(--bg-glass)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
                transition: 'all var(--transition)',
            }}>
                <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                        <Logo />
                    </Link>

                    {/* Desktop nav links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} style={{
                                padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
                                color: pathname === link.href ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                background: pathname === link.href ? 'rgba(108,99,255,0.1)' : 'transparent',
                                transition: 'all var(--transition)',
                            }}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        {/* Theme toggle */}
                        <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all var(--transition)' }}
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {/* Auth state */}
                        {status === 'loading' && (
                            <div style={{ width: 80, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', animation: 'skeleton-loading 1.5s infinite' }} />
                        )}

                        {status === 'unauthenticated' && (
                            <>
                                <Link href="/login" className="btn btn-ghost btn-sm" style={{ fontSize: 13 }}>Login</Link>
                                <Link href="/register" className="btn btn-primary btn-sm" style={{ fontSize: 13 }}>Get Started</Link>
                            </>
                        )}

                        {status === 'authenticated' && user && (
                            <>
                                {/* User avatar dropdown */}
                                <div style={{ position: 'relative' }}>
                                    <button onClick={() => setUserMenuOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 12px 5px 5px', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all var(--transition)' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
                                            {localAvatar || user.image ? <img src={localAvatar || user.image || ''} alt={user.name || 'U'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▼</span>
                                    </button>

                                    {userMenuOpen && (
                                        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 220, background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-elevated)', overflow: 'hidden', zIndex: 100 }}>
                                            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{user.name}</p>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</p>
                                            </div>
                                            {[
                                                { href: '/profile', label: 'My Profile' },
                                                { href: '/messages', label: 'Messages' },
                                                { href: '/settings', label: 'Settings' }
                                            ].map(item => (
                                                <Link key={item.href} href={item.href} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'background var(--transition)' }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                                <button onClick={() => signOut({ callbackUrl: '/' })} style={{ width: '100%', padding: '10px 16px', fontSize: 14, color: 'var(--accent-pink)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(v => !v)} style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}
                            id="mobile-menu-btn">
                            {mobileOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-medium)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 500, textDecoration: 'none', color: pathname === link.href ? 'var(--accent-primary)' : 'var(--text-primary)', background: pathname === link.href ? 'rgba(108,99,255,0.1)' : 'transparent' }}>
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10, marginTop: 4 }}>
                        {status === 'unauthenticated' && (<>
                            <Link href="/login" className="btn btn-ghost" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
                            <Link href="/register" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Register</Link>
                        </>)}
                        {status === 'authenticated' && (
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-ghost" style={{ width: '100%' }}>Sign out</button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
          nav > div > div:nth-child(2) { display: none !important; }
        }
      `}</style>
        </>
    );
}
