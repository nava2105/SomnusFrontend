// components/RecommendationList.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { View } from '@/components/Themed';
import RecommendationCard from './RecommendationCard';
import { fetchRecommendations } from '@/services/api';
import { Recommendation } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function RecommendationList() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            const data = await fetchRecommendations();
            setRecommendations(data);
        } catch (error) {
            console.error('Error loading recommendations:', error);
            // Fallback to empty array or local data if needed
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.text }}>Loading recommendations...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {recommendations.map((rec) => (
                    <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                    />
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