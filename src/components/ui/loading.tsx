'use client';

import { useTelegram } from '@/providers/TelegramProvider';
import { useEffect, useState } from 'react';

export function Loading() {
    const { theme } = useTelegram();
    const [timeUntilRefresh, setTimeUntilRefresh] = useState(8);

    // Detect dark/light theme
    const isDarkTheme =
        theme?.bg_color?.toLowerCase().startsWith('#1') ||
        theme?.bg_color?.toLowerCase().startsWith('#2') ||
        theme?.bg_color?.toLowerCase().startsWith('#0');

    // useEffect(() => {
    //     // Start countdown
    //     const countdownInterval = setInterval(() => {
    //         setTimeUntilRefresh((prev) => {
    //             if (prev <= 1) {
    //                 clearInterval(countdownInterval);
    //                 window.location.reload();
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);

    //     // Cleanup
    //     return () => clearInterval(countdownInterval);
    // }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4"
            style={{
                backgroundColor: theme?.bg_color,
                color: theme?.text_color,
            }}
        >
            <div className="space-y-6 w-full max-w-md">
                {/* Profile Picture Skeleton */}
                <div className="flex flex-col items-center space-y-4">
                    <div
                        className="w-24 h-24 rounded-full animate-pulse"
                        style={{
                            backgroundColor: isDarkTheme
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.1)',
                        }}
                    />
                    <style jsx>{`
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                        .reload-icon {
                            transition: transform 0.2s ease;
                        }
                        .reload-icon:active {
                            animation: spin 1s linear infinite;
                        }
                    `}</style>
                    {/* <div
                        className="text-sm opacity-70"
                        style={{ color: theme?.text_color }}
                    >
                        Refreshing in {timeUntilRefresh}s...
                    </div> */}
                </div>

                {/* Form Fields Skeleton */}
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div
                            className="h-4 w-24 rounded animate-pulse"
                            style={{
                                backgroundColor: isDarkTheme
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'rgba(0,0,0,0.1)',
                            }}
                        />
                        <div
                            className={`h-12 w-full rounded animate-pulse ${
                                i === 1 ? 'h-24' : 'h-12'
                            }`}
                            style={{
                                backgroundColor: isDarkTheme
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'rgba(0,0,0,0.1)',
                            }}
                        />
                    </div>
                ))}

                {/* Submit Button Skeleton */}
                <div
                    className="h-12 w-full rounded animate-pulse"
                    style={{
                        backgroundColor: isDarkTheme
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.1)',
                    }}
                />
            </div>
        </div>
    );
}
