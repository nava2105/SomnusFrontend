/**
 * Monthly calendar view showing sleep scores for each day
 * Color coding: asleepColor (>80), awakeColor (60-80), pickupColor (<60)
 * Now with month navigation buttons to browse historical data
 * FIXED: Timezone bug causing first day to appear in previous month
 */

import React, { useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { View } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import Colors from '@/constants/Colors';
import { MonthlyDayData } from '@/types';
import { FontAwesome } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_CELL_SIZE = (SCREEN_WIDTH - 80) / 7; // 7 days per week with margins

interface MonthlyGraphProps {
    data: MonthlyDayData[];
    initialYear: number;
    initialMonth: number; // 0-indexed (0 = January)
    onDayPress?: (date: string, score: number) => void;
}

export default function MonthlyGraph({
                                         data,
                                         initialYear,
                                         initialMonth,
                                         onDayPress
                                     }: MonthlyGraphProps) {
    const { colors } = useTheme();

    // State for current month/year navigation
    const [currentYear, setCurrentYear] = useState(initialYear);
    const [currentMonth, setCurrentMonth] = useState(initialMonth);

    // Get month name
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Calculate days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get first day of week (0 = Sunday)
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    // Get score for a specific day (FIXED: Avoid timezone issues)
    const getDayScore = (day: number): number | undefined => {
        // Parse date string manually instead of using Date object
        const dayData = data.find(d => {
            const [yearStr, monthStr, dayStr] = d.date.split('-').map(Number);
            return yearStr === currentYear &&
                monthStr === currentMonth + 1 && // +1 because string month is 1-indexed
                d.day === day;
        });
        return dayData?.score;
    };

    // Get color based on score
    const getDayColor = (score: number | undefined): string => {
        if (score === undefined) return colors.cardBackground;
        if (score > 80) return Colors.asleepColor;
        if (score >= 60) return Colors.awakeColor;
        return Colors.pickupColor;
    };

    // Navigation handlers
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            // Go to December of previous year
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            // Go to January of next year
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Generate calendar cells
    const renderCalendarDays = () => {
        const cells = [];
        const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        // Day headers
        dayHeaders.forEach((header, index) => {
            cells.push(
                <View key={`header-${index}`} style={styles.dayHeaderCell}>
                    <Text style={[styles.dayHeaderText, { color: colors.secondaryText }]}>
                        {header}
                    </Text>
                </View>
            );
        });

        // Empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            cells.push(
                <View key={`empty-${i}`} style={styles.emptyDayCell} />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const score = getDayScore(day);
            const backgroundColor = getDayColor(score);
            const isToday = new Date().getFullYear() === currentYear &&
                new Date().getMonth() === currentMonth &&
                new Date().getDate() === day;

            cells.push(
                <TouchableOpacity
                    key={`day-${day}`}
                    style={[
                        styles.dayCell,
                        { backgroundColor, width: DAY_CELL_SIZE, height: DAY_CELL_SIZE },
                        isToday && styles.todayCell
                    ]}
                    onPress={() => score !== undefined && onDayPress?.(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, score)}
                    activeOpacity={0.7}
                >
                    <Text style={[
                        styles.dayText,
                        { color: score !== undefined ? '#ffffff' : colors.text },
                        isToday && styles.todayText
                    ]}>
                        {day}
                    </Text>
                    {score !== undefined && (
                        <Text style={[
                            styles.scoreText,
                            { color: '#ffffff' }
                        ]}>
                            {score}
                        </Text>
                    )}
                </TouchableOpacity>
            );
        }

        return cells;
    };

    return (
        <View style={styles.container}>
            {/* Month Navigation Header */}
            <View style={styles.navigationHeader}>
                <TouchableOpacity
                    onPress={goToPreviousMonth}
                    style={styles.navButton}
                    activeOpacity={0.7}
                >
                    <FontAwesome
                        name="chevron-left"
                        size={20}
                        color={colors.secondaryText}
                    />
                </TouchableOpacity>

                <Text style={[styles.monthHeader, { color: colors.text }]}>
                    {monthNames[currentMonth]} {currentYear}
                </Text>

                <TouchableOpacity
                    onPress={goToNextMonth}
                    style={styles.navButton}
                    activeOpacity={0.7}
                >
                    <FontAwesome
                        name="chevron-right"
                        size={20}
                        color={colors.secondaryText}
                    />
                </TouchableOpacity>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.asleepColor }]} />
                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Excellent (&gt;80)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.awakeColor }]} />
                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Good (60-80)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: Colors.pickupColor }]} />
                    <Text style={[styles.legendText, { color: colors.secondaryText }]}>Poor (&lt;60)</Text>
                </View>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
                {renderCalendarDays()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    navigationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    navButton: {
        padding: 12,
        borderRadius: 8,
        minWidth: 40,
        alignItems: 'center',
    },
    monthHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendText: {
        fontSize: 12,
        fontWeight: '500',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayHeaderCell: {
        width: DAY_CELL_SIZE,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayHeaderText: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyDayCell: {
        width: DAY_CELL_SIZE,
        height: DAY_CELL_SIZE,
        margin: 2,
    },
    dayCell: {
        margin: 2,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    todayCell: {
        borderWidth: 2,
        borderColor: Colors.asleepColor,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
    },
    todayText: {
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    },
});