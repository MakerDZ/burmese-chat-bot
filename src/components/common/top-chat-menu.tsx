'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export function TopChatMenu() {
    const { isDark, textColor, backgroundColor } = useTelegramTheme();

    return (
        <div
            className="sticky top-0 z-10 w-full py-3 px-3 backdrop-blur-md"
            style={{
                backgroundColor: isDark
                    ? 'rgba(0,0,0,0.75)'
                    : 'rgba(255,255,255,0.75)',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
        >
            <div className="flex justify-center items-center">
                <div className="flex items-center gap-2">
                    <Image
                        src="https://i.pinimg.com/1200x/5d/98/e1/5d98e1f50ecd12004269fbfa0ada2a9d.jpg"
                        alt="logo"
                        width={32}
                        height={32}
                        className="rounded-md"
                    />
                    <span
                        className="text-sm font-bold"
                        style={{ color: textColor }}
                    >
                        Sakar Pyaw
                    </span>
                </div>
                {/* <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
                    style={{
                        backgroundColor: isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.05)',
                        color: textColor,
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="text-sm">Random Chat 🐱</span>
                </button> */}
            </div>
        </div>
    );
}
