'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { useValidateTelegramUser } from '@/hooks/useValidateTelegramUser';
import { ChatList } from '@/components/chat/chat-list';

export default function Home() {
    const {
        user,
        isLoading: isUserLoading,
        isValidating,
        error,
    } = useValidateTelegramUser();
    const { backgroundColor } = useTelegramTheme();

    if (isUserLoading || isValidating) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            >
                <ChatList isLoading={true} />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            >
                <ChatList isLoading={true} />
            </div>
        );
    }

    return (
        <div
            className="flex flex-col min-h-screen w-full pb-20"
            style={{ backgroundColor }}
        >
            <div className="overflow-y-auto flex-1">
                <ChatList isLoading={isUserLoading || isValidating} />
            </div>
        </div>
    );
}
