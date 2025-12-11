/**
 * Skip link for onboarding flow
 */

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from "@/constants/Colors";

interface SkipLinkProps {
    title: string;
    onPress: () => void;
    style?: object;
}

export function SkipLink({ title, onPress, style }: SkipLinkProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={[styles.linkText, { color: isDark ? Colors.dark.secondaryText : Colors.light.secondaryText }, style]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    linkText: {
        fontSize: 18,
        fontWeight: '600',
    },
});