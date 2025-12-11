/**
 * Modal screen for sleep recommendations
 */

import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import RecommendationList from '@/components/RecommendationList';

export default function RecommendationsScreen() {
    return (
        <View style={styles.container}>
            <RecommendationList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});