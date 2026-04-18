'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// People from the network page (used for other-user profile view)
const SAMPLE_PEOPLE = [
    { id: 'u1', name: 'Priya Sharma', title: 'SDE-2 at Razorpay', location: 'Bengaluru', initials: 'PS', color: '#6C63FF', skills: ['React', 'Node.js', 'AWS'], bio: 'Full-stack dev passionate about scalable fintech products. Open to mentoring.', followers: 812, following: 340, experience: [{ role: 'SDE-2', company: 'Razorpay', from: 'Jan 2023', to: 'Present', desc: 'Building payment gateway APIs and frontend dashboards.', skills: ['React', 'Node.js', 'AWS'] }] },
    { id: 'u2', name: 'Arjun Mehta', title: 'Data Engineer at Swiggy', location: 'Hyderabad', initials: 'AM', color: '#38bdf8', skills: ['Python', 'Spark', 'Kafka'], bio: 'Building real-time data pipelines at scale. ML enthusiast.', followers: 520, following: 210, experience: [{ role: 'Data Engineer', company: 'Swiggy', from: 'Mar 2022', to: 'Present', desc: 'Designing and maintaining real-time data pipelines.', skills: ['Python', 'Spark', 'Kafka'] }] },
    { id: 'u3', name: 'Sneha Kapoor', title: 'Frontend Lead at Atlassian', location: 'Pune', initials: 'SK', color: '#f472b6', skills: ['TypeScript', 'React', 'CSS'], bio: 'Design systems & accessibility advocate. Speaker at ReactIndia 2025.', followers: 1240, following: 180, experience: [{ role: 'Frontend Lead', company: 'Atlassian', from: 'Jun 2021', to: 'Present', desc: 'Leading the design system team for Jira & Confluence.', skills: ['TypeScript', 'React', 'CSS'] }] },
    { id: 'u4', name: 'Rahul Gupta', title: 'ML Engineer at Google', location: 'Bengaluru', initials: 'RG', color: '#ffa116', skills: ['TensorFlow', 'Python', 'GCP'], bio: 'Working on LLMs & recommendation systems. IIT Bombay alum.', followers: 3200, following: 450, experience: [{ role: 'ML Engineer', company: 'Google', from: 'Aug 2020', to: 'Present', desc: 'Building recommendation models at scale.', skills: ['TensorFlow', 'Python', 'GCP'] }] },
    { id: 'u5', name: 'Ananya Singh', title: 'DevOps at Zomato', location: 'Delhi', initials: 'AS', color: '#22c55e', skills: ['Kubernetes', 'Terraform', 'AWS'], bio: 'Infrastructure & cloud reliability engineer. CKA certified.', followers: 670, following: 290, experience: [{ role: 'DevOps Engineer', company: 'Zomato', from: 'Nov 2021', to: 'Present', desc: 'Managing cloud infrastructure and CI/CD pipelines.', skills: ['Kubernetes', 'Terraform', 'AWS'] }] },
    { id: 'u6', name: 'Vikram Nair', title: 'Product Manager at Phonepe', location: 'Bengaluru', initials: 'VN', color: '#f59e0b', skills: ['Product', 'SQL', 'Agile'], bio: 'From SDE to PM. Passionate about user-centric product thinking in fintech.', followers: 2100, following: 600, experience: [{ role: 'Product Manager', company: 'PhonePe', from: 'Feb 2022', to: 'Present', desc: 'Owning the payments UX product roadmap.', skills: ['Product', 'SQL', 'Agile'] }] },
    { id: 'u7', name: 'Divya Menon', title: 'Backend Engineer at CRED', location: 'Bengaluru', initials: 'DM', color: '#ec4899', skills: ['Java', 'Spring Boot', 'Kafka'], bio: 'Microservices & high-performance backend systems. Loves DSA.', followers: 430, following: 180, experience: [{ role: 'Backend Engineer', company: 'CRED', from: 'Sep 2022', to: 'Present', desc: 'Building microservices for the reward platform.', skills: ['Java', 'Spring Boot', 'Kafka'] }] },
    { id: 'u8', name: 'Karthik Rao', title: 'Cloud Architect at TCS', location: 'Chennai', initials: 'KR', color: '#8b5cf6', skills: ['Azure', 'Kubernetes', 'Terraform'], bio: 'AWS & Azure certified architect helping enterprises move to the cloud.', followers: 890, following: 400, experience: [{ role: 'Cloud Architect', company: 'TCS', from: 'Jan 2019', to: 'Present', desc: 'Designing cloud migration strategies for enterprise clients.', skills: ['Azure', 'Kubernetes', 'Terraform'] }] },
    { id: 'u9', name: 'Meera Joshi', title: 'Android Dev at Paytm', location: 'Noida', initials: 'MJ', color: '#6C63FF', skills: ['Kotlin', 'Android', 'Firebase'], bio: 'Building mobile experiences for Bharat. Flutter contributor.', followers: 560, following: 220, experience: [{ role: 'Android Developer', company: 'Paytm', from: 'Apr 2022', to: 'Present', desc: 'Building the Paytm Android app features.', skills: ['Kotlin', 'Android', 'Firebase'] }] },
    { id: 'u10', name: 'Aditya Kumar', title: 'Security Engineer at Flipkart', location: 'Bengaluru', initials: 'AK', color: '#38bdf8', skills: ['Security', 'Python', 'SIEM'], bio: 'Breaking things ethically. Bug bounty hunter & CompTIA Security+ certified.', followers: 720, following: 310, experience: [{ role: 'Security Engineer', company: 'Flipkart', from: 'Jul 2021', to: 'Present', desc: 'Performing penetration testing and security audits.', skills: ['Security', 'Python', 'SIEM'] }] },
    { id: 'u11', name: 'Pooja Verma', title: 'Data Scientist at OLA', location: 'Bengaluru', initials: 'PV', color: '#f472b6', skills: ['Python', 'ML', 'Pandas'], bio: 'Demand forecasting & pricing models for mobility at scale.', followers: 980, following: 260, experience: [{ role: 'Data Scientist', company: 'OLA', from: 'Oct 2021', to: 'Present', desc: 'Building demand forecasting and pricing models.', skills: ['Python', 'ML', 'Pandas'] }] },
    { id: 'u12', name: 'Nikhil Jain', title: 'Blockchain Dev at Polygon', location: 'Mumbai', initials: 'NJ', color: '#ffa116', skills: ['Solidity', 'Web3.js', 'Rust'], bio: 'DeFi protocol developer. ETHIndia 2024 winner. Web3 educator.', followers: 1560, following: 480, experience: [{ role: 'Blockchain Developer', company: 'Polygon', from: 'May 2022', to: 'Present', desc: 'Building DeFi protocols on Polygon PoS chain.', skills: ['Solidity', 'Web3.js', 'Rust'] }] },
];

