import React, { useState, useRef, useEffect } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Audio } from 'expo-av';
import { DeviceMotion } from 'expo-sensors';
import * as Brightness from 'expo-brightness';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';  // CHANGED: Use legacy import
import { sendSleepSessionData } from '@/services/api';

interface SleepStartButtonProps {
    size?: number;
}

export default function SleepStartButton({ size = 80 }: SleepStartButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [isRecording, setIsRecording] = useState(false);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const motionSubscriptionRef = useRef<any>(null);
    const sessionDataRef = useRef({
        startTime: '',
        endTime: '',
        duration: 0,
        audioData: [] as any[],
        motionData: [] as any[],
        lightData: [] as any[]
    });

    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording();
            }
        };
    }, []);

    useEffect(() => {
        if (!isRecording) return;

        const interval = setInterval(async () => {
            try {
                const brightness = await Brightness.getBrightnessAsync();
                sessionDataRef.current.lightData.push({
                    timestamp: new Date().toISOString(),
                    brightness: brightness
                });
            } catch (error) {
                console.warn('Failed to record brightness:', error);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = async () => {
        try {
            console.log('Starting sleep recording session...');

            sessionDataRef.current = {
                startTime: new Date().toISOString(),
                endTime: '',
                duration: 0,
                audioData: [],
                motionData: [],
                lightData: []
            };

            // Start audio recording
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { granted } = await Audio.getPermissionsAsync();
                if (!granted) {
                    throw new Error('Microphone permission not granted');
                }

                const recording = new Audio.Recording();
                await recording.prepareToRecordAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                await recording.startAsync();
                recordingRef.current = recording;
                console.log('Audio recording started');
            } catch (error) {
                console.warn('Audio recording failed:', error);
            }

            // Start motion tracking
            try {
                const isAvailable = await DeviceMotion.isAvailableAsync();
                if (!isAvailable) {
                    throw new Error('Device motion not available');
                }

                motionSubscriptionRef.current = DeviceMotion.addListener((motionData) => {
                    sessionDataRef.current.motionData.push({
                        timestamp: new Date().toISOString(),
                        acceleration: motionData.acceleration,
                        rotation: motionData.rotation,
                        orientation: motionData.orientation
                    });
                });

                DeviceMotion.setUpdateInterval(1000);
                console.log('Motion tracking started');
            } catch (error) {
                console.warn('Motion tracking failed:', error);
            }

            // Record initial brightness
            try {
                const brightness = await Brightness.getBrightnessAsync();
                sessionDataRef.current.lightData.push({
                    timestamp: new Date().toISOString(),
                    brightness: brightness
                });
            } catch (error) {
                console.warn('Brightness reading failed:', error);
            }

            setIsRecording(true);
            console.log('Sleep recording session started successfully');
        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert(
                'Recording Error',
                'Failed to start sleep recording. Please check permissions.'
            );
        }
    };

    const stopRecording = async () => {
        try {
            console.log('Stopping sleep recording session...');

            // Stop audio recording
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                    const uri = recordingRef.current.getURI();
                    sessionDataRef.current.audioData.push({
                        timestamp: new Date().toISOString(),
                        audioFileUri: uri
                    });
                    recordingRef.current = null;
                    console.log('Audio recording stopped, URI:', uri);
                } catch (error) {
                    console.warn('Error stopping audio:', error);
                }
            }

            // Stop motion tracking
            if (motionSubscriptionRef.current) {
                motionSubscriptionRef.current.remove();
                motionSubscriptionRef.current = null;
                console.log('Motion tracking stopped');
            }

            // Finalize session data
            sessionDataRef.current.endTime = new Date().toISOString();
            sessionDataRef.current.duration =
                new Date(sessionDataRef.current.endTime).getTime() -
                new Date(sessionDataRef.current.startTime).getTime();

            setIsRecording(false);
            await sendRecordingData();

        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    const sendRecordingData = async () => {
        try {
            console.log('Sending sleep session data to backend...');

            // Get username from storage
            const profileString = await AsyncStorage.getItem('userProfile');
            const profile = profileString ? JSON.parse(profileString) : {};
            const username = profile.username || 'anonymous';

            // Read audio file as base64 if it exists - FIXED: Using legacy import
            let audioBase64 = null;
            if (sessionDataRef.current.audioData.length > 0) {
                const audioUri = sessionDataRef.current.audioData[0].audioFileUri;
                if (audioUri) {
                    try {
                        console.log('Attempting to read audio file from:', audioUri);

                        // Use legacy API to read file as base64
                        audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
                            encoding: FileSystem.EncodingType.Base64
                        });

                        console.log('Audio file successfully converted to base64, size:', audioBase64.length);
                    } catch (error) {
                        console.error('Failed to read audio file:', error);
                        audioBase64 = null;
                    }
                }
            }

            const dataToSend = {
                username: username,
                startTime: sessionDataRef.current.startTime,
                endTime: sessionDataRef.current.endTime,
                duration: sessionDataRef.current.duration,
                audioData: audioBase64 ? [{
                    timestamp: sessionDataRef.current.startTime,
                    audioFileBase64: audioBase64
                }] : [],
                motionData: sessionDataRef.current.motionData.slice(-1000),
                lightData: sessionDataRef.current.lightData,
                summary: {
                    motionEvents: sessionDataRef.current.motionData.length,
                    lightReadings: sessionDataRef.current.lightData.length,
                    audioFile: audioBase64 !== null
                }
            };

            console.log('Sending session data:', {
                username: dataToSend.username,
                duration: `${(dataToSend.duration / 1000 / 60).toFixed(1)} minutes`,
                hasAudio: dataToSend.summary.audioFile,
                motionEvents: dataToSend.motionData.length,
                lightReadings: dataToSend.lightData.length,
                audioSize: audioBase64 ? `${(audioBase64.length / 1024).toFixed(1)} KB` : 'No audio'
            });

            const response = await sendSleepSessionData(dataToSend);
            console.log('Sleep session data sent successfully:', response);

            Alert.alert(
                'Recording Complete',
                `Your sleep session data has been uploaded.${audioBase64 ? ' (with audio)' : ' (no audio)'}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Failed to send recording data:', error);
            Alert.alert(
                'Upload Error',
                'Failed to upload sleep session data. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handlePress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.button,
                {
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                },
            ]}
        >
            <FontAwesome5
                name={isRecording ? "stop" : "play"}
                size={size}
                color={isRecording ? theme.tint2 : theme.tint }
                solid
            />
            <FontAwesome5
                name="bed"
                size={size * 0.35}
                color={ theme.background }
                style={isRecording ? styles.centeredIcon : styles.rightIcon }
                solid
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    rightIcon: {
        position: 'absolute',
        right: 15
    },
    centeredIcon: {
        position: 'absolute',
    },
});