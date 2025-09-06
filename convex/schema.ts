import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    // users
    users: defineTable({
        telegramId: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        username: v.optional(v.string()),
    }).index('by_telegramId', ['telegramId']),

    // profiles
    profiles: defineTable({
        userId: v.id('users'),
        telegramId: v.string(),
        avatarUrl: v.string(),
        name: v.string(),
        bio: v.optional(v.string()),
        gender: v.optional(v.union(v.literal('male'), v.literal('female'))),
        bornYear: v.optional(v.number()),
    })
        .index('by_userId', ['userId'])
        .index('by_telegramId', ['telegramId']),

    // chats rooms
    chatRooms: defineTable({
        participantIds: v.array(v.id('users')),
        createdAt: v.number(),
        lastMessageAt: v.optional(v.number()),
        lastMessagePreview: v.optional(v.string()),
        type: v.union(v.literal('matching'), v.literal('friend')),
        friendRequestId: v.optional(v.id('users')),
        status: v.union(
            v.literal('waiting'),
            v.literal('active'),
            v.literal('ended'),
            v.literal('deleted')
        ),
    })
        .index('by_participantIds', ['participantIds'])
        .index('by_type', ['type']),

    // chat participants
    chatParticipants: defineTable({
        chatRoomId: v.id('chatRooms'),
        status: v.union(
            v.literal('waiting'),
            v.literal('active'),
            v.literal('ended'),
            v.literal('deleted')
        ),
        type: v.union(v.literal('matching'), v.literal('friend')),
        userId: v.id('users'),
    })
        .index('by_status_type', ['status', 'type'])
        .index('by_type_userId', ['type', 'userId']),

    // chat messages
    chatMessages: defineTable({
        chatRoomId: v.id('chatRooms'),
        senderUserId: v.id('users'),
        message: v.optional(v.string()),

        replyToMessageId: v.optional(v.id('chatMessages')),
        replyPreview: v.optional(
            v.object({
                type: v.union(v.literal('text'), v.literal('image')),
                text: v.string(),
            })
        ),

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
