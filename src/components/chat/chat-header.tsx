'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MoreVertical, MessageSquare, Trash2 } from 'lucide-react';
import { ProfileDialog } from '@/components/profile/profile-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ChatHeaderProps {
    title: string;
    avatarUrl: string;
    profile?: {
        telegramId: string;
        avatarUrl: string;
        name: string;
        bio?: string;
        gender?: 'male' | 'female';
        bornYear?: number;
    };
    onEndChat?: () => void;
    onEndAndDeleteChat?: () => void;
}

export function ChatHeader({
    title,
    avatarUrl,
    profile,
    onEndChat,
    onEndAndDeleteChat,
}: ChatHeaderProps) {
    const { isDark, textColor, backgroundColor } = useTelegramTheme();
    const router = useRouter();

    return (
        <div
            className="sticky top-0 z-10 w-full py-3 px-3 border-b backdrop-blur-md"
            style={{
                backgroundColor: isDark
                    ? 'rgba(0,0,0,0.75)'
                    : 'rgba(255,255,255,0.75)',
                borderColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                color: textColor,
            }}
        >
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                >
                    <ChevronLeft size={24} />
                </button>

                {profile ? (
                    <ProfileDialog
                        profile={profile}
                        trigger={
                            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                                <Image
                                    src={avatarUrl}
                                    alt={title}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <span className="font-medium">{title}</span>
                            </div>
                        }
                    />
                ) : (
                    <div className="flex items-center gap-3">
                        <Image
                            src={avatarUrl}
                            alt={title}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <span className="font-medium">{title}</span>
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ color: textColor }}
                        >
                            <MoreVertical size={20} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-48"
                        style={{
                            backgroundColor: isDark
                                ? 'rgba(0,0,0,0.9)'
                                : 'rgba(255,255,255,0.9)',
                            borderColor: isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.1)',
                        }}
                    >
                        <DropdownMenuItem
                            onClick={onEndChat}
                            style={{ color: textColor }}
                            className="hover:bg-black/10 dark:hover:bg-white/10"
                        >
                            <MessageSquare size={16} className="mr-2" />
                            End Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onEndAndDeleteChat}
                            style={{ color: textColor }}
                            className="hover:bg-black/10 dark:hover:bg-white/10 text-red-500 dark:text-red-400"
                        >
                            <Trash2 size={16} className="mr-2" />
                            End and Delete Chat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
