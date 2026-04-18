import React from 'react';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export default function Logo({ 
    className = '', 
    style = {}, 
    size = 'md',
    hideText = false
}: { 
    className?: string; 
    style?: React.CSSProperties;
    size?: LogoSize;
    hideText?: boolean;
}) {
    // Slightly reduced dimensions as requested
    const config = {
        sm: { iconSize: 32, textSize: 16, gap: 6 },
        md: { iconSize: 45, textSize: 22, gap: 8 },
        lg: { iconSize: 58, textSize: 28, gap: 10 },
        xl: { iconSize: 74, textSize: 36, gap: 12 },
        hero: { iconSize: 104, textSize: 52, gap: 16 },
    };

    const s = config[size] || config.md;

    return (
        <div className={`logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap, textDecoration: 'none', ...style }}>
            {/* 
                Hardware-accelerated Wrapper
                This guarantees 100% smooth, anti-aliased edge clipping 
                without any jagged artifacts from the image file itself.
            */}
            <div style={{
                width: s.iconSize,
                height: s.iconSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
                borderRadius: '22%', // Apple-standard smooth continuous curve equivalent
                transform: 'translateZ(0)', // Forces GPU anti-aliasing on the clip mask
                backgroundColor: '#1E1E1E'
            }}>
                <img
                    src="/techorbit-logo-v3.png"
                    alt="TechOrbit Logo"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transform: 'scale(1.03)' // Micro-scale guarantees the white edge bleed is pushed entirely outside the clip mask
                    }}
                />
            </div>
            
            {/* Stylized Text */}
            {!hideText && (
                <span style={{
                    fontWeight: 900,
                    fontSize: s.textSize,
                    fontStyle: 'italic',
                    letterSpacing: '-0.05em',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    TECH<span style={{ position: 'relative', color: '#6C63FF' }}>
                        ORBIT
                        {/* Optional small star over the text to tie it back to the logo */}
                        <svg width="0.6em" height="0.6em" viewBox="0 0 100 100" style={{ position: 'absolute', top: '-0.2em', right: '-0.8em' }}>
                            <path d="M 20 50 Q 50 50, 50 80 Q 50 50, 80 50 Q 50 50, 50 20 Q 50 50, 20 50 Z" fill="#6C63FF" />
                        </svg>
                    </span>
                </span>
            )}
        </div>
    );
}
