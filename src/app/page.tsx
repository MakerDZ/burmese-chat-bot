'use client';

import { TopChatMenu } from '@/components/common/top-chat-menu';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { useValidateTelegramUser } from '@/hooks/useValidateTelegramUser';
import { ChatList } from '@/components/chat/chat-list';

export default function Home() {
    const {
        user,
        profile,
        isLoading: isUserLoading,
        isValidating,
        error,
    } = useValidateTelegramUser();
    const { backgroundColor } = useTelegramTheme();

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            >
                <TopChatMenu />
                <ChatList isLoading={isUserLoading || isValidating} />
            </div>
        );
    }

    return (
        <div
            className="flex flex-col min-h-screen w-full pb-20"
            style={{ backgroundColor }}
        >
            <TopChatMenu />
            <div className="overflow-y-auto flex-1">
                <ChatList isLoading={isUserLoading || isValidating} />
            </div>
        </div>
    );
}