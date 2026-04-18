'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const LOCATION_SUGGESTIONS = [
    'All', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Delhi NCR', 'Remote',
    'Noida', 'Gurgaon', 'Kolkata', 'Ahmedabad',
    // International
    'USA', 'USA Remote', 'New York', 'San Francisco', 'Seattle',
    'UK', 'London', 'UK Remote', 'Singapore', 'Canada', 'Germany', 'Australia', 'Netherlands', 'Dubai'
];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Fresher'];
const EXP_LEVELS = ['All', 'Fresher (0-1yr)', 'Junior (1-3yr)', 'Mid (3-6yr)', 'Senior (6yr+)'];
const SOURCE_ICONS: Record<string, string> = { LinkedIn: '💼', Indeed: '🔍', Glassdoor: '🏢', Naukri: '📋', ZipRecruiter: '⚡', default: '🌐' };

interface Job {
    id: string; title: string; company: string; location: string; salary: string;
    type: string; remote: boolean; tags: string[]; posted: string; description: string;
    applicants: number; logo: string; url: string; source: string; companyLogo: string | null;
}

function JobsContent() {
    const searchParams = useSearchParams();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [apiSource, setApiSource] = useState('');
    const [sourceDetail, setSourceDetail] = useState('');
    const [totalFound, setTotalFound] = useState(0);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('All');
    const [jobType, setJobType] = useState('All');
    const [expLevel, setExpLevel] = useState('All');
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [worldwide, setWorldwide] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchJobs = useCallback(async (q: string, loc: string, remote: boolean, isWorldwide: boolean, pg: number, append = false) => {
        if (!append) setLoading(true);
        else setLoadingMore(true);
        try {
            const params = new URLSearchParams({ q, location: loc, remote: String(remote), worldwide: String(isWorldwide), page: String(pg) });
            const res = await fetch('/api/jobs?' + params);
            const data = await res.json();
            setJobs(prev => append ? [...prev, ...data.jobs] : data.jobs || []);
            setHasMore(data.hasMore || false);
            setApiSource(data.source || '');
            setSourceDetail(data.sourceDetail || '');
            setTotalFound(data.totalFound || 0);
            setPage(pg);
        } catch { if (!append) setJobs([]); }
        finally { setLoading(false); setLoadingMore(false); }
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchJobs(search, location, remoteOnly, worldwide, 1, false);
        setRefreshing(false);
    };

    useEffect(() => {
        const q = searchParams?.get('q') || '';
        setSearch(q);
        fetchJobs(q, 'All', false, false, 1);
    }, [fetchJobs, searchParams]);

    const handleSearch = (value: string) => {
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => fetchJobs(value, location, remoteOnly, worldwide, 1), 500);
    };

    const handleFilter = (loc: string, type: string, remote: boolean, isWorldwide: boolean) => {
        setLocation(loc);
        setJobType(type);
        setRemoteOnly(remote);
        setWorldwide(isWorldwide);
        fetchJobs(search, loc, remote, isWorldwide, 1);
    };

    const filtered = jobs.filter(j => jobType === 'All' || j.type === jobType);

    return (
        <>
            {/* Header */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '80px 0 28px' }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span>🇮🇳</span>
                        <p className="section-label" style={{ margin: 0 }}>Live Jobs from LinkedIn · Indeed · Naukri · Glassdoor</p>
                    </div>
                    <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 24 }}>Find Your Dream Tech Job</h1>

                    {/* Search + filters row */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
                            <input className="input" style={{ paddingLeft: 42, height: 46 }} placeholder="Role, company, or skill (e.g. React, ML, Razorpay)..."
                                value={search} onChange={e => handleSearch(e.target.value)} />
                        </div>
                        <div style={{ position: 'relative', minWidth: 190 }}>
                            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none', zIndex: 1 }}>📍</span>
                            <input
                                list="locations-list"
                                className="input"
                                style={{ paddingLeft: 34, height: 46, background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}
                                placeholder="Location (Bengaluru, USA...)"
                                value={location === 'All' ? '' : location}
                                onChange={e => {
                                    const v = e.target.value.trim() || 'All';
                                    setLocation(v);
                                    fetchJobs(search, v, remoteOnly, worldwide, 1);
                                }}
                            />
                            <datalist id="locations-list">
                                {LOCATION_SUGGESTIONS.map(l => <option key={l} value={l === 'All' ? '' : l} />)}
                            </datalist>
                        </div>
                        <label className="checkbox-container" style={{ padding: '0 16px', height: 46, background: worldwide ? 'rgba(108,99,255,0.15)' : 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', marginBottom: 0 }}>
                            <input type="checkbox" className="custom-checkbox" checked={worldwide} onChange={e => handleFilter(location, jobType, remoteOnly, e.target.checked)} />
                            <span className="checkmark" style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', marginRight: '8px' }}></span>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>🌍 Worldwide</span>
                        </label>
                        <label className="checkbox-container" style={{ padding: '0 16px', height: 46, background: remoteOnly ? 'rgba(108,99,255,0.15)' : 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap', marginBottom: 0 }}>
                            <input type="checkbox" className="custom-checkbox" checked={remoteOnly} onChange={e => handleFilter(location, jobType, e.target.checked, worldwide)} />
                            <span className="checkmark" style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', marginRight: '8px' }}></span>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>Remote</span>
                        </label>
                        <button className="btn btn-primary" style={{ height: 46, paddingInline: 24 }} onClick={() => fetchJobs(search, location, remoteOnly, worldwide, 1)}>Search</button>
                        <button className="btn btn-ghost" style={{ height: 46, paddingInline: 16 }} onClick={handleRefresh} title="Refresh jobs" disabled={refreshing}>
                            <span style={{ display: 'inline-block', animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}>🔄</span>
                        </button>
                    </div>

                    {/* Type filter chips */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {JOB_TYPES.map(t => <button key={t} onClick={() => { setJobType(t); }} className={`chip ${jobType === t ? 'active' : ''}`}>{t}</button>)}
                        <span style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 4px' }} />
                        {EXP_LEVELS.map(e => <button key={e} onClick={() => setExpLevel(e)} className={`chip ${expLevel === e ? 'active' : ''}`}>{e}</button>)}
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
                {/* Source badge (Hidden) */}
                {/* 
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: apiSource === 'live' ? 'var(--accent-green)' : 'var(--accent-orange)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {apiSource === 'live'
                            ? `🌐 Live · ${sourceDetail || 'Multiple Sources'}`
                            : `📋 Curated · ${sourceDetail || 'Add API keys for live jobs'}`}
                    </span>
                    {totalFound > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto', background: 'var(--bg-card)', padding: '2px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                            {totalFound} results
                        </span>
                    )}
                </div>
                */}

                <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 420px' : '1fr', gap: 24, alignItems: 'start' }}>
                    {/* Job list */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                                {loading ? '⏳ Fetching latest jobs...' : `${filtered.length} jobs${search ? ` for "${search}"` : ''}${location !== 'All' ? ` in ${location}` : ''}`}
                            </p>
                            {selectedJob && <button className="btn btn-ghost btn-sm" onClick={() => setSelectedJob(null)}>✕ Close</button>}
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="card" style={{ padding: 24 }}>
                                        <div style={{ height: 18, background: 'var(--bg-secondary)', borderRadius: 6, width: '55%', marginBottom: 12, animation: 'skeleton-loading 1.5s infinite' }} />
                                        <div style={{ height: 13, background: 'var(--bg-secondary)', borderRadius: 6, width: '40%', marginBottom: 8, animation: 'skeleton-loading 1.5s infinite' }} />
                                        <div style={{ height: 13, background: 'var(--bg-secondary)', borderRadius: 6, width: '75%', animation: 'skeleton-loading 1.5s infinite' }} />
                                    </div>
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No jobs found</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Try different keywords or filters</p>
                                <button className="btn btn-ghost" onClick={() => { setSearch(''); setLocation('All'); setJobType('All'); setRemoteOnly(false); setWorldwide(false); fetchJobs('', 'All', false, false, 1); }}>Clear all filters</button>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {filtered.map((job, idx) => (
                                        <div key={`${job.id}-${idx}`} className="card" style={{ padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s', borderColor: selectedJob?.id === job.id ? 'var(--accent-primary)' : undefined, background: selectedJob?.id === job.id ? 'rgba(108,99,255,0.05)' : undefined }}
                                            onClick={() => setSelectedJob(job)}>
                                            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                                {/* Logo */}
                                                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: job.companyLogo ? undefined : 24, flexShrink: 0, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                                                    {job.companyLogo ? <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : job.logo}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                                        <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{job.title}</h3>
                                                        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 10 }}>{job.posted}</span>
                                                    </div>
                                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                                        {job.company} &bull; {job.location} &bull; <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{job.salary}</span>
                                                    </p>
                                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                                        {job.remote && <span className="badge badge-green" style={{ fontSize: 10 }}>Remote</span>}
                                                        <span className="badge badge-blue" style={{ fontSize: 10 }}>{job.type}</span>
                                                        {job.tags.slice(0, 3).map(t => t && <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <span style={{ fontSize: 14 }}>{SOURCE_ICONS[job.source] || SOURCE_ICONS.default}</span>
                                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.source}</span>
                                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>&bull; {job.applicants} applicants</span>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                                                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedJob(job)}>Details</button>
                                                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm"
                                                                style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                                                                Apply on {job.source.split(' ')[0]} →
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More */}
                                {hasMore && (
                                    <div style={{ textAlign: 'center', marginTop: 28 }}>
                                        <button className="btn btn-ghost" style={{ minWidth: 200 }} disabled={loadingMore}
                                            onClick={() => fetchJobs(search, location, remoteOnly, worldwide, page + 1, true)}>
                                            {loadingMore ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                                    <span style={{ width: 14, height: 14, border: '2px solid var(--border-medium)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                                    Loading more jobs...
                                                </span>
                                            ) : 'Load More Jobs ↓'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Job detail side panel */}
                    {selectedJob && (
                        <div className="glass-card" style={{ padding: 28, position: 'sticky', top: 88, maxHeight: 'calc(100vh - 110px)', overflow: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                                    {selectedJob.companyLogo ? <img src={selectedJob.companyLogo} alt={selectedJob.company} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : selectedJob.logo}
                                </div>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }} onClick={() => setSelectedJob(null)}>✕</button>
                            </div>

                            <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 5 }}>{selectedJob.title}</h2>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>{selectedJob.company}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                                {[
                                    { icon: '📍', val: selectedJob.location },
                                    { icon: '💰', val: selectedJob.salary },
                                    { icon: '⏰', val: selectedJob.type },
                                    { icon: '👥', val: `${selectedJob.applicants} applied` },
                                ].map(item => (
                                    <div key={item.val} style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', fontSize: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <span>{item.icon}</span><span style={{ color: 'var(--text-secondary)' }}>{item.val}</span>
                                    </div>
                                ))}
                            </div>

                            {selectedJob.remote && <div style={{ marginBottom: 12 }}><span className="badge badge-green">Remote Available</span></div>}

                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                                {selectedJob.tags.map(t => t && <span key={t} className="tag">{t}</span>)}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 18, marginBottom: 20 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Job Description</h4>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{selectedJob.description}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                                <span style={{ fontSize: 18 }}>{SOURCE_ICONS[selectedJob.source] || SOURCE_ICONS.default}</span>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Listed on <strong>{selectedJob.source}</strong></span>
                            </div>

                            <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg"
                                style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                Apply on {selectedJob.source} →
                            </a>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                                Opens original job listing on {selectedJob.source}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes skeleton-loading {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
        </>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0' }}>Loading jobs...</div>}>
            <JobsContent />
        </Suspense>
    );
}
