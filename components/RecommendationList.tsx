/**
 * Scrollable list of sleep recommendations
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import RecommendationCard from './RecommendationCard';
import { recommendationsData } from '@/constants/Data';

export default function RecommendationList() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {recommendationsData.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 20,
        paddingBottom: 40,
    },
});