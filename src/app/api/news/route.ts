import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
    customFields: {
        item: ['media:content', 'enclosure'],
    }
});

async function fetchRedditNews(category: string) {
    let subreddit = 'technology';
    if (category === 'Gaming') subreddit = 'games';
    else if (category === 'Mobile') subreddit = 'android'; 
    else if (category === 'Upcoming Launches') subreddit = 'gadgets';
    else if (category === 'PC & Hardware') subreddit = 'hardware';
    else if (category === 'Startups') subreddit = 'startups';
    else if (category === 'Scams & Frauds') subreddit = 'cybersecurity';
    else if (category === 'AI & ML') subreddit = 'artificialintelligence';
    
    try {
        const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=12`, { next: { revalidate: 1800 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data.children.filter((post: any) => !post.data.stickied).map((post: any, i: number) => {
            let imgUrl = null;
            if (post.data.preview && post.data.preview.images && post.data.preview.images[0].source?.url) {
                imgUrl = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');
            } else if (post.data.thumbnail && post.data.thumbnail.startsWith('http')) {
                imgUrl = post.data.thumbnail;
            }

            return {
                id: `reddit-${post.data.id}`,
                title: post.data.title,
                description: post.data.selftext ? post.data.selftext.slice(0, 300) + '...' : '',
                category: category === 'All' ? categorize(post.data.title) : category,
                source_id: `Reddit (r/${post.data.subreddit})`,
                source_url: `https://reddit.com/r/${post.data.subreddit}`,
                pubDate: new Date(post.data.created_utc * 1000).toISOString(),
                link: post.data.url,
                image_url: imgUrl,
                trending: post.data.score > 2000,
                views: `${Math.floor(post.data.score / 100)}K`,
            };
        });
    } catch { return []; }
}

