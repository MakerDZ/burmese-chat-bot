import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const createUser = mutation({
    args: {
        telegramId: v.string(),
        name: v.string(),
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const { telegramId, name, username } = args;
        // check if user already exists
        const user = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) => q.eq('telegramId', telegramId))
            .first();
        if (user) {
            return user;
        }

        return ctx.db.insert('users', {
            telegramId,
            name,
            username,
        });
    },
});
