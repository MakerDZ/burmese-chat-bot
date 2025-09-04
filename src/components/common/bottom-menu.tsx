'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function BottomMenu() {
    const { isDark, textColor, backgroundColor } = useTelegramTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const shouldShowMenu = !(pathname && /^\/[0-9a-f-]+$/.test(pathname));

    if (!shouldShowMenu) {
        return null;
    }

    return (
        <div
            className="fixed bottom-0 w-full flex justify-center items-center py-3 px-4 border-t"
            style={{
                backgroundColor,
                borderColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
            }}
        >
            <div className="flex gap-8 items-center">
                <Link href="/" className="flex flex-col items-center">
                    <div
                        className={`p-2 rounded-lg transition-colors ${pathname === '/' ? (isDark ? 'bg-white/10' : 'bg-black/10') : ''}`}
                        style={{ color: textColor }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <span
                        className="text-xs mt-0.5"
                        style={{ color: textColor }}
                    >
                        Chats
                    </span>
                </Link>

                <div className="w-10 h-10 "></div>

                <Link href="/profile" className="flex flex-col items-center">
                    <div
                        className={`p-2 rounded-lg transition-colors ${pathname === '/profile' ? (isDark ? 'bg-white/10' : 'bg-black/10') : ''}`}
                        style={{ color: textColor }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="8" r="5" />
                            <path d="M20 21a8 8 0 1 0-16 0" />
                        </svg>
                    </div>
                    <span
                        className="text-xs mt-0.5"
                        style={{ color: textColor }}
                    >
                        Profile
                    </span>
                </Link>
            </div>
        </div>
    );
}
