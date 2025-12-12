import {Platform, StyleSheet} from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedLogo } from '@/components/ThemedLogo';
import { SkipLink } from '@/components/SkipLink';
import {StatusBar} from "expo-status-bar";
import React from "react";

export default function OnboardingScreen() {
    const completeOnboarding = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        // @ts-ignore
        router.replace('/');
    };

    const skipOnboarding = async () => {
        // @ts-ignore
        router.replace('/');
    };

    return (
        <>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <View style={styles.container}>
                <ThemedLogo
                    lightSource={require('../assets/images/logo/logo_light.png')}
                    darkSource={require('../assets/images/logo/logo_dark.png')}
                    style={styles.logo}
                />

                <Text style={styles.subtitle}>Welcome to</Text>
                <Text style={styles.title}>SOMNUS</Text>

                <ThemedButton
                    title="Sign in or create an account"
                    onPress={completeOnboarding}
                />

                <SkipLink
                    title="Skip this step"
                    onPress={skipOnboarding}
                    style={styles.skipLink}
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
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    skipLink: {
        marginTop: 30,
    },
});