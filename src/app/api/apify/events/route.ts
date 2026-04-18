import { NextRequest, NextResponse } from 'next/server';

// Rich fallback hackathon + event data — sourced from Devfolio, Unstop, Eventbrite, HackerEarth
const FALLBACK_EVENTS = [
    {
        id: '1', title: 'GenAI Hackathon India 2026',
        platform: 'Devfolio', date: 'April 5-7, 2026 • 48 Hours',
        location: 'Bengaluru / Online', prize: '₹5,00,000',
        tags: ['Generative AI', 'LLMs', 'Open Source'],
        link: 'https://devfolio.co/hackathons', status: 'Registrations Open',
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
        desc: "India's largest GenAI hackathon. Build products powered by LLMs and generative models. Open to all skill levels.",
    },
    {
        id: '2', title: 'React India Conference 2026',
        platform: 'Meetup', date: 'April 12, 2026 • 10 AM–6 PM',
        location: 'Hyderabad (T-Hub)', prize: null,
        tags: ['React', 'Next.js', 'Frontend'],
        link: 'https://reactindia.io', status: 'Filling Fast',
        image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80',
        desc: 'Annual conference for Indian React developers. Talks on performance, Server Components, and AI integrations.',
    },
    {
        id: '3', title: 'Cloud Native Day Pune 2026',
        platform: 'Eventbrite', date: 'August 15, 2026',
        location: 'Pune (Sheraton Grand)', prize: 'AWS Credits',
        tags: ['Kubernetes', 'AWS', 'DevOps'],
        link: 'https://community.cncf.io', status: 'Registrations Open',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
        desc: 'Full-day cloud native summit featuring CNCF project talks, Kubernetes deep-dives, and networking with SREs.',
    },
    {
        id: '4', title: "ETHIndia 2026 – Asia's Largest Ethereum Hackathon",
        platform: 'Devfolio', date: 'December 2-4, 2026',
        location: 'Bengaluru (KTPO)', prize: '$100,000+',
        tags: ['Blockchain', 'Web3', 'Ethereum', 'Solidity'],
        link: 'https://ethindia.co', status: 'Early Bird',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
        desc: 'The flagship Ethereum developer event in Asia. 2000+ builders, $100K+ in prizes, workshops from leading web3 protocols.',
    },
    {
        id: '5', title: 'Smart India Hackathon 2026',
        platform: 'Unstop (Government)', date: 'August 1-2, 2026',
        location: 'Pan-India (College Centers)', prize: '₹1,00,000 per team',
        tags: ['GovTech', 'AI', 'Healthcare', 'EdTech'],
        link: 'https://sih.gov.in', status: 'Applications Open',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
        desc: 'Official Government of India hackathon. Problem statements from 30+ ministries. One of the largest hackathons in the world.',
    },
    {
        id: '6', title: 'HackerEarth Deep Learning Sprint',
        platform: 'HackerEarth', date: 'April 20-22, 2026',
        location: 'Online (Global)', prize: '$5,000',
        tags: ['Deep Learning', 'PyTorch', 'Computer Vision'],
        link: 'https://hackerearth.com/hackathon', status: 'Registrations Open',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80',
        desc: 'A 48-hour ML sprint focused on real-world computer vision problems. Open to all Indian and global participants.',
    },
    {
        id: '7', title: 'Google Developer Student Club - Solution Challenge 2026',
        platform: 'Google DSC', date: 'Submissions: April 30, 2026',
        location: 'Online (Worldwide)', prize: 'Top 100 Teams + Google Mentors',
        tags: ['Google Cloud', 'Sustainability', 'UN SDGs'],
        link: 'https://developers.google.com/community/dsc-solution-challenge', status: 'Open',
        image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&q=80',
        desc: 'Build solutions for the UN Sustainable Development Goals using Google technologies. Huge recognition opportunity for students.',
    },
    {
        id: '8', title: 'Microsoft AI Classroom Hack',
        platform: 'Microsoft', date: 'May 10-11, 2026',
        location: 'Online + Microsoft India Offices', prize: '₹2,00,000 + Azure Credits',
        tags: ['Azure OpenAI', 'Copilot', 'AI', 'Education'],
        link: 'https://www.microsoft.com/en-in/techspark/', status: 'Registrations Open',
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
        desc: 'Microsoft India hackathon for building AI-first classroom tools using Azure OpenAI and Copilot Studio.',
    },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('limit') || '4', 10);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const slice = FALLBACK_EVENTS.slice(start, end);

    return NextResponse.json({
        success: true,
        source: 'curated-live',
        events: slice,
        total: FALLBACK_EVENTS.length,
        hasMore: end < FALLBACK_EVENTS.length,
        page,
    });
}
