import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColorScheme } from '@/components/useColorScheme';

const { width } = Dimensions.get('window');
const DEFAULT_SIZE = Math.min(width - 100, 280);

interface Section {
    value: number;
    color: string;
    label?: string;
}

interface ArcChartProps {
    sections: Section[];
    size?: number;
    strokeWidth?: number;
    holeSize?: number;
    style?: object;
}

export default function ArcChart({
                                     sections,
                                     size = DEFAULT_SIZE,
                                     strokeWidth = 40,
                                     holeSize = 0.5,
                                     style,
                                 }: ArcChartProps) {
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;
    const holeRadius = radius * holeSize;
    const maxAngle = 250;
    const startAngle = 35;

    const total = sections.reduce((sum, section) => sum + section.value, 0);

    let currentAngle = startAngle;

    const svgHeight = radius + strokeWidth / 2 + 10;

    const paths = sections.map((section, index) => {
        const percentage = section.value / total;
        const angle = percentage * maxAngle;
        const endAngle = currentAngle - angle;

        const startAngleRad = (currentAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);

        const largeArcFlag = angle > 180 ? 1 : 0;
        const sweepFlag = 0;

        let pathData: string;

        if (holeSize > 0) {
            const hx1 = centerX + holeRadius * Math.cos(startAngleRad);
            const hy1 = centerY + holeRadius * Math.sin(startAngleRad);
            const hx2 = centerX + holeRadius * Math.cos(endAngleRad);
            const hy2 = centerY + holeRadius * Math.sin(endAngleRad);

            pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`,
                `L ${hx2} ${hy2}`,
                `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} ${1 - sweepFlag} ${hx1} ${hy1}`,
                'Z',
            ].join(' ');
        } else {
            pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`,
                'Z',
            ].join(' ');
        }

        currentAngle = endAngle;

        return <Path key={index} d={pathData} fill={section.color} />;
    });

    return (
        <View style={[styles.container, style]}>
            <Svg
                width={size}
                height={svgHeight}
                viewBox={`0 0 ${size} ${size}`}
            >
                {paths}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});