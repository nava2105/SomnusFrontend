import { StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import HeaderText from '@/components/HeaderText';
import AnalogClock from '@/components/AnalogClock';
import { UserTimeSetting } from '@/types';

export default function SetupTimeScreen() {
    const { colors } = useTheme();
    const [bedtime, setBedtime] = useState<UserTimeSetting>({
        hour: 10,
        minute: 0,
        isPM: true,
    });

    const handleNext = async () => {
        // Save bedtime settings and proceed to wake-up time setup
        const settings = {
            bedtime,
            wakeUpTime: null, // Will be set in next screen
            permissionsGranted: false,
        };
        await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
        router.push('/setup_wakeup');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderText text="Set Your Bedtime" />

            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                When do you usually go to sleep?
            </Text>

            <View style={styles.clockWrapper}>
                <AnalogClock
                    onTimeChange={(hour, minute, isPM) => {
                        setBedtime({ hour, minute, isPM });
                    }}
                    onNext={handleNext}
                    initialHour={bedtime.hour}
                    initialMinute={bedtime.minute}
                    initialIsPM={bedtime.isPM}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    clockWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
});