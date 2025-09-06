'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { HomeHeader } from '@/components/home/home-header';
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

import type { Message } from '@/components/chat/chat-messages';
import type { Id } from '../../../convex/_generated/dataModel';
import { useGetMatchingRoom } from '@/hooks/useChatRoom';
import { type TelegramProfile } from '@/providers/TelegramProvider';
import { useMessages } from '@/hooks/useMessages';
import { api } from '../../../convex/_generated/api';
import { useMutation } from 'convex/react';

interface NotSearchingProps {
    initData: string;
    chatRoomId: Id<'chatRooms'>;
    myProfile: TelegramProfile;
    onEndChat?: () => void;
    onNewPartner?: () => void;
}

export function NotSearching({
    initData,
    myProfile,
    onEndChat,
    onNewPartner,
    chatRoomId,
}: NotSearchingProps) {
    const sendMessage = useMutation(api.message.sendMessage);
    const { data: chatRoom, isLoading: isGetMatchingRoomLoading } =
        useGetMatchingRoom(initData, chatRoomId);

    const { data: messages, isLoading: isMessagesLoading } = useMessages(
        initData,
        chatRoomId
    );

    const myPartner = chatRoom?.participantProfiles.find(
        (profile) => profile.userId !== myProfile.userId
    );

    const { backgroundColor } = useTelegramTheme();
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const hasScrolledToBottomRef = useRef(false);
    const [replyTo, setReplyTo] = useState<{
        id: string;
        text: string;
        type: 'text' | 'image';
    } | null>(null);
    const [isFriendAdded, setIsFriendAdded] = useState(false); // Track if partner is already added as friend

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
        if (
            messages?.length &&
            messages.length > 0 &&
            !hasScrolledToBottomRef.current
        ) {
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
    }, [messages?.length, scrollToBottom]);

    const handleReply = (message: Message) => {
        setReplyTo({
            id: message._id,
            text: message.message || 'Photo',
            type: message.attachments?.length ? 'image' : 'text',
        });
    };

    const handleSendMessage = async (text: string, files?: File[]) => {
        await sendMessage({
            initData,
            chatRoomId,
            senderUserId: myProfile.userId as Id<'users'>,
            message: text,
            replyToMessageId: replyTo?.id as Id<'chatMessages'> | undefined,
        });

        setReplyTo(null);

        // Reset scroll flag so new messages will trigger scroll
        hasScrolledToBottomRef.current = false;
    };

    // Click management functions for dropdown menu
    const handleAddFriend = useCallback(() => {
        if (isFriendAdded) {
            // Accept friend request
            handleSendMessage("I'd like to accept your friend request! 🤝");
            toast.success('Friend request accepted!');
        } else {
            // Send friend request
            handleSendMessage('Hi! Would you like to be friends? 👋');
            toast.success('Friend request sent!');
        }
        setIsFriendAdded(true);
    }, [isFriendAdded, handleSendMessage]);

    const handleEndChat = useCallback(() => {
        handleSendMessage(
            'I think we should end our conversation here. Take care! 👋'
        );
        toast.info('Chat ended');
        // Call parent callback to change state
        onEndChat?.();
    }, [handleSendMessage, onEndChat]);

    const handleNewPartner = useCallback(() => {
        handleSendMessage(
            'I think we should find new conversation partners. What do you think? 💭'
        );
        toast.info('New partner request sent');
        // Call parent callback to simulate searching
        onNewPartner?.();
    }, [handleSendMessage, onNewPartner]);

    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
            <HomeHeader
                title={myPartner?.name || ''}
                avatarUrl={
                    myPartner?.avatarUrl ||
                    'https://i.pinimg.com/736x/00/9f/c0/009fc09a302e18d5cb0c1ecc75d728e5.jpg'
                }
                profile={myPartner}
                isFriendAdded={isFriendAdded}
                onAddFriend={handleAddFriend}
                onEndChat={handleEndChat}
                onNewPartner={handleNewPartner}
            />
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto pb-[120px]"
                style={{ scrollBehavior: 'smooth' }}
            >
                <ChatMessages
                    messages={messages || []}
                    currentUserId={myProfile.userId}
                    senderProfile={myPartner}
                    onReply={handleReply}
                    onImageLoad={handleImageLoad}
                />
                {/* Add some padding to ensure the bottom ref is clearly at the bottom */}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Fixed ChatInput positioned above bottom menu */}
            <div className="fixed bottom-[79px] left-0 right-0 z-20">
                <ChatInput
                    onSendMessage={handleSendMessage}
                    replyTo={replyTo || undefined}
                    onCancelReply={() => setReplyTo(null)}
                />
            </div>
        </div>
    );
}

