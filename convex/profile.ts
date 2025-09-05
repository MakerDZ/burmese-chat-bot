import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { validateInitData } from './verify';

export const updateProfile = mutation({
    args: {
        initData: v.string(),
        profile: v.object({
            name: v.string(),
            bio: v.optional(v.string()),
            gender: v.optional(v.union(v.literal('male'), v.literal('female'))),
            bornYear: v.optional(v.number()),
            avatarUrl: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const isValid = await validateInitData(
            args.initData,
            process.env.TELEGRAM_BOT_TOKEN!
        );
        if (!isValid) {
            throw new Error('Invalid Telegram initData');
        }
        // ✅ Parse safe user data after validation
        const urlParams = new URLSearchParams(args.initData);
        const userJson = urlParams.get('user');
        const user = userJson ? JSON.parse(userJson) : null;

        const profile = await ctx.db
            .query('profiles')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', user.id.toString())
            )
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