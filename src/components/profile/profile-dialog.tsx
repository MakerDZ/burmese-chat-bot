'use client';

import { Avatar } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

type ProfileData = {
    telegramId: string;
    avatarUrl: string;
    name: string;
    bio?: string;
    gender?: 'male' | 'female';
    bornYear?: number;
};

interface ProfileDialogProps {
    profile: ProfileData;
    trigger: React.ReactNode;
}

export function ProfileDialog({ profile, trigger }: ProfileDialogProps) {
    const { isDark, backgroundColor } = useTelegramTheme();
    const age = profile.bornYear
        ? new Date().getFullYear() - profile.bornYear
        : undefined;

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                className={`sm:max-w-[360px] p-5 border-none shadow-none -translate-y-[75%] ${
                    isDark
                        ? '[&>button]:text-white/70 [&>button:hover]:text-white [&>button]:hover:bg-white/10 bg-neutral-800 rounded-xl shadow-2xl'
                        : '[&>button]:text-black/70 [&>button:hover]:text-black [&>button]:hover:bg-black/10'
                }`}
                style={isDark ? {} : { backgroundColor }}
            >
                <DialogHeader className="space-y-3">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20">
                            <img src={profile.avatarUrl} alt={profile.name} />
                        </Avatar>
                        <div className="mt-3">
                            <DialogTitle
                                className={`text-lg font-semibold ${
                                    isDark ? 'text-white' : 'text-black'
                                }`}
                            >
                                {profile.name}
                            </DialogTitle>
                            {(profile.gender || age) && (
                                <div
                                    className={`flex items-center gap-2 justify-center mt-1 text-xs ${
                                        isDark
                                            ? 'text-white/70'
                                            : 'text-black/70'
                                    }`}
                                >
                                    {profile.gender && (
                                        <span className="capitalize">
                                            {profile.gender}
                                        </span>
                                    )}
                                    {profile.gender && age && (
                                        <span
                                            className={`w-1 h-1 rounded-full ${
                                                isDark
                                                    ? 'bg-white/50'
                                                    : 'bg-black/50'
                                            }`}
                                        />
                                    )}
                                    {age && <span>{age} y.o</span>}
                                </div>
                            )}
                        </div>
                    </div>
                    {profile.bio && (
                        <p
                            className={`text-sm text-center whitespace-pre-wrap px-2 ${
                                isDark ? 'text-white/70' : 'text-black/70'
                            }`}
                        >
                            {profile.bio}
                        </p>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
