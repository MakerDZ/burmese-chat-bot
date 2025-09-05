import { mutation } from './_generated/server';
import { v } from 'convex/values';

function toHex(buf: ArrayBuffer) {
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function validateInitData(initData: string, botToken: string) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) return false;
    urlParams.delete('hash');

    const dataCheckString = [...urlParams.entries()]
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join('\n');

    const enc = new TextEncoder();

    // Step 1: secretKey = HMAC_SHA256("WebAppData", botToken)
    const webAppDataKey = await crypto.subtle.importKey(
        'raw',
        enc.encode('WebAppData'),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );
    const secretKeyBytes = await crypto.subtle.sign(
        'HMAC',
        webAppDataKey,
        enc.encode(botToken)
    );

    // Step 2: computedHash = HMAC_SHA256(secretKey, dataCheckString) in hex
    const hmacKey = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(secretKeyBytes),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign(
        'HMAC',
        hmacKey,
        enc.encode(dataCheckString)
    );
    const computedHex = toHex(signature);

    return computedHex === hash.toLowerCase();
}

export const validateTelegramUser = mutation({
    args: {
        initData: v.string(),
    },
    handler: async (ctx, args) => {
        const botToken = process.env.TELEGRAM_BOT_TOKEN!;
        const isValid = await validateInitData(args.initData, botToken);

        if (!isValid) {
            throw new Error('Invalid Telegram initData');
        }

        // ✅ Parse safe user data after validation
        const urlParams = new URLSearchParams(args.initData);
        const userJson = urlParams.get('user');
        const user = userJson ? JSON.parse(userJson) : null;

        return {
            ok: true,
            user, // contains user.id, first_name, etc.
        };
    },
});
