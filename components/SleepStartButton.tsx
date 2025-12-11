/**
 * Play button with bed icon for starting sleep tracking
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface SleepStartButtonProps {
    onPress: () => void;
    size?: number;
    iconOffset?: number;
}

export default function SleepStartButton({
                                             onPress,
                                             size = 80,
                                             iconOffset = 0
                                         }: SleepStartButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
        >
            <FontAwesome5
                name="play"
                size={size}
                color={theme.tint}
                solid
            />
            <FontAwesome5
                name="bed"
                size={size * 0.35}
                color={theme.background}
                style={[styles.icon, { right: iconOffset }]}
                solid
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    icon: {
        position: 'absolute',
    },
});