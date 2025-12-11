/**
 * Interactive analog clock for time selection
 * Supports pan gestures to set hour and minute
 */

import React, {useCallback, useState} from 'react';
import {Dimensions, PanResponder, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CLOCK_SIZE = Math.min(SCREEN_WIDTH - 100, 280);
const RADIUS = CLOCK_SIZE / 2;

interface Props {
    onTimeChange?: (hour: number, minute: number) => void;
    initialHour?: number;
    initialMinute?: number;
}

export default function AnalogClock({ onTimeChange, initialHour = 22, initialMinute = 0 }: Props) {
    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);
    const { colors, isDark } = useTheme();

    const handlePanResponderMove = useCallback(
        (evt: any) => {
            const { locationX, locationY } = evt.nativeEvent;
            const angle = Math.atan2(locationY - RADIUS, locationX - RADIUS);
            const degrees = (angle * 180) / Math.PI + 90;
            const normalizedDegrees = (degrees + 360) % 360;

            const newHour = Math.floor(normalizedDegrees / 30) || 12;
            const newMinute = Math.round((normalizedDegrees % 30) * 2);

            setHour(newHour);
            setMinute(newMinute);
            onTimeChange?.(newHour, newMinute);
        },
        [onTimeChange],
    );

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: handlePanResponderMove,
        }),
    ).current;

    const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
    const minuteAngle = minute * 6;

    const clockNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.clock,
                    {
                        width: CLOCK_SIZE,
                        height: CLOCK_SIZE,
                        borderRadius: RADIUS,
                        backgroundColor: isDark ? '#1E293B' : '#f0f0f0',
                    },
                ]}
                {...panResponder.panHandlers}
            >
                {clockNumbers.map((num) => {
                    const angle = (num - 3) * 30;
                    const radian = (angle * Math.PI) / 180;
                    const x = RADIUS + Math.cos(radian) * (RADIUS - 30) - 12;
                    const y = RADIUS + Math.sin(radian) * (RADIUS - 30) - 12;

                    return (
                        <Text key={num} style={[styles.number, { left: x, top: y, color: colors.text }]}>
                            {num}
                        </Text>
                    );
                })}

                <View
                    style={[
                        styles.hand,
                        styles.hourHand,
                        {
                            height: RADIUS * 0.6,
                            backgroundColor: colors.text,
                            transform: getHandTransform(hourAngle, RADIUS * 0.3),
                        },
                    ]}
                />

                <View
                    style={[
                        styles.hand,
                        styles.minuteHand,
                        {
                            height: RADIUS * 0.8,
                            backgroundColor: colors.tint,
                            transform: getHandTransform(minuteAngle, RADIUS * 0.4),
                        },
                    ]}
                />

                <View style={[styles.center, { backgroundColor: colors.tint }]} />
            </View>

            <Text style={[styles.timeText, { color: colors.text }]}>
                {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
            </Text>
        </View>
    );
}

/**
 * Generates transform array for clock hand rotation
 */
function getHandTransform(angle: number, offset: number) {
    return [{ translateY: -offset }, { rotate: `${angle}deg` }, { translateY: offset }];
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 30,
    },
    clock: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    number: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: 'bold',
        width: 24,
        textAlign: 'center',
    },
    hand: {
        position: 'absolute',
        width: 4,
        borderRadius: 2,
        transformOrigin: 'center',
    },
    hourHand: {
        width: 6,
        zIndex: 2,
    },
    minuteHand: {
        zIndex: 1,
    },
    center: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 3,
    },
    timeText: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
    },
});