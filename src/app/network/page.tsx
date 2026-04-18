'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

// Real SVG logos as inline components
const LOGOS: Record<string, React.ReactNode> = {
    linkedin: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0077b5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    github: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    ),
    twitter: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    leetcode: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffa116">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H18.9a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
        </svg>
    ),
    kaggle: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#20beff">
            <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336" />
        </svg>
    ),
    stackoverflow: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#f48024">
            <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z" />
        </svg>
    ),
    instagram: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#ig)">
            <defs>
                <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
            </defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
    naukri: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#4a90d9">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
    ),
    devto: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#3d3d3d">
            <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.28zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.6-2.57.53-.01c.3 0 .53.05.53.11 0 .07-.specific in.08.33l-.02.3-.3 1.2-.1.46-.59 2.35c-.21.83-.34 1.46-.39 1.54z" />
        </svg>
    ),
    hackerrank: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#00ea64">
            <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.886-10.392-6c-.645-1.115-.645-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.117-.258-.26-.258-.142 0-.258.116-.258.258v9.886c0 .143.116.258.259.258.142 0 .259-.115.259-.258v-4.144h4.074v4.144c0 .143.117.258.258.258.143 0 .259-.115.259-.258V7.057c0-.143-.116-.258-.259-.258z" />
        </svg>
    ),
};

const PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', desc: 'Professional network, jobs & endorsements', loginUrl: 'https://www.linkedin.com/login', category: 'Professional', messageBase: 'https://www.linkedin.com/messaging/' },
    { id: 'github', name: 'GitHub', color: '#333', desc: 'Code repos, open source & portfolio', loginUrl: 'https://github.com/login', category: 'Developer', messageBase: null },
    { id: 'twitter', name: 'X (Twitter)', color: '#000', desc: 'Tech trends, threads & community', loginUrl: 'https://x.com/i/flow/login', category: 'Social', messageBase: 'https://x.com/messages' },
    { id: 'leetcode', name: 'LeetCode', color: '#ffa116', desc: 'DSA grind, contests & certificates', loginUrl: 'https://leetcode.com/accounts/login/', category: 'Developer', messageBase: null },
    { id: 'hackerrank', name: 'HackerRank', color: '#00ea64', desc: 'Coding challenges & skill badges', loginUrl: 'https://www.hackerrank.com/auth/login', category: 'Developer', messageBase: null },
    { id: 'kaggle', name: 'Kaggle', color: '#20beff', desc: 'ML competitions & public datasets', loginUrl: 'https://www.kaggle.com/account/login', category: 'Developer', messageBase: null },
    { id: 'stackoverflow', name: 'Stack Overflow', color: '#f48024', desc: 'Reputation, Q&A & developer community', loginUrl: 'https://stackoverflow.com/users/login', category: 'Developer', messageBase: null },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', desc: 'Personal brand & behind-the-scenes', loginUrl: 'https://www.instagram.com/accounts/login/', category: 'Social', messageBase: 'https://www.instagram.com/direct/inbox/' },
    { id: 'naukri', name: 'Naukri.com', color: '#4a90d9', desc: "India's #1 job portal — profile & resume", loginUrl: 'https://www.naukri.com/nlogin/login', category: 'Jobs', messageBase: null },
    { id: 'devto', name: 'Dev.to', color: '#3d3d3d', desc: 'Write tech articles & build community', loginUrl: 'https://dev.to/enter', category: 'Developer', messageBase: null },
];

