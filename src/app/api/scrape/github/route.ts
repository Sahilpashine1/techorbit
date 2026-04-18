import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });

    try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
            headers: { 
                'User-Agent': 'TechOrbit-App'
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
        }

        const data = await res.json();

        return NextResponse.json({ 
            platform: 'GitHub', 
            username: data.login, 
            repos: data.public_repos, 
            followers: data.followers,
            avatar: data.avatar_url,
            status: 'success'
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
