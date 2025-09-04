import { query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
    args: {
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (!args.userId) return [];

        const chatRooms = await ctx.db
            .query('chatRooms')
            .filter((q) => q.eq(q.field('participantIds'), args.userId))
            .order('desc', 'lastMessageAt')
            .collect();

        // Fetch profiles for all participants to get names and avatars
        const participantIds = new Set<string>();
        chatRooms.forEach((room) => {
            room.participantIds.forEach((id) => participantIds.add(id));
        });

        const profiles = await ctx.db
            .query('profiles')
            .filter((q) => q.field('telegramId').oneOf([...participantIds]))
            .collect();

        const profileMap = new Map(profiles.map((p) => [p.telegramId, p]));

        // Transform chat rooms with UI data
        return chatRooms.map((room) => {
            const otherParticipantId = room.participantIds.find(
                (id) => id !== args.userId
            );
            const otherProfile = otherParticipantId
                ? profileMap.get(otherParticipantId)
                : null;

            return {
                ...room,
                title: otherProfile?.name || 'Unknown User',
                avatarUrl: otherProfile?.avatarUrl || '/default-avatar.svg',
            };
        });
    },
});