// Mock connections for search demo
const MOCK_CONNECTIONS = [
    { name: 'Priya Sharma', company: 'Google', role: 'Software Engineer III', avatar: '👩‍💻', linkedin: 'https://linkedin.com/in/priya-sharma', connected: true },
    { name: 'Rahul Mehta', company: 'Microsoft', role: 'Principal Engineer', avatar: '👨‍💻', linkedin: 'https://linkedin.com/in/rahul-mehta', connected: true },
    { name: 'Ananya Iyer', company: 'Amazon', role: 'SDE-2', avatar: '👩‍🔬', linkedin: 'https://linkedin.com/in/ananya-iyer', connected: true },
    { name: 'Vikram Singh', company: 'Flipkart', role: 'Staff Engineer', avatar: '👨‍🔧', linkedin: 'https://linkedin.com/in/vikram-singh', connected: true },
    { name: 'Sneha Patel', company: 'Razorpay', role: 'Backend Engineer', avatar: '👩‍💼', linkedin: 'https://linkedin.com/in/sneha-patel', connected: true },
    { name: 'Arun Kumar', company: 'Google', role: 'DevOps Lead', avatar: '👨‍🚀', linkedin: 'https://linkedin.com/in/arun-kumar', connected: true },
    { name: 'Pooja Verma', company: 'CRED', role: 'ML Engineer', avatar: '👩‍🎨', linkedin: 'https://linkedin.com/in/pooja-verma', connected: true },
    { name: 'Suresh Nair', company: 'PhonePe', role: 'SDE-3', avatar: '👨‍🔬', linkedin: 'https://linkedin.com/in/suresh-nair', connected: true },
    { name: 'Kavya Reddy', company: 'Microsoft', role: 'Product Manager', avatar: '👩‍💼', linkedin: 'https://linkedin.com/in/kavya-reddy', connected: true },
    { name: 'Arjun Sharma', company: 'Amazon', role: 'SDE-1 (Fresh)', avatar: '👨‍🎓', linkedin: null, connected: false },
];

const MENTORS = [
    { name: 'Priya Sharma', role: 'Sr SDE @ Google', exp: '7 yrs', skills: ['System Design', 'Distributed Systems'], avatar: '👩‍💻', available: true, linkedin: 'https://linkedin.com', twitter: 'https://x.com' },
    { name: 'Rahul Mehta', role: 'ML Engineer @ Flipkart', exp: '5 yrs', skills: ['PyTorch', 'MLOps', 'Python'], avatar: '👨‍🔬', available: true, linkedin: 'https://linkedin.com', twitter: null },
    { name: 'Ananya Iyer', role: 'PM @ CRED', exp: '4 yrs', skills: ['Product Strategy', 'Analytics'], avatar: '👩‍💼', available: false, linkedin: 'https://linkedin.com', twitter: 'https://x.com' },
    { name: 'Vikram Singh', role: 'DevOps @ Razorpay', exp: '6 yrs', skills: ['Kubernetes', 'Terraform', 'AWS'], avatar: '👨‍🔧', available: true, linkedin: 'https://linkedin.com', twitter: null },
];