function SkillRing({ level, color, size = 64 }: { level: number; color: string; size?: number }) {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (level / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={7} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
                strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1.2s ease' }} />
        </svg>
    );
}

// ── SVG Platform Logos ────────────────────────────────────────────────────────
const PLATFORM_LOGOS: Record<string, { svg: React.ReactNode; color: string; url: (u: string) => string }> = {
    github:       { color: '#333333', url: u => `https://github.com/${u}`,              svg: <img src="https://cdn.simpleicons.org/github/333333" width="18" height="18" alt="GitHub" /> },
    leetcode:     { color: '#ffa116', url: u => `https://leetcode.com/${u}`,            svg: <img src="https://cdn.simpleicons.org/leetcode/ffa116" width="18" height="18" alt="LeetCode" /> },
    linkedin:     { color: '#0077b5', url: u => `https://linkedin.com/in/${u}`,         svg: <img src="https://cdn.simpleicons.org/linkedin/0077b5" width="18" height="18" alt="LinkedIn" /> },
    twitter:      { color: '#000000', url: u => `https://x.com/${u}`,                   svg: <img src="https://cdn.simpleicons.org/x/000000" width="18" height="18" alt="X" style={{ filter: 'var(--invert-dark, none)' }} /> },
    hackerrank:   { color: '#00ea64', url: u => `https://hackerrank.com/${u}`,          svg: <img src="https://cdn.simpleicons.org/hackerrank/00ea64" width="18" height="18" alt="HackerRank" /> },
    instagram:    { color: '#e1306c', url: u => `https://instagram.com/${u}`,           svg: <img src="https://cdn.simpleicons.org/instagram/e1306c" width="18" height="18" alt="Instagram" /> },
    kaggle:       { color: '#20beff', url: u => `https://kaggle.com/${u}`,              svg: <img src="https://cdn.simpleicons.org/kaggle/20beff" width="18" height="18" alt="Kaggle" /> },
};

// Assigns demo social usernames to sample people deterministically
function getSocialAccounts(id: string) {
    const map: Record<string, Record<string, string>> = {
        u1:  { github: 'priya-sharma-dev', leetcode: 'priya_s', linkedin: 'priya-sharma-sde' },
        u2:  { github: 'arjun-mehta',      leetcode: 'arjun_m', kaggle: 'arjunmehta' },
        u3:  { github: 'snehakapoor',      linkedin: 'sneha-kapoor-fe', twitter: 'snehakapoor' },
        u4:  { github: 'rahulgupta-ml',    leetcode: 'rahul_g', linkedin: 'rahulgupta-ml', kaggle: 'rahulgupta' },
        u5:  { github: 'ananya-devops',    hackerrank: 'ananyasingh', linkedin: 'ananya-singh-devops' },
        u6:  { linkedin: 'vikram-nair-pm', twitter: 'vikramnairpm', instagram: 'vikramnairpm' },
        u7:  { github: 'divyamenon',       leetcode: 'divya_m', hackerrank: 'divyamenon' },
        u8:  { linkedin: 'karthikrao-arch', github: 'karthikrao-cloud' },
        u9:  { github: 'meerajoshi-dev',   instagram: 'meerajoshi', linkedin: 'meera-joshi-android' },
        u10: { github: 'adityakumar-sec',  hackerrank: 'aditya_sec', linkedin: 'aditya-kumar-security' },
        u11: { kaggle: 'poojaverma',       leetcode: 'pooja_v', linkedin: 'pooja-verma-ds' },
        u12: { github: 'nikhiljain-web3',  twitter: 'nikhiljainweb3', instagram: 'nikhiljain' },
    };
    return map[id] || {};
}

