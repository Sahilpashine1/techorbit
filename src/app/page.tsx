'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const trendingJobs = [
  { title: 'Senior Backend Engineer', company: 'Razorpay', location: 'Bengaluru', salary: '₹40L-₹65L', tags: ['Java', 'Kafka', 'AWS'], badge: 'Hot 🔥' },
  { title: 'SDE-3 (ML Platform)', company: 'Flipkart', location: 'Bengaluru', salary: '₹55L-₹80L', tags: ['Python', 'Spark', 'MLOps'], badge: 'Remote' },
  { title: 'Full Stack Engineer', company: 'CRED', location: 'Bengaluru', salary: '₹30L-₹50L', tags: ['React', 'Node.js', 'Go'], badge: 'New ✨' },
  { title: 'Data Engineer', company: 'PhonePe', location: 'Pune', salary: '₹25L-₹40L', tags: ['Scala', 'Flink', 'BigQuery'], badge: 'Top Pick' },
];


const skills = [
  { skill: 'AI/ML Engineering', growth: 94, color: '#6c63ff' },
  { skill: 'Cloud (AWS/Azure/GCP)', growth: 87, color: '#38bdf8' },
  { skill: 'System Design & DSA', growth: 82, color: '#34d399' },
  { skill: 'DevOps / SRE', growth: 75, color: '#f472b6' },
  { skill: 'React / Next.js', growth: 70, color: '#fb923c' },
];

const features = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: 'AI Career Guidance', desc: "Upload your resume and get instant AI analysis, career roadmaps, and personalized learning plans.", href: '/career-guidance', color: '#6c63ff' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, title: 'India + Global Job Search', desc: 'Real jobs from LinkedIn, Naukri, Indeed, Glassdoor — India and abroad.', href: '/jobs', color: '#38bdf8' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>, title: 'Tech News India', desc: "Stay ahead with curated news from top tech publications and sources.", href: '/news', color: '#34d399' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>, title: 'Smart Networking', desc: 'Connect your LinkedIn, GitHub, X, and other profiles. Find mentors.', href: '/network', color: '#f472b6' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>, title: 'Skill Demand Tracker', desc: 'See which technologies are most demanded at FAANG India and unicorns.', href: '/dashboard', color: '#fb923c' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, title: 'AI Job Matching', desc: 'Our AI matches you to roles based on your skills and ₹ CTC expectations.', href: '/jobs', color: '#a78bfa' },
];

