// components/SleepStartButton.tsx
import React, { useState, useEffect } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import {
    startSleepRecording,
    stopSleepRecording,
    getRecordingState
} from '@/services/SleepRecordingService';

interface SleepStartButtonProps {
    size?: number;
}

export default function SleepStartButton({ size = 80 }: SleepStartButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isRecording, setIsRecording] = useState(false);
    const [isAutoTriggered, setIsAutoTriggered] = useState(false);

    // Check recording state periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const state = getRecordingState();
            setIsRecording(state.isRecording);
            // Check if triggered by sensor (from summary)
            if (state.sessionData?.summary?.triggeredBy === 'inactivity_sensor') {
                setIsAutoTriggered(true);
            } else {
                setIsAutoTriggered(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handlePress = async () => {
        if (isRecording) {
            const success = await stopSleepRecording();
            if (success) {
                setIsRecording(false);
                setIsAutoTriggered(false);
            }
        } else {
            const success = await startSleepRecording();
            if (success) {
                setIsRecording(true);
                setIsAutoTriggered(false);
            }
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.button,
                {
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                },
            ]}
        >
            <FontAwesome5
                name={isRecording ? "stop" : "play"}
                size={size}
                color={isRecording ? theme.tint2 : theme.tint}
                solid
            />
            <FontAwesome5
                name="bed"
                size={size * 0.35}
                color={theme.background}
                style={isRecording ? styles.centeredIcon : styles.rightIcon}
                solid
            />
            {isAutoTriggered && isRecording && (
                <FontAwesome5
                    name="magic"
                    size={size * 0.25}
                    color={theme.background}
                    style={styles.autoIcon}
                />
            )}
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
    rightIcon: {
        position: 'absolute',
        right: 15
    },
    centeredIcon: {
        position: 'absolute',
    },
    autoIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});