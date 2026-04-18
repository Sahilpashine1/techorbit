import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { messages, provider = 'gemini' } = await req.json();
    const userMessage = messages[messages.length - 1]?.content || '';

    // System prompt tailored for Indian tech career advisor
    const systemPrompt = `You are TechOrbit AI - an expert Indian tech career advisor. 
You specialize in:
- Indian tech job market (Razorpay, Flipkart, CRED, Swiggy, Zomato etc.)
- Salary negotiations in India (LPA format)
- DSA and system design interview prep for Indian companies
- Resume optimization for Naukri.com and LinkedIn India
- Career transitions to product companies vs service companies (TCS, Infosys vs unicorns)
- FAANG India interview preparation

Always give specific, actionable Indian context. Use Rs/LPA for salaries. Be encouraging but realistic.`;

    // Try OpenAI (ChatGPT)
    if (provider === 'openai' || provider === 'chatgpt') {
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey && openaiKey !== 'your-openai-api-key') {
            try {
                const res = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'system', content: systemPrompt }, ...messages],
                        max_tokens: 800,
                        temperature: 0.7,
                    }),
                });
                const data = await res.json();
                const reply = data.choices?.[0]?.message?.content;
                if (reply) return NextResponse.json({ reply, provider: 'ChatGPT (GPT-4o mini)' });
            } catch (e) { console.error('OpenAI error:', e); }
        }
    }

    // Try Google Gemini
    const geminiKey = process.env.GOOGLE_GEMINI_KEY;
    if (geminiKey && geminiKey !== 'your-gemini-api-key') {
        try {
            const geminiMessages = messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.role === 'system' ? `${systemPrompt}\n\n${m.content}` : m.content }],
            }));

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: geminiMessages,
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
                }),
            });
            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return NextResponse.json({ reply, provider: 'Google Gemini 1.5 Flash' });
        } catch (e) { console.error('Gemini error:', e); }
    }

    // Smart fallback responses for common Indian career questions
    const fallbackResponses: Record<string, string> = {
        default: `**TechOrbit AI** is here to help with your Indian tech career journey!\n\nWhile our AI models (ChatGPT & Gemini) need API keys configured, I can still guide you:\n\n**Popular queries:**\n- How to negotiate salary at Razorpay or Flipkart?\n- What DSA topics to prepare for Zomato/CRED interviews?\n- How to switch from TCS/Infosys to a product startup?\n- Resume tips for Naukri.com/LinkedIn India?\n\nTo enable **real AI responses**, add to .env.local:\n\`\`\`\nOPENAI_API_KEY=sk-...\nGOOGLE_GEMINI_KEY=AIza...\n\`\`\`\n\nGet free Gemini key at: https://makersuite.google.com/app/apikey`,
    };

    const lower = userMessage.toLowerCase();
    let reply = '';

    if (lower.includes('salary') || lower.includes('ctc') || lower.includes('lpa')) {
        reply = `**Salary Guide for Indian Tech Roles (2026)**\n\n**Fresher (0-1yr):**\nService companies (TCS/Infosys): Rs 3.5L-7L\nMid-tier startups: Rs 8L-15L\nProduct unicorns (CRED/Razorpay): Rs 15L-25L\n\n**Mid-level (3-6yr):**\nService companies: Rs 12L-20L\nStartup SDE-2: Rs 25L-50L\nTop FAANG India: Rs 60L-1.2Cr\n\n**Negotiation tips for India:**\n1. Always counter at least 15-20% above offer\n2. Mention competing offers (even informal ones)\n3. Factor in ESOPs at unicorns - they can double your CTC\n4. Delhi NCR negotiates differently than Bengaluru`;
    } else if (lower.includes('dsa') || lower.includes('interview') || lower.includes('leetcode')) {
        reply = `**DSA Prep for Indian Tech Companies (2026)**\n\n**For Product Unicorns (CRED, Razorpay, Swiggy):**\n- Array, String manipulation (Easy-Medium)\n- Sliding window, Two pointers\n- Binary Search\n- Graphs (BFS/DFS) - very common at Swiggy/Zomato\n- Dynamic Programming - Flipkart loves this\n\n**Platform Recommendations:**\n- LeetCode (must do 150 Neetcode problems)\n- GeeksforGeeks (for Indian company specific patterns)\n- Codeforces (for competitive rating, valued by Flipkart/Juspay)\n\n**Timeline:**\n- 3 months: 150 problems + System Design basics\n- 6 months: Ready for senior roles at unicorns`;
    } else if (lower.includes('resume') || lower.includes('naukri') || lower.includes('linkedin')) {
        reply = `**Resume Tips for Indian Job Market (2026)**\n\n**For Naukri.com:**\n- Update profile weekly (algorithm boosts fresh profiles)\n- Add "Open to Work" badge during active search\n- Use exact keywords from JDs (ATS-optimized)\n- Add certifications: AWS, GCP, Kubernetes\n\n**For LinkedIn India:**\n- Connect with 500+ people in your domain\n- Post 2-3 technical posts per week\n- Follow recruiters at target companies\n- Use "Easy Apply" + direct recruiter message combo\n\n**Resume Format for Indian companies:**\n1. Summary (2-3 lines with keywords)\n2. Skills (programming languages first)\n3. Experience (quantified with metrics in Rs/% improvement)\n4. Education (CGPA if 7.5+)\n5. Projects (GitHub links mandatory)`;
    } else if (lower.includes('switch') || lower.includes('service') || lower.includes('product')) {
        reply = `**Switching from Service to Product in India**\n\n**Timeline: Typically 6-18 months**\n\n**Phase 1: Skill Building (0-3 months)**\n- Build 2-3 strong side projects\n- Contribute to open source (GitHub green squares matter)\n- Get AWS/GCP certification\n\n**Phase 2: Network (2-4 months)**\n- LinkedIn messages to developers at target companies\n- Attend tech meetups in your city (Bengaluru/Hyderabad best)\n- Follow engineering blogs: Razorpay, Flipkart, CRED tech blogs\n\n**Phase 3: Applications**\n- Target: startups first, then unicorns, then FAANG\n- Angel.co, Instahyre, Cutshort (product company focused)\n- Referrals convert 8x better than direct applications\n\n**Realistic salary jump: 30-80% for first product role**`;
    } else {
        reply = fallbackResponses.default;
    }

    return NextResponse.json({ reply, provider: 'TechOrbit AI (Offline Mode - add API keys for GPT-4/Gemini)' });
}
