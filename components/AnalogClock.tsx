/**
 * Interactive analog clock for time selection
 * Tap numbers to set hour/minute, hands animate automatically
 */

import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Pressable,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedButton } from '@/components/ThemedButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CLOCK_SIZE = Math.min(SCREEN_WIDTH - 100, 280);
const RADIUS = CLOCK_SIZE / 2;

interface Props {
    onTimeChange?: (hour: number, minute: number, isPM: boolean) => void;
    onNext?: () => void;
    initialHour?: number;
    initialMinute?: number;
    initialIsPM?: boolean;
}

export default function AnalogClock({
                                        onTimeChange,
                                        onNext,
                                        initialHour = 12,
                                        initialMinute = 0,
                                        initialIsPM = true,
                                    }: Props) {
    const [selectionMode, setSelectionMode] = useState<'hour' | 'minute'>('hour');
    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);
    const [isPM, setIsPM] = useState(initialIsPM);
    const { colors, isDark } = useTheme();

    // Calculate angles (12 at top = -90°, 3 at right = 0°, 6 at bottom = 90°, 9 at left = 180°)
    const hourAngle = ((hour % 12) * 30);
    const minuteAngle = (minute * 6);

    // Generate numbers array based on mode
    const clockNumbers = selectionMode === 'hour'
        ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const handleNumberPress = (value: number) => {
        if (selectionMode === 'hour') {
            const newHour = value === 0 ? 12 : value;
            setHour(newHour);
            onTimeChange?.(newHour, minute, isPM);
        } else {
            setMinute(value);
            onTimeChange?.(hour, value, isPM);
        }
    };

    const toggleAmPm = () => {
        const newIsPM = !isPM;
        setIsPM(newIsPM);
        onTimeChange?.(hour, minute, newIsPM);
    };

    return (
        <View style={styles.container}>
            {/* Time Display Fields */}
            <View style={styles.timeDisplay}>
                <Pressable onPress={() => setSelectionMode('hour')}>
                    <Text style={[
                        styles.timeField,
                        selectionMode === 'hour' && styles.activeField,
                        selectionMode === 'hour' && { backgroundColor: colors.tint },
                        selectionMode === 'hour' && isDark && { color: colors.background },
                        { color: colors.text }
                    ]}>
                        {String(hour).padStart(2, '0')}
                    </Text>
                </Pressable>
                <Text style={[styles.colon, { color: colors.text }]}>:</Text>
                <Pressable onPress={() => setSelectionMode('minute')}>
                    <Text style={[
                        styles.timeField,
                        selectionMode === 'minute' && styles.activeField,
                        selectionMode === 'minute' && { backgroundColor: colors.tint },
                        selectionMode === 'minute' && isDark && { color: colors.background },
                        { color: colors.text }
                    ]}>
                        {String(minute).padStart(2, '0')}
                    </Text>
                </Pressable>
                <Pressable onPress={toggleAmPm}>
                    <Text style={[styles.ampm, { color: colors.secondaryText }]}>
                        {isPM ? 'PM' : 'AM'}
                    </Text>
                </Pressable>
            </View>

            {/* Selection Mode Indicator */}
            <Text style={[styles.modeText, { color: colors.secondaryText }]}>
                {selectionMode === 'hour' ? 'Select Hour' : 'Select Minute'}
            </Text>

            {/* Clock Face */}
            <View
                style={[
                    styles.clock,
                    {
                        width: CLOCK_SIZE,
                        height: CLOCK_SIZE,
                        borderRadius: RADIUS,
                        backgroundColor: colors.cardBackground,
                    },
                ]}
            >
                {/* Clock Numbers as Pressable */}
                {clockNumbers.map((num, index) => {
                    const angle = ((index) * 30 * Math.PI) / 180;
                    // Position numbers with 12 at top (rotate -90°)
                    // x, y representan el CENTRO exacto de cada número
                    const x = RADIUS + Math.cos(angle - Math.PI / 2) * (RADIUS - 40);
                    const y = RADIUS + Math.sin(angle - Math.PI / 2) * (RADIUS - 40);

                    const isSelected = selectionMode === 'hour'
                        ? hour === (num === 0 ? 12 : num)
                        : minute === num;

                    return (
                        <Pressable
                            key={index}
                            onPress={() => handleNumberPress(num)}
                            style={[
                                styles.numberContainer,
                                {
                                    left: x,
                                    top: y,
                                    transform: [{ translateX: -20 }, { translateY: -20 }]
                                },
                            ]}
                        >
                            <Text style={[
                                styles.number,
                                isSelected && styles.selectedNumber,
                                { color: isSelected ? colors.tint : colors.text }
                            ]}>
                                {selectionMode === 'hour'
                                    ? (num === 0 ? '12' : String(num))
                                    : String(num).padStart(2, '0')
                                }
                            </Text>
                        </Pressable>
                    );
                })}

                {/* Active Hand */}
                <View
                    style={[
                        styles.hand,
                        selectionMode === 'hour' ? styles.hourHand : styles.minuteHand,
                        {
                            backgroundColor: colors.tint,
                            transform: getHandTransform(
                                selectionMode === 'hour' ? hourAngle : minuteAngle,
                                selectionMode === 'hour' ? RADIUS * 0.5 : RADIUS * 0.7
                            ),
                        },
                    ]}
                />

                {/* Center Dot */}
                <View style={[styles.center, { backgroundColor: colors.tint }]} />

                {/* Center "H" or "M" indicator */}
                <Text style={[styles.centerText, { color: colors.secondaryText }]}>
                    {selectionMode === 'hour' ? 'H' : 'M'}
                </Text>
            </View>

            {/* Next Button */}
            <ThemedButton
                title="Next"
                onPress={onNext}
            />
        </View>
    );
}

/**
 * Generates transform array for proper rotation around center
 */
function getHandTransform(angle: number, length: number) {
    return [
        { translateX: -3 }, // Center horizontally (half of hand width)
        { translateY: -length }, // Move up by length
        { rotate: `${angle}deg` }, // Rotate
    ];
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
        paddingTop: 40,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    timeField: {
        fontSize: 48,
        fontWeight: '300',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    colon: {
        fontSize: 48,
        fontWeight: '300',
    },
    ampm: {
        fontSize: 24,
        fontWeight: '400',
        marginLeft: 10,
    },
    activeField: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    modeText: {
        fontSize: 16,
        marginBottom: 30,
    },
    clock: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    numberContainer: {
        position: 'absolute',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectedNumber: {
        fontSize: 28,
    },
    hand: {
        position: 'absolute',
        top: RADIUS,
        left: RADIUS,
        width: 6,
        borderRadius: 3,
        transformOrigin: 'center bottom',
    },
    hourHand: {
        height: RADIUS * 0.5,
        zIndex: 2,
    },
    minuteHand: {
        height: RADIUS * 0.7,
        zIndex: 2,
    },
    center: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        zIndex: 3,
    },
    centerText: {
        position: 'absolute',
        fontSize: 14,
        fontWeight: 'bold',
        zIndex: 4,
    },
});