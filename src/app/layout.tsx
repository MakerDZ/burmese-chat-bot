import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';
import { TelegramProvider } from '@/providers/TelegramProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Burmese Chat Bot',
    description: 'The best anonymous telegram chat bot for Burmese users',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en" suppressHydrationWarning>
                <head>
                    <Script
                        src="https://telegram.org/js/telegram-web-app.js"
                        strategy="beforeInteractive"
                        id="telegram-webapp"
                    />
                </head>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                    suppressHydrationWarning
                >
                    <ConvexClientProvider>
                        <TelegramProvider>{children}</TelegramProvider>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
