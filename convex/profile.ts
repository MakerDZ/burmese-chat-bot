import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const updateProfile = mutation({
    args: {
        telegramId: v.string(),
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
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();
        if (profile) {
            return await ctx.db.patch(profile._id, args.profile);
        }
        return await ctx.db.insert('profiles', {
            telegramId: args.telegramId,
            avatarUrl: args.profile.avatarUrl,
            name: args.profile.name,
            bio: args.profile.bio,
            gender: args.profile.gender,
            bornYear: args.profile.bornYear,
        });
    },
});
