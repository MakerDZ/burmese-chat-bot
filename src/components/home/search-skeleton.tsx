import { useTelegramTheme } from '@/hooks/useTelegramTheme';

export function SearchSkeleton() {
    const { isDark } = useTelegramTheme();
    const skeletonColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    return (
        <div className="overflow-y-auto flex-1">
            {/* Top Menu Skeleton */}
            <div className="flex justify-between items-center p-2">
                <div
                    className="h-8 w-24 rounded animate-pulse"
                    style={{ backgroundColor: skeletonColor }}
                />
                <div
                    className="h-8 w-8 rounded animate-pulse"
                    style={{ backgroundColor: skeletonColor }}
                />
            </div>

            {/* Image Area Skeleton */}
            <div className="relative w-full h-[260px] overflow-hidden mb-4">
                <div
                    className="w-full h-full rounded-b-lg animate-pulse"
                    style={{ backgroundColor: skeletonColor }}
                />
                {/* Aesthetic overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 rounded-b-lg" />
            </div>

            {/* Text Skeleton */}
            <div className="flex flex-col items-center gap-2 my-4">
                <div
                    className="h-5 w-48 rounded animate-pulse"
                    style={{ backgroundColor: skeletonColor }}
                />
                <div
                    className="h-5 w-64 rounded animate-pulse"
                    style={{ backgroundColor: skeletonColor }}
                />
            </div>

            {/* Button Skeleton */}
            <div className="flex justify-center items-center flex-1 pt-4">
                <div
                    className="w-11/12 h-11 rounded animate-pulse"
                    style={{ backgroundColor: skeletonColor }}
                />
            </div>
        </div>
    );
}
