/**
 * Area graph for displaying night sleep pattern with event markers
 * Green area = time slept, Red vertical line = pickup, Orange line = wake up
 */

import React from 'react';
import { ScrollView, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Colors from '@/constants/Colors';

interface NightGraphPoint {
    time: string; // Format: "HH:MM"
    /**
     * Sleep depth/value where:
     * - 0 = awake
     * - 0.3 = light sleep
     * - 0.7 = deep sleep
     * - 1.0 = very deep sleep
     */
    value: number;
}

interface NightGraphEvent {
    time: string; // Format: "HH:MM"
    type: 'pickup' | 'wakeup';
}

interface NightGraphProps {
    data: NightGraphPoint[];
    events: NightGraphEvent[];
}

export default function NightGraph({ data, events }: NightGraphProps) {
    const { colors } = useTheme();
    const { width: screenWidth } = Dimensions.get('window');

    // Configuration
    const chartHeight = 250;
    const pointSpacing = 35; // pixels between data points (increased for better touch targets)
    const margin = { top: 30, right: 20, bottom: 50, left: 20 };

    // Calculate total width based on data length
    const chartWidth = Math.max(
        screenWidth,
        data.length * pointSpacing + margin.left + margin.right
    );

    // Scales
    const xScale = (index: number) => margin.left + index * pointSpacing;
    const yScale = (value: number) => {
        const innerHeight = chartHeight - margin.top - margin.bottom;
        // Invert y-axis: higher value = lower on screen (sleep is at bottom)
        return margin.top + innerHeight - (value * innerHeight);
    };

    // Create smooth area path
    const createAreaPath = () => {
        if (data.length < 2) return '';

        let path = `M ${xScale(0)} ${chartHeight - margin.bottom}`;

        // Move to first point
        path += ` L ${xScale(0)} ${yScale(data[0].value)}`;

        // Create smooth curve through points
        for (let i = 1; i < data.length; i++) {
            const x = xScale(i);
            const y = yScale(data[i].value);
            const prevX = xScale(i - 1);
            const prevY = yScale(data[i - 1].value);

            // Use cubic Bezier for smoother curve
            const cpX1 = prevX + (x - prevX) * 0.5;
            const cpY1 = prevY;
            const cpX2 = prevX + (x - prevX) * 0.5;
            const cpY2 = y;

            path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
        }

        // Close the path to create area
        path += ` L ${xScale(data.length - 1)} ${chartHeight - margin.bottom} Z`;

        return path;
    };

    // Convert "HH:MM" to minutes since midnight
    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Helper to find X position for an event time
    const getEventX = (eventTime: string) => {
        const eventMinutes = timeToMinutes(eventTime);

        let closestIndex = 0;
        let minDiff = Infinity;

        data.forEach((point, index) => {
            const pointMinutes = timeToMinutes(point.time);
            const diff = Math.abs(pointMinutes - eventMinutes);

            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        return xScale(closestIndex);
    };

    // Filter labels to show only every hour
    const shouldShowLabel = (time: string) => {
        const minutes = timeToMinutes(time);
        return minutes % 60 === 0;
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.chartWrapper}>
                <Svg width={chartWidth} height={chartHeight}>
                    {/* Gradient definitions */}
                    <Defs>
                        <LinearGradient id="sleepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor={Colors.asleepColor} stopOpacity="0.7" />
                            <Stop offset="100%" stopColor={Colors.asleepColor} stopOpacity="0.15" />
                        </LinearGradient>
                    </Defs>

                    {/* Grid lines for better readability */}
                    {[0, 3, 6, 9, 12].map((hour, index) => {
                        const minutes = hour * 60;
                        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                        const x = getEventX(timeStr);

                        return (
                            <Line
                                key={`grid-${index}`}
                                x1={x}
                                y1={margin.top}
                                x2={x}
                                y2={chartHeight - margin.bottom}
                                stroke={colors.secondaryText}
                                strokeWidth={1}
                                opacity={0.1}
                            />
                        );
                    })}

                    {/* Sleep area path */}
                    <Path
                        d={createAreaPath()}
                        fill="url(#sleepGradient)"
                    />

                    {/* Event vertical lines */}
                    {events.map((event, index) => {
                        const x = getEventX(event.time);
                        const isPickup = event.type === 'pickup';

                        return (
                            <Line
                                key={`event-line-${index}`}
                                x1={x}
                                y1={margin.top}
                                x2={x}
                                y2={chartHeight - margin.bottom}
                                stroke={isPickup ? Colors.pickupColor : Colors.awakeColor}
                                strokeWidth={isPickup ? 2 : 3}
                                strokeDasharray={isPickup ? '5,5' : '0'}
                                opacity={isPickup ? 0.7 : 0.9}
                            />
                        );
                    })}

                    {/* X-axis */}
                    <Line
                        x1={margin.left}
                        y1={chartHeight - margin.bottom}
                        x2={chartWidth - margin.right}
                        y2={chartHeight - margin.bottom}
                        stroke={colors.secondaryText}
                        strokeWidth={1}
                        opacity={0.3}
                    />

                    {/* Hour labels */}
                    {data.map((point, index) => {
                        if (!shouldShowLabel(point.time)) return null;

                        return (
                            <SvgText
                                key={`label-${index}`}
                                x={xScale(index)}
                                y={chartHeight - 25}
                                fontSize={12}
                                fill={colors.secondaryText}
                                textAnchor="middle"
                                fontWeight="500"
                            >
                                {point.time}
                            </SvgText>
                        );
                    })}
                </Svg>

                {/* Event icons overlay - positioned absolutely over the SVG */}
                {events.map((event, index) => {
                    const x = getEventX(event.time);
                    const isPickup = event.type === 'pickup';

                    return (
                        <View
                            key={`event-icon-${index}`}
                            style={[
                                styles.eventIconContainer,
                                { left: x - 12 } // Center the icon (24px width / 2)
                            ]}
                        >
                            <FontAwesome
                                name={isPickup ? 'mobile' : 'eye'}
                                size={20}
                                color={isPickup ? Colors.pickupColor : Colors.awakeColor}
                            />
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 0,
    },
    chartWrapper: {
        paddingVertical: 10,
        position: 'relative', // Required for absolute positioning of icons
    },
    eventIconContainer: {
        position: 'absolute',
        top: 10, // Position above the graph area
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});