import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users: defineTable({
        telegramId: v.string(),
        name: v.string(),
        username: v.string(),
    }).index('by_telegramId', ['telegramId']),

    profiles: defineTable({
        userId: v.id('users'),
        name: v.string(),
        bio: v.string(),
        gender: v.union(v.literal('male'), v.literal('female')),
        bornYear: v.number(),
    }).index('by_userId', ['userId']),
});
