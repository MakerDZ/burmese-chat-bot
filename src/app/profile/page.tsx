'use client';

import { ProfileComponent } from '@/components/profile/profile-component';
import { Loading } from '@/components/ui/loading';
import { useValidateTelegramUser } from '@/hooks/useValidateTelegramUser';

export default function Profile() {
    const { profile, isLoading, isValidating, error } =
        useValidateTelegramUser();

    if (isLoading || isValidating) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!profile) {
        return <Loading />;
    }

    return <ProfileComponent profile={profile} />;
}
