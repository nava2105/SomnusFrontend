/**
 * Tab navigation layout configuration
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import TabBarIcon from '@/components/TabBarIcon';
import HeaderRightLink from '@/components/HeaderRightLink';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].background,
                },
                headerShown: useClientOnlyValue(false, true),
                tabBarShowLabel: false,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                    borderColor: Colors[colorScheme ?? 'light'].background,
                },
                headerTintColor: Colors[colorScheme ?? 'light'].text,
            }}
            initialRouteName="index">

            <Tabs.Screen
                name="three"
                options={{
                    title: 'Night graph',
                    tabBarIcon: ({ color }) => <TabBarIcon name="area-chart" color={color} />,
                    headerRight: () => (
                        <HeaderRightLink
                            href="/modal_monthly_graph"
                            label="Monthly history"
                            iconName="calendar"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />

            <Tabs.Screen
                name="two"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
                }}
            />
        </Tabs>
    );
}