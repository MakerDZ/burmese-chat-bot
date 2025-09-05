import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { validateInitData } from './verify';

export const createChatRoom = mutation({
    args: {
        initData: v.string(),
        telegramId: v.string(),
    },
    handler: async (ctx, args) => {
        const isValid = validateInitData(
            args.initData,
            process.env.TELEGRAM_BOT_TOKEN!
        );
        if (!isValid) {
            throw new Error('Invalid Telegram initData');
        }

        const participantId = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();

        if (!participantId) {
            throw new Error('Participant not found');
        }

        const chatRoom = await ctx.db.insert('chatRooms', {
            participantIds: [participantId._id],
            type: 'matching',
            status: 'waiting',
            createdAt: Date.now(),
        });

        await ctx.db.insert('chatParticipants', {
            chatRoomId: chatRoom,
            userId: participantId._id,
            type: 'matching',
            status: 'waiting',
        });

        return chatRoom;
    },
});

export const amIInMatchingRoom = query({
    args: {
        initData: v.string(),
        telegramId: v.string(),
    },
    handler: async (ctx, args) => {
        const isValid = validateInitData(
            args.initData,
            process.env.TELEGRAM_BOT_TOKEN!
        );
        if (!isValid) {
            throw new Error('Invalid Telegram initData');
        }

        const participantId = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', args.telegramId)
            )
            .first();
        if (!participantId) {
            throw new Error('Participant not found');
        }

        const chatRoom = await ctx.db
            .query('chatParticipants')
            .withIndex('by_type_userId', (q) =>
                q.eq('type', 'matching').eq('userId', participantId._id)
            )
            .first();

        return chatRoom;
    },
});
