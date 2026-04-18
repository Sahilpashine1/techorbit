import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface NormalizedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    remote: boolean;
    tags: string[];
    posted: string;
    description: string;
    applicants: number;
    logo: string;
    url: string;
    source: string;
    companyLogo: string | null;
}

function slug() { return Math.random().toString(36).slice(2, 8); }
function randApplicants(min = 20, max = 900) { return Math.floor(Math.random() * (max - min)) + min; }

function estimateSalaryAndLevel(title: string, company: string, reportedSalary?: string): string {
    if (reportedSalary && reportedSalary !== 'Competitive') return reportedSalary;
    
    const t = title.toLowerCase();
    const c = company.toLowerCase();
    
    // Service-based companies (TCS, Infosys, Wipro, Tech Mahindra, Cognizant, HCL, Accenture)
    const isServiceBased = c.includes('tcs') || c.includes('tata consultancy') || 
                           c.includes('infosys') || c.includes('wipro') || 
                           c.includes('tech mahindra') || c.includes('cognizant') || 
                           c.includes('hcl') || c.includes('accenture');

    // Internships
    if (t.includes('intern')) return isServiceBased ? '₹15K – ₹20K / mo (Est)' : '₹20K – ₹40K / mo (Est)';
    
    // Fresher / Junior level
    if (t.includes('fresher') || t.includes('junior') || t.includes('jr') || t.includes('trainee') || t.includes('associate') || t.includes('sde-1') || t.includes('sde 1')) {
        return isServiceBased ? '₹3.5L – ₹5.5L (Est)' : '₹6L – ₹12L (Est)';
    }

    // Senior / Staff level
    if (t.includes('senior') || t.includes('sr') || t.includes('sde-2') || t.includes('sde 2') || t.includes('sde ii') || t.includes('lead') || t.includes('architect') || t.includes('sde-3') || t.includes('sde 3') || t.includes('staff')) {
        return isServiceBased ? '₹10L – ₹18L (Est)' : '₹30L – ₹60L (Est)';
    }
    
    // Management
    if (t.includes('manager') || t.includes('vp') || t.includes('director')) return '₹40L – ₹80L (Est)';
    
    // Default Mid-level (2-4 years)
    return isServiceBased ? '₹5L – ₹9L (Est)' : '₹10L – ₹22L (Est)';
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. JSearch (RapidAPI) — aggregates LinkedIn, Indeed, Glassdoor, Naukri,
//    ZipRecruiter, Monster, CareerBuilder, SimplyHired, Snagajob, Wellfound
// ─────────────────────────────────────────────────────────────────────────────
async function fetchJSearch(query: string, location: string, page: number, worldwide: boolean): Promise<NormalizedJob[] | null> {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey || apiKey === 'your-rapidapi-key') return null;
    try {
        const isIndia = !worldwide && (!location || location === 'All' || ['bengaluru', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai', 'india'].some(c => location.toLowerCase().includes(c)));
        const params = new URLSearchParams({
            query: `${query || 'software engineer'} ${location !== 'All' && location !== 'Remote' ? location : (isIndia ? 'India' : (worldwide ? '' : 'India'))}`,
            page: String(page),
            num_pages: '1',
            country: isIndia ? 'in' : (worldwide ? '' : 'in'),
            language: 'en',
        });
        if (location === 'Remote') params.append('work_from_home', 'true');

        const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, {
            headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return (data.data || []).map((j: any): NormalizedJob => ({
            id: j.job_id || `jsearch-${slug()}`,
            title: j.job_title,
            company: j.employer_name,
            location: j.job_city ? `${j.job_city}, ${j.job_state || j.job_country || 'India'}` : (j.job_country || 'India'),
            salary: estimateSalaryAndLevel(j.job_title, j.employer_name, j.job_min_salary ? `₹${Math.round(j.job_min_salary / 100000)}L – ₹${Math.round(j.job_max_salary / 100000)}L` : 'Competitive'),
            type: j.job_employment_type || 'Full-time',
            remote: j.job_is_remote || false,
            tags: [j.job_required_skills?.[0], j.job_required_skills?.[1], j.job_required_skills?.[2]].filter(Boolean),
            posted: j.job_posted_at_datetime_utc ? new Date(j.job_posted_at_datetime_utc).toLocaleDateString('en-IN') : 'Recently',
            description: (j.job_description || '').slice(0, 400) + '…',
            applicants: randApplicants(50, 800),
            logo: j.employer_logo || '💼',
            url: j.job_apply_link || j.job_google_link,
            source: j.job_publisher || 'LinkedIn',
            companyLogo: j.employer_logo || null,
        }));
    } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Remotive — free, no key, fully remote tech jobs worldwide
// ─────────────────────────────────────────────────────────────────────────────
async function fetchRemotive(query: string, worldwide: boolean): Promise<NormalizedJob[] | null> {
    try {
        const params = new URLSearchParams({ limit: '30' });
        if (query) params.append('search', query);
        const res = await fetch(`https://remotive.com/api/remote-jobs?${params}`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        
        let rawJobs = data.jobs || [];
        if (!worldwide) {
            rawJobs = rawJobs.filter((j: any) => {
                const loc = (j.candidate_required_location || '').toLowerCase();
                return loc.includes('india') || loc.includes('apac') || loc.includes('bengaluru') || loc.includes('mumbai');
            });
        }
        
        return rawJobs.map((j: any): NormalizedJob => ({
            id: `remotive-${j.id}`,
            title: j.title,
            company: j.company_name,
            location: j.candidate_required_location || 'Worldwide Remote',
            salary: estimateSalaryAndLevel(j.title, j.company_name, j.salary || 'Competitive'),
            type: j.job_type || 'Full-time',
            remote: true,
            tags: (j.tags || []).slice(0, 4),
            posted: j.publication_date ? new Date(j.publication_date).toLocaleDateString('en-IN') : 'Recently',
            description: (j.description || '').replace(/<[^>]+>/g, '').slice(0, 400) + '…',
            applicants: randApplicants(10, 300),
            logo: j.company_logo || '🌐',
            url: j.url,
            source: 'Remotive',
            companyLogo: j.company_logo || null,
        }));
    } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Jobicy — free, no key, remote tech jobs
// ─────────────────────────────────────────────────────────────────────────────
async function fetchJobicy(query: string, worldwide: boolean): Promise<NormalizedJob[] | null> {
    try {
        const params = new URLSearchParams({ count: '20', geo: worldwide ? 'worldwide' : 'apac' });
        if (query) params.append('tag', query.split(' ')[0]);
        const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?${params}`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        
        let rawJobs = data.jobs || [];
        if (!worldwide) {
            rawJobs = rawJobs.filter((j: any) => {
                const loc = (j.jobGeo || '').toLowerCase();
                return loc.includes('india') || loc.includes('apac');
            });
        }

        return rawJobs.map((j: any): NormalizedJob => ({
            id: `jobicy-${j.id}`,
            title: j.jobTitle,
            company: j.companyName,
            location: j.jobGeo || 'Remote',
            salary: estimateSalaryAndLevel(j.jobTitle, j.companyName, j.annualSalaryMin ? `$${Math.round(j.annualSalaryMin / 1000)}K – $${Math.round(j.annualSalaryMax / 1000)}K` : 'Competitive'),
            type: j.jobType || 'Full-time',
            remote: true,
            tags: (j.jobIndustry || []).slice(0, 3),
            posted: j.pubDate ? new Date(j.pubDate).toLocaleDateString('en-IN') : 'Recently',
            description: (j.jobExcerpt || '').slice(0, 400) + '…',
            applicants: randApplicants(5, 200),
            logo: j.companyLogo || '💻',
            url: j.url,
            source: 'Jobicy',
            companyLogo: j.companyLogo || null,
        }));
    } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Adzuna — free tier, 250 req/day, global job board
//    Get keys: https://developer.adzuna.com/  (ADZUNA_APP_ID + ADZUNA_API_KEY)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchAdzuna(query: string, location: string, page: number, worldwide: boolean): Promise<NormalizedJob[] | null> {
    const appId = process.env.ADZUNA_APP_ID;
    const apiKey = process.env.ADZUNA_API_KEY;
    if (!appId || !apiKey || appId.includes('your')) return null;
    try {
        // Map location to Adzuna country code
        const isIndia = !worldwide && (!location || location === 'All' || ['bengaluru', 'mumbai', 'delhi', 'india', 'pune', 'hyderabad'].some(c => location.toLowerCase().includes(c)));
        const country = isIndia ? 'in' : (worldwide ? 'us' : 'in'); // Adzuna handles one country at a time well, default strictly to 'in' unless worldwide but Adzuna is country specific
        const params = new URLSearchParams({
            app_id: appId,
            app_key: apiKey,
            results_per_page: '20',
            what: query || 'software engineer',
            content_type: 'application/json',
        });
        if (location && location !== 'All' && location !== 'Remote') params.append('where', location);
        if (location === 'Remote') params.append('where', 'remote');

        const res = await fetch(
            `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params}`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return (data.results || []).map((j: any): NormalizedJob => ({
            id: `adzuna-${j.id}`,
            title: j.title,
            company: j.company?.display_name || 'Company',
            location: j.location?.display_name || location || 'India',
            salary: estimateSalaryAndLevel(j.title, j.company?.display_name || 'Company', j.salary_min ? `₹${Math.round(j.salary_min / 100000)}L – ₹${Math.round(j.salary_max / 100000)}L` : 'Competitive'),
            type: j.contract_type || 'Full-time',
            remote: (j.title + ' ' + (j.description || '')).toLowerCase().includes('remote'),
            tags: (j.category?.tag ? [j.category.tag] : []),
            posted: j.created ? new Date(j.created).toLocaleDateString('en-IN') : 'Recently',
            description: (j.description || '').slice(0, 400) + '…',
            applicants: randApplicants(20, 500),
            logo: '🌍',
            url: j.redirect_url,
            source: 'Adzuna',
            companyLogo: null,
        }));
    } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. The Muse — free tier, quality tech & startup roles
//    Get key: https://www.themuse.com/developers/api/v2  (MUSE_API_KEY)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchTheMuse(query: string, page: number, worldwide: boolean): Promise<NormalizedJob[] | null> {
    const apiKey = process.env.MUSE_API_KEY;
    try {
        const params = new URLSearchParams({ page: String(page - 1), descending: 'true' });
        if (apiKey && !apiKey.includes('your')) params.append('api_key', apiKey);
        if (query) params.append('category', encodeURIComponent(query));
        if (!worldwide) {
            params.append('location', 'India');
        }

        const res = await fetch(`https://www.themuse.com/api/public/jobs?${params}`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        
        let rawJobs = data.results || [];
        if (!worldwide) {
            rawJobs = rawJobs.filter((j: any) => {
                const locs = (j.locations || []).map((l: any) => l.name.toLowerCase()).join(' ');
                return locs.includes('india') || locs.includes('bengaluru') || locs.includes('mumbai');
            });
        }

        return rawJobs.map((j: any): NormalizedJob => ({
            id: `muse-${j.id}`,
            title: j.name,
            company: j.company?.name || 'Tech Company',
            location: (j.locations || []).map((l: any) => l.name).join(' / ') || 'Flexible',
            salary: estimateSalaryAndLevel(j.name, j.company?.name || 'Tech Company', 'Competitive'),
            type: j.type || 'Full-time',
            remote: (j.locations || []).some((l: any) => l.name?.toLowerCase().includes('remote')),
            tags: (j.categories || []).map((c: any) => c.name).slice(0, 3),
            posted: j.publication_date ? new Date(j.publication_date).toLocaleDateString('en-IN') : 'Recently',
            description: (j.contents || '').replace(/<[^>]+>/g, '').slice(0, 400) + '…',
            applicants: randApplicants(10, 400),
            logo: j.company?.short_name || '⭐',
            url: j.refs?.landing_page || '#',
            source: 'The Muse',
            companyLogo: j.company?.refs?.logo_image || null,
        }));
    } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Apify Google Jobs — premium, requires APIFY_API_TOKEN
// ─────────────────────────────────────────────────────────────────────────────
async function fetchApify(query: string, location: string, worldwide: boolean): Promise<NormalizedJob[] | null> {
    const apiKey = process.env.APIFY_API_TOKEN;
    if (!apiKey || apiKey.includes('your')) return null;
    try {
        const { ApifyClient } = await import('apify-client');
        const client = new ApifyClient({ token: apiKey });
        const searchQ = `${query || 'Software Engineer'} ${location !== 'All' && location !== 'Remote' ? location : (worldwide ? 'Worldwide' : 'India')}`;
        const run = await client.actor('lucasok/google-jobs-scraper').call({
            search_terms: searchQ,
            location: location !== 'All' ? location : (worldwide ? '' : 'India'),
            language: 'en',
            max_items: 15,
        });
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        if (!items?.length) return null;
        return items.map((j: any, i: number): NormalizedJob => ({
            id: `apify-${i}-${slug()}`,
            title: j.title || j.jobTitle || 'Tech Role',
            company: j.companyName || j.company || 'Tech Company',
            location: j.location || location,
            salary: estimateSalaryAndLevel(j.title || j.jobTitle || 'Tech Role', j.companyName || j.company || 'Tech Company', j.salary || 'Competitive'),
            type: j.jobType || 'Full-time',
            remote: (j.location || '').toLowerCase().includes('remote') || location === 'Remote',
            tags: [j.companyName, 'Tech', j.title?.split(' ')[0]].filter(Boolean).slice(0, 3),
            posted: j.postedAt || 'Recently',
            description: (j.description || j.snippet || '').slice(0, 400) + '…',
            applicants: randApplicants(20, 600),
            logo: j.companyLogo || j.thumbnail || '💼',
            url: j.jobProviderUrl || j.applyLink || j.url,
            source: j.jobProvider || 'Google Jobs',
            companyLogo: j.companyLogo || null,
        }));
    } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK — curated Indian tech roles with real apply links
// (covers LinkedIn, Glassdoor, Indeed, Naukri, Wellfound, ZipRecruiter,
//  Google Jobs, Upwork, CareerBuilder, Monster, Snagajob via direct links)
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_JOBS: NormalizedJob[] = [
    { id: 'f1', title: 'Senior Backend Engineer', company: 'Razorpay', location: 'Bengaluru, Karnataka', salary: '₹40L – ₹65L', type: 'Full-time', remote: true, tags: ['Java', 'Kafka', 'AWS'], posted: '2d ago', description: 'Build core payment infrastructure processing millions of transactions for India\'s leading fintech.', applicants: 843, logo: '💳', url: 'https://razorpay.com/jobs/', source: 'Razorpay Careers', companyLogo: null },
    { id: 'f2', title: 'ML Engineer — Search & Discovery', company: 'Flipkart', location: 'Bengaluru, Karnataka', salary: '₹55L – ₹80L', type: 'Full-time', remote: false, tags: ['Python', 'PyTorch', 'Spark'], posted: '3d ago', description: 'Work on large-scale ML systems driving product discovery for 400M+ customers.', applicants: 621, logo: '🛍', url: 'https://www.flipkartcareers.com/#!/joblist', source: 'Flipkart Careers', companyLogo: null },
    { id: 'f3', title: 'Full Stack Engineer', company: 'CRED', location: 'Bengaluru, Karnataka', salary: '₹30L – ₹50L', type: 'Full-time', remote: true, tags: ['React', 'Node.js', 'Go'], posted: '1d ago', description: 'Build premium fintech experiences for India\'s creditworthy consumers.', applicants: 512, logo: '💎', url: 'https://cred.club/jobs', source: 'CRED Careers', companyLogo: null },
    { id: 'f4', title: 'Data Engineer', company: 'PhonePe', location: 'Pune, Maharashtra', salary: '₹25L – ₹40L', type: 'Full-time', remote: true, tags: ['Scala', 'Flink', 'BigQuery'], posted: '4d ago', description: 'Design real-time data pipelines powering UPI payments for 500M+ users.', applicants: 389, logo: '📱', url: 'https://careers.phonepe.com/', source: 'PhonePe Careers', companyLogo: null },
    { id: 'f5', title: 'DevOps Platform Engineer', company: 'Swiggy', location: 'Hyderabad, Telangana', salary: '₹28L – ₹45L', type: 'Full-time', remote: true, tags: ['Kubernetes', 'Terraform', 'ArgoCD'], posted: '5d ago', description: 'Lead platform engineering for India\'s largest hyperlocal delivery ecosystem.', applicants: 276, logo: '🚚', url: 'https://careers.swiggy.com/', source: 'Swiggy Careers', companyLogo: null },
    { id: 'f6', title: 'iOS Engineer', company: 'Dream11', location: 'Mumbai, Maharashtra', salary: '₹22L – ₹35L', type: 'Full-time', remote: false, tags: ['Swift', 'SwiftUI', 'iOS'], posted: '6d ago', description: 'Build real-time fantasy sports for 200M+ cricket fans.', applicants: 198, logo: '🏏', url: 'https://careers.dream11.com/', source: 'Dream11 Careers', companyLogo: null },
    { id: 'f7', title: 'Security Engineer', company: 'Zerodha', location: 'Bengaluru, Karnataka', salary: '₹30L – ₹50L', type: 'Full-time', remote: true, tags: ['Python', 'AppSec', 'Pentest'], posted: '1w ago', description: 'Protect India\'s largest stockbroker platform trusted by 15M+ investors.', applicants: 145, logo: '📈', url: 'https://zerodha.com/careers/', source: 'Zerodha Careers', companyLogo: null },
    { id: 'f8', title: 'Cloud Architect', company: 'Zoho', location: 'Chennai, Tamil Nadu', salary: '₹35L – ₹55L', type: 'Full-time', remote: false, tags: ['AWS', 'Azure', 'Kubernetes'], posted: '1w ago', description: 'Architect multi-cloud infrastructure powering 50+ SaaS products globally.', applicants: 302, logo: '🌐', url: 'https://careers.zohocorp.com/', source: 'Zoho Careers', companyLogo: null },
    { id: 'f9', title: 'SDE-2 Backend', company: 'Zepto', location: 'Bengaluru, Karnataka', salary: '₹32L – ₹52L', type: 'Full-time', remote: true, tags: ['Go', 'Microservices', 'Postgres'], posted: '2d ago', description: 'Keep Zepto\'s 10-minute delivery infrastructure at 99.99% uptime.', applicants: 167, logo: '⚡', url: 'https://zepto.co/careers', source: 'Zepto Careers', companyLogo: null },
    { id: 'f10', title: 'AI Research Engineer', company: 'Jio AI Cloud', location: 'Mumbai, Maharashtra', salary: '₹45L – ₹75L', type: 'Full-time', remote: false, tags: ['LLMs', 'PyTorch', 'RLHF'], posted: '3d ago', description: 'Shape India\'s AI future at Reliance\'s AI Cloud division.', applicants: 765, logo: '☁️', url: 'https://jioplatforms.com/careers', source: 'Jio Careers', companyLogo: null },
    { id: 'f11', title: 'Product Manager', company: 'Meesho', location: 'Bengaluru, Karnataka', salary: '₹30L – ₹50L', type: 'Full-time', remote: false, tags: ['Product', 'Analytics', 'A/B Testing'], posted: '4d ago', description: 'Drive growth for India\'s fastest-growing social commerce platform.', applicants: 421, logo: '🛒', url: 'https://meesho.careers/', source: 'Meesho Careers', companyLogo: null },
    { id: 'f12', title: 'Frontend Engineer', company: 'Freshworks', location: 'Chennai, Tamil Nadu', salary: '₹18L – ₹30L', type: 'Full-time', remote: true, tags: ['React', 'TypeScript', 'GraphQL'], posted: '5d ago', description: 'Build next-gen CRM tools used by 60,000+ businesses globally.', applicants: 234, logo: '🌿', url: 'https://careers.freshworks.com/', source: 'Freshworks Careers', companyLogo: null },
    { id: 'f13', title: 'Android Engineer', company: 'Ola', location: 'Bengaluru, Karnataka', salary: '₹24L – ₹38L', type: 'Full-time', remote: false, tags: ['Kotlin', 'Jetpack', 'MVVM'], posted: '6d ago', description: 'Build the Ola app used by millions of riders across India and APAC.', applicants: 289, logo: '🚗', url: 'https://www.ola.com/careers', source: 'Ola Careers', companyLogo: null },
    { id: 'f14', title: 'Data Scientist', company: 'Paytm', location: 'Delhi NCR', salary: '₹22L – ₹36L', type: 'Full-time', remote: true, tags: ['Python', 'ML', 'SQL'], posted: '1w ago', description: 'Drive data-driven decisions across Paytm Payment Bank and lending products.', applicants: 356, logo: '💰', url: 'https://paytm.com/careers', source: 'Paytm Careers', companyLogo: null },
    { id: 'f15', title: 'SDE-I (Fresher 2026)', company: 'TCS', location: 'Multiple Cities', salary: '₹7L – ₹12L', type: 'Full-time', remote: false, tags: ['Java', 'Spring Boot', 'SQL'], posted: '1d ago', description: 'Join TCS mass hiring for 2025/26 graduates. Register on iBegin portal.', applicants: 12450, logo: '🏦', url: 'https://ibegin.tcs.com/', source: 'TCS iBegin', companyLogo: null },
    // Remote-friendly international roles (Wellfound/AngelList, Upwork, Google Jobs)
    { id: 'f16', title: 'Remote Full Stack Engineer', company: 'Stripe', location: 'Remote — India eligible', salary: '$120K – $180K', type: 'Full-time', remote: true, tags: ['Ruby', 'React', 'Distributed Systems'], posted: '2d ago', description: 'Join Stripe\'s global engineering team. Strong India presence.', applicants: 1240, logo: '💳', url: 'https://stripe.com/jobs', source: 'Wellfound', companyLogo: null },
    { id: 'f17', title: 'Senior ML Engineer (Remote)', company: 'Hugging Face', location: 'Worldwide Remote', salary: '$130K – $200K', type: 'Full-time', remote: true, tags: ['PyTorch', 'Transformers', 'NLP'], posted: '4d ago', description: 'Work on open-source AI models used by millions of developers.', applicants: 2300, logo: '🤗', url: 'https://apply.workable.com/huggingface/', source: 'Wellfound', companyLogo: null },
    { id: 'f18', title: 'Freelance React Developer', company: 'Multiple Clients', location: 'Remote (Upwork)', salary: '$40–$80/hr', type: 'Contract', remote: true, tags: ['React', 'Next.js', 'TypeScript'], posted: 'Today', description: 'High-demand freelance React development contracts on Upwork.', applicants: 0, logo: '🔧', url: 'https://www.upwork.com/nx/search/jobs/?q=react+developer&sort=recency', source: 'Upwork', companyLogo: null },
    { id: 'f19', title: 'Backend Engineer — Node.js', company: 'GitLab', location: 'Remote — Global', salary: '$100K – $155K', type: 'Full-time', remote: true, tags: ['Node.js', 'PostgreSQL', 'Ruby on Rails'], posted: '3d ago', description: 'Help build the DevSecOps platform used by 30M+ developers globally.', applicants: 867, logo: '🦊', url: 'https://about.gitlab.com/jobs/', source: 'LinkedIn', companyLogo: null },
    { id: 'f20', title: 'DevOps Engineer — AWS', company: 'Cloudflare', location: 'Remote India', salary: '₹50L – ₹90L', type: 'Full-time', remote: true, tags: ['AWS', 'Terraform', 'Go'], posted: '5d ago', description: 'Help protect the internet with the world\'s leading CDN and security platform.', applicants: 445, logo: '🌩', url: 'https://www.cloudflare.com/careers/', source: 'Google Jobs', companyLogo: null },
];

// ─────────────────────────────────────────────────────────────────────────────
// DEDUP — remove jobs with the same title+company
// ─────────────────────────────────────────────────────────────────────────────
function deduplicate(jobs: NormalizedJob[]): NormalizedJob[] {
    const seen = new Set<string>();
    return jobs.filter(j => {
        const key = `${j.title.toLowerCase()}::${j.company.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query    = searchParams.get('q') || '';
    const location = searchParams.get('location') || 'All';
    const remote   = searchParams.get('remote') === 'true';
    const worldwide = searchParams.get('worldwide') === 'true';
    const page     = parseInt(searchParams.get('page') || '1');

    // ── TIER 1: Run free no-key APIs in parallel (Remotive + Jobicy) ──────────
    const [remotiveJobs, jobicyJobs] = await Promise.all([
        fetchRemotive(query, worldwide),
        fetchJobicy(query, worldwide),
    ]);

    // ── TIER 2: Run keyed free APIs in parallel ──────────────────────────────
    const [jsearchJobs, adzunaJobs, museJobs, apifyJobs] = await Promise.all([
        fetchJSearch(query, location, page, worldwide),
        fetchAdzuna(query, location, page, worldwide),
        fetchTheMuse(query, page, worldwide),
        fetchApify(query, location, worldwide),
    ]);

    // ── MERGE all live sources ────────────────────────────────────────────────
    const liveSources: Array<{ name: string; jobs: NormalizedJob[] | null }> = [
        { name: 'JSearch (LinkedIn·Indeed·Glassdoor·Naukri·ZipRecruiter)', jobs: jsearchJobs },
        { name: 'Adzuna', jobs: adzunaJobs },
        { name: 'The Muse', jobs: museJobs },
        { name: 'Remotive', jobs: remotiveJobs },
        { name: 'Jobicy', jobs: jobicyJobs },
        { name: 'Apify (Google Jobs)', jobs: apifyJobs },
    ];

    const activeSources = liveSources.filter(s => s.jobs && s.jobs.length > 0);
    let merged: NormalizedJob[] = activeSources.flatMap(s => s.jobs!);

    if (merged.length > 0) {
        // Filter by remote if requested
        if (remote) merged = merged.filter(j => j.remote);

        // Filter by query (client-side safety net for sources that don't filter server-side)
        if (query) {
            const q = query.toLowerCase();
            merged = merged.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q) ||
                j.tags.some(t => t?.toLowerCase().includes(q)) ||
                j.description.toLowerCase().includes(q)
            );
        }

        // Filter by location
        if (location !== 'All' && location !== 'Remote') {
            const loc = location.toLowerCase();
            const locFiltered = merged.filter(j =>
                j.location.toLowerCase().includes(loc) || j.remote
            );
            if (locFiltered.length > 0) merged = locFiltered;
        }
        
        // Strict boundary: if not worldwide, drop anything explicitly from other countries
        if (!worldwide) {
            const validLocs = ['india', 'in', 'bengaluru', 'bangalore', 'mumbai', 'delhi', 'noida', 'gurugram', 'gurgaon', 'hyderabad', 'pune', 'chennai', 'kolkata', 'ahmedabad', 'apac', 'remote'];
            merged = merged.filter(j => {
                const l = j.location.toLowerCase();
                // Check if they say remote explicitly without country, they pass. Otherwise, must be India-based
                if (l === 'remote' || l === 'worldwide remote' || l === 'anywhere') return true;
                return validLocs.some(v => l.includes(v));
            });
        }

        merged = deduplicate(merged);

        // Pagination is handled by the upstream APIs fetching the specific requested page
        // Some APIs ignore page, but most respect it. We just return the merged results for this page.
        const hasMore = merged.length > 0; // If APIs returned data, assume there's potentially more

        const sourceNames = activeSources.map(s => s.name).join(' · ');

        return NextResponse.json({
            jobs: merged,
            source: 'live',
            sourceDetail: sourceNames,
            totalFound: merged.length,
            page,
            hasMore,
        });
    }

    // ── FALLBACK: curated static jobs ────────────────────────────────────────
    let filtered = FALLBACK_JOBS.filter(j => {
        const q = query.toLowerCase();
        const matchQ = !query || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q));
        const matchLoc = location === 'All' || (location === 'Remote' ? j.remote : j.location.toLowerCase().includes(location.toLowerCase()));
        const matchRemote = !remote || j.remote;
        const matchWorldwide = worldwide || j.location.toLowerCase().includes('india') || ['bengaluru', 'mumbai', 'delhi', 'chennai', 'pune', 'hyderabad'].some(c => j.location.toLowerCase().includes(c));
        return matchQ && matchLoc && matchRemote && matchWorldwide;
    });

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return NextResponse.json({
        jobs: paginated,
        source: 'local',
        sourceDetail: 'Curated jobs (LinkedIn · Indeed · Glassdoor · Naukri · Wellfound · Upwork · Google Jobs)',
        totalFound: filtered.length,
        page,
        hasMore: filtered.length > start + pageSize,
        apiNote: 'Add RAPIDAPI_KEY, ADZUNA_APP_ID/ADZUNA_API_KEY, or MUSE_API_KEY to .env.local for live results',
    });
}
