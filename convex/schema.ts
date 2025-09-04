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

    // chats rooms
    chatRooms: defineTable({
        participantIds: v.array(v.string()),
        createdAt: v.number(),
        lastMessageAt: v.optional(v.number()),
        lastMessagePreview: v.optional(v.string()),
    }).index('by_participantIds', ['participantIds']),

    // chat messages
    chatMessages: defineTable({
        chatRoomId: v.id('chatRooms'),
        senderUserId: v.string(),
        message: v.optional(v.string()),

        replyToMessageId: v.optional(v.id('chatMessages')),

        attachments: v.optional(
            v.array(
                v.object({
                    type: v.union(
                        v.literal('image'),
                        v.literal('video'),
                        v.literal('file')
                    ),
                    url: v.string(),
                    thumbnailUrl: v.optional(v.string()),
                    fileName: v.optional(v.string()),
                    fileSize: v.optional(v.number()),
                })
            )
        ),

        createdAt: v.number(),
    }).index('by_chatRoomId', ['chatRoomId']),
});
