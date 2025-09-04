import { useEffect, useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useTelegram } from '@/providers/TelegramProvider';

export type TelegramUser = {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    language_code: string | null;
    photo_url: string | null;
};

type ValidationResult = {
    user: any | null;
    profile: any | null;
    isLoading: boolean;
    isValidating: boolean;
    error: string | null;
};

export function useValidateTelegramUser(): ValidationResult {
    const { initData, user, tg } = useTelegram();
    const validateTelegramUser = useAction(api.verify.validateTelegramUser);
    const [validatedUser, setValidatedUser] = useState<any | null>(null);
    const [validatedProfile, setValidatedProfile] = useState<any | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // True if Telegram WebApp is still initializing
    const isLoading = !tg;

    useEffect(() => {
        if (isLoading) return;

        if (initData) {
            setIsValidating(true);
            validateTelegramUser({
                initData,
                user: user?.id.toString() ?? '',
            })
                .then((res) => {
                    setValidatedUser(res.user ?? null);
                    setValidatedProfile(res.profile ?? null);
                    setIsValidating(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setIsValidating(false);
                });
        } else {
            setIsValidating(false);
        }
    }, [initData, validateTelegramUser, isLoading]);

    return {
        user: validatedUser,
        profile: validatedProfile,
        isLoading,
        isValidating,
        error,
    };
}
