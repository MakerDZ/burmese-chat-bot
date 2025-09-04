'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import Image from 'next/image';
import { useState } from 'react';
import { useLongPress } from 'use-long-press';
import { useRouter } from 'next/navigation';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash2, XCircle } from 'lucide-react';

interface ChatItemProps {
    id: string;
    title: string;
    avatarUrl: string;
    lastMessage: string;
    time: string;
    isRead?: boolean;
    hasNotification?: boolean;
    onEndChat?: (id: string) => void;
    onDeleteChat?: (id: string) => void;
}

export function ChatItem({
    id,
    title,
    avatarUrl,
    lastMessage,
    time,
    isRead,
    hasNotification,
    onEndChat,
    onDeleteChat,
}: ChatItemProps) {
    const { isDark, textColor } = useTelegramTheme();
    const [isLongPressed, setIsLongPressed] = useState(false);
    const router = useRouter();

    const bind = useLongPress(
        () => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }
            setIsLongPressed(true);
        },
        {
            threshold: 500,
            cancelOnMovement: true,
            onCancel: (event) => {
                // If it wasn't a long press, treat it as a normal click
                router.push(`/chat/${id}`);
            },
        }
    );

    return (
        <ContextMenu onOpenChange={setIsLongPressed}>
            <ContextMenuTrigger asChild>
                <button
                    {...bind()}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors select-none touch-none
                        ${isLongPressed ? (isDark ? 'bg-white/10' : 'bg-black/5') : ''}`}
                    style={{ color: textColor }}
                >
                    <Image
                        src={avatarUrl}
                        alt={title}
                        width={48}
                        height={48}
                        className="rounded-lg"
                        draggable={false}
                    />
                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline gap-2">
                            <p className="font-medium truncate select-none">
                                {title}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                                {hasNotification && (
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                )}
                                <span
                                    className="text-xs select-none"
                                    style={{ opacity: 0.5 }}
                                >
                                    {time}
                                </span>
                                {isRead && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ opacity: 0.5 }}
                                    >
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <p
                            className="text-sm truncate select-none"
                            style={{ opacity: 0.7 }}
                        >
                            {lastMessage}
                        </p>
                    </div>
                </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    className="text-red-500 dark:text-red-400"
                    onClick={() => {
                        setIsLongPressed(false);
                        onEndChat?.(id);
                    }}
                >
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>End Chat</span>
                </ContextMenuItem>
                <ContextMenuItem
                    className="text-red-500 dark:text-red-400"
                    onClick={() => {
                        setIsLongPressed(false);
                        onDeleteChat?.(id);
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
