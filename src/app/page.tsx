'use client';

import { Search } from '@/components/home/search';
import { NotSearching } from '@/components/home/not-searching';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { useValidateTelegramUser } from '@/hooks/useValidateTelegramUser';
import { useState } from 'react';

export default function Home() {
    const {
        user,
        profile,
        isLoading: isUserLoading,
        isValidating,
        error,
    } = useValidateTelegramUser();

    const [isSearch, setIsSearch] = useState(true);

    const { backgroundColor } = useTelegramTheme();

    if (isUserLoading || isValidating) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            ></div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            ></div>
        );
    }

    const handleStartSearching = () => {
        setIsSearch(false); // Switch to not-searching state
    };

    const handleEndChat = () => {
        setIsSearch(true); // Switch back to search state
    };

    const handleNewPartner = () => {
        setIsSearch(true); // Switch to search state first
        // Simulate the searching process after a short delay
        setTimeout(() => {
            setIsSearch(false); // Then switch to not-searching state
        }, 3000); // 3 seconds to simulate finding a new partner
    };

    return (
        <div
            className="flex flex-col min-h-screen w-full"
            style={{ backgroundColor }}
        >
            {isSearch ? (
                <Search onStartSearching={handleStartSearching} />
            ) : (
                <NotSearching
                    onEndChat={handleEndChat}
                    onNewPartner={handleNewPartner}
                />
            )}
        </div>
    );
}