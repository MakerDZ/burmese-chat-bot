'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { toast } from 'sonner';
import { useRef, useEffect, useState } from 'react';

type Message = {
    _id: string;
    chatRoomId: string;
    senderUserId: string;
    message?: string;
    createdAt: number;
    senderProfile?: {
        avatarUrl: string;
        name: string;
    };
    attachments?: Array<{
        type: 'image' | 'video' | 'file';
        url: string;
    }>;
    replyToMessageId?: string;
    replyPreview?: {
        type: string;
        text: string;
    };
};

export default function ChatPage({ params }: { params: { id: string } }) {
    const { backgroundColor } = useTelegramTheme();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [replyTo, setReplyTo] = useState<{
        id: string;
        text: string;
        type: 'text' | 'image';
    } | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, []);

    const handleReply = (message: Message) => {
        setReplyTo({
            id: message._id,
            text: message.message || 'Photo',
            type: message.attachments?.length ? 'image' : 'text',
        });
    };

    const handleSendMessage = (text: string, files?: File[]) => {
        // Here you would normally send the message to your backend
        // For now, just show a toast
        toast.success(
            files?.length
                ? `Sending message with ${files.length} files...`
                : 'Sending message...'
        );
        setReplyTo(null);
        // Scroll to bottom after sending
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
            <ChatHeader
                title="Watermelon"
                avatarUrl="https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg"
            />
            <div className="flex-1 overflow-y-auto">
                <ChatMessages
                    messages={MOCK_MESSAGES}
                    currentUserId="current-user-id"
                    onReply={handleReply}
                />
                <div ref={bottomRef} />
            </div>
            <ChatInput
                onSendMessage={handleSendMessage}
                replyTo={replyTo || undefined}
                onCancelReply={() => setReplyTo(null)}
            />
        </div>
    );
}

const WATERMELON_PROFILE = {
    name: 'Watermelon',
    avatarUrl:
        'https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg',
};

// Mock data following the schema structure
const MOCK_MESSAGES: Message[] = [
    {
        _id: '1',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'Hey! Welcome to Sakar Pyaw 👋',
        createdAt: Date.now() - 50000,
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '2',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'Thanks! Nice to meet you 😊',
        createdAt: Date.now() - 45000,
    },
    {
        _id: '3',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'What kind of food do you like?',
        createdAt: Date.now() - 40000,
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '4',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'I love Mexican food! Especially tacos and salsa 🌮',
        createdAt: Date.now() - 35000,
    },
    {
        _id: '5',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'Oh, can you bring some salsa?',
        createdAt: Date.now() - 30000,
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '6',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'Yeah no worries, what kind? Super spicy or...?',
        createdAt: Date.now() - 25000,
    },
    {
        _id: '7',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'Check these out! My favorites 🔥',
        createdAt: Date.now() - 20000,
        attachments: [
            {
                type: 'image',
                url: 'https://i.pinimg.com/736x/5f/b3/20/5fb320adf4f0dff66a98b9019fcb61c1.jpg',
            },
            {
                type: 'image',
                url: 'https://i.pinimg.com/736x/da/2d/f6/da2df612c785b2cf2ee1437eb43516d7.jpg',
            },
        ],
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '8',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'Nice! I will get the first one',
        createdAt: Date.now() - 15000,
        replyToMessageId: '7',
        replyPreview: {
            type: 'image',
            text: 'Check these out! My favorites 🔥',
        },
    },
    {
        _id: '9',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'Great choice! That one is really good 👍',
        createdAt: Date.now() - 10000,
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '10',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'By the way, here is my favorite Mexican restaurant',
        createdAt: Date.now() - 5000,
    },
    {
        _id: '11',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        attachments: [
            {
                type: 'image',
                url: 'https://i.pinimg.com/736x/8c/77/e7/8c77e78c19b53672d393d3da338f5d8b.jpg',
            },
        ],
        createdAt: Date.now() - 4000,
    },
    {
        _id: '12',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'Oh wow! That looks amazing 😍',
        createdAt: Date.now() - 3000,
        replyToMessageId: '11',
        replyPreview: {
            type: 'image',
            text: '',
        },
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '13',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'We should definitely go there sometime!',
        createdAt: Date.now() - 2000,
        senderProfile: WATERMELON_PROFILE,
    },
    {
        _id: '14',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'Sure! Let me know when you are free 😊',
        createdAt: Date.now() - 1000,
    },
];
