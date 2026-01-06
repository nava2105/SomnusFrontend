import { Audio } from 'expo-av';
import { DeviceMotion } from 'expo-sensors';
import * as Brightness from 'expo-brightness';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { sendSleepSessionData } from '@/services/api';

// Global state for sleep recording
let isRecording = false;
let recording: Audio.Recording | null = null;
let motionSubscription: any = null;
let lightInterval: NodeJS.Timeout | null = null;
let sessionData: any = null;

// Initialize recording session
const initializeSession = () => {
    sessionData = {
        startTime: new Date().toISOString(),
        endTime: '',
        duration: 0,
        audioData: [] as any[],
        motionData: [] as any[],
        lightData: [] as any[]
    };
    console.log('[SLEEP_RECORDING] Session initialized');
};

// Start audio recording
const startAudioRecording = async () => {
    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { granted } = await Audio.getPermissionsAsync();
        if (!granted) {
            throw new Error('Microphone permission not granted');
        }

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
            Audio.RecordingOptionsPresets.LOW_QUALITY
        );
        await newRecording.startAsync();
        recording = newRecording;
        console.log('[SLEEP_RECORDING] Audio recording started');
    } catch (error) {
        console.warn('[SLEEP_RECORDING] Audio recording failed:', error);
    }
};

// Start motion tracking
const startMotionTracking = () => {
    try {
        motionSubscription = DeviceMotion.addListener((motionData) => {
            sessionData.motionData.push({
                timestamp: new Date().toISOString(),
                acceleration: motionData.acceleration,
                rotation: motionData.rotation,
                orientation: motionData.orientation
            });
        });
        DeviceMotion.setUpdateInterval(1000);
        console.log('[SLEEP_RECORDING] Motion tracking started');
    } catch (error) {
        console.warn('[SLEEP_RECORDING] Motion tracking failed:', error);
    }
};

// Start light monitoring
const startLightMonitoring = () => {
    // @ts-ignore
    lightInterval = setInterval(async () => {
        try {
            const brightness = await Brightness.getBrightnessAsync();
            sessionData.lightData.push({
                timestamp: new Date().toISOString(),
                brightness: brightness
            });
        } catch (error) {
            console.warn('[SLEEP_RECORDING] Failed to record brightness:', error);
        }
    }, 60000);

    // Record initial brightness
    Brightness.getBrightnessAsync().then(brightness => {
        sessionData.lightData.push({
            timestamp: new Date().toISOString(),
            brightness: brightness
        });
    });
};

// Stop all sensors
const stopSensors = async () => {
    // Stop audio
    if (recording) {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            sessionData.audioData.push({
                timestamp: new Date().toISOString(),
                audioFileUri: uri
            });
            recording = null;
            console.log('[SLEEP_RECORDING] Audio recording stopped');
        } catch (error) {
            console.warn('[SLEEP_RECORDING] Error stopping audio:', error);
        }
    }

    // Stop motion
    if (motionSubscription) {
        motionSubscription.remove();
        motionSubscription = null;
        console.log('[SLEEP_RECORDING] Motion tracking stopped');
    }

    // Stop light
    if (lightInterval) {
        clearInterval(lightInterval);
        lightInterval = null;
        console.log('[SLEEP_RECORDING] Light monitoring stopped');
    }
};

// Send data to backend
const sendDataToBackend = async () => {
    try {
        console.log('[SLEEP_RECORDING] Sending sleep session data to backend...');

        const profileString = await AsyncStorage.getItem('userProfile');
        const profile = profileString ? JSON.parse(profileString) : {};
        const username = profile.username || 'anonymous';

        // Read audio file as base64 if it exists
        let audioBase64 = null;
        if (sessionData.audioData.length > 0) {
            const audioUri = sessionData.audioData[0].audioFileUri;
            if (audioUri) {
                try {
                    console.log('[SLEEP_RECORDING] Reading audio file from:', audioUri);
                    audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
                        encoding: FileSystem.EncodingType.Base64
                    });
                    console.log('[SLEEP_RECORDING] Audio file converted to base64, size:', audioBase64.length);
                } catch (error) {
                    console.error('[SLEEP_RECORDING] Failed to read audio file:', error);
                }
            }
        }

        const dataToSend = {
            username: username,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            duration: sessionData.duration,
            audioData: audioBase64 ? [{
                timestamp: sessionData.startTime,
                audioFileBase64: audioBase64
            }] : [],
            motionData: sessionData.motionData.slice(-1000),
            lightData: sessionData.lightData,
            summary: {
                motionEvents: sessionData.motionData.length,
                lightReadings: sessionData.lightData.length,
                audioFile: audioBase64 !== null,
                triggeredBy: 'inactivity_sensor' // Mark as auto-triggered
            }
        };

        console.log('[SLEEP_RECORDING] Session data prepared:', {
            username: dataToSend.username,
            duration: `${(dataToSend.duration / 1000 / 60).toFixed(1)} minutes`,
            hasAudio: dataToSend.summary.audioFile,
            motionEvents: dataToSend.motionData.length,
            lightReadings: dataToSend.lightData.length,
            trigger: 'auto'
        });

        const response = await sendSleepSessionData(dataToSend);
        console.log('[SLEEP_RECORDING] Sleep session data sent successfully:', response);

        return response;
    } catch (error) {
        console.error('[SLEEP_RECORDING] Failed to send recording data:', error);
        throw error;
    }
};

// Main function to start sleep recording
export const startSleepRecording = async (): Promise<boolean> => {
    if (isRecording) {
        console.log('[SLEEP_RECORDING] Already recording, skipping...');
        return false;
    }

    try {
        console.log('[SLEEP_RECORDING] Starting sleep recording session...');

        initializeSession();
        await startAudioRecording();
        startMotionTracking();
        startLightMonitoring();

        isRecording = true;
        console.log('[SLEEP_RECORDING] Sleep recording session started successfully');
        return true;
    } catch (error) {
        console.error('[SLEEP_RECORDING] Failed to start recording:', error);
        // Cleanup on failure
        await stopSleepRecording();
        return false;
    }
};

// Main function to stop sleep recording
export const stopSleepRecording = async (): Promise<boolean> => {
    if (!isRecording) {
        console.log('[SLEEP_RECORDING] Not currently recording');
        return false;
    }

    try {
        console.log('[SLEEP_RECORDING] Stopping sleep recording session...');

        // Finalize session data
        sessionData.endTime = new Date().toISOString();
        sessionData.duration = new Date(sessionData.endTime).getTime() - new Date(sessionData.startTime).getTime();

        await stopSensors();
        isRecording = false;

        // Send to backend
        await sendDataToBackend();

        console.log('[SLEEP_RECORDING] Sleep recording stopped and data sent');
        return true;
    } catch (error) {
        console.error('[SLEEP_RECORDING] Error stopping recording:', error);
        return false;
    }
};

// Get current recording state
export const getRecordingState = () => ({
    isRecording,
    sessionData: isRecording ? sessionData : null
});