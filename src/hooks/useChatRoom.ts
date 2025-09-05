import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '../../convex/_generated/api';

export function useAmIInMatchingRoom(initData: string) {
    return useQuery(
        convexQuery(api.room.amIInMatchingRoom, {
            initData,
        })
    );
}
