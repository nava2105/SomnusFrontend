import {StyleSheet, View, Text, TextInput, ScrollView, Image, TouchableOpacity, Modal} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import { ThemedButton } from '@/components/ThemedButton';
import HeaderText from '@/components/HeaderText';
import { FontAwesome } from '@expo/vector-icons';
import { View as ThemedView } from '@/components/Themed';
import { UserProfile } from '@/types';
import api from '@/services/api';

// List of available avatars - Add your avatar file names here
// Place your avatar images in assets/avatar/ folder
const AVAILABLE_AVATARS = [
    require('@/assets/avatar/bear.png'),
    require('@/assets/avatar/buffalo.png'),
    require('@/assets/avatar/chick.png'),
    require('@/assets/avatar/chicken.png'),
    require('@/assets/avatar/cow.png'),
    require('@/assets/avatar/crocodile.png'),
    require('@/assets/avatar/dog.png'),
    require('@/assets/avatar/duck.png'),
    require('@/assets/avatar/elephant.png'),
    require('@/assets/avatar/frog.png'),
    require('@/assets/avatar/giraffe.png'),
    require('@/assets/avatar/goat.png'),
    require('@/assets/avatar/gorilla.png'),
    require('@/assets/avatar/hippo.png'),
    require('@/assets/avatar/horse.png'),
    require('@/assets/avatar/monkey.png'),
    require('@/assets/avatar/moose.png'),
    require('@/assets/avatar/narwhal.png'),
    require('@/assets/avatar/owl.png'),
    require('@/assets/avatar/panda.png'),
    require('@/assets/avatar/parrot.png'),
    require('@/assets/avatar/penguin.png'),
    require('@/assets/avatar/pig.png'),
    require('@/assets/avatar/rabbit.png'),
    require('@/assets/avatar/rhino.png'),
    require('@/assets/avatar/sloth.png'),
    require('@/assets/avatar/snake.png'),
    require('@/assets/avatar/walrus.png'),
    require('@/assets/avatar/whale.png'),
    require('@/assets/avatar/zebra.png'),
];

