'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SKILLS_FILTER = ['All', 'React', 'Python', 'Node.js', 'AWS', 'ML', 'Kubernetes', 'Java', 'TypeScript', 'Web3'];
const COLORS = ['#6C63FF', '#38bdf8', '#f472b6', '#ffa116', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'];

const SAMPLE_PEOPLE = [
    { id: 'u1', name: 'Priya Sharma', title: 'SDE-2 at Razorpay', location: 'Bengaluru', initials: 'PS', skills: ['React', 'Node.js', 'AWS'], mutual: 4, followers: 812, following: 340, bio: 'Full-stack dev passionate about scalable fintech products. Open to mentoring.' },
    { id: 'u2', name: 'Arjun Mehta', title: 'Data Engineer at Swiggy', location: 'Hyderabad', initials: 'AM', skills: ['Python', 'Spark', 'Kafka'], mutual: 2, followers: 520, following: 210, bio: 'Building real-time data pipelines at scale. ML enthusiast.' },
    { id: 'u3', name: 'Sneha Kapoor', title: 'Frontend Lead at Atlassian', location: 'Pune', initials: 'SK', skills: ['TypeScript', 'React', 'CSS'], mutual: 7, followers: 1240, following: 180, bio: 'Design systems & accessibility advocate. Speaker at ReactIndia 2025.' },
    { id: 'u4', name: 'Rahul Gupta', title: 'ML Engineer at Google', location: 'Bengaluru', initials: 'RG', skills: ['TensorFlow', 'Python', 'GCP'], mutual: 1, followers: 3200, following: 450, bio: 'Working on LLMs & recommendation systems. IIT Bombay alum.' },
    { id: 'u5', name: 'Ananya Singh', title: 'DevOps at Zomato', location: 'Delhi', initials: 'AS', skills: ['Kubernetes', 'Terraform', 'AWS'], mutual: 3, followers: 670, following: 290, bio: 'Infrastructure & cloud reliability engineer. CKA certified.' },
    { id: 'u6', name: 'Vikram Nair', title: 'Product Manager at Phonepe', location: 'Bengaluru', initials: 'VN', skills: ['Product', 'SQL', 'Agile'], mutual: 5, followers: 2100, following: 600, bio: 'From SDE to PM. Passionate about user-centric product thinking in fintech.' },
    { id: 'u7', name: 'Divya Menon', title: 'Backend Engineer at CRED', location: 'Bengaluru', initials: 'DM', skills: ['Java', 'Spring Boot', 'Kafka'], mutual: 2, followers: 430, following: 180, bio: 'Microservices & high-performance backend systems. Loves DSA.' },
    { id: 'u8', name: 'Karthik Rao', title: 'Cloud Architect at TCS', location: 'Chennai', initials: 'KR', skills: ['Azure', 'Kubernetes', 'Terraform'], mutual: 0, followers: 890, following: 400, bio: 'AWS & Azure certified architect helping enterprises move to the cloud.' },
    { id: 'u9', name: 'Meera Joshi', title: 'Android Dev at Paytm', location: 'Noida', initials: 'MJ', skills: ['Kotlin', 'Android', 'Firebase'], mutual: 1, followers: 560, following: 220, bio: 'Building mobile experiences for Bharat. Flutter contributor.' },
    { id: 'u10', name: 'Aditya Kumar', title: 'Security Engineer at Flipkart', location: 'Bengaluru', initials: 'AK', skills: ['Security', 'Python', 'SIEM'], mutual: 0, followers: 720, following: 310, bio: 'Breaking things ethically. Bug bounty hunter & CompTIA Security+ certified.' },
    { id: 'u11', name: 'Pooja Verma', title: 'Data Scientist at OLA', location: 'Bengaluru', initials: 'PV', skills: ['Python', 'ML', 'Pandas'], mutual: 3, followers: 980, following: 260, bio: 'Demand forecasting & pricing models for mobility at scale.' },
    { id: 'u12', name: 'Nikhil Jain', title: 'Blockchain Dev at Polygon', location: 'Mumbai', initials: 'NJ', skills: ['Solidity', 'Web3.js', 'Rust'], mutual: 0, followers: 1560, following: 480, bio: 'DeFi protocol developer. ETHIndia 2024 winner. Web3 educator.' },
];

export default function PeoplePage() {
    const { data: session } = useSession();
    const [search, setSearch] = useState('');
    const [skillFilter, setSkillFilter] = useState('All');
    const [followed, setFollowed] = useState<Set<string>>(new Set());
    const [liked, setLiked] = useState<Set<string>>(new Set());
    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {
        const saved = localStorage.getItem('to_followed');
        if (saved) setFollowed(new Set(JSON.parse(saved)));
        const savedLiked = localStorage.getItem('to_liked');
        if (savedLiked) setLiked(new Set(JSON.parse(savedLiked)));
    }, []);

    const toggleFollow = (id: string) => {
        setFollowed(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            localStorage.setItem('to_followed', JSON.stringify([...next]));
            return next;
        });
    };

    const toggleLike = (id: string) => {
        setLiked(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            localStorage.setItem('to_liked', JSON.stringify([...next]));
            return next;
        });
    };

    const filtered = SAMPLE_PEOPLE.filter(p => {
        const matchSearch = !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.location.toLowerCase().includes(search.toLowerCase()) ||
            p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
        const matchSkill = skillFilter === 'All' || p.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
        return matchSearch && matchSkill;
    });

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    return (
        <div style={{ paddingTop: 80, paddingBottom: 100, minHeight: '100vh', position: 'relative' }}>
            <div className="orb orb-purple" style={{ position: 'fixed', top: -100, right: -100, pointerEvents: 'none' }} />
            <div className="orb orb-blue" style={{ position: 'fixed', bottom: -100, left: -100, pointerEvents: 'none' }} />

            <div className="container" style={{ maxWidth: 1060, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 'var(--radius-full)', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', marginBottom: 18 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>PEOPLE</span>
                    </div>
                    <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
                        Discover TechOrbit <span style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Professionals</span>
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 32px' }}>
                        Connect, follow and collaborate with India&apos;s top tech builders.
                    </p>
                    <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
                        <svg style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input className="input" placeholder="Search by name, role, company, skill..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 48, fontSize: 15, borderRadius: 'var(--radius-full)', border: '2px solid var(--border-medium)' }} />
                    </div>
                </div>

                {/* Skill filters */}
                <div className="scroll-row" style={{ marginBottom: 36, gap: 8, paddingBottom: 4 }}>
                    {SKILLS_FILTER.map(s => (
                        <button key={s} onClick={() => setSkillFilter(s)} style={{
                            padding: '8px 20px', borderRadius: 'var(--radius-full)', border: '1.5px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                            background: skillFilter === s ? 'var(--accent-primary)' : 'var(--bg-card)',
                            borderColor: skillFilter === s ? 'var(--accent-primary)' : 'var(--border-subtle)',
                            color: skillFilter === s ? 'white' : 'var(--text-secondary)',
                            boxShadow: skillFilter === s ? '0 4px 14px rgba(108,99,255,0.3)' : 'none',
                        }}>{s}</button>
                    ))}
                </div>

                {/* Stats bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
                        Showing <strong style={{ color: 'var(--text-primary)' }}>{Math.min(visibleCount, filtered.length)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> professionals
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Following: <strong style={{ color: 'var(--accent-primary)' }}>{followed.size}</strong>
                    </p>
                </div>

                {/* People Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
                    {visible.map((person, i) => {
                        const color = COLORS[i % COLORS.length];
                        const isFollowing = followed.has(person.id);
                        const isLiked = liked.has(person.id);
                        return (
                            <div key={person.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', animation: `fade-in-up 0.4s ease backwards`, animationDelay: `${i * 0.05}s` }}>
                                {/* Card Banner — clickable to view profile */}
                                <Link href={`/profile?id=${person.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                    <div style={{ height: 72, background: `linear-gradient(135deg, ${color}44, ${color}22)`, position: 'relative', borderBottom: `2px solid ${color}33`, cursor: 'pointer' }}>
                                        {person.mutual > 0 && (
                                            <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: `${color}33`, color, border: `1px solid ${color}55` }}>
                                                {person.mutual} mutual
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <div style={{ padding: '0 20px 20px' }}>
                                    {/* Avatar — clickable */}
                                    <Link href={`/profile?id=${person.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                        <div style={{ width: 68, height: 68, borderRadius: '50%', border: '4px solid var(--bg-secondary)', marginTop: -34, marginBottom: 12, background: `linear-gradient(135deg, ${color}, ${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: 'white', boxShadow: `0 4px 16px ${color}44`, cursor: 'pointer' }}>
                                            {person.initials}
                                        </div>
                                    </Link>

                                    {/* Info — name is clickable link */}
                                    <Link href={`/profile?id=${person.id}`} style={{ textDecoration: 'none' }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 3, color: 'var(--text-primary)' }}>{person.name}</h3>
                                    </Link>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 3 }}>{person.title}</p>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>📍 {person.location}</p>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{person.bio}</p>

                                    {/* Skills */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                                        {person.skills.map(s => (
                                            <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: `${color}18`, color, border: `1px solid ${color}33` }}>{s}</span>
                                        ))}
                                    </div>

                                    {/* Follower stats */}
                                    <div style={{ display: 'flex', gap: 18, marginBottom: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                                        <span><strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{person.followers.toLocaleString()}</strong> followers</span>
                                        <span><strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{person.following}</strong> following</span>
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => toggleFollow(person.id)}
                                            style={{ flex: 1, padding: '9px 16px', borderRadius: 'var(--radius-md)', border: isFollowing ? `1.5px solid ${color}` : 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
                                                background: isFollowing ? 'transparent' : color,
                                                color: isFollowing ? color : 'white',
                                                boxShadow: isFollowing ? 'none' : `0 4px 14px ${color}40` }}>
                                            {isFollowing ? '✓ Following' : '+ Follow'}
                                        </button>
                                        <button onClick={() => toggleLike(person.id)}
                                            style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-medium)', cursor: 'pointer', background: isLiked ? 'rgba(244,114,182,0.1)' : 'var(--bg-card)', color: isLiked ? '#f472b6' : 'var(--text-muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                                            {isLiked ? '❤️' : '🤍'}
                                        </button>
                                        <Link href={`/profile?id=${person.id}`}
                                            style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-medium)', cursor: 'pointer', background: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 700 }}>
                                            →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No results */}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                        <h3 style={{ fontSize: 20, fontWeight: 700 }}>No professionals found</h3>
                        <p style={{ fontSize: 14, marginTop: 8 }}>Try different search terms or skill filters.</p>
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div style={{ textAlign: 'center', marginTop: 48 }}>
                        <button onClick={() => setVisibleCount(v => v + 8)} className="btn btn-primary"
                            style={{ padding: '14px 48px', fontSize: 15, borderRadius: 'var(--radius-full)', boxShadow: '0 8px 28px rgba(108,99,255,0.35)' }}>
                            Load More People ({filtered.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
