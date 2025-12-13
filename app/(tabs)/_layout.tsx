/**
 * Tab navigation layout configuration
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import TabBarIcon from '@/components/TabBarIcon';
import {Platform} from "react-native";
import {StatusBar} from "expo-status-bar";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
                        headerShown: false,
                    }}
                />

                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                        headerShown: false,
                    }}
                />

                <Tabs.Screen
                    name="two"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
                        headerTitleStyle: {
                            fontSize: 24,
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Tabs>
        </>
    );
}