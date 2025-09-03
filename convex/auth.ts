// convex/auth.ts
import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import type { DataModel } from './_generated/dataModel';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password<DataModel>({
            profile(params) {
                return {
                    email: params.email as string,
                    name: params.name as string | undefined,
                    username: params.username as string | undefined,
                    telegramId: params.telegramId as string | undefined,
                };
            },
        }),
    ],
});
