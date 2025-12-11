/**
 * Theme-aware Text and View components
 * Automatically apply appropriate colors based on current theme
 */

import { Text as DefaultText, View as DefaultView } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

/**
 * Resolves a color from theme or custom override
 */
function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
): string {
    const theme = useColorScheme() ?? 'light';
    return props[theme] ?? Colors[theme][colorName];
}

/**
 * Theme-aware Text component
 */
export function Text({ style, lightColor, darkColor, ...otherProps }: TextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

/**
 * Theme-aware View component
 */
export function View({ style, lightColor, darkColor, ...otherProps }: ViewProps) {
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        'background',
    );
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}