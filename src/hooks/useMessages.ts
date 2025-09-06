import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export function useMessages(initData: string, chatRoomId: Id<'chatRooms'>) {
    return useQuery(
        convexQuery(api.message.getMessages, { initData, chatRoomId })
    );
}
