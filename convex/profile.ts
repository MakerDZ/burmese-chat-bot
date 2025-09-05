import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const updateProfile = mutation({
    args: {
        userId: v.id('users'),
        profile: v.object({
            name: v.string(),
            bio: v.optional(v.string()),
            gender: v.optional(v.union(v.literal('male'), v.literal('female'))),
            bornYear: v.optional(v.number()),
            avatarUrl: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query('profiles')
            .withIndex('by_userId', (q) => q.eq('userId', args.userId))
            .first();
        if (profile) {
            return await ctx.db.patch(profile._id, args.profile);
        }

        //throw error if profile not found
        throw new Error('Profile not found');
    },
});

export const getProfile = query({
    args: {
        telegramId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('profiles')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();
    },
});