import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/components/useColorScheme';

export {
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    const [showOnboarding, setShowOnboarding] = useState(true);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Verificar si el usuario ya vio el onboarding
    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
                setShowOnboarding(!hasSeenOnboarding);
            } catch (e) {
                console.error('Error checking onboarding:', e);
                setShowOnboarding(false);
            } finally {
                setIsChecking(false);
            }
        };

        if (loaded) {
            checkOnboardingStatus();
        }
    }, [loaded]);

    // Mostrar splash mientras carga
    if (!loaded || isChecking) {
        return null;
    }

    // Renderizar stack de onboarding o stack principal
    return showOnboarding ? <OnboardingLayout /> : <MainLayout />;
}

function OnboardingLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="onboarding" />
            </Stack>
        </ThemeProvider>
    );
}

function MainLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
        </ThemeProvider>
    );
}