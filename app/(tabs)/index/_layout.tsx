/**
 * Index navigation layout configuration
 */

import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeStackLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            {/* Pantalla principal sin header */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* Recommendations screen with custom header */}
            <Stack.Screen
                name="recommendations"
                options={{
                    title: 'Recommendations',
                    headerStyle: {
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                    },
                    headerTintColor: Colors[colorScheme ?? 'light'].text,
                    headerTitleStyle: {
                        fontSize: 24,
                        fontWeight: 'bold',
                    },

                }}
            />
        </Stack>
    );
}