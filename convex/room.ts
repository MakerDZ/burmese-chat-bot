import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { validateTelegramUserHelper } from './model/telegram';

export const createChatRoom = mutation({
    args: {
        initData: v.string(),
    },
    handler: async (ctx, args) => {
        const { user } = await validateTelegramUserHelper(ctx, args);

        const currentParticipantId = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', user.id.toString())
            )
            .first();

        if (!currentParticipantId) {
            throw new Error('Participant not found');
        }

        // check if there is a chat waiting chat room available for joining
        const chatPartner = await ctx.db
            .query('chatParticipants')
            .withIndex('by_status_type', (q) =>
                q.eq('status', 'waiting').eq('type', 'matching')
            )
            .first();

        if (chatPartner) {
            // update the chat room & create a new chat participant and change the old chat participant to active
            const updatedChatRoom = await ctx.db.patch(chatPartner.chatRoomId, {
                participantIds: [chatPartner.userId, currentParticipantId._id],
                status: 'active',
            });

            await ctx.db.insert('chatParticipants', {
                chatRoomId: chatPartner.chatRoomId,
                userId: currentParticipantId._id,
                type: 'matching',
                status: 'active',
            });

            await ctx.db.patch(chatPartner._id, {
                status: 'active',
            });

            return updatedChatRoom;
        }

        const chatRoom = await ctx.db.insert('chatRooms', {
            participantIds: [currentParticipantId._id],
            type: 'matching',
            status: 'waiting',
            createdAt: Date.now(),
        });

        await ctx.db.insert('chatParticipants', {
            chatRoomId: chatRoom,
            userId: currentParticipantId._id,
            type: 'matching',
            status: 'waiting',
        });

        return chatRoom;
    },
});

export const amIInMatchingRoom = query({
    args: {
        initData: v.string(),
    },
    handler: async (ctx, args) => {
        const { user } = await validateTelegramUserHelper(ctx, args);

        const participantId = await ctx.db
            .query('users')
            .withIndex('by_telegramId', (q) =>
                q.eq('telegramId', user.id.toString())
            )
            .first();
        if (!participantId) {
            throw new Error('Participant not found');
        }

        const chatRooms = await ctx.db
            .query('chatParticipants')
            .withIndex('by_type_userId', (q) =>
                q.eq('type', 'matching').eq('userId', participantId._id)
            )
            .collect();

        if (chatRooms.length > 1) {
            throw new Error('Participant is in a chat room');
        }

        return chatRooms[0];
    },
});

export const getMatchingRoom = query({
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

        if (chatRoom?.status === 'active') {
            // Fetch profiles for all participants
            const participantProfiles = await Promise.all(
                chatRoom.participantIds.map(async (userId) => {
                    const profiles = await ctx.db
                        .query('profiles')
                        .withIndex('by_userId', (q) => q.eq('userId', userId))
                        .first();

                    return profiles; // Get the first profile since there should be only one per user
                })
            );

            // Return sanitized profiles without telegramId
            const sanitizedProfiles = participantProfiles
                .filter(
                    (profile): profile is NonNullable<typeof profile> =>
                        profile !== undefined
                )
                .map((profile) => ({
                    _id: profile._id,
                    userId: profile.userId,
                    avatarUrl: profile.avatarUrl,
                    name: profile.name,
                    bio: profile.bio,
                    gender: profile.gender,
                    bornYear: profile.bornYear,
                }));

            return {
                chatRoom,
                participantProfiles: sanitizedProfiles,
            };
        }
        throw new Error('Chat room not found');
    },
});