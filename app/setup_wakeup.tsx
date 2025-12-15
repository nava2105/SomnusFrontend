import { StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import HeaderText from '@/components/HeaderText';
import AnalogClock from '@/components/AnalogClock';
import { UserTimeSetting } from '@/types';
import api from '@/services/api';

export default function SetupWakeupScreen() {
    const { colors } = useTheme();
    const [wakeUpTime, setWakeUpTime] = useState<UserTimeSetting>({
        hour: 7,
        minute: 0,
        isPM: false,
    });

    const handleNext = async () => {
        try {
            const settingsString = await AsyncStorage.getItem('userSettings');
            const existingSettings = settingsString ? JSON.parse(settingsString) : {};
            const profileString = await AsyncStorage.getItem('userProfile');
            const profile = profileString ? JSON.parse(profileString) : {};

            const settings = {
                ...existingSettings,
                wakeUpTime,
            };

            await AsyncStorage.setItem('userSettings', JSON.stringify(settings));

            // Send to backend with error handling
            try {
                console.log('Sending settings to backend:', settings);
                const response = await api.post('/api/user/settings', {
                    username: profile.username,
                    bedtime: {
                        hour: existingSettings.bedtime.hour,
                        minute: existingSettings.bedtime.minute,
                        isPM: existingSettings.bedtime.isPM
                    },
                    wakeup_time: {
                        hour: wakeUpTime.hour,
                        minute: wakeUpTime.minute,
                        isPM: wakeUpTime.isPM
                    }
                });
                console.log('Settings saved successfully:', response.data);
            } catch (error: any) {
                console.error('Failed to send settings to backend:', error.message);
                alert(`Failed to connect to backend. Make sure you're using the correct IP address. Error: ${error.message}`);
            }

            router.replace('/setup_permissions');
        } catch (error) {
            console.error('Error saving wake-up time:', error);
            router.replace('/setup_permissions');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderText text="Set Your Wake-up Time" />

            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                When do you usually wake up?
            </Text>

            <View style={styles.clockWrapper}>
                <AnalogClock
                    onTimeChange={(hour, minute, isPM) => {
                        setWakeUpTime({ hour, minute, isPM });
                    }}
                    onNext={handleNext}
                    initialHour={wakeUpTime.hour}
                    initialMinute={wakeUpTime.minute}
                    initialIsPM={wakeUpTime.isPM}
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