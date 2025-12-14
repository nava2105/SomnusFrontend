import { StyleSheet, View, Text, ScrollView, Platform, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import React, { useState, useEffect } from 'react';
import { ThemedButton } from '@/components/ThemedButton';
import HeaderText from '@/components/HeaderText';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { DeviceMotion } from 'expo-sensors';
import * as Brightness from 'expo-brightness';
import Colors from "@/constants/Colors";

interface PermissionItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    required: boolean;
}

const permissions: PermissionItem[] = [
    {
        id: 'sound',
        title: 'Microphone Access',
        description: 'Record ambient noise and snoring patterns',
        icon: 'microphone',
        required: true,
    },
    {
        id: 'movement',
        title: 'Motion & Fitness',
        description: 'Track movement during sleep for sleep quality analysis',
        icon: 'bed',
        required: true,
    },
    {
        id: 'light',
        title: 'Ambient Light',
        description: 'Monitor room lighting conditions that affect sleep',
        icon: 'sun-o',
        required: true,
    },
];

export default function SetupPermissionsScreen() {
    const { colors } = useTheme();
    const [grantedPermissions, setGrantedPermissions] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<string | null>(null);

    // Check initial permission status on mount
    useEffect(() => {
        checkInitialPermissions();
    }, []);

    const checkInitialPermissions = async () => {
        try {
            // Check microphone permission
            const micPermission = await Audio.getPermissionsAsync();
            if (micPermission.granted) {
                setGrantedPermissions(prev => new Set(prev).add('sound'));
            }

            // Check brightness permission
            const isBrightnessAvailable = await Brightness.isAvailableAsync();
            if (isBrightnessAvailable) {
                // Brightness doesn't have a direct permission check, but we can try to get the brightness
                try {
                    await Brightness.getBrightnessAsync();
                    setGrantedPermissions(prev => new Set(prev).add('light'));
                } catch (error) {
                    // Permission not granted yet
                }
            }
        } catch (error) {
            console.error('Error checking initial permissions:', error);
        }
    };

    const requestMicrophonePermission = async (): Promise<boolean> => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();
            return granted;
        } catch (error) {
            console.warn('Microphone permission error:', error);
            return false;
        }
    };

    const requestMotionPermission = async (): Promise<boolean> => {
        try {
            // Motion permissions are handled differently on iOS vs Android
            if (Platform.OS === 'ios') {
                // iOS: This will prompt for motion permission automatically when we try to use it
                const isAvailable = await DeviceMotion.isAvailableAsync();
                if (!isAvailable) {
                    Alert.alert(
                        'Motion Not Available',
                        'This device does not support motion tracking.'
                    );
                    return false;
                }

                // Try to start the sensor - this will trigger permission request on iOS
                await DeviceMotion.requestPermissionsAsync();
                return true;
            } else {
                // Android: Motion permissions are typically granted automatically
                // But we need to check if it's available
                const isAvailable = await DeviceMotion.isAvailableAsync();
                if (!isAvailable) {
                    Alert.alert(
                        'Motion Not Available',
                        'This device does not support motion tracking.'
                    );
                    return false;
                }
                return true;
            }
        } catch (error) {
            console.warn('Motion permission error:', error);

            // On iOS, if permission is denied, show settings prompt
            if (Platform.OS === 'ios') {
                Alert.alert(
                    'Permission Required',
                    'Please enable Motion & Fitness tracking in Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
            }
            return false;
        }
    };

    const requestLightPermission = async (): Promise<boolean> => {
        try {
            // Check if brightness control is available
            const isAvailable = await Brightness.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert(
                    'Light Sensor Not Available',
                    'This device does not support ambient light monitoring.'
                );
                return false;
            }

            // Request permission to control brightness (this also covers reading brightness)
            const { status } = await Brightness.requestPermissionsAsync();

            if (status === 'granted') {
                // Test if we can actually read brightness
                await Brightness.getBrightnessAsync();
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Light permission error:', error);

            // If permission is denied, show settings prompt
            Alert.alert(
                'Permission Required',
                'Please enable Brightness access in Settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
            return false;
        }
    };

    const handlePermissionRequest = async (permissionId: string) => {
        setLoading(permissionId);

        let granted = false;

        try {
            switch (permissionId) {
                case 'sound':
                    granted = await requestMicrophonePermission();
                    break;

                case 'movement':
                    granted = await requestMotionPermission();
                    break;

                case 'light':
                    granted = await requestLightPermission();
                    break;

                default:
                    granted = false;
            }

            if (granted) {
                setGrantedPermissions(prev => new Set(prev).add(permissionId));
            }
        } catch (error) {
            console.error(`Error requesting ${permissionId}:`, error);
            Alert.alert(
                'Error',
                `Failed to request ${permissionId} permission. Please try again or enable it manually in Settings.`
            );
        } finally {
            setLoading(null);
        }
    };

    const handleContinue = async () => {
        try {
            // Check if all required permissions are granted
            const requiredPermissions = permissions.filter(p => p.required);
            const hasRequiredPermissions = requiredPermissions.every(
                p => grantedPermissions.has(p.id)
            );

            if (!hasRequiredPermissions) {
                Alert.alert(
                    'Required Permissions',
                    'Please grant all required permissions to continue.'
                );
                return;
            }

            // Update settings to mark permissions as granted
            const settingsString = await AsyncStorage.getItem('userSettings');
            if (settingsString) {
                const settings = JSON.parse(settingsString);
                settings.permissionsGranted = true;
                await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
            }

            // Mark setup as complete
            await AsyncStorage.setItem('setupComplete', 'true');

            // Navigate to home
            // @ts-ignore
            router.replace('/');
        } catch (error) {
            console.error('Error saving settings:', error);
            // @ts-ignore
            router.replace('/');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderText text="Grant Permissions" />

            <Text style={[styles.intro, { color: colors.secondaryText }]}>
                Somnus needs these permissions to provide accurate sleep tracking
            </Text>

            <ScrollView style={styles.permissionsList}>
                {permissions.map((permission) => {
                    const isGranted = grantedPermissions.has(permission.id);
                    const isLoading = loading === permission.id;

                    return (
                        <View
                            key={permission.id}
                            style={[
                                styles.permissionCard,
                                { backgroundColor: colors.cardBackground },
                            ]}
                        >
                            <View style={styles.permissionHeader}>
                                <FontAwesome
                                    name={permission.icon}
                                    size={24}
                                    color={isGranted ? Colors.asleepColor : colors.text}
                                />
                                <View style={styles.permissionText}>
                                    <Text style={[styles.permissionTitle, { color: colors.text }]}>
                                        {permission.title}
                                        {permission.required && (
                                            <Text style={[styles.requiredAsterisk, { color: colors.secondaryText }]}>*</Text>
                                        )}
                                    </Text>
                                    <Text style={[styles.permissionDescription, { color: colors.secondaryText }]}>
                                        {permission.description}
                                    </Text>
                                </View>
                            </View>

                            <ThemedButton
                                title={isLoading ? 'Requesting...' : isGranted ? 'Granted ✓' : 'Grant'}
                                onPress={() => handlePermissionRequest(permission.id)}
                                disabled={isGranted || isLoading}
                                style={styles.grantButton}
                            />
                        </View>
                    );
                })}

                <Text style={[styles.asteriskNote, { color: colors.secondaryText }]}>
                    * Required permissions
                </Text>
                <View style={styles.finishButtonContainer}>
                    <ThemedButton
                        title="Finish"
                        onPress={handleContinue}
                    />
                </View>
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
    },
    intro: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    permissionsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    permissionCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    permissionHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    permissionText: {
        flex: 1,
        marginLeft: 12,
    },
    permissionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    requiredAsterisk: {
        fontSize: 16,
        marginLeft: 4,
    },
    permissionDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    grantButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'flex-end',
        minWidth: 100,
    },
    asteriskNote: {
        fontSize: 12,
        marginTop: 10,
        marginBottom: 20,
    },
    finishButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center', // Center the button
    },
});