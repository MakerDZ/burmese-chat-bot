import { useTelegram } from '@/providers/TelegramProvider';

export type TelegramThemeColors = {
    isDark: boolean;
    textColor: string;
    backgroundColor: string;
    buttonColor: string;
    buttonTextColor: string;
    hintColor: string;
    linkColor: string;
};

export function useTelegramTheme(): TelegramThemeColors {
    const { theme } = useTelegram();

    // Default light theme colors if no theme is provided
    const defaultColors: TelegramThemeColors = {
        isDark: false,
        textColor: '#000000',
        backgroundColor: '#ffffff',
        buttonColor: '#3390ec',
        buttonTextColor: '#ffffff',
        hintColor: '#707579',
        linkColor: '#3390ec',
    };

    if (!theme) {
        return defaultColors;
    }

    // Detect if theme is dark based on background color
    const isDark = !!(
        theme.bg_color?.toLowerCase().startsWith('#1') ||
        theme.bg_color?.toLowerCase().startsWith('#2') ||
        theme.bg_color?.toLowerCase().startsWith('#0')
    );

    return {
        isDark,
        textColor: theme.text_color || defaultColors.textColor,
        backgroundColor: theme.bg_color || defaultColors.backgroundColor,
        buttonColor: theme.button_color || defaultColors.buttonColor,
        buttonTextColor:
            theme.button_text_color || defaultColors.buttonTextColor,
        hintColor: theme.hint_color || defaultColors.hintColor,
        linkColor: theme.link_color || defaultColors.linkColor,
    };
}
