'use client';

import { useTelegram } from '@/providers/TelegramProvider';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { ChatList } from '@/components/chat/chat-list';

export default function Home() {
    const { initData, user, validationError } = useTelegram();
    const { backgroundColor } = useTelegramTheme();

    if (validationError || !initData || !user) {
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
                <ChatList isLoading={false} />
            </div>
        </div>
    );
}
