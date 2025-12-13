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
            {/* Principal screen without header */}
            <Stack.Screen
                name="three"
                options={{
                    headerShown: false,
                }}
            />

            {/* Recommendations screen with custom header */}
            <Stack.Screen
                name="monthly_graph"
                options={{
                    title: 'Monthly Graph',
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