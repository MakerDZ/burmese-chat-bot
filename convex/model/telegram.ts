// convex/model/telegram.ts
import type { QueryCtx, MutationCtx } from '../_generated/server';
import { v, type Infer } from 'convex/values';
import { validateInitData } from '../verify';

export const vValidateTelegramArgs = v.object({
    initData: v.string(),
});
export type ValidateTelegramArgs = Infer<typeof vValidateTelegramArgs>;

export async function validateTelegramUserHelper(
    ctx: QueryCtx | MutationCtx,
    { initData }: ValidateTelegramArgs
) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN!;
    const isValid = await validateInitData(initData, botToken);
    if (!isValid) throw new Error('Invalid Telegram initData');

    const urlParams = new URLSearchParams(initData);
    const userJson = urlParams.get('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const profile = await ctx.db
        .query('profiles')
        .withIndex('by_telegramId', (q) =>
            q.eq('telegramId', user.id.toString())
        )
        .first();

    if (!profile) throw new Error('Profile not found');

    return { ok: true as const, user, profile };
}
