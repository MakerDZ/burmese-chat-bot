'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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
    theme: TelegramTheme | null;
};

const TelegramContext = createContext<TelegramContextType>({
    tg: null,
    user: null,
    initData: null,
    theme: null,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isClient, setIsClient] = useState(false);
    const [tg, setTg] = useState<any | null>(null);
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [initData, setInitData] = useState<string | null>(null);
    const [theme, setTheme] = useState<TelegramTheme | null>(null);

    // Handle client-side initialization
    useEffect(() => {
        setIsClient(true);

        const webApp = (window as any).Telegram?.WebApp;
        if (webApp) {
            setTg(webApp);
            setUser(webApp.initDataUnsafe?.user || null);
            setInitData(webApp.initData || null);
            setTheme(webApp.themeParams || null);

            // Listen for theme changes (dark <-> light)
            webApp.onEvent('themeChanged', () => {
                setTheme(webApp.themeParams || null);
            });

            // Tell Telegram the app is ready
            webApp.ready();
        }
    }, []);

    // Provide a stable value for SSR
    const contextValue = {
        tg: isClient ? tg : null,
        user: isClient ? user : null,
        initData: isClient ? initData : null,
        theme: isClient ? theme : null,
    };

    return (
        <TelegramContext.Provider value={contextValue}>
            {children}
        </TelegramContext.Provider>
    );
};