export default function NetworkPage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<'connect' | 'search' | 'mentors' | 'events'>('connect');
    const [connected, setConnected] = useState<Set<string>>(new Set());
    const [searchQ, setSearchQ] = useState('');
    const [connectionSearch, setConnectionSearch] = useState('');
    const [events, setEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    const handleTabChange = (tab: any) => {
        setActiveTab(tab);
        if (tab === 'events' && events.length === 0) {
            setLoadingEvents(true);
            fetch('/api/apify/events')
                .then(r => r.json())
                .then(d => { if(d.success) setEvents(d.events); })
                .catch(console.error)
                .finally(() => setLoadingEvents(false));
        }
    };

    const handleConnect = (platformId: string, loginUrl: string) => {
        window.open(loginUrl, '_blank', 'noopener,noreferrer');
        setConnected(prev => new Set([...prev, platformId]));
    };

    const handleDisconnect = (platformId: string) => {
        setConnected(prev => { const s = new Set(prev); s.delete(platformId); return s; });
    };

    // Filter connections by search query
    const filteredConnections = connectionSearch.trim()
        ? MOCK_CONNECTIONS.filter(c =>
            c.company.toLowerCase().includes(connectionSearch.toLowerCase()) ||
            c.name.toLowerCase().includes(connectionSearch.toLowerCase()) ||
            c.role.toLowerCase().includes(connectionSearch.toLowerCase())
        )
        : MOCK_CONNECTIONS;

    // 🔒 Login Gate
    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--border-medium)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    if (!session) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
                <div className="orb orb-purple" style={{ position: 'fixed', top: -100, left: -100 }} />
                <div className="orb orb-blue" style={{ position: 'fixed', bottom: -100, right: -100 }} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 520 }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 12 }}>Sign in to Access Networking</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
                        Connect your LinkedIn, GitHub, X, and 7+ platforms. Search connections by company. Find mentors at top Indian firms. <strong>Free account required.</strong>
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                        {['💼 LinkedIn Connect', '🐙 GitHub Sync', '🔍 Search Connections', '🤝 Find Mentors'].map(f => (
                            <div key={f} className="glass-card" style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, textAlign: 'left' }}>{f}</div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <Link href="/login" className="btn btn-primary btn-lg">Sign In Free</Link>
                        <Link href="/register" className="btn btn-ghost btn-lg">Create Account</Link>
                    </div>
                </div>
            </div>
        );
    }

    const connectedCount = connected.size;

    return (
        <>
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 32px' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <span style={{ fontSize: 26 }}>🌐</span>
                                <p className="section-label" style={{ margin: 0 }}>Professional Networking</p>
                            </div>
                            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>
                                Welcome, {session.user?.name?.split(' ')[0]} 👋
                            </h1>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                                {connectedCount > 0 ? `${connectedCount} platform${connectedCount > 1 ? 's' : ''} connected` : 'Connect your profiles to unlock networking'}
                            </p>
                        </div>
                        {connectedCount > 0 && (
                            <div style={{ padding: '10px 18px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--accent-green)', fontWeight: 700 }}>
                                ✓ {connectedCount} Connected
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 32 }}>
                    {[
                        { key: 'connect', label: '🔗 Social Connect' },
                        { key: 'search', label: '🔍 Search Connections' },
                        { key: 'mentors', label: '🤝 Find Mentors' },
                        { key: 'events', label: '📅 Tech Events' },
                    ].map((t: any) => (
                        <button key={t.key} onClick={() => handleTabChange(t.key)}
                            style={{
                                padding: '12px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                color: activeTab === t.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === t.key ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                transition: 'all 0.2s', marginBottom: -1
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── Social Connect ── */}
                {activeTab === 'connect' && (
                    <div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Click <strong>Connect Now</strong> to open the platform login in a new tab. Your session will be saved.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                            {PLATFORMS.map(p => {
                                const isConnected = connected.has(p.id);
                                return (
                                    <div key={p.id} className="card" style={{ padding: 20, borderColor: isConnected ? 'rgba(52,211,153,0.4)' : undefined, transition: 'all 0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                            <div style={{ width: 46, height: 46, borderRadius: 12, background: `${p.color}15`, border: `1.5px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {LOGOS[p.id]}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.category}</div>
                                            </div>
                                            {isConnected && <span style={{ fontSize: 18 }}>✅</span>}
                                        </div>
                                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>{p.desc}</p>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {isConnected ? (
                                                <>
                                                    {p.messageBase && (
                                                        <a href={p.messageBase} target="_blank" rel="noopener noreferrer"
                                                            className="btn btn-ghost btn-sm" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: 12 }}>
                                                            💬 Message
                                                        </a>
                                                    )}
                                                    <a href={p.loginUrl} target="_blank" rel="noopener noreferrer"
                                                        className="btn btn-ghost btn-sm" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', fontSize: 12 }}>
                                                        Open ↗
                                                    </a>
                                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-pink)', fontSize: 12 }} onClick={() => handleDisconnect(p.id)}>✕</button>
                                                </>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    style={{ flex: 1, background: p.color, fontSize: 12 }}
                                                    onClick={() => handleConnect(p.id, p.loginUrl)}>
                                                    Connect Now →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Connection Search ── */}
                {activeTab === 'search' && (
                    <div>
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Search Your Connections</h2>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                Find who in your network works at a specific company — and reach out directly on LinkedIn or X.
                            </p>
                            <div style={{ position: 'relative', maxWidth: 560 }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>🔍</span>
                                <input
                                    className="input"
                                    style={{ paddingLeft: 46, height: 50, fontSize: 15 }}
                                    placeholder='Search by company, name, or role... (e.g. "Google", "ML Engineer")'
                                    value={connectionSearch}
                                    onChange={e => setConnectionSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {connectionSearch && (
                                <p style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                                    {filteredConnections.length} connection{filteredConnections.length !== 1 ? 's' : ''} found at &ldquo;<strong>{connectionSearch}</strong>&rdquo;
                                </p>
                            )}
                        </div>

                        {filteredConnections.length === 0 && connectionSearch ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: 48, marginBottom: 12 }}>🤷</div>
                                <p>No connections found at &ldquo;{connectionSearch}&rdquo;</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                                {filteredConnections.map(c => (
                                    <div key={c.name} className="glass-card" style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '2px solid var(--border-subtle)', flexShrink: 0 }}>
                                                {c.avatar}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{c.name}</div>
                                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.role}</div>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '3px 10px', background: 'rgba(108,99,255,0.1)', borderRadius: 99, fontSize: 12, fontWeight: 600, color: 'var(--accent-primary)' }}>
                                                    🏢 {c.company}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {c.linkedin ? (
                                                <a href={c.linkedin} target="_blank" rel="noopener noreferrer"
                                                    className="btn btn-primary btn-sm"
                                                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                    {LOGOS.linkedin} Message on LinkedIn
                                                </a>
                                            ) : (
                                                <span style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Not connected on LinkedIn</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Mentors ── */}
                {activeTab === 'mentors' && (
                    <div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Connect with experienced professionals at top Indian companies.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                            {MENTORS.map(m => (
                                <div key={m.name} className="glass-card" style={{ padding: 24 }}>
                                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '2px solid var(--border-subtle)', flexShrink: 0 }}>{m.avatar}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</span>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.available ? 'var(--accent-green)' : 'var(--text-muted)', flexShrink: 0 }} />
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.role}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.exp} experience</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                                        {m.skills.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {m.linkedin && (
                                            <a href={`${m.linkedin}/messaging/`} target="_blank" rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm"
                                                style={{ flex: 1, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12 }}>
                                                {LOGOS.linkedin} LinkedIn
                                            </a>
                                        )}
                                        {m.twitter && (
                                            <a href={m.twitter} target="_blank" rel="noopener noreferrer"
                                                className="btn btn-ghost btn-sm"
                                                style={{ width: 36, padding: 0, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {LOGOS.twitter}
                                            </a>
                                        )}
                                        <button className="btn btn-primary btn-sm" style={{ flex: 1.2, padding: '8px 12px' }} disabled={!m.available}>
                                            {m.available ? 'Request Mentorship' : 'Unavailable'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Events ── */}
                {activeTab === 'events' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Live Tech Events & Hackathons</h2>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Scraped in real-time from Devfolio, Meetup, and Eventbrite.</p>
                            </div>
                            <span className="badge" style={{ padding: '6px 12px', fontSize: 12, background: 'rgba(108,99,255,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(108,99,255,0.3)', fontWeight: 700 }}>Powered by Apify 🕷️</span>
                        </div>

                        {loadingEvents ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                                <div style={{ width: 36, height: 36, border: '3px solid var(--border-medium)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                                {events.map(e => (
                                    <div key={e.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'default' }}
                                        onMouseEnter={ev => ev.currentTarget.style.transform = 'translateY(-4px)'}
                                        onMouseLeave={ev => ev.currentTarget.style.transform = 'none'}>
                                        <div style={{ height: 160, background: 'var(--bg-secondary)', position: 'relative' }}>
                                            <img src={e.image} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                                                {e.platform}
                                            </div>
                                        </div>
                                        <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
                                                <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.4 }}>{e.title}</h3>
                                                {e.prize && <span style={{ fontSize: 13, fontWeight: 800, color: '#34d399', whiteSpace: 'nowrap', background: 'rgba(52,211,153,0.1)', padding: '4px 8px', borderRadius: 6 }}>🏆 {e.prize}</span>}
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <span style={{ fontSize: 16 }}>📅</span> <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.date}</span>
                                            </div>
                                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                                                <span style={{ fontSize: 16 }}>📍</span> {e.location}
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', marginBottom: 24 }}>
                                                {e.tags.map((t: string) => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                                            </div>
                                            <div style={{ marginTop: 'auto' }}>
                                                <a href={e.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                                                    {e.status} ↗
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
