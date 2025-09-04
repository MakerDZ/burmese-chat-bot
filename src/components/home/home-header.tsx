'use client';

import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import Image from 'next/image';
import { ProfileDialog } from '@/components/profile/profile-dialog';
import { MoreVertical, UserPlus, MessageSquare, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface HomeHeaderProps {
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
    isFriendAdded?: boolean;
    onAddFriend?: () => void;
    onEndChat?: () => void;
    onNewPartner?: () => void;
}

export function HomeHeader({
    title,
    avatarUrl,
    profile,
    isFriendAdded = false,
    onAddFriend,
    onEndChat,
    onNewPartner,
}: HomeHeaderProps) {
    const { isDark, textColor, backgroundColor } = useTelegramTheme();

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
                <div className="flex items-center gap-3">
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
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            style={{ color: textColor }}
                        >
                            <MoreVertical size={20} />
                            {isFriendAdded && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white dark:border-black" />
                            )}
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
                            onClick={onAddFriend}
                            style={{ color: textColor }}
                            className="hover:bg-black/10 dark:hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <UserPlus size={16} className="mr-2" />
                                    {isFriendAdded
                                        ? 'Accept Friend'
                                        : 'Add Friend'}
                                </div>
                                {isFriendAdded && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onEndChat}
                            style={{ color: textColor }}
                            className="hover:bg-black/10 dark:hover:bg-white/10"
                        >
                            <MessageSquare size={16} className="mr-2" />
                            End Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onNewPartner}
                            style={{ color: textColor }}
                            className="hover:bg-black/10 dark:hover:bg-white/10"
                        >
                            <User size={16} className="mr-2" />
                            New Partner
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
