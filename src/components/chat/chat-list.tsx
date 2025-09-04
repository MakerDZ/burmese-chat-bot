'use client';

import { ChatItem } from './chat-item';
import { ChatSkeleton } from './chat-skeleton';
import { toast } from 'sonner';

// Simulated data
const MOCK_CHATS = [
    {
        id: '1',
        title: 'The Future of AI',
        avatarUrl:
            'https://i.pinimg.com/736x/00/9f/c0/009fc09a302e18d5cb0c1ecc75d728e5.jpg',
        lastMessage: 'Great work facilitating the',
        time: 'Wed',
        isRead: true,
    },
    {
        id: '2',
        title: 'Duolingo Club',
        avatarUrl:
            'https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg',
        lastMessage: 'Great work facilitating the',
        time: 'Mon',
        hasNotification: true,
    },
    {
        id: '3',
        title: 'Dead Poet Society',
        avatarUrl:
            'https://i.pinimg.com/736x/00/75/0f/00750f89dbf6ee5cf715611752295701.jpg',
        lastMessage: 'Hey! you get my last message??',
        time: 'Sat',
        isRead: true,
    },
    {
        id: '4',
        title: 'Editing with AI',
        avatarUrl:
            'https://i.pinimg.com/736x/5f/b3/20/5fb320adf4f0dff66a98b9019fcb61c1.jpg',
        lastMessage: 'Great work facilitating the',
        time: 'Sat',
        isRead: true,
    },
];

interface ChatListProps {
    isLoading?: boolean;
}

export function ChatList({ isLoading }: ChatListProps) {
    const handleEndChat = (id: string) => {
        toast.success('Chat ended successfully');
        // Add your end chat logic here
    };

    const handleDeleteChat = (id: string) => {
        toast.success('Chat deleted successfully');
        // Add your delete chat logic here
    };

    if (isLoading) {
        return <ChatSkeleton />;
    }

    return (
        <div className="space-y-1">
            {MOCK_CHATS.map((chat) => (
                <ChatItem
                    key={chat.id}
                    id={chat.id}
                    title={chat.title}
                    avatarUrl={chat.avatarUrl}
                    lastMessage={chat.lastMessage}
                    time={chat.time}
                    isRead={chat.isRead}
                    hasNotification={chat.hasNotification}
                    onEndChat={handleEndChat}
                    onDeleteChat={handleDeleteChat}
                />
            ))}
        </div>
    );
}
