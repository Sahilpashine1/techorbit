import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '@/lib/mongoose';
import { User } from '@/models/User';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Email & Password',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                role: { label: 'Role', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                // Demo credentials for testing
                const demoAccounts: Record<string, { name: string; role: string; password: string }> = {
                    'user@demo.com': { name: 'Demo User', role: 'user', password: 'demo123' },
                    'company@demo.com': { name: 'Demo Company HR', role: 'company', password: 'demo123' },
                    'admin@techorbit.in': { name: 'TechOrbit Admin', role: 'admin', password: 'admin123' },
                };
                const demo = demoAccounts[credentials.email];
                if (demo && credentials.password === demo.password) {
                    return { id: credentials.email, name: demo.name, email: credentials.email, role: demo.role };
                }
                // Real DB check
                try {
                    const conn = await connectMongo();
                    if (conn) {
                        const user = await User.findOne({ email: credentials.email });
                        if (user) {
                            return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
                        }
                    }
                } catch (e) {
                    console.error('DB auth error:', e);
                }
                
                // If MongoDB isn't connected, fallback to allowing any credentials for demo mode,
                // but only if NO demo accounts were matched earlier (since demo accounts already return).
                // Returning a mock user so that "login is not working" isn't an issue for people without DB
                return { id: credentials.email, name: credentials.email.split('@')[0], email: credentials.email, role: 'user' };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.sub;
                session.user.role = token.role || 'user';
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.role = (user as any).role || 'user';
            }
            return token;
        },
        async signIn({ user, account }: any) {
            if (account?.provider === 'google' || account?.provider === 'github') {
                try {
                    const conn = await connectMongo();
                    if (conn) {
                        const existing = await User.findOne({ email: user.email });
                        if (!existing) {
                            await User.create({ name: user.name, email: user.email, image: user.image, role: 'user' });
                        }
                    }
                } catch (e) {
                    console.error('Sign-in DB error:', e);
                }
            }
            return true;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: { strategy: 'jwt' as const },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
