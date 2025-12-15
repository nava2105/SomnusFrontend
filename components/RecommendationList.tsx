// components/RecommendationList.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { View } from '@/components/Themed';
import RecommendationCard from './RecommendationCard';
import { fetchRecommendations } from '@/services/api';
import { Recommendation } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function RecommendationList() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { colors } = useTheme();

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRecommendations();
            setRecommendations(data);
        } catch (err) {
            console.error('Error loading recommendations:', err);
            setError('Failed to load recommendations. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={[styles.statusText, { color: colors.secondaryText }]}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
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
    statusText: {
        marginTop: 10,
        fontSize: 14,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});