'use client';
import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - var(--nav-height, 64px))', paddingTop: 'var(--nav-height, 64px)' }}>
                {children}
            </main>
            <Footer />
        </SessionProvider>
    );
}
