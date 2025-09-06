import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { validateTelegramUserHelper } from './model/telegram';

export const getMessages = query({
    args: {
        initData: v.string(),
        chatRoomId: v.id('chatRooms'),
    },
    handler: async (ctx, args) => {
        const { profile } = await validateTelegramUserHelper(ctx, args);
        const chatRoom = await ctx.db.get(args.chatRoomId);

        if (!chatRoom?.participantIds.includes(profile.userId)) {
            throw new Error('Unauthorized Request');
        }

        const messages = await ctx.db
            .query('chatMessages')
            .withIndex('by_chatRoomId', (q) =>
                q.eq('chatRoomId', args.chatRoomId)
            )
            .collect();

        //sorting by createdAt ascending
        return messages.sort((a, b) => a.createdAt - b.createdAt);
    },
});

export const sendMessage = mutation({
    args: {
        initData: v.string(),
        chatRoomId: v.id('chatRooms'),
        senderUserId: v.id('users'),
        message: v.string(),
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
        replyToMessageId: v.optional(v.id('chatMessages')),
    },
    handler: async (ctx, args) => {
        const { profile } = await validateTelegramUserHelper(ctx, args);
        const chatRoom = await ctx.db
            .query('chatRooms')
            .withIndex('by_id', (q) => q.eq('_id', args.chatRoomId))
            .first();

        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        if (!chatRoom.participantIds.includes(profile.userId)) {
            throw new Error('Unauthorized Request');
        }

        let replyPreview = undefined;
        if (args.replyToMessageId) {
            const repliedMessage = await ctx.db.get(args.replyToMessageId);
            if (repliedMessage) {
                replyPreview = {
                    type: repliedMessage.attachments?.length ? 'image' : 'text',
                    text: repliedMessage.message || 'Photo',
                } as const;
            }
        }

        const newMessage = await ctx.db.insert('chatMessages', {
            chatRoomId: args.chatRoomId,
            senderUserId: args.senderUserId,
            message: args.message,
            createdAt: Date.now(),
            attachments: args.attachments,
            replyToMessageId: args.replyToMessageId,
            replyPreview,
        });

        return newMessage;
    },
});
