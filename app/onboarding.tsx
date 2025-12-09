import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/components/useColorScheme';

export default function OnboardingScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const completeOnboarding = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Image
                source={
                    isDark
                        ? require('../assets/images/logo/logo_dark.png')
                        : require('../assets/images/logo/logo_light.png')
                }
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.subtitle}>Welcome to</Text>
            <Text style={styles.title}>SOMNUS</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: isDark ? '#10B981' : '#2f95dc' }]}
                onPress={completeOnboarding}
            >
                <Text style={styles.buttonText}>Sign in or create an account</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={completeOnboarding}
            >
                <Text style={[styles.buttonText, { color: isDark ? '#565656' : '#2f95dc'}]}>Skip this step</Text>
            </TouchableOpacity>
        </View>
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
        height: 200, // Ajusta según tus necesidades
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
    button: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});