import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    Dimensions,
    Text,
    ViewStyle,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CLOCK_SIZE = Math.min(width - 100, 280);
const RADIUS = CLOCK_SIZE / 2;

interface Props {
    onTimeChange?: (hour: number, minute: number) => void;
    initialHour?: number;
    initialMinute?: number;
    style?: ViewStyle;
}

export default function AnalogClock({
                                        onTimeChange,
                                        initialHour = 22,
                                        initialMinute = 0,
                                        style,
                                    }: Props) {
    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                const centerX = RADIUS;
                const centerY = RADIUS;

                const angle = Math.atan2(locationY - centerY, locationX - centerX);
                const degrees = (angle * 180) / Math.PI + 90;
                const normalizedDegrees = (degrees + 360) % 360;

                const newHour = Math.floor(normalizedDegrees / 30) || 12;
                const newMinute = Math.round((normalizedDegrees % 30) * 2);

                setHour(newHour);
                setMinute(newMinute);
                onTimeChange?.(newHour, newMinute);
            },
        })
    ).current;

    const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
    const minuteAngle = minute * 6;

    return (
        <View style={[styles.container, style]}>
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const angle = (num - 3) * 30;
                    const radian = (angle * Math.PI) / 180;
                    const x = RADIUS + Math.cos(radian) * (RADIUS - 30) - 12;
                    const y = RADIUS + Math.sin(radian) * (RADIUS - 30) - 12;

                    return (
                        <Text
                            key={num}
                            style={[
                                styles.number,
                                { left: x, top: y, color: isDark ? Colors.dark.text : Colors.light.text },
                            ]}
                        >
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
                            transform: [
                                { translateY: -RADIUS * 0.3 },
                                { rotate: `${hourAngle}deg` },
                                { translateY: RADIUS * 0.3 },
                            ],
                            backgroundColor: isDark ? Colors.dark.text : Colors.light.text,
                        },
                    ]}
                />

                <View
                    style={[
                        styles.hand,
                        styles.minuteHand,
                        {
                            height: RADIUS * 0.8,
                            transform: [
                                { translateY: -RADIUS * 0.4 },
                                { rotate: `${minuteAngle}deg` },
                                { translateY: RADIUS * 0.4 },
                            ],
                            backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
                        },
                    ]}
                />

                <View
                    style={[styles.center, { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint }]}
                />
            </View>

            <Text style={[styles.timeText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
            </Text>
        </View>
    );
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