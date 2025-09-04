'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import Image from 'next/image';
import { useState } from 'react';
import { useLongPress } from 'use-long-press';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Copy, Reply, Image as ImageIcon } from 'lucide-react';
import { ProfileDialog } from '@/components/profile/profile-dialog';

export interface Message {
    _id: string;
    chatRoomId: string;
    senderUserId: string;
    message?: string;
    createdAt: number;
    senderProfile?: {
        telegramId: string;
        avatarUrl: string;
        name: string;
        bio?: string;
        gender?: 'male' | 'female';
        bornYear?: number;
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
}

interface ChatMessagesProps {
    messages: Message[];
    currentUserId: string;
    onReply?: (message: Message) => void;
    onImageLoad?: () => void;
}

export function ChatMessages({
    messages,
    currentUserId,
    onReply,
    onImageLoad,
}: ChatMessagesProps) {
    const { isDark, textColor } = useTelegramTheme();
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null
    );

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
        setSelectedMessageId(null);
    };

    return (
        <div className="flex flex-col gap-2 p-4">
            {messages.map((message) => {
                const isMe = message.senderUserId === currentUserId;

                return (
                    <ContextMenu
                        key={message._id}
                        onOpenChange={(open) => {
                            if (!open) setSelectedMessageId(null);
                        }}
                    >
                        <ContextMenuTrigger asChild>
                            <div
                                {...useLongPress(
                                    () => {
                                        if (
                                            typeof navigator !== 'undefined' &&
                                            navigator.vibrate
                                        ) {
                                            navigator.vibrate(50);
                                        }
                                        setSelectedMessageId(message._id);
                                    },
                                    {
                                        threshold: 500,
                                        cancelOnMovement: true,
                                    }
                                )}
                                onContextMenu={(e) => {
                                    // Prevent context menu during long press
                                    if (selectedMessageId === message._id) {
                                        e.preventDefault();
                                    }
                                }}
                                className={`flex items-end gap-2 ${
                                    isMe ? 'flex-row-reverse' : ''
                                }`}
                            >
                                {!isMe && message.senderProfile && (
                                    <ProfileDialog
                                        profile={message.senderProfile}
                                        trigger={
                                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80">
                                                <Image
                                                    src={
                                                        message.senderProfile
                                                            .avatarUrl
                                                    }
                                                    alt={
                                                        message.senderProfile
                                                            .name
                                                    }
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                    draggable={false}
                                                    onLoad={onImageLoad}
                                                />
                                            </div>
                                        }
                                    />
                                )}
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 select-none ${
                                        isMe
                                            ? 'bg-purple-500 text-white'
                                            : isDark
                                              ? 'bg-[#2C2C2C] text-white'
                                              : 'bg-black/5 text-black'
                                    }`}
                                >
                                    {/* Reply Preview */}
                                    {message.replyPreview && (
                                        <div
                                            className={`mb-2 p-2 rounded-lg text-sm flex items-center gap-2 ${
                                                isDark
                                                    ? 'bg-white/10'
                                                    : 'bg-black/10'
                                            }`}
                                        >
                                            {message.replyPreview.type ===
                                                'image' && (
                                                <ImageIcon size={16} />
                                            )}
                                            <span className="line-clamp-1">
                                                {message.replyPreview.text}
                                            </span>
                                        </div>
                                    )}

                                    {/* Image Attachments */}
                                    {message.attachments?.map(
                                        (attachment, index) => {
                                            if (attachment.type === 'image') {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="mb-2 rounded-lg overflow-hidden"
                                                    >
                                                        <Image
                                                            src={attachment.url}
                                                            alt="Attachment"
                                                            width={300}
                                                            height={200}
                                                            className="w-full object-cover"
                                                            draggable={false}
                                                            onLoad={onImageLoad}
                                                            priority={index < 3} // Load first few images with priority
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }
                                    )}

                                    {/* Message Text */}
                                    {message.message && (
                                        <p className="break-words">
                                            {message.message}
                                        </p>
                                    )}

                                    {/* Timestamp */}
                                    <span
                                        className={`text-xs mt-1 block ${
                                            isMe
                                                ? 'text-white/70'
                                                : isDark
                                                  ? 'text-white/50'
                                                  : 'text-black/50'
                                        }`}
                                    >
                                        {new Date(
                                            message.createdAt
                                        ).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem
                                onClick={() => {
                                    if (message.message) {
                                        handleCopyText(message.message);
                                    }
                                }}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy Text</span>
                            </ContextMenuItem>
                            <ContextMenuItem
                                onClick={() => {
                                    setSelectedMessageId(null);
                                    onReply?.(message);
                                }}
                            >
                                <Reply className="mr-2 h-4 w-4" />
                                <span>Reply</span>
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                );
            })}
        </div>
    );
}