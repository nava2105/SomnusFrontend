// components/RecommendationCard.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Recommendation } from '@/types';
import { sendPinAction } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
    recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [username, setUsername] = useState<string>('');
    const { colors } = useTheme();

    // Load username when component mounts
    useEffect(() => {
        loadUsername();
    }, []);

    const loadUsername = async () => {
        try {
            const profileString = await AsyncStorage.getItem('userProfile');
            if (profileString) {
                const profile = JSON.parse(profileString);
                setUsername(profile.username || 'unknown_user');
            }
        } catch (error) {
            console.error('Error loading username:', error);
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const togglePinned = async () => {
        const newPinnedState = !isPinned;
        setIsPinned(newPinnedState);

        // Send pin action to backend
        try {
            if (username) {
                await sendPinAction(
                    username,
                    recommendation.id,
                    recommendation.title,
                    newPinnedState
                );
            } else {
                console.warn('Username not available for pin action');
            }
        } catch (error) {
            console.error('Failed to send pin action:', error);
            // Revert state if API call fails
            setIsPinned(!newPinnedState);
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            {/* Header with title and pin icon */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {recommendation.title}
                </Text>

                <Pressable
                    onPress={togglePinned}
                    style={({ pressed }) => [
                        styles.pinButton,
                        { opacity: pressed ? 0.5 : 1 }
                    ]}
                    accessibilityLabel={isPinned ? 'Unpin recommendation' : 'Pin recommendation'}
                >
                    <FontAwesome
                        name="thumb-tack"
                        size={20}
                        color={isPinned ? colors.tint : colors.secondaryText}
                        style={[styles.pinIcon, isPinned && styles.pinnedIcon]}
                    />
                </Pressable>
            </View>

            <Text style={[styles.brief, { color: colors.secondaryText }]}>
                {recommendation.brief_explanation}
            </Text>

            <Pressable
                onPress={toggleExpanded}
                style={styles.whyButton}
                accessibilityLabel={isExpanded ? 'Hide explanation' : 'Show explanation'}
            >
                <Text style={[styles.whyText, { color: colors.tint }]}>
                    Why?
                </Text>
                <FontAwesome
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.tint}
                />
            </Pressable>

            {isExpanded && (
                <Text style={[styles.detailed, { color: colors.secondaryText }]}>
                    {recommendation.detailed_explanation}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
        lineHeight: 24,
    },
    pinButton: {
        padding: 8,
    },
    pinIcon: {
        transform: [{ rotate: '-45deg' }],
    },
    pinnedIcon: {
        transform: [{ rotate: '0deg' }],
    },
    brief: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    whyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 4,
    },
    whyText: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    detailed: {
        fontSize: 13,
        lineHeight: 18,
        marginTop: 12,
    },
});