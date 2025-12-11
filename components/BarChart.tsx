import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text, Line, G } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width: screenWidth } = Dimensions.get('window');

interface DayData {
    day: string;
    asleep: number;
    awake: number;
    pickups: number;
}

interface BarChartProps {
    data: DayData[];
    height?: number;
}

export default function BarChart({ data, height = 200 }: BarChartProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const chartWidth = screenWidth - 40;
    const chartHeight = height;
    const margin = { top: 10, right: 20, bottom: 40, left: 40 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const COLORS = {
        asleep: Colors.asleepColor,
        awake: Colors.awakeColor,
        pickups: Colors.pickupColor,
    };

    const maxTotal = Math.max(...data.map(d => d.asleep + d.awake + d.pickups));
    const yMax = Math.ceil(maxTotal * 1.1);

    const barWidth = innerWidth / data.length * 0.7;
    const barSpacing = innerWidth / data.length;

    const scaleY = (value: number) => (value / yMax) * innerHeight;

    const renderBars = () => {
        return data.map((dayData, index) => {
            const x = margin.left + index * barSpacing + (barSpacing - barWidth) / 2;

            let currentY = margin.top + innerHeight;

            const sections = [
                { key: 'asleep', value: dayData.asleep, color: COLORS.asleep },
                { key: 'awake', value: dayData.awake, color: COLORS.awake },
                { key: 'pickups', value: dayData.pickups, color: COLORS.pickups },
            ];

            return sections.map((section) => {
                const sectionHeight = scaleY(section.value);
                const y = currentY - sectionHeight;

                const rect = (
                    <Rect
                        key={`${index}-${section.key}`}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={sectionHeight}
                        fill={section.color}
                        rx={4}
                        ry={4}
                    />
                );

                currentY = y;
                return rect;
            });
        });
    };

    const renderAxes = () => (
        <>
            {/* Eje Y */}
            <Line
                x1={margin.left}
                y1={margin.top}
                x2={margin.left}
                y2={margin.top + innerHeight}
                stroke={theme.secondaryText}
                strokeWidth={1}
                opacity={0.3}
            />
            {/* Eje X */}
            <Line
                x1={margin.left}
                y1={margin.top + innerHeight}
                x2={margin.left + innerWidth}
                y2={margin.top + innerHeight}
                stroke={theme.secondaryText}
                strokeWidth={1}
                opacity={0.3}
            />
        </>
    );

    const renderLabels = () => {
        return data.map((dayData, index) => {
            const x = margin.left + index * barSpacing + barSpacing / 2;
            return (
                <Text
                    key={`label-${index}`}
                    x={x}
                    y={chartHeight - 10}
                    fontSize={12}
                    fill={theme.text}
                    textAnchor="middle"
                    fontWeight="500"
                >
                    {dayData.day}
                </Text>
            );
        });
    };

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                <G>
                    {renderAxes()}
                    {renderBars()}
                    {renderLabels()}
                </G>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});