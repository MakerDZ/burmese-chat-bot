'use client';

import { useTelegram } from '@/providers/TelegramProvider';
import { useEffect, useState } from 'react';

export default function Home() {
    const { user, initData, theme } = useTelegram();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Simple function to detect dark/light theme
    const isDarkTheme =
        theme?.bg_color?.toLowerCase().startsWith('#1') ||
        theme?.bg_color?.toLowerCase().startsWith('#2') ||
        theme?.bg_color?.toLowerCase().startsWith('#0');

    return (
        <main className="p-6">
            <h1 className="text-xl font-bold">
                Hello from Telegram Mini App 👋
            </h1>

            {/* Simple theme indicator */}
            {mounted && theme && (
                <p className="mt-2">
                    Current theme: {isDarkTheme ? 'Dark' : 'Light'}
                </p>
            )}

            {/* Render a loading state during SSR and initial client render */}
            {!mounted ? (
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                </div>
            ) : user ? (
                <div>
                    <p suppressHydrationWarning>User ID: {user.id}</p>
                    <p suppressHydrationWarning>
                        Name: {user.first_name} {user.last_name}
                    </p>
                    <p suppressHydrationWarning>Username: @{user.username}</p>
                    <p suppressHydrationWarning>
                        Language: {user.language_code}
                    </p>
                    <pre
                        className="p-2 mt-2 rounded bg-gray-100"
                        suppressHydrationWarning
                    >
                        {initData}
                    </pre>
                </div>
            ) : (
                <p style={{ color: theme?.hint_color }}>
                    No Telegram user detected (are you opening inside Telegram?)
                </p>
            )}
        </main>
    );
}
