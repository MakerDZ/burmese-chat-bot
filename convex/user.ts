import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createUser = mutation({
    args: {
        telegramId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        username: v.string(),
    },
    handler: async (ctx, args) => {
        //check if user already exists
        const user = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();
        if (user) {
            return user;
        }

        await ctx.db.insert('users', args);
        await ctx.db.insert('profiles', {
            telegramId: args.telegramId,
            avatarUrl:
                'https://i.pinimg.com/736x/00/9f/c0/009fc09a302e18d5cb0c1ecc75d728e5.jpg',
            name: 'No Name',
        });
    },
});

export const getUser = query({
    args: {
        telegramId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();

        const profile = await ctx.db
            .query('profiles')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();

        return { user, profile };
    },
});
