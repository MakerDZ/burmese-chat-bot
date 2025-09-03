import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
    ...authTables,
    // users
    users: defineTable({
        email: v.string(),
        telegramId: v.optional(v.string()),
        name: v.optional(v.string()),
        username: v.optional(v.string()),
    }).index('by_email', ['email']),

    // profiles
    profiles: defineTable({
        userId: v.id('users'),
        name: v.string(),
        bio: v.string(),
        gender: v.union(v.literal('male'), v.literal('female')),
        bornYear: v.number(),
    }).index('by_userId', ['userId']),
});
