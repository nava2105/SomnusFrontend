/**
 * Main home screen displaying sleep score and weekly overview
 */

import { StyleSheet, ActivityIndicator } from 'react-native';
import { View } from '@/components/Themed';
import ArcChart from "@/components/ArcChart";
import Colors from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import IconTextRow from "@/components/IconTextRow";
import ScoreDisplay from "@/components/ScoreDisplay";
import {useColorScheme} from "@/components/useColorScheme";
import BodyActionLink from "@/components/BodyActionLink";
import SleepStartButton from '@/components/SleepStartButton';
import BarChart from "@/components/BarChart";
import HeaderText from '@/components/HeaderText';
import { router } from 'expo-router';
import { fetchWeeklyData, fetchSleepDistribution, fetchSleepScore } from '@/services/api';
import { ChartSection } from '@/types';

export default function TabOneScreen() {
    const colorScheme = useColorScheme();
    const [weeklyData, setWeeklyData] = useState<any[]>([]);
    const [sleepDistribution, setSleepDistribution] = useState<{awake: number, pickups: number, asleep: number} | null>(null);
    const [sleepScore, setSleepScore] = useState<{score: number, label: string} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [weekly, distribution, score] = await Promise.all([
                fetchWeeklyData(),
                fetchSleepDistribution(),
                fetchSleepScore()
            ]);

            setWeeklyData(weekly);
            setSleepDistribution(distribution);
            setSleepScore(score);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
                <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
            </View>
        );
    }

    // Convert distribution data to ChartSection format with colors
    const chartSections: ChartSection[] = sleepDistribution ? [
        { value: sleepDistribution.awake, color: Colors.awakeColor, label: 'Awake' },
        { value: sleepDistribution.pickups, color: Colors.pickupColor, label: 'Pickups' },
        { value: sleepDistribution.asleep, color: Colors.asleepColor, label: 'Asleep' },
    ] : [];

    return (
        <View style={styles.container}>
            <HeaderText text={"Home"} />
            <BodyActionLink
                href="/recommendations"
                label="Recommendations"
                iconName="list"
                position="right"
            />
            <View style={styles.chartContainer}>
                <ArcChart
                    sections={chartSections}
                    size={350}
                    strokeWidth={40}
                    holeSize={0.9}
                />
                {sleepScore && (
                    <ScoreDisplay
                        score={sleepScore.score}
                        label={sleepScore.label}
                        size={50}
                        color={Colors[colorScheme ?? 'light'].secondaryText}
                    />
                )}
            </View>
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
            <View style={styles.separation}>
                <SleepStartButton
                    onPress={() => router.push('/modal_change_hour')}
                    size={50}
                    iconOffset={15}
                />
            </View>
            <BodyActionLink
                href="/modal_change_hour"
                label="Edit bedtime"
                iconName="clock-o"
                position="left"
            />
            <BarChart
                data={weeklyData}
                height={100}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    separation: {
        paddingVertical: 20
    }
});