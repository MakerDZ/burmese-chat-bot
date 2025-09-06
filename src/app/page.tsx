'use client';

import { Search } from '@/components/home/search';
import { NotSearching } from '@/components/home/not-searching';
import { SearchSkeleton } from '@/components/home/search-skeleton';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { useTelegram } from '@/providers/TelegramProvider';
import { useAmIInMatchingRoom } from '@/hooks/useChatRoom';
import { api } from '../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useState } from 'react';

export default function Home() {
    const { initData, user, validationError, validatedProfile } = useTelegram();
    const createChatRoom = useMutation(api.room.createChatRoom);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const {
        data,
        isPending: isAmIInMatchingRoomPending,
        error: errorAmIInMatchingRoom,
    } = useAmIInMatchingRoom(initData!);

    const { backgroundColor } = useTelegramTheme();

    if (
        !user ||
        validationError ||
        !initData ||
        isAmIInMatchingRoomPending ||
        errorAmIInMatchingRoom ||
        !validatedProfile
    ) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            >
                <SearchSkeleton />
            </div>
        );
    }

    const handleEndChat = () => {};

    const handleNewPartner = () => {};

    return (
        <div
            className="flex flex-col min-h-screen w-full"
            style={{ backgroundColor }}
        >
            {!data || data.status === 'waiting' ? (
                <Search
                    onStartSearching={async () => {
                        setIsCreatingRoom(true);
                        try {
                            await createChatRoom({
                                initData,
                            });
                        } catch (error) {
                            setIsCreatingRoom(false);
                        } finally {
                            setIsCreatingRoom(false);
                        }
                    }}
                    isSearching={isCreatingRoom || data?.status === 'waiting'}
                />
            ) : (
                <NotSearching
                    initData={initData}
                    myProfile={validatedProfile}
                    chatRoomId={data.chatRoomId}
                    onEndChat={handleEndChat}
                    onNewPartner={handleNewPartner}
                />
            )}
        </div>
    );
}