export default function SetupProfileScreen() {
    const { colors } = useTheme();
    const [username, setUsername] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [age, setAge] = useState<number | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const calculateAge = (day: string, month: string, year: string): number | null => {
        if (!day || !month || !year) return null;

        const birthDateObj = new Date(`${year}-${month}-${day}`);
        const today = new Date();

        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    };

    const handleContinue = () => {
        const calculatedAge = calculateAge(birthDate.day, birthDate.month, birthDate.year);

        if (!username.trim() || !calculatedAge || calculatedAge < 0) {
            alert('Please enter a valid name and birth date');
            return;
        }

        setAge(calculatedAge);
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        if (!age) return;

        const profile: UserProfile = {
            username: username.trim(),
            birthDate: `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
            age: age,
            avatar: `avatar${selectedAvatar + 1}.png`
        };

        // Save locally
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

        // Send to backend with error handling
        try {
            console.log('Sending profile to backend:', profile);
            const response = await api.post('/api/user/profile', {
                username: profile.username,
                profile_picture: profile.avatar,
                age: profile.age,
                birth_date: profile.birthDate
            });
            console.log('Profile saved successfully:', response.data);
        } catch (error: any) {
            console.error('Failed to send profile to backend:', error.message);
            alert(`Failed to connect to backend. Make sure you're using the correct IP address. Error: ${error.message}`);
        }

        router.replace('/setup_time');
    };

    const handleBack = () => {
        setShowConfirmation(false);
        setAge(null);
    };

    const updateBirthDateField = (field: 'day' | 'month' | 'year', value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');

        if (field === 'day' && numericValue.length > 2) return;
        if (field === 'month' && numericValue.length > 2) return;
        if (field === 'year' && numericValue.length > 4) return;

        setBirthDate(prev => ({ ...prev, [field]: numericValue }));
    };

    if (showConfirmation) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <HeaderText text="Confirm Your Profile" />

                <View style={styles.confirmationContainer}>
                    <Image
                        source={AVAILABLE_AVATARS[selectedAvatar]}
                        style={styles.selectedAvatar}
                    />

                    <Text style={[styles.confirmationText, { color: colors.text }]}>
                        So <Text style={[styles.username, {color: colors.secondaryText} ]}>{username}</Text>, you are{' '}
                        <Text style={[styles.age, {color: colors.tint}]}>{age}</Text> years old
                    </Text>

                    <View style={styles.confirmationButtons}>
                        <ThemedButton
                            title="No"
                            onPress={handleBack}
                            style={styles.confirmationButton}
                        />
                        <ThemedButton
                            title="Yes"
                            onPress={handleConfirm}
                            style={styles.confirmationButton}
                        />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HeaderText text="Your Profile" />

            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                Tell us a bit about yourself
            </Text>

            <ScrollView style={styles.formContainer}>
                {/* Avatar Selection Dropdown */}
                <View style={styles.avatarSection}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Choose Your Avatar
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowAvatarModal(true)}
                        style={[
                            styles.avatarDropdown,
                            {
                                backgroundColor: colors.cardBackground,
                                borderColor: colors.secondaryText,
                            }
                        ]}
                    >
                        <Image
                            source={AVAILABLE_AVATARS[selectedAvatar]}
                            style={styles.dropdownAvatarImage}
                            resizeMode="contain"
                        />
                        <FontAwesome
                            name="chevron-down"
                            size={20}
                            color={colors.secondaryText}
                            style={styles.dropdownArrow}
                        />
                    </TouchableOpacity>
                </View>

                {/* Username Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Username
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.cardBackground,
                                color: colors.text,
                                borderColor: colors.secondaryText
                            }
                        ]}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.secondaryText}
                        value={username}
                        onChangeText={setUsername}
                        autoCorrect={false}
                    />
                </View>

                {/* Birth Date Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        Birth Date
                    </Text>
                    <View style={styles.dateContainer}>
                        <TextInput
                            style={[
                                styles.dateInput,
                                {
                                    backgroundColor: colors.cardBackground,
                                    color: colors.text,
                                    borderColor: colors.secondaryText
                                }
                            ]}
                            placeholder="DD"
                            placeholderTextColor={colors.secondaryText}
                            value={birthDate.day}
                            onChangeText={(value) => updateBirthDateField('day', value)}
                            keyboardType="number-pad"
                            maxLength={2}
                        />
                        <Text style={[styles.separator, { color: colors.text }]}>/</Text>
                        <TextInput
                            style={[
                                styles.dateInput,
                                {
                                    backgroundColor: colors.cardBackground,
                                    color: colors.text,
                                    borderColor: colors.secondaryText
                                }
                            ]}
                            placeholder="MM"
                            placeholderTextColor={colors.secondaryText}
                            value={birthDate.month}
                            onChangeText={(value) => updateBirthDateField('month', value)}
                            keyboardType="number-pad"
                            maxLength={2}
                        />
                        <Text style={[styles.separator, { color: colors.text }]}>/</Text>
                        <TextInput
                            style={[
                                styles.dateInput,
                                {
                                    backgroundColor: colors.cardBackground,
                                    color: colors.text,
                                    borderColor: colors.secondaryText
                                }
                            ]}
                            placeholder="YYYY"
                            placeholderTextColor={colors.secondaryText}
                            value={birthDate.year}
                            onChangeText={(value) => updateBirthDateField('year', value)}
                            keyboardType="number-pad"
                            maxLength={4}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <ThemedButton
                        title="Next"
                        onPress={handleContinue}
                    />
                </View>
            </ScrollView>

            {/* Avatar Selection Modal */}
            <Modal
                visible={showAvatarModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAvatarModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[
                        styles.modalContent,
                        { backgroundColor: colors.background }
                    ]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                Select Your Avatar
                            </Text>
                            <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                                <FontAwesome name="times" size={24} color={colors.secondaryText} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            <ThemedView style={styles.avatarGrid}>
                                {AVAILABLE_AVATARS.map((avatar, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setSelectedAvatar(index);
                                            setShowAvatarModal(false);
                                        }}
                                        style={[
                                            styles.avatarOption,
                                            { borderColor: colors.secondaryText },
                                            selectedAvatar === index && {
                                                ...styles.avatarSelected,
                                                borderColor: colors.tint
                                            }
                                        ]}
                                    >
                                        <Image
                                            source={avatar}
                                            style={styles.avatarImage}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ThemedView>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    avatarSection: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    avatarDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        height: 70,
    },
    dropdownAvatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    dropdownArrow: {
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        padding: 10,
        borderRadius: 12,
    },
    avatarOption: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarSelected: {
        borderWidth: 3,
        transform: [{ scale: 1.1 }],
    },
    avatarImage: {
        width: '80%',
        height: '80%',
        borderRadius: 40,
    },
    inputGroup: {
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateInput: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        borderWidth: 1,
        textAlign: 'center',
    },
    separator: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    confirmationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    selectedAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 30,
    },
    confirmationText: {
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 40,
    },
    username: {
        fontWeight: 'bold',
    },
    age: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    confirmationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    confirmationButton: {
        flex: 1,
    },
});