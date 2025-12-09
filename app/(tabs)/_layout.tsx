import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Text } from '@/components/Themed';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
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
      initialRouteName={"index"}>
        <Tabs.Screen
          name="three"
          options={{
            title: 'Night graph',
            tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
            headerRight: () => (
              <Link href={"/modal_monthly_graph"} asChild>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 15
                  }}>
                  {({ pressed }) => (
                    <>
                        <Text
                            style={{
                                color: Colors[colorScheme ?? 'light'].text,
                                opacity: pressed ? 0.5 : 1,
                                fontSize: 16
                            }}
                        >
                            Monthly history
                        </Text>
                        <FontAwesome
                        name="calendar"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginHorizontal: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    </>
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href={"/modal_recommendations"} asChild>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 15
                }}>
                {({ pressed }) => (
                  <>
                  <Text
                    style={{
                      color: Colors[colorScheme ?? 'light'].text,
                      opacity: pressed ? 0.5 : 1,
                      fontSize: 16
                    }}
                  >
                  Recommendations
                            </Text>
                            <FontAwesome
                                name="angle-right"
                                size={25}
                                color={Colors[colorScheme ?? 'light'].text}
                                style={{ marginHorizontal: 15, opacity: pressed ? 0.5 : 1 }}
                            />
                        </>
                    )}
                </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color}/>,
        }}
      />
    </Tabs>
  );
}
