'use client';

import { TopChatMenu } from '@/components/common/top-chat-menu';
import { Button } from '@/components/ui/button';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { useValidateTelegramUser } from '@/hooks/useValidateTelegramUser';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
    const {
        user,
        profile,
        isLoading: isUserLoading,
        isValidating,
        error,
    } = useValidateTelegramUser();

    const { backgroundColor, textColor, isDark } = useTelegramTheme();

    // Rotating GIF images with aesthetic filters
    const gifImages = [
        'https://i.pinimg.com/originals/78/18/45/7818455671b1385b18d7257abaa863c2.gif',
        'https://i.pinimg.com/originals/67/53/44/6753445a162da72785119a3d69d70dfe.gif',
        'https://i.pinimg.com/originals/48/9e/bd/489ebd5b338352cb896f0719f432357e.gif',
        'https://i.pinimg.com/originals/dd/b5/33/ddb533cae3afcc8e9bfbddb2a4d0d2d0.gif',
        'https://i.pinimg.com/originals/61/bc/b5/61bcb50ca35add3d795a92ac151c44e1.gif',
        'https://i.pinimg.com/originals/fb/b5/e7/fbb5e7b2ff835e2bd11ad009c2880d63.gif',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % gifImages.length
                );
                // Keep transition state longer to ensure smooth handover
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, 250); // Slightly longer transition
        }, 3500); // Longer interval to let GIFs complete loops

        return () => clearInterval(interval);
    }, [gifImages.length]);

    const buttonStyle = {
        backgroundColor: isDark ? '#FFFFFF' : '#000000',
        color: isDark ? '#000000' : '#FFFFFF',
        border: `1px solid ${isDark ? '#FFFFFF' : '#000000'}`,
    };

    if (isUserLoading || isValidating) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            ></div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return (
            <div
                className="flex flex-col min-h-screen w-full"
                style={{ backgroundColor }}
            ></div>
        );
    }

    return (
        <div
            className="flex flex-col min-h-screen w-full"
            style={{ backgroundColor }}
        >
            <div className="overflow-y-auto flex-1">
                <TopChatMenu />
                <div className="relative w-full h-[260px] overflow-hidden mb-4">
                    <Image
                        src={gifImages[currentImageIndex]}
                        alt="logo"
                        width={128}
                        height={128}
                        className={`rounded-b-lg w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                            isTransitioning ? 'opacity-60' : 'opacity-100'
                        }`}
                        style={{
                            filter: 'brightness(1.05) contrast(1.05) saturate(1.1) hue-rotate(2deg)',
                            backdropFilter: 'blur(0.5px)',
                        }}
                    />
                    {/* Aesthetic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 rounded-b-lg" />
                </div>
                <h1
                    className="text-md font-medium text-center my-4"
                    style={{ color: textColor }}
                >
                    သင်ပျင်းနေပါသလား။ <br />{' '}
                    ဒီကနေတစ်ယောက်ယောက်နဲ့စကားပြောကြည့်ပါ။
                </h1>
                <div className="flex justify-center items-center flex-1 pt-4">
                    <Button
                        type="submit"
                        className="w-11/12 h-11"
                        style={buttonStyle}
                    >
                        👻 လူရှာမယ်
                    </Button>
                </div>
            </div>
        </div>
    );
}