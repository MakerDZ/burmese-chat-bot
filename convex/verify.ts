'use node';
import { action } from './_generated/server';
import crypto from 'crypto';
import { v } from 'convex/values';
import { api } from './_generated/api';

function validateInitData(initData: string, botToken: string) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash')!;
    urlParams.delete('hash');

    const dataCheckString = [...urlParams.entries()]
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('\n');

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    return computedHash === hash;
}

export const validateTelegramUser = action({
    args: {
        initData: v.string(),
        user: v.string(),
    },
    handler: async (
        ctx,
        args
    ): Promise<{
        ok: true;
        user: {
            _id: string;
            _creationTime: number;
            telegramId?: string | undefined;
            firstName?: string | undefined;
            lastName?: string | undefined;
            username?: string | undefined;
        } | null;
        profile: {
            _id: string;
            _creationTime: number;
            bio?: string | undefined;
            gender?: 'male' | 'female' | undefined;
            bornYear?: number | undefined;
            telegramId: string;
            avatarUrl: string;
            name: string;
        } | null;
    }> => {
        const botToken = process.env.TELEGRAM_BOT_TOKEN!;
        const isValid = validateInitData(args.initData, botToken);

        if (!isValid) {
            throw new Error('Invalid Telegram initData');
        }

        const { user, profile } = await ctx.runQuery(api.user.getUser, {
            telegramId: args.user,
        });

        return { ok: true, user: user, profile: profile };
    },
});
