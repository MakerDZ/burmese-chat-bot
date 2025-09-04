'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';

export function ChatSkeleton() {
    const { isDark } = useTelegramTheme();
    const skeletonColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    return (
        <div className="space-y-2 p-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                    {/* Avatar skeleton */}
                    <div
                        className="w-12 h-12 rounded-lg animate-pulse"
                        style={{ backgroundColor: skeletonColor }}
                    />

                    <div className="flex-1 min-w-0">
                        {/* Title and time skeleton */}
                        <div className="flex justify-between items-center gap-2 mb-1">
                            <div
                                className="h-4 w-32 rounded animate-pulse"
                                style={{ backgroundColor: skeletonColor }}
                            />
                            <div
                                className="h-3 w-10 rounded animate-pulse shrink-0"
                                style={{ backgroundColor: skeletonColor }}
                            />
                        </div>
                        {/* Message preview skeleton */}
                        <div
                            className="h-3 w-48 rounded animate-pulse"
                            style={{ backgroundColor: skeletonColor }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
