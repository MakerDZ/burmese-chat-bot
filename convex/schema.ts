import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    // users
    users: defineTable({
        telegramId: v.optional(v.string()),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        username: v.optional(v.string()),
    }).index('by_telegramId', ['telegramId']),

    // profiles
    profiles: defineTable({
        telegramId: v.string(),
        avatarUrl: v.string(),
        name: v.string(),
        bio: v.optional(v.string()),
        gender: v.optional(v.union(v.literal('male'), v.literal('female'))),
        bornYear: v.optional(v.number()),
    }).index('by_telegramId', ['telegramId']),
});


