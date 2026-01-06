// constants/Inactivity.ts
export const INACTIVITY_CONFIG = {
    // 10 minutes for production, 30 seconds for testing
    INACTIVE_TIMEOUT_MS: 30 * 1000, // Change to 10 * 60 * 1000 after testing

    LOG_PREFIX: '[INACTIVITY_SENSOR]',

    ENABLED: true,

    // Check every 5 seconds (change to 30 * 1000 after testing)
    CHECK_INTERVAL_MS: 5 * 1000,
};

export const AUTO_MONITOR_CONFIG = {
    // Only activate monitoring after bedtime
    ACTIVATE_AFTER_BEDTIME: true,

    // Buffer time after bedtime before monitoring starts (e.g., 30 minutes)
    BEDTIME_BUFFER_MS: 0 * 60 * 1000, // 0 minutes for testing

    // Automatically trigger sleep recording when inactive
    AUTO_TRIGGER_SLEEP: true,

    // Minimum screen off time before triggering (prevents false positives)
    MIN_SCREEN_OFF_MS: 30 * 1000, // 30 seconds for testing, 5-10 min for production

    // Production values (commented for testing)
    // INACTIVE_TIMEOUT_MS: 10 * 60 * 1000, // 10 minutes
    // CHECK_INTERVAL_MS: 30 * 1000, // 30 seconds
    // BEDTIME_BUFFER_MS: 30 * 60 * 1000, // 30 minutes after bedtime
    // MIN_SCREEN_OFF_MS: 5 * 60 * 1000, // 5 minutes
};