/**
 * Stacked bar chart for weekly sleep data visualization
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { DayData } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import Colors from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    data: DayData[];
    height?: number;
}

export default function BarChart({ data, height = 200 }: Props) {
    const { colors } = useTheme();
    const chartWidth = SCREEN_WIDTH - 40;
    const chartHeight = height;

    const margin = { top: 10, right: 20, bottom: 40, left: 40 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    const maxTotal = Math.max(...data.map((d) => d.asleep + d.awake + d.pickups));
    const yMax = Math.ceil(maxTotal * 1.1);

    const barWidth = (innerWidth / data.length) * 0.7;
    const barSpacing = innerWidth / data.length;

    const scaleY = (value: number) => (value / yMax) * innerHeight;

    const renderBars = () =>
        data.map((dayData, index) => {
            const x = margin.left + index * barSpacing + (barSpacing - barWidth) / 2;
            let currentY = margin.top + innerHeight;

            const sections: Array<keyof Omit<DayData, 'day'>> = ['asleep', 'awake', 'pickups'];
            const sectionColors = {
                asleep: Colors.asleepColor,
                awake: Colors.awakeColor,
                pickups: Colors.pickupColor,
            };

            return sections.map((section) => {
                const value = dayData[section] as number;
                const sectionHeight = scaleY(value);
                const y = currentY - sectionHeight;

                const rect = (
                    <Rect
                        key={`${index}-${section}`}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={sectionHeight}
                        fill={sectionColors[section]}
                        rx={4}
                        ry={4}
                    />
                );

                currentY = y;
                return rect;
            });
        });

    const renderAxes = () => (
        <G>
            {/* Y-axis */}
            <Line
                x1={margin.left}
                y1={margin.top}
                x2={margin.left}
                y2={margin.top + innerHeight}
                stroke={colors.secondaryText}
                strokeWidth={1}
                opacity={0.3}
            />
            {/* X-axis */}
            <Line
                x1={margin.left}
                y1={margin.top + innerHeight}
                x2={margin.left + innerWidth}
                y2={margin.top + innerHeight}
                stroke={colors.secondaryText}
                strokeWidth={1}
                opacity={0.3}
            />
        </G>
    );

    const renderLabels = () =>
        data.map((dayData, index) => {
            const x = margin.left + index * barSpacing + barSpacing / 2;
            return (
                <SvgText
                    key={`label-${index}`}
                    x={x}
                    y={chartHeight - 10}
                    fontSize={12}
                    fill={colors.text}
                    textAnchor="middle"
                    fontWeight="500"
                >
                    {dayData.day}
                </SvgText>
            );
        });

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                {renderAxes()}
                {renderBars()}
                {renderLabels()}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});