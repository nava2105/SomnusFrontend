import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { INACTIVITY_CONFIG } from '@/constants/Inactivity';

/**
 * Screen-off only detector.
 * ONLY runs checks when screen is OFF. Completely stops polling when screen is ON.
 * Logs:
 * - When screen turns OFF (starts monitoring)
 * - When screen turns ON (stops monitoring)
 * - When screen has been OFF for INACTIVE_TIMEOUT_MS
 */
export function usePhoneInactivityTracker() {
    const { ENABLED, LOG_PREFIX, INACTIVE_TIMEOUT_MS, CHECK_INTERVAL_MS } = INACTIVITY_CONFIG;

    const screenOffTimestampRef = useRef<number | null>(null);
    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isScreenAwake, setIsScreenAwake] = useState(true);

    const checkScreenState = async (): Promise<boolean> => {
        try {
            if (Platform.OS === 'android') {
                const powerState = await DeviceInfo.getPowerState();
                return powerState.screenOn || false;
            }
            return AppState.currentState === 'active';
        } catch (error) {
            console.warn(`${LOG_PREFIX} Screen check failed:`, error);
            return true; // Default to on if check fails
        }
    };

    // Start monitoring (only called when screen is OFF)
    const startMonitoring = () => {
        console.log(`${LOG_PREFIX} Screen is OFF - Starting monitoring`);

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
                screenOffTimestampRef.current = null;
                setIsScreenAwake(true);
                return;
            }

            // Screen is still OFF - check timeout
            if (screenOffTimestampRef.current) {
                const offDuration = now - screenOffTimestampRef.current;

                if (offDuration >= INACTIVE_TIMEOUT_MS) {
                    console.log(`⚠️  ${LOG_PREFIX} PHONE INACTIVE: Screen off for ${Math.floor(offDuration / 60000)}min`);
                    // Stop monitoring after detection to avoid spam
                    stopMonitoring();
                }
            }
        };

        // Check immediately, then set interval
        performCheck();
        // @ts-ignore
        checkIntervalRef.current = setInterval(performCheck, CHECK_INTERVAL_MS);
    };

    // Stop monitoring (called when screen is ON)
    const stopMonitoring = () => {
        if (checkIntervalRef.current) {
            console.log(`${LOG_PREFIX} Stopping monitoring (screen is ON)`);
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        }
    };

    useEffect(() => {
        if (!ENABLED) {
            console.log(`${LOG_PREFIX} Sensor disabled`);
            return;
        }

        console.log(`${LOG_PREFIX} Starting screen-off only sensor`);

        // Initial check
        const init = async () => {
            const initialState = await checkScreenState();
            setIsScreenAwake(initialState);

            if (!initialState) {
                // Screen is already OFF on start
                screenOffTimestampRef.current = Date.now();
                startMonitoring();
            }
        };
        init();

        // Track app state changes
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            // When app comes to foreground, check if screen is off
            if (nextAppState === 'active') {
                setTimeout(async () => {
                    const screenState = await checkScreenState();
                    if (!screenState && !checkIntervalRef.current) {
                        screenOffTimestampRef.current = Date.now();
                        startMonitoring();
                    }
                }, 1000); // Delay to let screen state update
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            console.log(`${LOG_PREFIX} Cleaning up sensor`);
            subscription.remove();
            stopMonitoring();
        };
    }, [ENABLED, LOG_PREFIX, INACTIVE_TIMEOUT_MS, CHECK_INTERVAL_MS]);

    // New effect: Watch for screen state changes
    useEffect(() => {
        const monitorScreenChanges = async () => {
            const previousState = isScreenAwake;
            const currentState = await checkScreenState();

            if (previousState && !currentState) {
                // Screen just turned OFF
                console.log(`🔒 ${LOG_PREFIX} Screen turned OFF`);
                screenOffTimestampRef.current = Date.now();
                startMonitoring();
            } else if (!previousState && currentState) {
                // Screen just turned ON
                console.log(`🔓 ${LOG_PREFIX} Screen turned ON`);
                stopMonitoring();
            }

            setIsScreenAwake(currentState);
        };

        // Check for screen changes every 5 seconds
        const id = setInterval(monitorScreenChanges, 5000);
        return () => clearInterval(id);
    }, [isScreenAwake]);

    return null;
}