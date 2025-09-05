'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { useMutation } from 'convex/react';

type TelegramUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
};

type TelegramTheme = {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
};

type TelegramContextType = {
    tg: any | null;
    user: TelegramUser | null;
    initData: string | null;
    validationError: string | null;
    theme: TelegramTheme | null;
    loading: boolean;
};

const TelegramContext = createContext<TelegramContextType>({
    tg: null,
    user: null,
    initData: null,
    validationError: null,
    theme: null,
    loading: true,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [tg, setTg] = useState<any | null>(null);
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [initData, setInitData] = useState<string | null>(null);
    const [theme, setTheme] = useState<TelegramTheme | null>(null);
    const [loading, setLoading] = useState(true);
    const validateTelegramUser = useMutation(api.verify.validateTelegramUser);

    const [validationResult, setValidationResult] = useState<{
        error: string | null;
    }>({
        error: null,
    });

    useEffect(() => {
        const initTelegram = async () => {
            const webApp = (window as any).Telegram?.WebApp;
            if (webApp) {
                setTg(webApp);
                setUser(webApp.initDataUnsafe?.user || null);
                setInitData(webApp.initData || null);
                setTheme(webApp.themeParams || null);

                try {
                    const result = await validateTelegramUser({
                        initData: webApp.initData,
                        user: webApp.initDataUnsafe?.user.id.toString(),
                    });
                    setValidationResult({
                        error: null,
                    });
                } catch (err) {
                    setValidationResult({
                        error:
                            err instanceof Error
                                ? err.message
                                : 'Validation failed',
                    });
                }

                webApp.onEvent('themeChanged', () => {
                    setTheme(webApp.themeParams || null);
                });

                webApp.ready();
            }
            setLoading(false);
        };

        initTelegram();
    }, []);

    const contextValue = {
        tg,
        user,
        initData,
        validationError: validationResult.error,
        theme,
        loading,
    };

    if (loading) {
        // ✅ Show a fullscreen loading screen
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                Loading...
            </div>
        );
    }

    return (
        <TelegramContext.Provider value={contextValue}>
            {children}
        </TelegramContext.Provider>
    );
};