// ── OTHER USER PROFILE (LinkedIn-style) ──────────────────────────────────────
function OtherUserProfile({ userId, onBack }: { userId: string; onBack: () => void }) {
    const person = SAMPLE_PEOPLE.find(p => p.id === userId);
    const [followed, setFollowed] = useState(false);
    const [msgOpen, setMsgOpen] = useState(false);
    const [msgText, setMsgText] = useState('');
    const [msgSent, setMsgSent] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('to_followed');
        if (saved) setFollowed(new Set(JSON.parse(saved)).has(userId));
    }, [userId]);

    const toggleFollow = () => {
        const saved = localStorage.getItem('to_followed');
        const set = new Set<string>(saved ? JSON.parse(saved) : []);
        followed ? set.delete(userId) : set.add(userId);
        localStorage.setItem('to_followed', JSON.stringify([...set]));
        setFollowed(!followed);
    };

    const sendMessage = () => {
        if (!msgText.trim()) return;
        setMsgSent(true);
        setTimeout(() => { setMsgOpen(false); setMsgSent(false); setMsgText(''); }, 2000);
    };

    if (!person) return (
        <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 48 }}>😕</div>
            <p style={{ fontSize: 18, fontWeight: 700 }}>Profile not found</p>
            <button onClick={onBack} className="btn btn-ghost">← Go Back</button>
        </div>
    );

    const socials = getSocialAccounts(userId);

    return (
        <div style={{ paddingTop: 80, paddingBottom: 100, minHeight: '100vh' }}>
            <div className="orb orb-purple" style={{ position: 'fixed', top: -120, right: -120, pointerEvents: 'none' }} />
            <div className="orb orb-blue" style={{ position: 'fixed', bottom: -120, left: -120, pointerEvents: 'none' }} />

            {/* Message Modal */}
            {msgOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    onClick={e => { if (e.target === e.currentTarget) setMsgOpen(false); }}>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 480, border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-elevated)', animation: 'fade-in-up 0.25s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: 'white' }}>{person.initials}</div>
                            <div>
                                <p style={{ fontWeight: 800, fontSize: 16 }}>Message {person.name}</p>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{person.title}</p>
                            </div>
                            <button onClick={() => setMsgOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>✕</button>
                        </div>
                        {msgSent ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                                <p style={{ fontWeight: 700, fontSize: 16, color: '#22c55e' }}>Message sent!</p>
                            </div>
                        ) : (
                            <>
                                <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
                                    placeholder={`Write a message to ${person.name.split(' ')[0]}...`}
                                    style={{ width: '100%', minHeight: 120, padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border-medium)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', marginBottom: 16 }} />
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => setMsgOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                                    <button onClick={sendMessage} className="btn btn-primary" style={{ flex: 2, background: person.color, boxShadow: `0 4px 14px ${person.color}44` }} disabled={!msgText.trim()}>Send Message</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="container" style={{ maxWidth: 780, position: 'relative', zIndex: 1 }}>
                <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, marginBottom: 24, padding: 0 }}>
                    ← Back to People
                </button>

                {/* Header Card */}
                <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-elevated)', marginBottom: 20 }}>
                    <div style={{ height: 160, background: `linear-gradient(135deg, ${person.color}88, ${person.color}44)` }} />
                    <div style={{ background: 'var(--bg-secondary)', padding: '0 32px 28px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
                            <div style={{ width: 112, height: 112, borderRadius: '50%', border: '5px solid var(--bg-secondary)', marginTop: -56, background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 38, color: 'white', flexShrink: 0, boxShadow: `0 8px 24px ${person.color}44` }}>
                                {person.initials}
                            </div>
                            <div style={{ display: 'flex', gap: 10, paddingBottom: 4 }}>
                                <button onClick={toggleFollow} style={{ padding: '9px 24px', borderRadius: 'var(--radius-full)', border: followed ? `2px solid ${person.color}` : 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', background: followed ? 'transparent' : person.color, color: followed ? person.color : 'white', boxShadow: followed ? 'none' : `0 4px 16px ${person.color}44` }}>
                                    {followed ? '✓ Following' : '+ Follow'}
                                </button>
                            </div>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 4 }}>{person.name}</h1>
                            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{person.title}</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>📍 {person.location}</p>
                            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                                <span><strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{person.followers.toLocaleString()}</strong> followers</span>
                                <span><strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{person.following}</strong> following</span>
                            </div>
                            {person.bio && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 560 }}>{person.bio}</p>}
                        </div>
                    </div>
                </div>

                {/* Social Platforms */}
                {Object.keys(socials).length > 0 && (
                    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Connected Platforms</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {Object.entries(socials).map(([platform, username]) => {
                                const cfg = PLATFORM_LOGOS[platform];
                                if (!cfg) return null;
                                return (
                                    <a key={platform} href={cfg.url(username)} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: `${cfg.color}14`, border: `1.5px solid ${cfg.color}33`, textDecoration: 'none', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${cfg.color}24`; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${cfg.color}14`; }}>
                                        {cfg.svg}
                                        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>@{username}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Skills */}
                <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Skills</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {person.skills.map(s => (
                            <span key={s} style={{ padding: '8px 18px', borderRadius: 'var(--radius-full)', background: `${person.color}18`, color: person.color, border: `1px solid ${person.color}33`, fontWeight: 700, fontSize: 13 }}>{s}</span>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                {person.experience && person.experience.length > 0 && (
                    <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Experience</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {person.experience.map((exp, i) => (
                                <div key={i} style={{ display: 'flex', gap: 18 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${person.color}22`, border: `2px solid ${person.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: person.color, flexShrink: 0 }}>
                                        {exp.company[0]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{exp.role}</h4>
                                        <p style={{ fontSize: 14, color: person.color, fontWeight: 600, marginBottom: 2 }}>{exp.company}</p>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{exp.from} — {exp.to}</p>
                                        {exp.desc && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>{exp.desc}</p>}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {exp.skills.map((s: string) => <span key={s} className="tag">{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resume Section */}
                <div className="card" style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${person.color}18`, border: `2px solid ${person.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>📄</div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Resume / CV</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{person.name} hasn&apos;t shared a public resume yet.</p>
                    </div>
                    <button disabled style={{ padding: '9px 20px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border-medium)', background: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: 'not-allowed', opacity: 0.5 }}>Not Available</button>
                </div>
            </div>
        </div>
    );
}

// ── OWN PROFILE ───────────────────────────────────────────────────────────────
function ProfileContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewId = searchParams.get('id');

    const [avatar, setAvatar] = useState('');
    const [banner, setBanner] = useState('');
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience' | 'badges'>('overview');

    const [lcStats, setLcStats] = useState<any>(null);
    const [ghStats, setGhStats] = useState<any>(null);
    const [loadingLc, setLoadingLc] = useState(false);
    const [loadingGh, setLoadingGh] = useState(false);

    // Dynamic skills from localStorage (set by resume analysis)
    const [userSkills, setUserSkills] = useState<{ name: string; level: number; color: string }[]>([]);

    const [experiences, setExperiences] = useState<any[]>([]);
    const [addingExp, setAddingExp] = useState(false);
    const [newExp, setNewExp] = useState({ role: '', company: '', from: '', to: '', desc: '', skills: '' });

    // Follower / Following modal
    const [followModal, setFollowModal] = useState<'followers' | 'following' | null>(null);
    const [followedPeople, setFollowedPeople] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('to_followed');
        if (saved) setFollowedPeople(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') { router.push('/login'); return; }
        if (session?.user) {
            setName(session.user.name || '');
            const sa = localStorage.getItem('to_avatar');
            setAvatar(sa || session.user.image || '');
            setBanner(localStorage.getItem('to_banner') || '');
            setTitle(localStorage.getItem('to_title') || '');
            setBio(localStorage.getItem('to_bio') || '');
            setLocation(localStorage.getItem('to_location') || '');
            const savedExp = localStorage.getItem('to_experience');
            if (savedExp) setExperiences(JSON.parse(savedExp));
            // Load dynamic skills
            const savedSkills = localStorage.getItem('to_skills');
            if (savedSkills) setUserSkills(JSON.parse(savedSkills));
            const lc = localStorage.getItem('to_lc');
            const gh = localStorage.getItem('to_gh');
            if (lc) fetchLeetCode(lc);
            if (gh) fetchGitHub(gh);
        }
    }, [status, session]); // eslint-disable-line

    const fetchLeetCode = async (u: string) => {
        setLoadingLc(true);
        try { const r = await fetch(`/api/scrape/leetcode?username=${u}`); if (r.ok) setLcStats(await r.json()); } catch { }
        setLoadingLc(false);
    };

    const fetchGitHub = async (u: string) => {
        setLoadingGh(true);
        try { const r = await fetch(`/api/scrape/github?username=${u}`); if (r.ok) setGhStats(await r.json()); } catch { }
        setLoadingGh(false);
    };

    const handleSave = () => {
        setSaving(true);
        localStorage.setItem('to_title', title);
        localStorage.setItem('to_bio', bio);
        localStorage.setItem('to_location', location);
        setTimeout(() => { setSaving(false); setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 3000); }, 600);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => { 
            const url = ev.target?.result as string; 
            setAvatar(url); 
            localStorage.setItem('to_avatar', url);
            window.dispatchEvent(new Event('avatar-updated')); // Sync with Navbar
        };
        reader.readAsDataURL(f);
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => { const url = ev.target?.result as string; setBanner(url); localStorage.setItem('to_banner', url); };
        reader.readAsDataURL(f);
    };

    const saveExperience = () => {
        if (!newExp.role || !newExp.company) return;
        const updated = [...experiences, { ...newExp, id: Date.now(), skills: newExp.skills.split(',').map(s => s.trim()).filter(Boolean) }];
        setExperiences(updated);
        localStorage.setItem('to_experience', JSON.stringify(updated));
        setNewExp({ role: '', company: '', from: '', to: '', desc: '', skills: '' });
        setAddingExp(false);
    };

    const deleteExperience = (id: number) => {
        const updated = experiences.filter(e => e.id !== id);
        setExperiences(updated);
        localStorage.setItem('to_experience', JSON.stringify(updated));
    };

    const profileCompletion = [name, title, bio, location].filter(Boolean).length * 25;

    const followingList = SAMPLE_PEOPLE.filter(p => followedPeople.includes(p.id));
    const COLORS_MAP: Record<string,string> = { u1:'#6C63FF',u2:'#38bdf8',u3:'#f472b6',u4:'#ffa116',u5:'#22c55e',u6:'#f59e0b',u7:'#ec4899',u8:'#8b5cf6',u9:'#6C63FF',u10:'#38bdf8',u11:'#f472b6',u12:'#ffa116' };

    if (status === 'loading') return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    );
    if (status === 'unauthenticated') return null; // Wait for redirect


    // Show other user's profile if ?id= is set
    if (viewId) return <OtherUserProfile userId={viewId} onBack={() => router.back()} />;

    const BADGES = [
        { icon: '🔥', label: 'Problem Solver', desc: '50+ LeetCode problems solved', unlocked: (lcStats?.solved ?? 0) >= 50 },
        { icon: '🌟', label: 'Early Adopter', desc: 'Joined TechOrbit in March 2026', unlocked: true },
        { icon: '🎓', label: 'Certified Pro', desc: 'Holds at least 1 certification', unlocked: false },
        { icon: '🚀', label: 'Job Seeker', desc: 'Applied to 10+ jobs', unlocked: false },
    ];

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'skills', label: 'Skills' },
        { key: 'experience', label: 'Experience' },
        { key: 'badges', label: 'Badges' },
    ] as const;

    const SKILL_COLORS = ['#61DAFB', '#68A063', '#3572A5', '#6C63FF', '#FFA116', '#FF9900', '#f472b6', '#38bdf8'];

    return (
        <div style={{ paddingTop: 80, paddingBottom: 100, minHeight: '100vh', position: 'relative' }}>
            <div className="orb orb-purple" style={{ position: 'fixed', top: -120, right: -120, pointerEvents: 'none' }} />
            <div className="orb orb-blue" style={{ position: 'fixed', bottom: -120, left: -120, pointerEvents: 'none' }} />

            {/* Followers / Following Modal */}
            {followModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    onClick={e => { if (e.target === e.currentTarget) setFollowModal(null); }}>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 440, maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-elevated)', animation: 'fade-in-up 0.25s ease', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800 }}>{followModal === 'following' ? `Following (${followingList.length})` : 'Followers (0)'}</h3>
                            <button onClick={() => setFollowModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-muted)', lineHeight: 1 }}>×</button>
                        </div>
                        <div style={{ overflowY: 'auto', padding: '12px 0' }}>
                            {followModal === 'following' ? (
                                followingList.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                        <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                                        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Not following anyone yet</p>
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Go to People to follow professionals</p>
                                    </div>
                                ) : followingList.map(p => {
                                    const c = COLORS_MAP[p.id] || '#6C63FF';
                                    return (
                                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                            <Link href={`/profile?id=${p.id}`} onClick={() => setFollowModal(null)}
                                                style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${c}, ${c}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: 'white', textDecoration: 'none', flexShrink: 0 }}>
                                                {p.initials}
                                            </Link>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <Link href={`/profile?id=${p.id}`} onClick={() => setFollowModal(null)}
                                                    style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: 2 }}>{p.name}</Link>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</p>
                                            </div>
                                            <Link href={`/profile?id=${p.id}`} onClick={() => setFollowModal(null)}
                                                style={{ fontSize: 12, fontWeight: 700, color: c, padding: '5px 14px', borderRadius: 'var(--radius-full)', border: `1.5px solid ${c}44`, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                View
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                                    <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Followers are private</p>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Only you can see your follower list</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ maxWidth: 1060, position: 'relative', zIndex: 1 }}>

                {/* ═══ HERO BANNER ═══ */}
                <div style={{ position: 'relative', marginBottom: 28, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-elevated)' }}>
                    <div style={{ height: 180, background: banner ? `url(${banner}) center/cover no-repeat` : 'var(--gradient-hero)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 15% 60%, rgba(255,255,255,0.15) 0%, transparent 55%), radial-gradient(ellipse at 85% 40%, rgba(255,255,255,0.1) 0%, transparent 55%)' }} />
                        <label style={{ position: 'absolute', top: 16, right: 16, padding: '8px 16px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg> Change Banner
                            <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} />
                        </label>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', padding: '0 40px 36px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', marginTop: -64, flexShrink: 0 }}>
                                <div style={{ width: 128, height: 128, borderRadius: '50%', border: '5px solid var(--bg-secondary)', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.35)', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {avatar ? <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 52, fontWeight: 900, color: 'white' }}>{name?.[0]?.toUpperCase() || 'U'}</span>}
                                </div>
                                <label style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', color: 'white', fontSize: 11, fontWeight: 700, gap: 4 }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                                    <span style={{ fontSize: 26 }}>📷</span> Change
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                                </label>
                                <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: '#22c55e', border: '3px solid var(--bg-secondary)' }} />
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10, paddingBottom: 4, alignItems: 'center' }}>
                                {saved && <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>Saved!</span>}
                                {editing ? (
                                    <>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                                        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                                    </>
                                ) : (
                                    <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
                                )}
                                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-ghost btn-sm" style={{ color: '#f472b6', borderColor: 'rgba(244,114,182,0.25)' }}>Sign Out</button>
                            </div>
                        </div>

                        {editing ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                                {[
                                    { label: 'Full Name', val: name, set: setName, ph: 'Rahul Sharma' },
                                    { label: 'Professional Role', val: title, set: setTitle, ph: 'SDE-2 at Razorpay' },
                                    { label: 'Location', val: location, set: setLocation, ph: 'Bengaluru, India' },
                                    { label: 'Bio', val: bio, set: setBio, ph: 'Short intro...' },
                                ].map(f => (
                                    <div key={f.label}>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>{f.label}</label>
                                        <input className="input" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ marginTop: 18 }}>
                                <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.025em', margin: '0 0 4px' }}>{name || 'TechOrbit User'}</h1>
                                {title && <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{title}</p>}
                                {location && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>📍 {location}</p>}
                                {bio && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 580, marginBottom: 6 }}>{bio}</p>}
                                <div style={{ display: 'flex', gap: 20, marginBottom: 6 }}>
                                    <button onClick={() => setFollowModal('followers')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                                        <strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>0</strong> followers
                                    </button>
                                    <button onClick={() => setFollowModal('following')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                                        <strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{followingList.length}</strong> following
                                    </button>
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{session?.user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══ TABS ═══ */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 32 }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            style={{ padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', marginBottom: -1,
                                color: activeTab === t.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === t.key ? '2px solid var(--accent-primary)' : '2px solid transparent' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ═══ OVERVIEW ═══ */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* Platform Stats */}
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Platform Statistics</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                                    {[
                                        { value: lcStats?.solved ?? '—', label: 'Problems Solved', color: '#FFA116', bg: 'rgba(255,161,22,0.08)', border: 'rgba(255,161,22,0.2)' },
                                        { value: lcStats?.easy ?? '—', label: 'Easy', color: '#00B8A3', bg: 'rgba(0,184,163,0.08)', border: 'rgba(0,184,163,0.2)' },
                                        { value: lcStats?.medium ?? '—', label: 'Medium', color: '#FFC01E', bg: 'rgba(255,192,30,0.08)', border: 'rgba(255,192,30,0.2)' },
                                        { value: lcStats?.hard ?? '—', label: 'Hard', color: '#EF4743', bg: 'rgba(239,71,67,0.08)', border: 'rgba(239,71,67,0.2)' },
                                    ].map(s => (
                                        <div key={s.label} style={{ textAlign: 'center', padding: '16px 10px', borderRadius: 12, background: s.bg, border: `1px solid ${s.border}` }}>
                                            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                    {[
                                        { value: ghStats?.repos ?? '—', label: 'GitHub Repos', color: '#6C63FF', bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.2)' },
                                        { value: ghStats?.followers ?? '—', label: 'GH Followers', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)' },
                                        { value: experiences.length || '—', label: 'Jobs / Roles', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
                                    ].map(s => (
                                        <div key={s.label} style={{ textAlign: 'center', padding: '16px 10px', borderRadius: 12, background: s.bg, border: `1px solid ${s.border}` }}>
                                            <p style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                                {(!lcStats || !ghStats) && (
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, textAlign: 'center' }}>
                                        Connect LeetCode &amp; GitHub in <Link href="/network" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>Network</Link> to see live stats
                                    </p>
                                )}
                            </div>

                            {/* Live Platforms */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FFA116', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: 'white' }}>LC</div>
                                        <div><p style={{ fontSize: 14, fontWeight: 800 }}>LeetCode</p><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live Stats</p></div>
                                        <span style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 700 }}>LIVE</span>
                                    </div>
                                    {loadingLc ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[100,75,85].map(w => <div key={w} className="skeleton" style={{ height: 12, width:`${w}%`, borderRadius: 6 }} />)}</div>
                                        : lcStats?.status === 'success' ? (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                                                    <span style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: '#FFA116' }}>{lcStats.solved}</span>
                                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>solved</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    {[{ l: 'Easy', v: lcStats.easy, c: '#00B8A3', bg: 'rgba(0,184,163,0.1)' }, { l: 'Med', v: lcStats.medium, c: '#FFC01E', bg: 'rgba(255,192,30,0.1)' }, { l: 'Hard', v: lcStats.hard, c: '#EF4743', bg: 'rgba(239,71,67,0.1)' }].map(d => (
                                                        <div key={d.l} style={{ flex: 1, background: d.bg, borderRadius: 9, padding: '10px 6px', textAlign: 'center' }}>
                                                            <p style={{ fontSize: 16, fontWeight: 900, color: d.c }}>{d.v}</p>
                                                            <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>{d.l}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : <div style={{ textAlign: 'center', padding: '12px 0' }}><p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Not connected</p><Link href="/network" className="btn btn-ghost btn-sm" style={{ fontSize: 12, textDecoration: 'none' }}>Connect →</Link></div>}
                                </div>

                                <div className="glass-card" style={{ padding: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: 'var(--bg-primary)' }}>GH</div>
                                        <div><p style={{ fontSize: 14, fontWeight: 800 }}>GitHub</p><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live Stats</p></div>
                                        <span style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 700 }}>LIVE</span>
                                    </div>
                                    {loadingGh ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[100,75,85].map(w => <div key={w} className="skeleton" style={{ height: 12, width:`${w}%`, borderRadius: 6 }} />)}</div>
                                        : ghStats?.status === 'success' ? (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                                    <img src={ghStats.avatar} alt="" style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--border-medium)' }} />
                                                    <div><p style={{ fontSize: 14, fontWeight: 800 }}>@{ghStats.username}</p><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Public profile</p></div>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                                    <div style={{ background: 'rgba(108,99,255,0.1)', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid rgba(108,99,255,0.2)' }}><p style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent-primary)' }}>{ghStats.repos}</p><p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Repos</p></div>
                                                    <div style={{ background: 'rgba(56,189,248,0.1)', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid rgba(56,189,248,0.2)' }}><p style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8' }}>{ghStats.followers}</p><p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Followers</p></div>
                                                </div>
                                            </div>
                                        ) : <div style={{ textAlign: 'center', padding: '12px 0' }}><p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Not connected</p><Link href="/network" className="btn btn-ghost btn-sm" style={{ fontSize: 12, textDecoration: 'none' }}>Connect →</Link></div>}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>Quick Actions</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    {[
                                        { href: '/career-guidance', label: 'AI Resume', icon: '📄', color: '#6C63FF' },
                                        { href: '/jobs', label: 'Browse Jobs', icon: '💼', color: '#38bdf8' },
                                        { href: '/certifications', label: 'Certs', icon: '🎓', color: '#FFA116' },
                                        { href: '/people', label: 'People', icon: '👥', color: '#22c55e' },
                                        { href: '/news', label: 'Tech News', icon: '📰', color: '#f472b6' },
                                        { href: '/settings', label: 'Settings', icon: '⚙️', color: '#94a3b8' },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px', borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', textDecoration: 'none', color: 'var(--text-secondary)', transition: 'all 0.22s', fontSize: 13, fontWeight: 600 }}
                                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = item.color; el.style.color = item.color; el.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-subtle)'; el.style.color = 'var(--text-secondary)'; el.style.transform = ''; }}>
                                            <span style={{ fontSize: 24 }}>{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="card" style={{ padding: 24 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Account Details</h3>
                                {[
                                    { label: 'Member since', value: 'Mar 2026' },
                                    { label: 'Email verified', value: session?.user?.email ? '✓ Yes' : '✗ No' },
                                    { label: 'Profile completion', value: `${profileCompletion}%` },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 12 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                                        <span style={{ fontWeight: 700 }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 8 }}>
                                    <div style={{ height: '100%', width: `${profileCompletion}%`, background: profileCompletion === 100 ? '#22c55e' : 'var(--accent-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
                                </div>
                                <Link href="/settings" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 16, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Manage Account →</Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ SKILLS ═══ */}
                {activeTab === 'skills' && (
                    <div>
                        {userSkills.length === 0 ? (
                            <div className="card" style={{ padding: 64, textAlign: 'center', borderStyle: 'dashed' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🛠</div>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No skills added yet</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                                    Upload your resume to automatically detect your skills and proficiency levels.
                                </p>
                                <Link href="/career-guidance" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Analyze Resume →</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                {userSkills.map((skill, i) => (
                                    <div key={skill.name} className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <div style={{ position: 'relative', flexShrink: 0, width: 64, height: 64 }}>
                                            <SkillRing level={skill.level} color={skill.color || SKILL_COLORS[i % SKILL_COLORS.length]} size={64} />
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: 11, fontWeight: 900, color: skill.color || SKILL_COLORS[i % SKILL_COLORS.length] }}>{skill.level}%</span>
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{skill.name}</p>
                                            <div style={{ height: 6, borderRadius: 'var(--radius-full)', background: 'var(--border-subtle)', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${skill.level}%`, background: skill.color || SKILL_COLORS[i % SKILL_COLORS.length], borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }} />
                                            </div>
                                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{skill.level >= 80 ? 'Advanced' : skill.level >= 60 ? 'Intermediate' : 'Beginner'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ EXPERIENCE ═══ */}
                {activeTab === 'experience' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Work Experience</h3>
                            <button className="btn btn-primary btn-sm" onClick={() => setAddingExp(true)}>+ Add Experience</button>
                        </div>
                        {addingExp && (
                            <div className="card" style={{ padding: 28, border: '2px solid var(--accent-primary)', animation: 'fade-in-up 0.3s ease' }}>
                                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>New Experience</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                    {[
                                        { label: 'Job Title', key: 'role', ph: 'Software Engineer' },
                                        { label: 'Company', key: 'company', ph: 'Google India' },
                                        { label: 'From', key: 'from', ph: 'Jan 2023' },
                                        { label: 'To', key: 'to', ph: 'Present' },
                                    ].map(f => (
                                        <div key={f.key}>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7 }}>{f.label}</label>
                                            <input className="input" placeholder={f.ph} value={(newExp as any)[f.key]} onChange={e => setNewExp(p => ({ ...p, [f.key]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7 }}>Description</label>
                                        <textarea className="input" placeholder="What did you build / achieve?" value={newExp.desc} onChange={e => setNewExp(p => ({ ...p, desc: e.target.value }))} style={{ minHeight: 80, resize: 'vertical' }} />
                                    </div>
                                    <div style={{ gridColumn: '1/-1' }}>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7 }}>Skills Used (comma separated)</label>
                                        <input className="input" placeholder="React, Node.js, AWS" value={newExp.skills} onChange={e => setNewExp(p => ({ ...p, skills: e.target.value }))} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn btn-primary" onClick={saveExperience}>Save Experience</button>
                                    <button className="btn btn-ghost" onClick={() => setAddingExp(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
                        {experiences.length === 0 ? (
                            <div className="card" style={{ padding: 48, textAlign: 'center', borderStyle: 'dashed' }}>
                                <p style={{ fontSize: 32, marginBottom: 12 }}>💼</p>
                                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No experience added yet</p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add your work experience to build a stronger profile</p>
                            </div>
                        ) : (
                            experiences.map((exp, i) => (
                                <div key={exp.id} className="glass-card" style={{ padding: 24, display: 'flex', gap: 20, position: 'relative' }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `hsl(${(i * 60) % 360}, 70%, 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: 'white', flexShrink: 0 }}>
                                        {exp.company?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 3 }}>{exp.role}</h4>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 3 }}>{exp.company}</p>
                                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{exp.from} — {exp.to}</p>
                                            </div>
                                            <button onClick={() => deleteExperience(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, padding: 4 }}>🗑</button>
                                        </div>
                                        {exp.desc && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>{exp.desc}</p>}
                                        {Array.isArray(exp.skills) && exp.skills.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {exp.skills.map((s: string) => <span key={s} className="tag">{s}</span>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ═══ BADGES ═══ */}
                {activeTab === 'badges' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                        {BADGES.map(badge => (
                            <div key={badge.label} className="glass-card" style={{ padding: 28, display: 'flex', gap: 20, alignItems: 'center', opacity: badge.unlocked ? 1 : 0.45, filter: badge.unlocked ? 'none' : 'grayscale(1)' }}>
                                <div style={{ width: 64, height: 64, borderRadius: 18, background: badge.unlocked ? 'var(--gradient-hero)' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0, boxShadow: badge.unlocked ? 'var(--shadow-glow)' : 'none' }}>
                                    {badge.icon}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <p style={{ fontSize: 15, fontWeight: 800 }}>{badge.label}</p>
                                        {badge.unlocked && <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>EARNED</span>}
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 44, height: 44, border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>}>
            <ProfileContent />
        </Suspense>
    );
}
