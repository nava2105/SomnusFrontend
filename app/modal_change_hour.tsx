/**
 * Modal screen for setting bedtime hour
 */

import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { router } from "expo-router";
import { View } from '@/components/Themed';
import AnalogClock from "@/components/AnalogClock";
import { useTheme } from '@/hooks/useTheme';

export default function ModalScreen() {
    const { colors } = useTheme();

    return (
        <>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <AnalogClock
                    onTimeChange={(hour, minute, isPM) => {
                        console.log(`Time: ${hour}:${minute} ${isPM ? 'PM' : 'AM'}`);
                    }}
                    onNext={() => {
                        router.back();
                    }}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});