const trendingSearches = ['SDE-2 Bengaluru', 'Remote ML Engineer', 'Fresher 2026', 'DevOps Hyderabad', 'USA Remote', 'UK Tech Jobs', 'Singapore SDE'];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingNews, setTrendingNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news?category=All')
      .then(res => res.json())
      .then(data => {
          if (data?.articles) setTrendingNews(data.articles.slice(0, 4));
      }).catch(() => {});
  }, []);

  const handleSearch = () => {
    const path = searchQuery.trim() ? `/jobs?q=${encodeURIComponent(searchQuery.trim())}` : '/jobs';
    router.push(path);
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 80 }}>
        <div className="orb orb-purple" style={{ top: -100, left: -100, position: 'absolute' }} />
        <div className="orb orb-blue" style={{ top: 100, right: -80, position: 'absolute' }} />
        <div className="orb orb-green" style={{ bottom: -50, left: '40%', position: 'absolute' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', marginBottom: 28 }}>
            <span style={{ fontSize: 12, color: 'var(--accent-secondary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>🇮🇳 India&apos;s Tech Career Platform</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, marginBottom: 24, maxWidth: 900, margin: '0 auto 24px' }}>
            India&apos;s Smartest{' '}
            <span className="gradient-text">Tech Career</span>
            <br />Platform
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            AI-powered job search, real-time tech news, career guidance, and smart networking — for Indian developers, freshers, and tech leaders.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/jobs" className="btn btn-primary btn-lg">Explore Jobs 💼</Link>
            <Link href="/career-guidance" className="btn btn-ghost btn-lg">AI Career Guidance →</Link>
          </div>

          {/* Working Search Bar */}
          <div style={{ maxWidth: 700, margin: '0 auto', background: 'var(--bg-glass)', border: '1px solid var(--bg-glass-border)', borderRadius: 'var(--radius-xl)', padding: '8px 8px 8px 20px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-glow)' }}>
            <span style={{ fontSize: 20, display: 'flex' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
            <input
              placeholder='Search jobs, companies, skills, location... (e.g. "React Bengaluru", "USA Remote SDE")'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}
            />
            <button onClick={handleSearch} className="btn btn-primary" style={{ flexShrink: 0, borderRadius: 'var(--radius-lg)' }}>Search</button>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: '28px' }}>Trending:</span>
            {trendingSearches.map(s => (
              <button key={s} onClick={() => router.push(`/jobs?q=${encodeURIComponent(s)}`)}
                className="chip" style={{ fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>{s}</button>
            ))}
          </div>
        </div>
      </section>



      {/* ===== FEATURES ===== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="section-label">Built for Bharat&apos;s Best</p>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>Your Unfair Career Advantage</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>Six powerful AI tools designed for India&apos;s booming tech ecosystem.</p>
          </div>
          <div className="grid-3">
            {features.map(f => (
              <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 28, height: '100%', cursor: 'pointer' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 20, border: `1px solid ${f.color}30` }}>{f.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING JOBS ===== */}
      <section className="section" style={{ background: 'var(--bg-secondary)', marginInline: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <div>
              <p className="section-label">Hot Right Now</p>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 0' }}>Trending Jobs</h2>
            </div>
            <Link href="/jobs" className="btn btn-ghost">View All Jobs →</Link>
          </div>
          <div className="grid-2">
            {trendingJobs.map((job, i) => (
              <Link key={i} href={`/jobs?q=${encodeURIComponent(job.title)}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 24, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{job.title}</h3>
                    <span className="badge badge-purple" style={{ fontSize: 10, flexShrink: 0 }}>{job.badge}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
                    {job.company} &bull; {job.location} &bull; <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{job.salary}</span>
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {job.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING NEWS ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <div>
              <p className="section-label">India Tech Pulse</p>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 0' }}>Latest News</h2>
            </div>
            <Link href="/news" className="btn btn-ghost">All News →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trendingNews.length > 0 ? trendingNews.map((n, i) => (
              <Link key={i} href="/news" style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {n.image_url ? <img src={n.image_url} alt={n.title} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{n.title}</h4>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className="badge badge-blue" style={{ fontSize: 10 }}>{n.category}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.source} &bull; {n.time}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--text-muted)', flexShrink: 0 }}>→</span>
                </div>
              </Link>
            )) : (
              // Skeletons
              [1,2,3,4].map(i => (
                <div key={i} className="card" style={{ padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-glass)', animation: 'skeleton-loading 1.5s infinite' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 16, width: '80%', background: 'var(--bg-glass)', borderRadius: 4, animation: 'skeleton-loading 1.5s infinite', marginBottom: 8 }} />
                    <div style={{ height: 12, width: '40%', background: 'var(--bg-glass)', borderRadius: 4, animation: 'skeleton-loading 1.5s infinite' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== SKILL TRACKER ===== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <p className="section-label">Skill Demand 2026</p>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>What India is Hiring For</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                Real-time demand signals from latest job listings across India.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {skills.map(s => (
                <div key={s.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{s.skill}</span>
                    <span style={{ fontSize: 13, color: s.color, fontWeight: 700 }}>{s.growth}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-card)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: s.color, width: `${s.growth}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
             <Link href="/dashboard" className="btn btn-ghost" style={{ border: '1px solid var(--border-medium)' }}>See Full Analysis →</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ padding: '60px 40px', position: 'relative', overflow: 'hidden', maxWidth: 700, margin: '0 auto' }}>
            <div className="orb orb-purple" style={{ position: 'absolute', top: -80, right: -80, opacity: 0.3 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
                Ready to Level Up Your Career?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
                Join Indian tech professionals already using TechOrbit. Free forever.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
                <Link href="/jobs" className="btn btn-ghost btn-lg">Browse Jobs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
