/**
 * Root layout with onboarding flow and main app navigation
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/components/useColorScheme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = 'hasSeenOnboarding';

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    const [showOnboarding, setShowOnboarding] = useState(true);
    const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

    useEffect(() => {
        if (fontError) throw fontError;
    }, [fontError]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
                const setupComplete = await AsyncStorage.getItem('setupComplete');

                // Show onboarding if never seen OR if setup not complete
                setShowOnboarding(!hasSeenOnboarding || !setupComplete);
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setShowOnboarding(false);
            } finally {
                setIsCheckingOnboarding(false);
            }
        };

        if (fontsLoaded) {
            checkOnboardingStatus();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded || isCheckingOnboarding) {
        return null;
    }

    return showOnboarding ? <OnboardingNavigator /> : <MainNavigator />;
}

/**
 * Onboarding flow navigator
 */
function OnboardingNavigator() {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="setup_profile" /> {/* New screen */}
                <Stack.Screen name="setup_time" />
                <Stack.Screen name="setup_wakeup" />
                <Stack.Screen name="setup_permissions" />
            </Stack>
        </ThemeProvider>
    );
}

/**
 * Main app navigator with tabs and modals
 */
function MainNavigator() {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal_monthly_graph" options={{ presentation: 'modal' }} />
                <Stack.Screen name="modal_change_hour" options={{ presentation: 'modal',  headerShown: false }} />
            </Stack>
        </ThemeProvider>
    );
}