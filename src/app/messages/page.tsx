'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const COLORS: Record<string, string> = {
    u1: '#6C63FF', u2: '#38bdf8', u3: '#f472b6', u4: '#ffa116',
    u5: '#22c55e', u6: '#f59e0b', u7: '#ec4899', u8: '#8b5cf6',
    u9: '#6C63FF', u10: '#38bdf8', u11: '#f472b6', u12: '#ffa116',
};

const ALL_PEOPLE: Record<string, { id: string; name: string; title: string; initials: string }> = {
    u1:  { id: 'u1',  name: 'Priya Sharma',   title: 'SDE-2 at Razorpay',          initials: 'PS' },
    u2:  { id: 'u2',  name: 'Arjun Mehta',    title: 'Data Engineer at Swiggy',    initials: 'AM' },
    u3:  { id: 'u3',  name: 'Sneha Kapoor',   title: 'Frontend Lead at Atlassian', initials: 'SK' },
    u4:  { id: 'u4',  name: 'Rahul Gupta',    title: 'ML Engineer at Google',      initials: 'RG' },
    u5:  { id: 'u5',  name: 'Ananya Singh',   title: 'DevOps at Zomato',           initials: 'AS' },
    u6:  { id: 'u6',  name: 'Vikram Nair',    title: 'Product Manager at Phonepe', initials: 'VN' },
    u7:  { id: 'u7',  name: 'Divya Menon',    title: 'Backend Engineer at CRED',   initials: 'DM' },
    u8:  { id: 'u8',  name: 'Karthik Rao',    title: 'Cloud Architect at TCS',     initials: 'KR' },
    u9:  { id: 'u9',  name: 'Meera Joshi',    title: 'Android Dev at Paytm',       initials: 'MJ' },
    u10: { id: 'u10', name: 'Aditya Kumar',   title: 'Security Engineer at Flipkart', initials: 'AK' },
    u11: { id: 'u11', name: 'Pooja Verma',    title: 'Data Scientist at OLA',      initials: 'PV' },
    u12: { id: 'u12', name: 'Nikhil Jain',    title: 'Blockchain Dev at Polygon',  initials: 'NJ' },
};

interface Msg { id: string; from: 'me' | 'them'; text: string; ts: number; }

const AUTO_REPLIES: Record<string, string[]> = {
    u1: ["Hey! Thanks for reaching out 😊", "I'd love to connect!", "Let me know how I can help."],
    u2: ["Hi there! Always happy to chat about data engineering.", "What's up?", "Sure, let's discuss!"],
    u3: ["Hey! Frontend geek here 🙋‍♀️", "Thanks for the message!", "Happy to connect!"],
    u4: ["Hello! ML is my jam 🤖", "Thanks for reaching out!", "Let's collaborate!"],
    u5: ["Hey! DevOps never sleeps ☁️", "What's on your mind?", "Sure, ping me anytime!"],
    u6: ["Hi! Product thinking in action 💡", "Thanks for the message!", "Let's sync up soon."],
    u7: ["Hey! Java + Kafka = ❤️", "Thanks for connecting!", "Happy to help!"],
    u8: ["Cloud architect online ☁️", "Thanks for reaching out!", "Let's talk cloud strategy."],
    u9: ["Hey! Building for Bharat 🇮🇳", "Thanks for the message!", "Flutter is love!"],
    u10: ["Hello! Security first 🔐", "Thanks for reaching out!", "Let's chat!"],
    u11: ["Hey! Data science never ends 📊", "Thanks for the message!", "Let's collaborate on ML!"],
    u12: ["Web3 builder here! 🦾", "Thanks for connecting!", "Let's BUIDL together!"],
};

function getStorageKey(userId: string) { return `to_msgs_${userId}`; }

function loadMsgs(userId: string): Msg[] {
    try { const d = localStorage.getItem(getStorageKey(userId)); return d ? JSON.parse(d) : []; }
    catch { return []; }
}

