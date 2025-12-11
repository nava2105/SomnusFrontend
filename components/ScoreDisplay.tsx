import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface ScoreDisplayProps {
    score: number;
    label?: string;
    size?: number;
    color?: string;
    style?: object;
}

export default function ScoreDisplay({
                                         score,
                                         label = "Sleep Score",
                                         size = 60,
                                         color,
                                         style,
                                     }: ScoreDisplayProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const textColor = color || (isDark ? Colors.dark.text : Colors.light.text);

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.score, { fontSize: size, color: textColor }]}>
                {score}
            </Text>
            {label && (
                <Text style={[styles.label, { color: textColor }]}>
                    {label}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    score: {
        fontWeight: 'bold',
        lineHeight: 60,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
        opacity: 0.8,
    },
});