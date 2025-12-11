import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// @ts-ignore
import type { FontAwesomeGlyphs } from '@expo/vector-icons/build/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface IconTextRowProps {
    iconName: FontAwesomeGlyphs;
    text: string;
    color?: string;
    style?: object;
}

export default function IconTextRow({
                                        iconName,
                                        text,
                                        color,
                                        style,
                                    }: IconTextRowProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const iconColor = color || (isDark ? Colors.dark.tint : Colors.light.tint);

    return (
        <View style={[styles.container, style]}>
            <FontAwesome
                name={iconName}
                size={20}
                color={iconColor}
                style={styles.icon}
            />
            <Text style={[styles.text, { color: iconColor }]}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    icon: {
        marginRight: 10,
        width: 24,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});