import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import HeaderText from '@/components/HeaderText';
import { FontAwesome } from '@expo/vector-icons';

export default function TabTwoScreen() {
    const { colors } = useTheme();

    const handleResetOnboarding = async () => {
        Alert.alert(
            'Reset Onboarding',
            'This will clear all your settings and return you to the onboarding flow. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Clear all relevant AsyncStorage keys
                            await AsyncStorage.multiRemove([
                                'hasSeenOnboarding',
                                'setupComplete',
                                'userProfile',
                                'userSettings'
                            ]);
                            Alert.alert('Success', 'Onboarding data cleared. Restart the app.');
                            // Force reload
                            router.replace('/onboarding');
                        } catch (error) {
                            console.error('Failed to clear data:', error);
                            Alert.alert('Error', 'Failed to clear onboarding data');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderText text="Settings" />

            <ScrollView style={styles.content}>
                <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                    <FontAwesome name="info-circle" size={24} color={colors.tint} style={styles.icon} />
                    <Text style={[styles.title, { color: colors.text }]}>Onboarding Status</Text>
                    <Text style={[styles.description, { color: colors.secondaryText }]}>
                        If you're not seeing the onboarding flow, you can reset it here.
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={handleResetOnboarding}
                    >
                        <Text style={styles.buttonText}>Reset Onboarding</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                    <FontAwesome name="database" size={24} color={colors.tint} style={styles.icon} />
                    <Text style={[styles.title, { color: colors.text }]}>Data Management</Text>
                    <Text style={[styles.description, { color: colors.secondaryText }]}>
                        Clear all locally stored data including user profile and settings.
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={handleResetOnboarding}
                    >
                        <Text style={styles.buttonText}>Clear All Data</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    icon: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});