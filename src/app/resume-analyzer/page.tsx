'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
type ChatMessage = { role: 'user' | 'ai'; text: string; time: string; provider?: string };
type AIProvider = 'gemini' | 'openai';

const quickChips = [
    'How do I transition to AI/ML? 🤖',
    'How to negotiate salary in India? 💰',
    'Best companies for freshers 2026 🎓',
    'Review my resume for ATS 📄',
    'Top companies with highest ₹ CTC 🏆',
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface AnalysisResult {
    score: number;
    strengths: string[];
    gaps: string[];
    matchedRoles: { role: string; match: number; salary: string }[];
    roadmap: { step: number; title: string; status: string; skills: string[]; time: string; details?: string[] }[];
    learningPlan: { icon: string; title: string; provider: string; duration: string; priority: string; match: number }[];
    certifications: { name: string; platform: string; relevance: string; url: string }[];
}

// ── Animated score ring ───────────────────────────────────────────────────────
function ScoreRing({ score, size = 180 }: { score: number; size?: number }) {
    const r = (size - 20) / 2;
    const circ = 2 * Math.PI * r;
    const filled = circ * score / 100;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : '#ef4444';
    const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={12} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={12}
                    strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <span style={{ fontSize: size * 0.26, fontWeight: 900, letterSpacing: '-0.04em', color }}>{score}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ATS Score</span>
                <span style={{ fontSize: 12, fontWeight: 700, color, marginTop: 2 }}>{label}</span>
            </div>
        </div>
    );
}

