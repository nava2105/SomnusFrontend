/**
 * Circular score display overlay for charts
 */

import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';

interface Props {
    score: number;
    label?: string;
    size?: number;
    color?: string;
}

// @ts-ignore
export default function ScoreDisplay({ score, label = 'Sleep Score', size = 60, color, style }: Props) {
    const { colors } = useTheme();
    const textColor = color ?? colors.text;

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.score, { fontSize: size, color: textColor }]}>{score}</Text>
            {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
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