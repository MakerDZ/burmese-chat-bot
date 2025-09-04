'use client';

import { ProfileComponent } from '@/components/profile/profile-component';
import { Loading } from '@/components/ui/loading';
import { useValidateTelegramUser } from '@/hooks/useValidateTelegramUser';

export default function Profile() {
    const { user, profile, isLoading, isValidating, error } =
        useValidateTelegramUser();

    if (isLoading || isValidating) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return <div>No user data available</div>;
    }

    return <ProfileComponent profile={profile} />;
}
