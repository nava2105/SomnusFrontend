import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    INACTIVITY_CONFIG,
    AUTO_MONITOR_CONFIG
} from '@/constants/Inactivity';
import { startSleepRecording } from '@/services/SleepRecordingService';

interface BedtimeSettings {
    hour: number;
    minute: number;
    isPM: boolean;
}

export function useBedtimeInactivityTracker() {
    const {
        ENABLED,
        LOG_PREFIX,
        INACTIVE_TIMEOUT_MS,
        CHECK_INTERVAL_MS
    } = INACTIVITY_CONFIG;

    const {
        ACTIVATE_AFTER_BEDTIME,
        BEDTIME_BUFFER_MS,
        AUTO_TRIGGER_SLEEP,
        MIN_SCREEN_OFF_MS
    } = AUTO_MONITOR_CONFIG;

    const screenOffTimestampRef = useRef<number | null>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isScreenAwake, setIsScreenAwake] = useState(true);
    const [isInactive, setIsInactive] = useState(false);
    const [bedtime, setBedtime] = useState<BedtimeSettings | null>(null);

    // Load bedtime from AsyncStorage
    useEffect(() => {
        const loadBedtime = async () => {
            try {
                const settingsString = await AsyncStorage.getItem('userSettings');
                if (settingsString) {
                    const settings = JSON.parse(settingsString);
                    if (settings.bedtime) {
                        setBedtime(settings.bedtime);
                        console.log(`${LOG_PREFIX} Loaded bedtime: ${settings.bedtime.hour}:${settings.bedtime.minute} ${settings.bedtime.isPM ? 'PM' : 'AM'}`);
                    }
                }
            } catch (error) {
                console.error(`${LOG_PREFIX} Failed to load bedtime:`, error);
            }
        };

        loadBedtime();
    }, []);

    // Check if current time is past bedtime
    const isPastBedtime = (): boolean => {
        if (!bedtime || !ACTIVATE_AFTER_BEDTIME) {
            return true; // If no bedtime set or feature disabled, always active
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Convert bedtime to 24-hour format
        let bedtimeHour = bedtime.hour;
        if (bedtime.isPM && bedtimeHour !== 12) {
            bedtimeHour += 12;
        } else if (!bedtime.isPM && bedtimeHour === 12) {
            bedtimeHour = 0;
        }

        // Create today's bedtime datetime
        const todayBedtime = new Date();
        todayBedtime.setHours(bedtimeHour, bedtime.minute, 0, 0);

        // Add buffer time
        todayBedtime.setTime(todayBedtime.getTime() + BEDTIME_BUFFER_MS);

        const isPast = now >= todayBedtime;

        if (isPast) {
            console.log(`${LOG_PREFIX} Current time (${currentHour}:${currentMinute}) is past bedtime (${bedtimeHour}:${bedtime.minute})`);
        }

        return isPast;
    };

    const checkScreenState = async (): Promise<boolean> => {
        try {
            if (Platform.OS === 'android') {
                const powerState = await DeviceInfo.getPowerState();
                return powerState.screenOn || false;
            }
            return AppState.currentState === 'active';
        } catch (error) {
            console.warn(`${LOG_PREFIX} Screen check failed:`, error);
            return true;
        }
    };

    // Start monitoring (only called when screen is OFF)
    const startMonitoring = () => {
        console.log(`${LOG_PREFIX} Screen is OFF - Starting monitoring`);

        if (!isPastBedtime()) {
            console.log(`${LOG_PREFIX} Not past bedtime yet, monitoring paused`);
            stopMonitoring();
            return;
        }

        const performCheck = async () => {
            const screenState = await checkScreenState();
            const now = Date.now();

            // If screen turned back ON, stop monitoring
            if (screenState) {
                stopMonitoring();
                const offDuration = screenOffTimestampRef.current
                    ? Math.floor((now - screenOffTimestampRef.current) / 1000)
                    : 0;
                console.log(`🔓 ${LOG_PREFIX} Screen ON after ${offDuration}s`);
                setIsInactive(false);
                setIsScreenAwake(true);
                return;
            }

            // Screen is still OFF - check timeout
            if (screenOffTimestampRef.current) {
                const offDuration = now - screenOffTimestampRef.current;

                if (offDuration >= INACTIVE_TIMEOUT_MS) {
                    console.log(`⚠️  ${LOG_PREFIX} PHONE INACTIVE: Screen off for ${Math.floor(offDuration / 60000)}min`);

                    // Trigger sleep recording if configured
                    if (AUTO_TRIGGER_SLEEP && offDuration >= MIN_SCREEN_OFF_MS) {
                        console.log(`${LOG_PREFIX} Auto-triggering sleep recording...`);
                        try {
                            await startSleepRecording(); // Programmatically start recording
                            console.log(`${LOG_PREFIX} Sleep recording started successfully`);
                        } catch (error) {
                            console.error(`${LOG_PREFIX} Failed to auto-start sleep recording:`, error);
                        }
                    }

                    setIsInactive(true);
                    stopMonitoring();
                }
            }
        };

        // Check immediately, then set interval
        performCheck();
        checkIntervalRef.current = setInterval(performCheck, CHECK_INTERVAL_MS) as unknown as NodeJS.Timeout;
    };

    // Stop monitoring (called when screen is ON)
    const stopMonitoring = () => {
        if (checkIntervalRef.current) {
            console.log(`${LOG_PREFIX} Stopping monitoring (screen is ON)`);
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
            setIsInactive(false);
        }
    };

    useEffect(() => {
        if (!ENABLED) {
            console.log(`${LOG_PREFIX} Sensor disabled`);
            return;
        }

        console.log(`${LOG_PREFIX} Starting bedtime-aware inactivity sensor`);
        setIsScreenAwake(true);
        setIsInactive(false);

        // Initial check
        const init = async () => {
            const initialState = await checkScreenState();
            setIsScreenAwake(initialState);

            if (!initialState && isPastBedtime()) {
                // Screen is already OFF on start and past bedtime
                screenOffTimestampRef.current = Date.now();
                startMonitoring();
            }
        };
        init();

        // Track app state changes
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            // When app comes to foreground, check if screen is off and past bedtime
            if (nextAppState === 'active') {
                setTimeout(async () => {
                    const screenState = await checkScreenState();
                    if (!screenState && isPastBedtime() && !checkIntervalRef.current) {
                        screenOffTimestampRef.current = Date.now();
                        startMonitoring();
                    }
                }, 1000);
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Poll for screen state changes (more reliable than relying solely on events)
        const pollInterval = setInterval(async () => {
            const currentScreenState = await checkScreenState();

            // Screen just turned OFF and past bedtime
            if (isScreenAwake && !currentScreenState && isPastBedtime()) {
                console.log(`🔒 ${LOG_PREFIX} Screen turned OFF (past bedtime)`);
                screenOffTimestampRef.current = Date.now();
                startMonitoring();
            }
            // Screen just turned ON
            else if (!isScreenAwake && currentScreenState) {
                console.log(`🔓 ${LOG_PREFIX} Screen turned ON`);
                stopMonitoring();
                screenOffTimestampRef.current = null;
            }

            setIsScreenAwake(currentScreenState);
        }, CHECK_INTERVAL_MS);

        return () => {
            console.log(`${LOG_PREFIX} Cleaning up sensor`);
            subscription.remove();
            stopMonitoring();
            clearInterval(pollInterval);
        };
    }, [ENABLED, LOG_PREFIX, INACTIVE_TIMEOUT_MS, CHECK_INTERVAL_MS, bedtime, isScreenAwake]);

    // Expose state for external components
    return { isInactive, isScreenAwake, isMonitoring: checkIntervalRef.current !== null };
}