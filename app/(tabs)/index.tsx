/**
 * Main home screen displaying sleep score and weekly overview
 */

import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ArcChart from "@/components/ArcChart";
import Colors from "@/constants/Colors";
import React from "react";
import IconTextRow from "@/components/IconTextRow";
import ScoreDisplay from "@/components/ScoreDisplay";
import {useColorScheme} from "@/components/useColorScheme";
import BodyActionLink from "@/components/BodyActionLink";
import SleepStartButton from '@/components/SleepStartButton';
import BarChart from "@/components/BarChart";
import { router } from 'expo-router';

const weeklyData = [
    { day: 'Sun', asleep: 40, awake: 58, pickups: 2 },
    { day: 'Mon', asleep: 25, awake: 67, pickups: 8 },
    { day: 'Tue', asleep: 35, awake: 60, pickups: 5 },
    { day: 'Wed', asleep: 33, awake: 53, pickups: 14 },
    { day: 'Thu', asleep: 21, awake: 78, pickups: 1 },
    { day: 'Fri', asleep: 50, awake: 46, pickups: 4 },
    { day: 'Sat', asleep: 35, awake: 62, pickups: 3 },
];

export default function TabOneScreen() {
    const colorScheme = useColorScheme();
    return (
        <View style={styles.container}>
            <BodyActionLink
                href="/modal_recommendations"
                label="Recommendations"
                iconName="angle-right"
                position="right"
            />
            <View style={styles.chartContainer}>
                <ArcChart
                    sections={[
                        { value: 60, color: Colors.awakeColor },
                        { value: 5, color: Colors.pickupColor },
                        { value: 35, color: Colors.asleepColor },
                    ]}
                    size={350}
                    strokeWidth={40}
                    holeSize={0.9}
                />
                <ScoreDisplay
                    score={85}
                    label="Night Score"
                    size={50}
                    color={Colors[colorScheme ?? 'light'].secondaryText}
                />
            </View>
            <IconTextRow
                iconName="bed"
                // iconName="moon-o"        Possible change of icon
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
                    onPress={() => router.push('/modal_recommendations')}
                    size={50}
                    iconOffset={15}
                />
            </View>
            <BodyActionLink
                href="/modal_recommendations"
                label="Edit bedtime"
                iconName="angle-right"
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