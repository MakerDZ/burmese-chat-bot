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

export interface Profile {
    _id: string;
    userId: string;
    avatarUrl: string;
    name: string;
    bio?: string;
    gender?: 'male' | 'female';
    bornYear?: number;
}

export interface Message {
    _id: string;
    chatRoomId: string;
    senderUserId: string;
    message?: string;
    createdAt: number;
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
    senderProfile?: Profile;
    onReply?: (message: Message) => void;
    onImageLoad?: () => void;
}

interface MessageItemProps {
    message: Message;
    isMe: boolean;
    senderProfile?: Profile;
    isDark: boolean;
    selectedMessageId: string | null;
    onImageLoad?: () => void;
    onReply?: (message: Message) => void;
    onCopyText: (text: string) => void;
    onSelectedMessageChange: (id: string | null) => void;
}

function MessageItem({
    message,
    isMe,
    senderProfile,
    isDark,
    selectedMessageId,
    onImageLoad,
    onReply,
    onCopyText,
    onSelectedMessageChange,
}: MessageItemProps) {
    const bind = useLongPress(
        () => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }
            onSelectedMessageChange(message._id);
        },
        {
            threshold: 500,
            cancelOnMovement: true,
        }
    );

    return (
        <ContextMenu
            onOpenChange={(open) => {
                if (!open) onSelectedMessageChange(null);
            }}
        >
            <ContextMenuTrigger asChild>
                <div
                    {...bind}
                    onContextMenu={(e) => {
                        if (selectedMessageId === message._id) {
                            e.preventDefault();
                        }
                    }}
                    className={`flex items-end gap-2 ${
                        isMe ? 'flex-row-reverse' : ''
                    }`}
                >
                    {!isMe && senderProfile && (
                        <ProfileDialog
                            profile={{
                                _id: senderProfile._id,
                                userId: senderProfile.userId,
                                avatarUrl: senderProfile.avatarUrl,
                                name: senderProfile.name,
                                bio: senderProfile.bio,
                                gender: senderProfile.gender,
                                bornYear: senderProfile.bornYear,
                            }}
                            trigger={
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80">
                                    <Image
                                        src={senderProfile.avatarUrl}
                                        alt={senderProfile.name}
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
                    {!isMe && !senderProfile && (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200" />
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
                                    isDark ? 'bg-white/10' : 'bg-black/10'
                                }`}
                            >
                                {message.replyPreview.type === 'image' && (
                                    <ImageIcon size={16} />
                                )}
                                <span className="line-clamp-1">
                                    {message.replyPreview.text}
                                </span>
                            </div>
                        )}

                        {/* Image Attachments */}
                        {message.attachments?.map((attachment, index) => {
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
                                            priority={index < 3}
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}

                        {/* Message Text */}
                        {message.message && (
                            <p className="break-words">{message.message}</p>
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
                            {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                }
                            )}
                        </span>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={() => {
                        if (message.message) {
                            onCopyText(message.message);
                        }
                    }}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Text</span>
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={() => {
                        onSelectedMessageChange(null);
                        onReply?.(message);
                    }}
                >
                    <Reply className="mr-2 h-4 w-4" />
                    <span>Reply</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export function ChatMessages({
    messages,
    currentUserId,
    senderProfile,
    onReply,
    onImageLoad,
}: ChatMessagesProps) {
    const { isDark } = useTelegramTheme();
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null
    );

    const handleCopyText = (text: string) => {
        navigator.clipboard.writeText(text);
        setSelectedMessageId(null);
    };

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full my-16 p-8 text-center">
                <svg
                    className="w-16 h-16 mb-3 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M8 10h.01" />
                    <path d="M12 10h.01" />
                    <path d="M16 10h.01" />
                </svg>
                <h3
                    className={`text-xl font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    No messages yet
                </h3>
                <p
                    className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                    🙊 စာစပို့ပြီးစကားပြောလို့ရပါပြီ !!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            {messages.map((message) => {
                const isMe = message.senderUserId === currentUserId;
                return (
                    <MessageItem
                        key={message._id}
                        message={message}
                        isMe={isMe}
                        senderProfile={senderProfile}
                        isDark={isDark}
                        selectedMessageId={selectedMessageId}
                        onImageLoad={onImageLoad}
                        onReply={onReply}
                        onCopyText={handleCopyText}
                        onSelectedMessageChange={setSelectedMessageId}
                    />
                );
            })}
        </div>
    );
}