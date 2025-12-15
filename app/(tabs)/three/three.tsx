/**
 * Night graph tab screen showing detailed sleep pattern
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Text } from 'react-native';
import { View } from '@/components/Themed';
import NightGraph from '@/components/NightGraph';
import BodyActionLink from '@/components/BodyActionLink';
import IconTextRow from '@/components/IconTextRow';
import Colors from '@/constants/Colors';
import HeaderText from '@/components/HeaderText';
import { fetchNightPattern } from '@/services/api';
import { useTheme } from '@/hooks/useTheme';

export default function TabThreeScreen() {
    const { colors } = useTheme();
    const [nightData, setNightData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNightPattern();
    }, []);

    const loadNightPattern = async () => {
        try {
            setLoading(true);
            const data = await fetchNightPattern();
            setNightData(data);
        } catch (error) {
            console.error('Error loading night pattern:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.tint} />
            </View>
        );
    }

    if (!nightData) {
        return (
            <View style={styles.screenContainer}>
                <Text style={{ color: colors.text }}>Failed to load data</Text>
            </View>
        );
    }

    return (
        <View style={styles.screenContainer}>
            <HeaderText text="Night graph" />
            <View style={styles.centeredBlock}>
                <View style={styles.editTagsWrapper}>
                    <BodyActionLink
                        href="/modal_change_hour"
                        label="Edit tags"
                        iconName="edit"
                        position="right"
                    />
                </View>

                <NightGraph
                    data={nightData.points}
                    events={nightData.events}
                />

                <View style={styles.labelContainer}>
                    <IconTextRow
                        iconName="bed"
                        text="Hours of sleep"
                        color={Colors.asleepColor}
                    />
                    <IconTextRow
                        iconName="eye"
                        text="Time awake"
                        color={Colors.awakeColor}
                    />
                    <IconTextRow
                        iconName="mobile"
                        text="Night pickups"
                        color={Colors.pickupColor}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <View style={styles.buttonContainer}>
                        <BodyActionLink
                            href="/three/monthly_graph"
                            label="Monthly history"
                            iconName="calendar"
                            position="left"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <BodyActionLink
                            href="/modal_change_hour"
                            label="Export image"
                            iconName="image"
                            position="right"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    centeredBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
    },
    editTagsWrapper: {
        width: '100%',
        marginBottom: 15,
    },
    labelContainer: {
        paddingHorizontal: 15,
        marginBottom: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
    },
});