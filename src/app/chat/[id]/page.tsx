'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { toast } from 'sonner';
import {
    useRef,
    useEffect,
    useState,
    useLayoutEffect,
    useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

import type { Message } from '@/components/chat/chat-messages';

export default function ChatPage({ params }: { params: { id: string } }) {
    const { backgroundColor } = useTelegramTheme();
    const router = useRouter();
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const hasScrolledToBottomRef = useRef(false);
    const [replyTo, setReplyTo] = useState<{
        id: string;
        text: string;
        type: 'text' | 'image';
    } | null>(null);

    // Reset scroll flag when component mounts
    useEffect(() => {
        hasScrolledToBottomRef.current = false;
    }, []);

    // Improved scroll to bottom function
    const scrollToBottom = useCallback(
        (behavior: 'smooth' | 'auto' = 'auto') => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer && bottomRef.current) {
                // Use scrollIntoView first
                bottomRef.current.scrollIntoView({
                    behavior,
                    block: 'end',
                    inline: 'nearest',
                });

                // Then force scroll to absolute bottom as backup
                requestAnimationFrame(() => {
                    if (scrollContainer) {
                        scrollContainer.scrollTop =
                            scrollContainer.scrollHeight;
                    }
                });

                hasScrolledToBottomRef.current = true;
            }
        },
        []
    );

    // Handle image load events to re-scroll
    const handleImageLoad = useCallback(() => {
        if (!hasScrolledToBottomRef.current) {
            // Small delay to ensure DOM is updated
            setTimeout(() => scrollToBottom(), 50);
        }
    }, [scrollToBottom]);

    useLayoutEffect(() => {
        if (MOCK_MESSAGES.length > 0 && !hasScrolledToBottomRef.current) {
            // Multiple attempts with increasing delays to handle async content loading
            const scrollAttempts = [0, 100, 300, 500];

            scrollAttempts.forEach((delay, index) => {
                setTimeout(() => {
                    if (
                        !hasScrolledToBottomRef.current ||
                        index === scrollAttempts.length - 1
                    ) {
                        scrollToBottom();
                    }
                }, delay);
            });

            // Set up a ResizeObserver to handle dynamic content size changes
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer && 'ResizeObserver' in window) {
                const resizeObserver = new ResizeObserver(() => {
                    if (!hasScrolledToBottomRef.current) {
                        scrollToBottom();
                    }
                });

                resizeObserver.observe(scrollContainer);

                return () => {
                    resizeObserver.disconnect();
                };
            }
        }
    }, [MOCK_MESSAGES.length, scrollToBottom]);

    const handleReply = (message: Message) => {
        setReplyTo({
            id: message._id,
            text: message.message || 'Photo',
            type: message.attachments?.length ? 'image' : 'text',
        });
    };

    const handleSendMessage = (text: string, files?: File[]) => {
        toast.success(
            files?.length
                ? `Sending message with ${files.length} files...`
                : 'Sending message...'
        );
        setReplyTo(null);

        // Reset scroll flag so new messages will trigger scroll
        hasScrolledToBottomRef.current = false;
    };

    const handleEndChat = () => {
        handleSendMessage('I need to end this conversation. Take care! 👋');
        toast.info('Chat ended');
    };

    const handleEndAndDeleteChat = () => {
        toast.info('Chat ended and deleted');
        // Navigate back to home page after a short delay
        setTimeout(() => {
            router.push('/chat');
        }, 1000);
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
            <ChatHeader
                title="Watermelon"
                avatarUrl="https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg"
                profile={{
                    telegramId: 'watermelon123',
                    avatarUrl:
                        'https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg',
                    name: 'Watermelon',
                    bio: 'I love Mexican food! 🌮',
                    gender: 'female',
                    bornYear: 1995,
                }}
                onEndChat={handleEndChat}
                onEndAndDeleteChat={handleEndAndDeleteChat}
            />
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto"
                style={{ scrollBehavior: 'smooth' }}
            >
                <ChatMessages
                    senderProfile={{
                        _id: 'watermelon123',
                        userId: 'watermelon123',
                        avatarUrl:
                            'https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg',
                        name: 'Watermelon',
                        bio: 'I love Mexican food! 🌮',
                        gender: 'female' as const,
                        bornYear: 1995,
                    }}
                    messages={MOCK_MESSAGES}
                    currentUserId="current-user-id"
                    onReply={handleReply}
                    onImageLoad={handleImageLoad}
                />
                {/* Add some padding to ensure the bottom ref is clearly at the bottom */}
                <div ref={bottomRef} className="h-4" />
            </div>
            <ChatInput
                onSendMessage={handleSendMessage}
                replyTo={replyTo || undefined}
                onCancelReply={() => setReplyTo(null)}
            />
        </div>
    );
}

// Mock data following the schema structure
const MOCK_MESSAGES: Message[] = [
    {
        _id: '1',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'Hey! Welcome to Sakar Pyaw 👋',
        createdAt: Date.now() - 50000,
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
    },
    {
        _id: '13',
        chatRoomId: 'room-1',
        senderUserId: 'other-user-id',
        message: 'We should definitely go there sometime!',
        createdAt: Date.now() - 2000,
    },
    {
        _id: '14',
        chatRoomId: 'room-1',
        senderUserId: 'current-user-id',
        message: 'Sure! Let me know when you are free 😊',
        createdAt: Date.now() - 1000,
    },
];
