'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { }, toggle: () => { } });
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const saved = localStorage.getItem('theme') || 'dark';
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
    }, []);

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };
    const toggleTheme = toggle;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}