async function fetchHackerNews(query: string) {
    try {
        const q = encodeURIComponent(query || 'technology');
        const url = `https://hn.algolia.com/api/v1/search_by_date?query=${q}&tags=story&hitsPerPage=6`;
        const res = await fetch(url, { next: { revalidate: 1800 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.hits.map((a: any) => ({
            id: `hn-${a.objectID}`,
            title: a.title,
            description: '',
            category: categorize(a.title),
            source_id: 'Hacker News',
            source_url: 'https://news.ycombinator.com',
            pubDate: a.created_at,
            link: a.url || `https://news.ycombinator.com/item?id=${a.objectID}`,
            image_url: null,
            trending: a.points > 100,
            views: `${Math.floor(Math.random() * 50 + 10)}K`,
        }));
    } catch { return []; }
}

async function fetchRSS(category: string) {
    try {
        let feedUrl = 'https://techcrunch.com/feed/';
        if (category === 'Gaming') feedUrl = 'https://www.gamespot.com/feeds/mashup/';
        else if (category === 'Mobile') feedUrl = 'https://www.phonearena.com/feed';
        else if (category === 'Upcoming Launches') feedUrl = 'https://www.theverge.com/rss/index.xml';
        else if (category === 'PC & Hardware') feedUrl = 'https://www.pcworld.com/feed';
        else if (category === 'Startups') feedUrl = 'https://techcrunch.com/category/startups/feed/';
        else if (category === 'AI & ML') feedUrl = 'https://techcrunch.com/category/artificial-intelligence/feed/';
        else if (category === 'Scams & Frauds') feedUrl = 'https://www.bleepingcomputer.com/feed/';

        const feed = await parser.parseURL(feedUrl);
        return feed.items.slice(0, 6).map((item, i: number) => {
             let img = null;
             if (item['media:content'] && item['media:content'].$) img = item['media:content'].$.url;
             else if (item.enclosure && item.enclosure.url) img = item.enclosure.url;

             return {
                 id: `rss-${i}-${Date.now()}`,
                 title: item.title || '',
                 description: item.contentSnippet?.slice(0, 200) || '',
                 category: category === 'All' ? categorize(item.title || '') : category,
                 source_id: feed.title || 'RSS Feed',
                 source_url: feed.link || '',
                 pubDate: item.pubDate || new Date().toISOString(),
                 link: item.link || '',
                 image_url: img,
                 trending: false,
                 views: `${Math.floor(Math.random() * 50 + 10)}K`,
             }
        });
    } catch { return []; }
}

function categorize(text: string): string {
    const t = text.toLowerCase();
    if (t.includes('game') || t.includes('ps5') || t.includes('xbox') || t.includes('nintendo') || t.includes('steam')) return 'Gaming';
    if (t.includes('scam') || t.includes('fraud') || t.includes('phishing') || t.includes('hack') || t.includes('breach') || t.includes('cyber') || t.includes('deepfake')) return 'Scams & Frauds';
    if (t.includes('phone') || t.includes('ios') || t.includes('android') || t.includes('mobile')) return 'Mobile';
    if (t.includes('launch') || t.includes('release') || t.includes('announce') || t.includes('event')) return 'Upcoming Launches';
    if (t.includes('pc') || t.includes('hardware') || t.includes('cpu') || t.includes('gpu') || t.includes('nvidia') || t.includes('amd')) return 'PC & Hardware';
    if (t.includes('isro') || t.includes('space') || t.includes('nasa')) return 'ISRO & Space';
    if (t.includes('ai') || t.includes('ml') || t.includes('gemini') || t.includes('chatgpt') || t.includes('llm')) return 'AI & ML';
    if (t.includes('job') || t.includes('hiring') || t.includes('layoff') || t.includes('recruit') || t.includes('career')) return 'Jobs & Careers';
    if (t.includes('policy') || t.includes('government') || t.includes('regulation') || t.includes('meity')) return 'Policy';
    if (t.includes('cloud') || t.includes('aws') || t.includes('azure') || t.includes('gcp')) return 'Cloud';
    if (t.includes('open source') || t.includes('github') || t.includes('linux')) return 'Open Source';
    if (t.includes('startup') || t.includes('funding') || t.includes('unicorn') || t.includes('vc')) return 'Startups';
    return 'Tech';
}

const FALLBACK_NEWS = [
    { id: 'fn1', title: 'Zomato Crosses Rs 1,000 Cr Quarterly Profit - AI Team Doubles with 500 New Hires', description: "Zomato's Q3 results beat estimates as their AI-driven hyperlocal logistics engine continues to drive margin expansion. The company announced 500 AI/ML engineering roles across Bengaluru and Hyderabad.", category: 'Startups', source_id: 'Inc42', source_url: 'https://inc42.com', pubDate: '2026-03-06', link: 'https://inc42.com', image_url: null, trending: true, views: '1.2L' },
    { id: 'fn2', title: 'TCS and Infosys Announce 60,000 Fresher Hiring Drive for FY2026', description: "India's two largest IT exporters will collectively hire 60,000 engineering graduates from IITs, NITs, and tier-2 colleges. The drive targets candidates from CSE, IT, and ECE backgrounds. Packages ranging from Rs 3.5L to Rs 7L CTC.", category: 'Jobs & Careers', source_id: 'ET Tech', source_url: 'https://economictimes.indiatimes.com/tech', pubDate: '2026-03-06', link: 'https://economictimes.indiatimes.com/tech', image_url: null, trending: true, views: '3.4L' },
    { id: 'fn3', title: 'ISRO SpaceTech Startup Fund to Fuel 200 Deep-Tech Companies', description: 'The Indian Space Research Organisation announced IN-SPACe 2.0, a Rs 1,000 crore fund to support 200 deep-tech startups working on satellite communications and space data analytics.', category: 'ISRO & Space', source_id: 'YourStory', source_url: 'https://yourstory.com', pubDate: '2026-03-05', link: 'https://yourstory.com', image_url: null, trending: true, views: '87K' },
    { id: 'fn4', title: 'Nvidia RTX 6090 Leaks Suggest 2X Performance Over 5090', description: 'Early silicon leaks show incredible rasterization improvements. Gamers brace for impact on pricing.', category: 'PC & Hardware', source_id: 'Tom\'s Hardware', source_url: 'https://tomshardware.com', pubDate: '2026-03-05', link: 'https://tomshardware.com', image_url: null, trending: true, views: '1.1L' },
    { id: 'fn5', title: 'Google India Gives Free Gemini API Access to 10,000 Startups', description: "Google's India startup accelerator expanded with free Gemini Ultra API access, Rs 50L in Cloud credits, and dedicated TPU quotas for AI startups registered under DPIIT.", category: 'AI & ML', source_id: 'YourStory', source_url: 'https://yourstory.com', pubDate: '2026-03-04', link: 'https://yourstory.com', image_url: null, trending: true, views: '1.8L' },
    { id: 'fn6', title: 'Meta India Layoffs: 400 Jobs Cut Across WhatsApp and Instagram Teams', description: "Meta's India engineering hubs in Hyderabad saw restructuring with approximately 400 roles eliminated across WhatsApp Business Platform and Instagram Creator tools teams.", category: 'Jobs & Careers', source_id: 'Business Insider India', source_url: 'https://www.businessinsider.in', pubDate: '2026-03-04', link: 'https://www.businessinsider.in', image_url: null, trending: true, views: '4.1L' },
    { id: 'fn7', title: 'Sony Announces PlayStation 6 Pro Launch Window', description: "At an exclusive investors call, Sony confirmed the next iteration of the console architecture is nearly finished.", category: 'Gaming', source_id: 'IGN', source_url: 'https://ign.com', pubDate: '2026-03-03', link: 'https://ign.com', image_url: null, trending: true, views: '42K' },
    { id: 'fn8', title: 'India AI Act 2026 - MEITY Proposes Mandatory Audits for High-Risk AI Systems', description: 'MEITY released draft provisions on AI governance making algorithmic audits compulsory for AI systems in finance, healthcare, and hiring. Regulation affects 3,000+ startups.', category: 'Policy', source_id: 'The Hindu Tech', source_url: 'https://www.thehindu.com/sci-tech', pubDate: '2026-03-03', link: 'https://www.thehindu.com/sci-tech', image_url: null, trending: false, views: '56K' },
    { id: 'fn9', title: 'Samsung Galaxy S27 Ultra Features Next-Gen Telephoto', description: "Reports confirm the introduction of variable optical focal lengths hitting the flagship mobile market next quarter.", category: 'Mobile', source_id: 'GSM Arena', source_url: 'https://gsmarena.com', pubDate: '2026-03-02', link: 'https://gsmarena.com', image_url: null, trending: false, views: '2.3L' },
    { id: 'fn10', title: 'Zepto Engineering: 10 Million Orders Per Hour at 99.99% Uptime', description: "Zepto's CTO published a deep-dive on their microservices architecture and Golang order orchestration engine. Key: event-driven Kafka, distributed tracing with Jaeger, blue-green Kubernetes deployments.", category: 'Startups', source_id: 'Zepto Blog', source_url: 'https://zepto.co', pubDate: '2026-03-01', link: 'https://zepto.co', image_url: null, trending: false, views: '73K' },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'All';
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const searchQuery = query || (category !== 'All' ? `${category} technology` : 'technology');

    // Run parallel free fetchers (Reddit, HackerNews, RSS)
    const [reddit, hn, rss] = await Promise.all([
        fetchRedditNews(category),
        fetchHackerNews(searchQuery),
        fetchRSS(category)
    ]);

    let externalArticles = [...(reddit || []), ...(hn || []), ...(rss || [])];

    // Shuffle gently or sort by date to mix them up instead of grouping rigidly
    externalArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Inject beautiful default cover photo if one wasn't successfully scraped
    const defaultCover = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
    externalArticles = externalArticles.map(a => ({
        ...a,
        image_url: a.image_url || defaultCover
    }));

    // Filter by query if user searched
    if (query) {
        externalArticles = externalArticles.filter(a => 
            a.title.toLowerCase().includes(query.toLowerCase()) || 
            a.description.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // Check if we got enough. If so, return immediately.
    if (externalArticles.length > 5) {
         const pageSize = 12;
         const start = (page - 1) * pageSize;
         const paginated = externalArticles.slice(start, start + pageSize);
         
         return NextResponse.json({ 
             articles: paginated, 
             source: 'live', 
             page, 
             hasMore: externalArticles.length > start + pageSize 
         });
    }

    // Fallback to static data if all external sources tragically failed
    const filtered = category === 'All'
        ? FALLBACK_NEWS
        : FALLBACK_NEWS.filter(a => a.category === category || a.title.toLowerCase().includes(category.toLowerCase()));

    const pageSize = 5;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(0, start + pageSize);

    return NextResponse.json({
        articles: paginated,
        source: 'local',
        page,
        hasMore: filtered.length > start + pageSize,
        apiNote: 'Showing static fallback. Live APIs might be rate limited or blocked.',
    });
}
