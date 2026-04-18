'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Startups', 'AI & ML', 'Scams & Frauds', 'Jobs & Careers', 'Gaming', 'Mobile', 'Upcoming Launches', 'PC & Hardware', 'Cloud', 'Policy', 'Open Source'];
const CATEGORY_COLORS: Record<string, string> = { 'Startups': 'badge-purple', 'AI & ML': 'badge-purple', 'Scams & Frauds': 'badge-orange', 'Jobs & Careers': 'badge-green', 'Gaming': 'badge-pink', 'Mobile': 'badge-blue', 'Upcoming Launches': 'badge-orange', 'PC & Hardware': 'badge-purple', 'Cloud': 'badge-blue', 'Policy': 'badge-orange', 'Open Source': 'badge-green' };

interface Article {
    id: string; title: string; description: string; category: string;
    source_id: string; source_url: string; pubDate: string;
    link: string; image_url: string | null; trending: boolean; views: string;
}

export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [tweets, setTweets] = useState<any[]>([]);
    const [loadingTweets, setLoadingTweets] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [apiSource, setApiSource] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => { fetchNews(activeCategory, '', 1); }, [activeCategory]);
    useEffect(() => { fetchTweets(); }, []);

    const fetchTweets = async () => {
        try {
            const res = await fetch('/api/twitter');
            const data = await res.json();
            setTweets(data.tweets || []);
        } catch { setTweets([]); }
        finally { setLoadingTweets(false); }
    };

    const fetchNews = async (cat: string, q: string, pg: number, append = false) => {
        if (!append) setLoading(true);
        else setLoadingMore(true);
        try {
            const params = new URLSearchParams({ category: cat, q, page: String(pg) });
            const res = await fetch('/api/news?' + params);
            const data = await res.json();
            setArticles(prev => append ? [...prev, ...data.articles] : data.articles || []);
            setHasMore(data.hasMore || false);
            setApiSource(data.source || '');
            setPage(pg);
        } catch { if (!append) setArticles([]); }
        finally { setLoading(false); setLoadingMore(false); }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNews(activeCategory, search, 1);
        setRefreshing(false);
    };

    const filtered = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));
    const featured = filtered[0];

    return (
        <>
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 28px' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span>📰</span>
                        <p className="section-label" style={{ margin: 0 }}>Live from Inc42 · YourStory · ET Tech · X · RSS feeds</p>
                    </div>
                    <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 20 }}>India Tech News</h1>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
                            <input className="input" style={{ paddingLeft: 42 }} placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="btn btn-ghost" style={{ padding: '0 14px' }} onClick={handleRefresh} title="Refresh" disabled={refreshing}>
                            <span style={{ display: 'inline-block', animation: refreshing ? 'spin 0.8s linear infinite' : 'none', fontSize: 20 }}>🔄</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
                {/* Category chips */}
                <div className="scroll-row" style={{ marginBottom: 28 }}>
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setActiveCategory(c)} className={`chip ${activeCategory === c ? 'active' : ''}`} style={{ flexShrink: 0 }}>
                            {c}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
                    <div>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="card" style={{ padding: 24 }}>
                                        <div style={{ height: 18, background: 'var(--bg-secondary)', borderRadius: 6, width: '65%', marginBottom: 12, animation: 'skeleton-loading 1.5s infinite' }} />
                                        <div style={{ height: 13, background: 'var(--bg-secondary)', borderRadius: 6, width: '88%', animation: 'skeleton-loading 1.5s infinite' }} />
                                    </div>
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <div style={{ fontSize: 56, marginBottom: 16 }}>📰</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No articles found</h3>
                                <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear filters</button>
                            </div>
                        ) : (
                            <>
                                {/* Featured */}
                                {featured && (
                                    <div className="glass-card" style={{ padding: 28, marginBottom: 18, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                                        onClick={() => setExpanded(expanded === featured.id ? null : featured.id)}>
                                        <div className="orb orb-purple" style={{ position: 'absolute', top: -60, right: -60, opacity: 0.12 }} />
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                                                <span className="badge badge-purple">Top Story</span>
                                                <span className={`badge ${CATEGORY_COLORS[featured.category] || 'badge-blue'}`} style={{ fontSize: 10 }}>{featured.category}</span>
                                                {featured.trending && <span className="badge badge-orange" style={{ fontSize: 10 }}>Trending</span>}
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{featured.views} views</span>
                                            </div>
                                            {featured.image_url && (
                                                <img src={featured.image_url} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 16 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                            )}
                                            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.35 }}>{featured.title}</h2>
                                            {expanded === featured.id ? (
                                                <>
                                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 18 }}>{featured.description}</p>
                                                    <div style={{ display: 'flex', gap: 10 }}>
                                                        <a href={featured.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>
                                                            Read on {featured.source_id} →
                                                        </a>
                                                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setExpanded(null); }}>Collapse ↑</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 12 } as React.CSSProperties}>{featured.description}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{featured.source_id}</span>
                                                        <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 700 }}>Read more ↓</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Rest */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {filtered.slice(1).map(article => (
                                        <div key={article.id} className="card" style={{ padding: '18px 20px', cursor: 'pointer' }}
                                            onClick={() => setExpanded(expanded === article.id ? null : article.id)}>
                                            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                                {article.image_url ? (
                                                    <img src={article.image_url} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                ) : (
                                                    <div style={{ width: 50, height: 50, borderRadius: 10, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, border: '1px solid var(--border-subtle)' }}>
                                                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)' }}>{article.category.substring(0, 2).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', gap: 6, marginBottom: 7 }}>
                                                        <span className={`badge ${CATEGORY_COLORS[article.category] || 'badge-blue'}`} style={{ fontSize: 9 }}>{article.category}</span>
                                                        {article.trending && <span className="badge badge-orange" style={{ fontSize: 9 }}>Trending</span>}
                                                    </div>
                                                    <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{article.title}</h3>
                                                    {expanded === article.id ? (
                                                        <>
                                                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 12 }}>{article.description}</p>
                                                            <div style={{ display: 'flex', gap: 8 }}>
                                                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>
                                                                    Read Full Article →
                                                                </a>
                                                                <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setExpanded(null); }}>Collapse ↑</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{article.source_id} &bull; {article.views}</span>
                                                            <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>Expand ↓</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More */}
                                <div style={{ textAlign: 'center', marginTop: 28 }}>
                                    <button className="btn btn-ghost" style={{ minWidth: 200 }} disabled={loadingMore || !hasMore}
                                        onClick={() => fetchNews(activeCategory, search, page + 1, true)}>
                                        {loadingMore ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                                <span style={{ width: 14, height: 14, border: '2px solid var(--border-medium)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                                Loading more...
                                            </span>
                                        ) : hasMore ? 'Load More News ↓' : 'All articles loaded'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="glass-card" style={{ padding: 22 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Trending on X</h3>
                                <span style={{ fontSize: 18 }}>🐦</span>
                            </div>
                            {loadingTweets ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ height: 60, background: 'var(--bg-secondary)', borderRadius: 8, animation: 'skeleton-loading 1.5s infinite' }} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {tweets.slice(0, 4).map(t => (
                                        <div key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                {t.authorAvatar ? (
                                                    <img src={t.authorAvatar} alt={t.authorName} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                                                ) : (
                                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                                                        {t.authorName.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.1 }}>{t.authorName}</p>
                                                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>@{t.authorHandle}</p>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 8 }}>{t.text}</p>
                                            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                                                <span>❤️ {t.metrics.likes}</span>
                                                <span>🔁 {t.metrics.retweets}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="glass-card" style={{ padding: 22 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Daily Digest</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>Top 5 Indian tech stories every morning.</p>
                            {subscribed ? (
                                <p style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: 13, textAlign: 'center' }}>Subscribed!</p>
                            ) : (
                                <>
                                    <input className="input" placeholder="you@gmail.com" style={{ marginBottom: 8 }} value={email} onChange={e => setEmail(e.target.value)} />
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => email && setSubscribed(true)}>Subscribe Free</button>
                                </>
                            )}
                        </div>

                        <div className="glass-card" style={{ padding: 22 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Topics</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {CATEGORIES.slice(1).map(c => (
                                    <button key={c} onClick={() => setActiveCategory(c)} className={`chip ${activeCategory === c ? 'active' : ''}`} style={{ fontSize: 11 }}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
        @keyframes skeleton-loading { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
      `}</style>
        </>
    );
}
