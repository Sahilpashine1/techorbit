import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });

    try {
        const res = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                query: `
                    query userProblemsSolved($username: String!) {
                        matchedUser(username: $username) {
                            submitStatsGlobal { 
                                acSubmissionNum { difficulty count } 
                            }
                        }
                    }
                `,
                variables: { username }
            })
        });

        const data = await res.json();
        const stats = data.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
        
        if (!stats) return NextResponse.json({ error: 'User not found or profile is private' }, { status: 404 });

        const solved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
        const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
        const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
        const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;

        return NextResponse.json({ 
            platform: 'LeetCode', 
            username, 
            solved, 
            easy, 
            medium, 
            hard,
            status: 'success'
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
