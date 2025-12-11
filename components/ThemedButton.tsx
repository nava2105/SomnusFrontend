/**
 * Theme-aware button with consistent styling
 */

import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text as ThemedText } from './Themed';

interface Props extends TouchableOpacityProps {
    title: string;
}

export function ThemedButton({ title, style, ...touchableProps }: Props) {
    const { colors, isDark } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: colors.tint },
                style,
            ]}
            {...touchableProps}
        >
            <ThemedText style={[styles.text, { color: isDark ? colors.text : colors.background }]}>
                {title}
            </ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    },
});