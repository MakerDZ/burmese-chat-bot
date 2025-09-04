'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface ChatHeaderProps {
    title: string;
    avatarUrl: string;
}

export function ChatHeader({ title, avatarUrl }: ChatHeaderProps) {
    const { isDark, textColor, backgroundColor } = useTelegramTheme();
    const router = useRouter();

    return (
        <div
            className="sticky top-0 z-10 w-full py-3 px-3 border-b backdrop-blur-md"
            style={{
                backgroundColor: isDark
                    ? 'rgba(0,0,0,0.75)'
                    : 'rgba(255,255,255,0.75)',
                borderColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                color: textColor,
            }}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                >
                    <ChevronLeft size={24} />
                </button>
                <Image
                    src={avatarUrl}
                    alt={title}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <span className="font-medium">{title}</span>
            </div>
        </div>
    );
}