// ── Keyword bar ───────────────────────────────────────────────────────────────
function MatchBar({ label, value, salary, color }: { label: string; value: number; salary: string; color: string }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>{salary}</span>
                    <span style={{ color, fontWeight: 800 }}>{value}%</span>
                </div>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: 'var(--bg-card)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <div style={{ height: '100%', borderRadius: 4, width: `${value}%`, background: `linear-gradient(90deg, ${color}99, ${color})`, transition: 'width 1s ease 0.3s' }} />
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResumeAnalyzerPage() {
    const [dragging, setDragging] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [fileName, setFileName] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'roadmap' | 'courses' | 'chat'>('overview');
    const [expandedStep, setExpandedStep] = useState<number | null>(null);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const [aiProvider, setAiProvider] = useState<AIProvider>('gemini');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'ai', text: "Namaste! 🙏 I'm **TechOrbit AI** - powered by Google Gemini & ChatGPT, trained for India's tech job market.\n\nAsk me anything: salary negotiation, company comparisons, DSA prep, resume tips, FAANG India interviews, or career transitions.\n\nPick a question below or type your own! 👇", time: 'now', provider: 'TechOrbit AI' },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || typing) return;
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const updatedMessages = [...messages, { role: 'user' as const, text, time: now }];
        setMessages(updatedMessages);
        setInput('');
        setTyping(true);
        try {
            const apiMessages = updatedMessages
                .filter(m => m.role !== 'ai' || updatedMessages.indexOf(m) > 0)
                .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages, provider: aiProvider }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.reply || 'Sorry, I could not get a response. Please try again.',
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                provider: data.provider,
            }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'Network error. Please check your connection and try again.', time: now }]);
        } finally {
            setTyping(false);
        }
    };

    const analyze = useCallback(async (file?: File) => {
        setError('');
        setAnalyzing(true);
        setResult(null);
        if (file) setFileName(file.name);

        try {
            if (file) {
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/analyze-resume', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.error) { setError(data.error); setAnalyzing(false); return; }
                setResult(data);
            } else {
                // Demo mode
                await new Promise(r => setTimeout(r, 2400));
                setFileName('demo_resume.pdf');
                setResult({
                    score: 74,
                    strengths: [
                        'Strong Python & data analysis skills (Pandas, NumPy)',
                        'Cloud experience — AWS basics mentioned',
                        'ATS-friendly bullet-point structure',
                        'Quantified achievements in 3 of 5 bullets',
                        'Clean single-column format — passes most parsers',
                    ],
                    gaps: [
                        'No System Design or scalability signals',
                        'PyTorch / Deep Learning not mentioned',
                        'GitHub / open-source projects missing',
                        'LeetCode / DSA proficiency not demonstrated',
                        'Missing STAR-format behavioral examples',
                    ],
                    matchedRoles: [
                        { role: 'Data Scientist (Unicorn — Meesho, Zepto)', match: 88, salary: '₹25L–₹40L' },
                        { role: 'ML Engineer (Flipkart / Swiggy)', match: 76, salary: '₹35L–₹55L' },
                        { role: 'Backend Engineer (SDE-2)', match: 71, salary: '₹22L–₹38L' },
                        { role: 'AI Engineer (FAANG India)', match: 64, salary: '₹55L–₹90L' },
                        { role: 'Data Analyst (Fintech)', match: 92, salary: '₹12L–₹22L' },
                    ],
                    roadmap: [
                        { step: 1, title: 'Strengthen DSA & Problem Solving', status: 'active', skills: ['Arrays', 'Trees', 'Graphs', 'DP'], time: '6 weeks', details: ['Solve 150+ LeetCode Medium problems', 'Focus on sliding window, two-pointer, BFS/DFS', 'Mock interviews on Pramp or Interview Kickstart'] },
                        { step: 2, title: 'Deep Learning Foundations', status: 'upcoming', skills: ['PyTorch', 'CNNs', 'Transformers', 'HuggingFace'], time: '8 weeks', details: ['Complete Fast.ai Part 1 (free)', 'Build 2 end-to-end projects', 'Publish models on HuggingFace Hub'] },
                        { step: 3, title: 'System Design for Scale', status: 'upcoming', skills: ['HLD', 'LLD', 'Kafka', 'Redis', 'Sharding'], time: '4 weeks', details: ['Study ByteByteGo patterns', 'Design YouTube, WhatsApp, Uber systems', 'Practice Excalidraw diagrams'] },
                        { step: 4, title: 'Build Portfolio Projects', status: 'upcoming', skills: ['GitHub', 'FastAPI', 'Docker', 'AWS'], time: '6 weeks', details: ['3 end-to-end ML/backend projects on GitHub', 'Deploy at least 1 live — Vercel, Railway, or EC2', 'Write a technical blog post for each'] },
                        { step: 5, title: 'Cloud & DevOps', status: 'upcoming', skills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'], time: '5 weeks', details: ['Get AWS Cloud Practitioner cert', 'Build a simple K8s cluster on EKS', 'Set up GitHub Actions CI/CD pipeline'] },
                        { step: 6, title: 'Interview Preparation', status: 'upcoming', skills: ['STAR Method', 'HR Rounds', 'Negotiation'], time: '3 weeks', details: ['Prepare 10 STAR stories', 'Practice salary negotiation scripts', 'Research ₹ CTC benchmarks on AmbitionBox'] },
                    ],
                    learningPlan: [
                        { icon: '🔥', title: 'Practical Deep Learning for Coders', provider: 'Fast.ai (Free)', duration: '2 months', priority: 'High', match: 96 },
                        { icon: '📘', title: 'Deep Learning Specialization (Andrew Ng)', provider: 'Coursera / deeplearning.ai', duration: '4 months', priority: 'High', match: 93 },
                        { icon: '🤖', title: 'LLM Engineering & Prompt Design', provider: 'HuggingFace (Free)', duration: '6 weeks', priority: 'Medium', match: 88 },
                        { icon: '⚡', title: 'System Design Interview Prep', provider: 'ByteByteGo', duration: '6 weeks', priority: 'High', match: 91 },
                        { icon: '🎯', title: 'DSA for Competitive Programming', provider: 'LeetCode Premium', duration: '3 months', priority: 'High', match: 94 },
                    ],
                    certifications: [
                        { name: 'AWS Certified Cloud Practitioner', platform: 'Amazon Web Services', relevance: '95%', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
                        { name: 'Google Data Analytics Professional', platform: 'Google / Coursera', relevance: '92%', url: 'https://www.coursera.org/professional-certificates/google-data-analytics' },
                        { name: 'Deep Learning Specialization', platform: 'deeplearning.ai / Coursera', relevance: '90%', url: 'https://www.coursera.org/specializations/deep-learning' },
                    ],
                });
            }
        } catch {
            setError('Server error. Please check your connection and try again.');
        }
        setAnalyzing(false);
    }, []);

    const onFile = (file: File) => {
        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF document.');
            return;
        }
        analyze(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
    };

    const TABS = [
        { key: 'overview', label: '📊 Overview' },
        { key: 'roles', label: '🎯 Role Match' },
        { key: 'roadmap', label: '🗺 Roadmap' },
        { key: 'courses', label: '📚 Learning Plan' },
        { key: 'chat', label: '🤖 AI Chat' },
    ] as const;

    const scoreColor = result ? (result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#f97316' : '#ef4444') : '#6c63ff';

    // ── UPLOAD SCREEN ──────────────────────────────────────────────────────────
    if (!result && !analyzing) {
        return (
            <>
                <style>{`
                    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                    @keyframes spin { to{transform:rotate(360deg)} }
                    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                    .feature-card:hover { transform: translateY(-4px); border-color: var(--accent-primary) !important; }
                    .feature-card { transition: all 0.25s ease; }
                `}</style>

                {/* Header */}
                <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 48px', position: 'relative', overflow: 'hidden' }}>
                    <div className="orb orb-purple" style={{ position: 'absolute', top: -100, left: -60, opacity: 0.5 }} />
                    <div className="orb orb-blue" style={{ position: 'absolute', top: -40, right: -80, opacity: 0.4 }} />
                    <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', marginBottom: 20 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✦ AI-Powered · Gemini + GPT-4</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.08, marginBottom: 16 }}>
                            Resume <span className="gradient-text">Analyzer</span>
                        </h1>
                        <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                            Get your ATS score, skill gaps, role matches, salary benchmarks, and a personalized career roadmap — in seconds.
                        </p>
                    </div>
                </div>

                <div className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 760 }}>
                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        onClick={() => fileRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragging ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                            borderRadius: 24, padding: '64px 40px', textAlign: 'center',
                            background: dragging ? 'rgba(108,99,255,0.07)' : 'var(--bg-card)',
                            cursor: 'pointer', transition: 'all 0.25s', marginBottom: 20,
                            boxShadow: dragging ? 'var(--shadow-glow)' : 'none',
                        }}>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
                        <div style={{ fontSize: 64, marginBottom: 20, animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>📄</div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Drop your resume here</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 6 }}>PDF · DOC · DOCX up to 10 MB</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 28 }}>Scanned by AI — your data is never stored</p>
                        <button className="btn btn-primary btn-lg" style={{ pointerEvents: 'none' }}>Upload Resume</button>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '14px 20px', color: '#ef4444', fontSize: 14, marginBottom: 20 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>— or try with a sample —</p>
                        <button className="btn btn-ghost btn-lg" onClick={() => analyze()} style={{ gap: 8 }}>
                            ✨ Analyze Demo Resume
                        </button>
                    </div>

                    {/* Feature cards */}
                    <div className="grid-3">
                        {[
                            { icon: '⚡', title: 'ATS Score', desc: 'Instant score out of 100 — see if you pass Naukri, LinkedIn & Instahyre filters.' },
                            { icon: '🎯', title: 'Role Matching', desc: 'Match % against 5 real Indian tech roles with ₹ CTC salary benchmarks.' },
                            { icon: '🗺', title: 'Career Roadmap', desc: '6-step personalized learning roadmap to fill skill gaps and level up your career.' },
                            { icon: '📚', title: 'Course Plan', desc: 'Top 5 Coursera / Fast.ai / HuggingFace courses matched to your resume gaps.' },
                            { icon: '🥇', title: 'Certifications', desc: 'Exact certification links from AWS, Google, and Coursera to boost your profile.' },
                            { icon: '🤖', title: 'Powered by AI', desc: 'Gemini Pro + GPT-4 trained on India\'s tech job market for accurate analysis.' },
                        ].map(f => (
                            <div key={f.title} className="card feature-card" style={{ padding: 24 }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    // ── LOADING ────────────────────────────────────────────────────────────────
    if (analyzing) {
        const steps = [
            'Parsing resume content…',
            'Checking ATS compatibility…',
            'Scanning for skill keywords…',
            'Matching against Indian job market…',
            'Generating career roadmap…',
            'Calculating salary benchmarks…',
        ];
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: 40 }}>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes blink{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
                <div style={{ width: 72, height: 72, border: '4px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Analyzing {fileName || 'your resume'}…</h2>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Powered by Gemini AI · Usually takes 5–10 seconds</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, width: '100%' }}>
                    {steps.map((s, i) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)', animation: `blink 1.5s ease ${i * 0.4}s infinite` }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                            {s}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── RESULTS ────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                @keyframes spin{to{transform:rotate(360deg)}}
                .tab-btn:hover{background:var(--bg-card)!important;}
                .step-card:hover{border-color:var(--accent-primary)!important;}
            `}</style>

            {/* Results header */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 36px' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <p className="section-label">Resume Analysis Complete</p>
                            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 4 }}>
                                {fileName || 'Demo Resume'}
                            </h1>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Analyzed by Gemini AI · India Market · 2026</p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-ghost" onClick={() => { setResult(null); setFileName(''); setError(''); }}>← Upload New</button>
                            <Link href="/jobs" className="btn btn-primary" style={{ textDecoration: 'none' }}>Find Matching Jobs →</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 36, paddingBottom: 80 }}>

                {/* Score + quick stats hero */}
                <div className="glass-card" style={{ padding: '36px 40px', marginBottom: 32, animation: 'fadeUp 0.4s ease', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center' }}>
                    <ScoreRing score={result!.score} size={190} />
                    <div style={{ flex: 1, minWidth: 260 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
                            {[
                                { label: 'Strengths', value: result!.strengths.length, icon: '✅', color: '#22c55e' },
                                { label: 'Skill Gaps', value: result!.gaps.length, icon: '⚠️', color: '#f97316' },
                                { label: 'Role Matches', value: result!.matchedRoles.length, icon: '🎯', color: '#6c63ff' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center', padding: '18px 8px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, letterSpacing: '-0.04em' }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                        {/* Top role match */}
                        <div style={{ padding: '14px 18px', borderRadius: 12, background: `${scoreColor}12`, border: `1px solid ${scoreColor}30` }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Best Role Match</p>
                            <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{result!.matchedRoles[0]?.role}</p>
                            <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>{result!.matchedRoles[0]?.salary} · {result!.matchedRoles[0]?.match}% match</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 36, gap: 4 }}>
                    {TABS.map(t => (
                        <button key={t.key} className="tab-btn" onClick={() => setActiveTab(t.key)}
                            style={{ padding: '12px 22px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, borderBottom: activeTab === t.key ? '2px solid var(--accent-primary)' : '2px solid transparent', color: activeTab === t.key ? 'var(--accent-primary)' : 'var(--text-secondary)', marginBottom: -1, borderRadius: '8px 8px 0 0', transition: 'all 0.2s' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                    <div style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div className="grid-2" style={{ marginBottom: 28 }}>
                            {/* Strengths */}
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    ✅ Strengths Detected
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {result!.strengths.map(s => (
                                        <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#22c55e', fontSize: 12, fontWeight: 900, marginTop: 1 }}>✓</div>
                                            <span>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Gaps */}
                            <div className="glass-card" style={{ padding: 28 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: '#f97316', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    ⚠️ Skill Gaps to Fix
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {result!.gaps.map(g => (
                                        <div key={g} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f97316', fontSize: 12, fontWeight: 900, marginTop: 1 }}>!</div>
                                            <span>{g}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ATS Tips */}
                        <div className="glass-card" style={{ padding: 28 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>💡 Quick ATS Improvements</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                                {[
                                    { tip: 'Use standard section headers (Experience, Education, Skills)', impact: 'High' },
                                    { tip: 'Add quantified metrics — "improved by 40%", "served 1M users"', impact: 'High' },
                                    { tip: 'Include GitHub profile link and 2–3 starred projects', impact: 'High' },
                                    { tip: 'Keep resume to 1 page if under 4 years experience', impact: 'Medium' },
                                    { tip: 'Add LinkedIn URL and keep it keyword-rich', impact: 'Medium' },
                                    { tip: 'Save as PDF — never submit .docx to Naukri/LinkedIn', impact: 'Low' },
                                ].map(t => (
                                    <div key={t.tip} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: t.impact === 'High' ? 'rgba(239,68,68,0.15)' : t.impact === 'Medium' ? 'rgba(249,115,22,0.15)' : 'rgba(34,197,94,0.15)', color: t.impact === 'High' ? '#ef4444' : t.impact === 'Medium' ? '#f97316' : '#22c55e', flexShrink: 0, marginTop: 2 }}>{t.impact}</span>
                                        <span style={{ fontSize: 13, lineHeight: 1.5 }}>{t.tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications at bottom of overview */}
                        {result!.certifications?.length > 0 && (
                            <div style={{ marginTop: 28 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>🥇 Recommended Certifications</h3>
                                <div className="grid-3">
                                    {result!.certifications.map(c => (
                                        <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="card"
                                            style={{ padding: 24, textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.25s', cursor: 'pointer' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.transform = ''; }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏅</div>
                                                <span className="badge badge-purple" style={{ fontSize: 10 }}>{c.relevance} Match</span>
                                            </div>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{c.name}</h4>
                                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>{c.platform}</p>
                                            <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 700 }}>View Certification ↗</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── ROLE MATCH TAB ── */}
                {activeTab === 'roles' && (
                    <div style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div className="glass-card" style={{ padding: 36 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 800 }}>🎯 Indian Market Role Match</h2>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                                    Based on 2026 job listings
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                                {result!.matchedRoles.map((r, i) => {
                                    const c = i === 0 ? '#22c55e' : i === 1 ? '#6c63ff' : i === 2 ? '#38bdf8' : i === 3 ? '#f97316' : '#a78bfa';
                                    return <MatchBar key={r.role} label={r.role} value={r.match} salary={r.salary} color={c} />;
                                })}
                            </div>
                            <div style={{ marginTop: 32, padding: '18px 22px', borderRadius: 14, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)' }}>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    💡 <strong>Tip:</strong> A score of 80%+ means your resume is highly likely to clear the initial ATS filter. Fill the gaps highlighted in the Overview tab to push your top match above 90%.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: 28 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>🔥 Trending Roles You're Close To</h3>
                            <div className="grid-2">
                                {result!.matchedRoles.slice(0, 4).map(r => (
                                    <Link key={r.role} href={`/jobs?q=${encodeURIComponent(r.role.split('(')[0].trim())}`}
                                        className="card" style={{ padding: 22, textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{r.role}</h4>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: r.match >= 80 ? '#22c55e' : r.match >= 65 ? '#f97316' : 'var(--text-muted)' }}>{r.match}%</span>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#22c55e', fontWeight: 700, marginBottom: 10 }}>{r.salary}</p>
                                        <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>View Live Jobs →</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ROADMAP TAB ── */}
                {activeTab === 'roadmap' && (
                    <div style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'var(--border-subtle)', zIndex: 0 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                {result!.roadmap.map(step => (
                                    <div key={step.step} style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 1 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0, background: step.status === 'done' ? '#22c55e' : step.status === 'active' ? 'var(--accent-primary)' : 'var(--bg-card)', border: `2px solid ${step.status === 'done' ? '#22c55e' : step.status === 'active' ? 'var(--accent-primary)' : 'var(--border-medium)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: step.status === 'upcoming' ? 'var(--text-muted)' : 'white', boxShadow: step.status === 'active' ? 'var(--shadow-glow)' : 'none', transition: 'all 0.3s' }}>
                                            {step.status === 'done' ? '✓' : step.step}
                                        </div>
                                        <div className="card step-card" onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                                            style={{ flex: 1, padding: 22, cursor: 'pointer', transition: 'all 0.2s', borderColor: step.status === 'active' ? 'var(--accent-primary)' : undefined, background: step.status === 'active' ? 'rgba(108,99,255,0.04)' : undefined }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <h4 style={{ fontSize: 16, fontWeight: 700 }}>{step.title}</h4>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    <span className={`badge ${step.status === 'done' ? 'badge-green' : step.status === 'active' ? 'badge-purple' : 'badge-blue'}`} style={{ fontSize: 10 }}>
                                                        {step.status === 'done' ? '✓ Done' : step.status === 'active' ? '▶ Current' : '⏳ Upcoming'}
                                                    </span>
                                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>~{step.time}</span>
                                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{expandedStep === step.step ? '▲' : '▼'}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {step.skills.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
                                            </div>
                                            {expandedStep === step.step && step.details && (
                                                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                                                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Key Milestones</p>
                                                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                                        {step.details.map((d, i) => <li key={i} style={{ marginBottom: 5 }}>{d}</li>)}
                                                    </ul>
                                                    {step.status !== 'done' && (
                                                        <Link href="/jobs" className="btn btn-primary btn-sm" style={{ marginTop: 16, textDecoration: 'none', display: 'inline-block' }}>Find Related Jobs →</Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── COURSES TAB ── */}
                {activeTab === 'courses' && (
                    <div style={{ animation: 'fadeUp 0.3s ease' }}>
                        <div className="grid-2" style={{ marginBottom: 28 }}>
                            {result!.learningPlan.map(c => (
                                <div key={c.title} className="card" style={{ padding: 24, transition: 'all 0.2s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.transform = ''; }}>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                        <div style={{ fontSize: 36, flexShrink: 0 }}>{c.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                                                <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>{c.title}</h4>
                                                <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 800, flexShrink: 0 }}>{c.match}%</span>
                                            </div>
                                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>
                                                {c.provider} · {c.duration}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span className={`badge ${c.priority === 'High' ? 'badge-pink' : 'badge-blue'}`} style={{ fontSize: 10 }}>{c.priority} Priority</span>
                                                <button className="btn btn-primary btn-sm">Start →</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="glass-card" style={{ padding: 28 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>📖 Free Learning Resources</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'LeetCode — DSA Practice', url: 'https://leetcode.com', badge: 'Free + Premium', color: '#FFA116' },
                                    { label: 'Fast.ai — Practical Deep Learning', url: 'https://fast.ai', badge: '100% Free', color: '#22c55e' },
                                    { label: 'HuggingFace — NLP & LLM Courses', url: 'https://huggingface.co/learn', badge: '100% Free', color: '#22c55e' },
                                    { label: 'ByteByteGo — System Design', url: 'https://bytebytego.com', badge: 'Paid', color: '#6c63ff' },
                                    { label: 'Naukri Learning — Indian Market Certs', url: 'https://learning.naukri.com', badge: 'Free Trials', color: '#38bdf8' },
                                ].map(r => (
                                    <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = r.color; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</span>
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: r.color, background: `${r.color}18`, padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>{r.badge}</span>
                                            <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>↗</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom CTA */}
                {activeTab !== 'chat' && (
                    <div style={{ marginTop: 48, textAlign: 'center' }}>
                        <div className="glass-card" style={{ padding: '40px 32px', display: 'inline-block', maxWidth: 560 }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Ready to Apply?</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                                Browse live jobs from LinkedIn, Indeed, Glassdoor, Naukri and 10+ more sources — filtered by your matched roles.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href={`/jobs?q=${encodeURIComponent(result!.matchedRoles[0]?.role?.split('(')[0]?.trim() || '')}`} className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                                    Find {result!.matchedRoles[0]?.role?.split('(')[0]?.trim()} Jobs →
                                </Link>
                                <button className="btn btn-ghost btn-lg" onClick={() => { setResult(null); setFileName(''); }}>Analyze Another Resume</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── AI CHAT TAB ── */}
                {activeTab === 'chat' && (
                    <div style={{ animation: 'fadeUp 0.3s ease', maxWidth: 780, margin: '0 auto' }}>
                        {/* Chat window */}
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            {/* Chat header */}
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15 }}>TechOrbit AI Career Advisor</div>
                                    <div style={{ fontSize: 12, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
                                        Online · India Tech Specialist 2026
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by:</span>
                                    {(['gemini', 'openai'] as AIProvider[]).map(p => (
                                        <button key={p} onClick={() => setAiProvider(p)}
                                            style={{
                                                padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                                                background: aiProvider === p ? (p === 'gemini' ? '#4285f4' : '#10a37f') : 'var(--bg-card)',
                                                color: aiProvider === p ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s'
                                            }}>
                                            {p === 'gemini' ? '✦ Gemini' : '✦ ChatGPT'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ height: 420, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                                        {msg.role === 'ai' && (
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
                                        )}
                                        <div style={{ maxWidth: '75%' }}>
                                            <div style={{
                                                padding: '12px 16px',
                                                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                                                border: msg.role === 'ai' ? '1px solid var(--border-subtle)' : 'none',
                                                fontSize: 14,
                                                lineHeight: 1.65,
                                                whiteSpace: 'pre-line',
                                                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                            }}>
                                                {msg.text}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                                {typing && (
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
                                        <div style={{ padding: '12px 18px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', gap: 6, alignItems: 'center' }}>
                                            {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)', display: 'inline-block', animation: `orb-float 1s ease-in-out infinite`, animationDelay: `${i * 0.2}s`, transform: 'none' }} />)}
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Quick chips */}
                            {messages.length < 3 && (
                                <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {quickChips.map(c => (
                                        <button key={c} onClick={() => sendMessage(c)} className="chip" style={{ fontSize: 12 }}>{c}</button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10 }}>
                                <input
                                    className="input"
                                    placeholder="Ask about salaries, companies, transitions, resume tips..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                                    disabled={typing}
                                />
                                <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={typing || !input.trim()} style={{ flexShrink: 0 }}>
                                    {typing ? '⌛' : '↗️'}
                                </button>
                            </div>
                        </div>

                        {/* Re-open chips after a while */}
                        {messages.length >= 3 && (
                            <div style={{ marginTop: 16 }}>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>💡 Quick questions:</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {quickChips.map(c => (
                                        <button key={c} onClick={() => sendMessage(c)} className="chip" style={{ fontSize: 12 }}>{c}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
