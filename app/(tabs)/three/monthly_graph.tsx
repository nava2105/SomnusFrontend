/**
 * Monthly sleep history graph screen
 */

import { StyleSheet, ActivityIndicator } from 'react-native';
import { View } from '@/components/Themed';
import MonthlyGraph from '@/components/MonthlyGraph';
import { useTheme } from '@/hooks/useTheme';
import React, { useState, useEffect } from 'react';
import { fetchMonthlyData } from '@/services/api';

export default function MonthlyGraphScreen() {
    const { colors } = useTheme();
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Current date (September 2025 for demo)
    const currentYear = 2025;
    const currentMonth = 11; // December (0-indexed)

    useEffect(() => {
        loadMonthlyData();
    }, []);

    const loadMonthlyData = async () => {
        try {
            setLoading(true);
            const data = await fetchMonthlyData();
            setMonthlyData(data);
        } catch (error) {
            console.error('Error loading monthly data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDayPress = (date: string, score: number) => {
        console.log(`Day pressed: ${date} - Score: ${score}`);
        // Future: navigate to daily details
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.tint} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <MonthlyGraph
                data={monthlyData}
                initialYear={currentYear}
                initialMonth={currentMonth}
                onDayPress={handleDayPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});