import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function useAmIInMatchingRoom(initData: string) {
    return useQuery(
        convexQuery(api.room.amIInMatchingRoom, {
            initData,
        })
    );
}

export function useGetMatchingRoom(chatRoomId: Id<'chatRooms'>) {
    return useQuery(convexQuery(api.room.getMatchingRoom, { chatRoomId }));
}