function saveMsgs(userId: string, msgs: Msg[]) {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(msgs));
}

function formatTime(ts: number) {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - ts) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function MessagesContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initId = searchParams.get('id');

    const [contacts, setContacts] = useState<string[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Record<string, Msg[]>>({});
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [search, setSearch] = useState('');
    const [newChatOpen, setNewChatOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'unauthenticated') { router.push('/login'); return; }
    }, [status, router]);

    // Load contacts from localStorage on mount
    useEffect(() => {
        const followed = localStorage.getItem('to_followed');
        const followedIds: string[] = followed ? JSON.parse(followed) : [];

        // Also load any people we've directly messaged (even if not following)
        const allMsgKeys = Object.keys(localStorage).filter(k => k.startsWith('to_msgs_'));
        const msgIds = allMsgKeys.map(k => k.replace('to_msgs_', '')).filter(id => !followedIds.includes(id));

        const allIds = [...followedIds, ...msgIds];
        setContacts(allIds);

        // Load all conversation data
        const convs: Record<string, Msg[]> = {};
        allIds.forEach(id => { convs[id] = loadMsgs(id); });
        setConversations(convs);

        // Set active from URL param or first contact
        if (initId && ALL_PEOPLE[initId]) {
            if (!allIds.includes(initId)) {
                // Add to contacts if not already
                setContacts(prev => [...prev, initId]);
                convs[initId] = loadMsgs(initId);
                setConversations({ ...convs });
            }
            setActiveId(initId);
        } else if (allIds.length > 0) {
            setActiveId(allIds[0]);
        }
    }, [status, initId]); // eslint-disable-line

    // Scroll to bottom on new message or active change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeId, conversations]);

    const activePerson = activeId ? ALL_PEOPLE[activeId] : null;
    const activeMsgs = activeId ? (conversations[activeId] || []) : [];
    const activeColor = activeId ? COLORS[activeId] || '#6C63FF' : '#6C63FF';

    const sendMessage = () => {
        if (!input.trim() || !activeId) return;
        const msg: Msg = { id: Date.now().toString(), from: 'me', text: input.trim(), ts: Date.now() };
        const updated = [...activeMsgs, msg];
        const newConvs = { ...conversations, [activeId]: updated };
        setConversations(newConvs);
        saveMsgs(activeId, updated);
        setInput('');
        inputRef.current?.focus();

        // Auto reply after delay
        const replies = AUTO_REPLIES[activeId] || ["Thanks for your message!"];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        setTyping(true);
        setTimeout(() => {
            const replyMsg: Msg = { id: (Date.now() + 1).toString(), from: 'them', text: reply, ts: Date.now() };
            setConversations(prev => {
                const updated2 = [...(prev[activeId] || []), replyMsg];
                saveMsgs(activeId, updated2);
                return { ...prev, [activeId]: updated2 };
            });
            setTyping(false);
        }, 1200 + Math.random() * 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const startNewChat = (id: string) => {
        if (!contacts.includes(id)) {
            setContacts(prev => [...prev, id]);
            setConversations(prev => ({ ...prev, [id]: loadMsgs(id) }));
        }
        setActiveId(id);
        setNewChatOpen(false);
    };

    const filteredContacts = contacts.filter(id => {
        const p = ALL_PEOPLE[id];
        if (!p) return false;
        return p.name.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase());
    });

    const sortedContacts = [...filteredContacts].sort((a, b) => {
        const la = conversations[a]?.slice(-1)[0]?.ts || 0;
        const lb = conversations[b]?.slice(-1)[0]?.ts || 0;
        return lb - la;
    });

    if (status === 'loading') return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    );
    if (status === 'unauthenticated') return null;

    return (
        <div style={{ paddingTop: 64, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* New Chat Modal */}
            {newChatOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    onClick={e => { if (e.target === e.currentTarget) setNewChatOpen(false); }}>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 440, maxHeight: '70vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-elevated)', overflow: 'hidden', animation: 'fade-in-up 0.25s ease' }}>
                        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800 }}>New Message</h3>
                            <button onClick={() => setNewChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-muted)' }}>×</button>
                        </div>
                        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                            <input placeholder="Search people..." className="input" style={{ fontSize: 14 }}
                                value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                        </div>
                        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
                            {Object.values(ALL_PEOPLE).filter(p =>
                                p.name.toLowerCase().includes(search.toLowerCase()) ||
                                p.title.toLowerCase().includes(search.toLowerCase())
                            ).map(p => {
                                const c = COLORS[p.id] || '#6C63FF';
                                return (
                                    <button key={p.id} onClick={() => startNewChat(p.id)}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${c}, ${c}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: 'white', flexShrink: 0 }}>
                                            {p.initials}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</p>
                                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.title}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--bg-primary)' }}>

                {/* ══ LEFT SIDEBAR ══ */}
                <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
                    {/* Sidebar header */}
                    <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 900 }}>Messages</h2>
                            <button onClick={() => { setSearch(''); setNewChatOpen(true); }}
                                style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--accent-primary)', border: 'none', cursor: 'pointer', color: 'white', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(108,99,255,0.35)', transition: 'all 0.2s' }}
                                title="New Message"
                                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input className="input" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ paddingLeft: 36, fontSize: 13, height: 38, borderRadius: 'var(--radius-full)' }} />
                        </div>
                    </div>

                    {/* Conversation list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {sortedContacts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                                <div style={{ marginBottom: 14, color: 'var(--accent-primary)' }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div>
                                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>No conversations yet</p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                                    Follow people or click the <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline', verticalAlign:'middle'}}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> button to start a chat
                                </p>
                                <Link href="/people" style={{ display: 'inline-block', padding: '9px 22px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 14px rgba(108,99,255,0.3)' }}>
                                    Discover People →
                                </Link>
                            </div>
                        ) : sortedContacts.map(id => {
                            const p = ALL_PEOPLE[id];
                            if (!p) return null;
                            const c = COLORS[id] || '#6C63FF';
                            const msgs = conversations[id] || [];
                            const lastMsg = msgs[msgs.length - 1];
                            const isActive = id === activeId;
                            return (
                                <button key={id} onClick={() => setActiveId(id)}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: isActive ? `${c}12` : 'none', border: 'none', borderLeft: isActive ? `3px solid ${c}` : '3px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-card)'; }}
                                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${c}, ${c}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: 'white', flexShrink: 0, position: 'relative' }}>
                                        {p.initials}
                                        <div style={{ position: 'absolute', bottom: 2, right: 2, width: 11, height: 11, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg-secondary)' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{p.name}</span>
                                            {lastMsg && <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{formatTime(lastMsg.ts)}</span>}
                                        </div>
                                        <p style={{ fontSize: 12, color: lastMsg ? 'var(--text-secondary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {lastMsg ? (lastMsg.from === 'me' ? `You: ${lastMsg.text}` : lastMsg.text) : p.title}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ══ CHAT WINDOW ══ */}
                {activePerson ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Chat header */}
                        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                            <Link href={`/profile?id=${activePerson.id}`}
                                style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${activeColor}, ${activeColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17, color: 'white', textDecoration: 'none', flexShrink: 0, boxShadow: `0 4px 14px ${activeColor}44` }}>
                                {activePerson.initials}
                            </Link>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Link href={`/profile?id=${activePerson.id}`} style={{ textDecoration: 'none' }}>
                                    <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{activePerson.name}</p>
                                </Link>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {typing ? <span style={{ color: activeColor, fontWeight: 600 }}>typing...</span> : activePerson.title}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Link href={`/profile?id=${activePerson.id}`}
                                    style={{ padding: '7px 16px', borderRadius: 'var(--radius-full)', border: `1.5px solid ${activeColor}44`, color: activeColor, textDecoration: 'none', fontSize: 13, fontWeight: 700, background: `${activeColor}0e` }}>
                                    View Profile →
                                </Link>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {activeMsgs.length === 0 && (
                                <div style={{ textAlign: 'center', margin: 'auto', padding: '40px 0' }}>
                                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${activeColor}, ${activeColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 28, color: 'white', margin: '0 auto 16px', boxShadow: `0 8px 24px ${activeColor}44` }}>
                                        {activePerson.initials}
                                    </div>
                                    <p style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{activePerson.name}</p>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>{activePerson.title}<br />Say hi to start the conversation!</p>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                                        {["Hey there!", "I'd love to connect!", "Can we collaborate?"].map(t => (
                                            <button key={t} onClick={() => { setInput(t); inputRef.current?.focus(); }}
                                                style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border-medium)', background: 'var(--bg-card)', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                                                onMouseEnter={e => (e.currentTarget.style.borderColor = activeColor)}
                                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeMsgs.map((msg, i) => {
                                const isMe = msg.from === 'me';
                                const prevMsg = activeMsgs[i - 1];
                                const showDate = !prevMsg || new Date(prevMsg.ts).toDateString() !== new Date(msg.ts).toDateString();
                                return (
                                    <div key={msg.id}>
                                        {showDate && (
                                            <div style={{ textAlign: 'center', margin: '12px 0 6px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '3px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                                                    {new Date(msg.ts).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 3 }}>
                                            <div style={{ maxWidth: '68%' }}>
                                                <div style={{
                                                    padding: '10px 16px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                    background: isMe ? activeColor : 'var(--bg-secondary)',
                                                    color: isMe ? 'white' : 'var(--text-primary)',
                                                    border: isMe ? 'none' : '1px solid var(--border-subtle)',
                                                    fontSize: 14, lineHeight: 1.55, wordBreak: 'break-word',
                                                    boxShadow: isMe ? `0 2px 10px ${activeColor}44` : '0 1px 4px rgba(0,0,0,0.08)',
                                                }}>
                                                    {msg.text}
                                                </div>
                                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingInline: 4 }}>
                                                    {formatTime(msg.ts)}{isMe && ' ✓✓'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {typing && (
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', gap: 5, alignItems: 'center' }}>
                                        {[0, 0.2, 0.4].map((delay, i) => (
                                            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: activeColor, animation: `typing-dot 1.2s ${delay}s infinite ease-in-out` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input bar */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input ref={inputRef} className="input" placeholder={`Message ${activePerson.name.split(' ')[0]}...`}
                                        value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                        style={{ paddingRight: 48, fontSize: 14, height: 48, borderRadius: 'var(--radius-full)' }} />
                                    {/* Emoji quick insert */}
                                    <button onClick={() => setInput(p => p + ' 😊')}
                                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, opacity: 0.5, color: 'var(--text-primary)' }}
                                        title="Add emoji"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
                                </div>
                                <button onClick={sendMessage} disabled={!input.trim()}
                                    style={{ width: 48, height: 48, borderRadius: '50%', background: input.trim() ? activeColor : 'var(--bg-card)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() ? `0 4px 16px ${activeColor}50` : 'none', transform: input.trim() ? 'scale(1)' : 'scale(0.95)' }}
                                    title="Send message">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? 'white' : 'var(--text-muted)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty state when no contact selected */
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: 'var(--text-muted)', background: 'var(--bg-primary)' }}>
                        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px dashed var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: 8 }}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg></div>
                        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Your Messages</p>
                        <p style={{ fontSize: 14, textAlign: 'center', lineHeight: 1.7, maxWidth: 320 }}>
                            Send private messages to developers, designers, and product builders in the TechOrbit network.
                        </p>
                        <button onClick={() => setNewChatOpen(true)}
                            style={{ marginTop: 8, padding: '12px 32px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 20px rgba(108,99,255,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> New Message
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes typing-dot {
                    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, border: '4px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>}>
            <MessagesContent />
        </Suspense>
    );
}
