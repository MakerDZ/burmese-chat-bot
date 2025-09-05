'use client';

import { ProfileComponent } from '@/components/profile/profile-component';
import { Loading } from '@/components/ui/loading';
import { useProfile } from '@/hooks/useProfile';
import { useTelegram } from '@/providers/TelegramProvider';

export default function Profile() {
    const { initData, user, validationError } = useTelegram();
    const { data, isPending, error } = useProfile(user?.id.toString() ?? '');

    if (validationError || !user || !initData || isPending || error) {
        return <Loading />;
    }

    return <ProfileComponent initData={initData} profile={data} />;
}
