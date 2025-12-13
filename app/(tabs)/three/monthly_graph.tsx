/**
 * Monthly sleep history graph screen
 */

import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import MonthlyGraph from '@/components/MonthlyGraph';
import { monthlyGraphData } from '@/constants/Data';
import { useTheme } from '@/hooks/useTheme';

export default function MonthlyGraphScreen() {
    const { colors } = useTheme();

    // Current date (September 2025 for demo)
    const currentYear = 2025;
    const currentMonth = 11; // September (0-indexed)

    const handleDayPress = (date: string, score: number) => {
        console.log(`Day pressed: ${date} - Score: ${score}`);
        // Future: navigate to daily details
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <MonthlyGraph
                data={monthlyGraphData}
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