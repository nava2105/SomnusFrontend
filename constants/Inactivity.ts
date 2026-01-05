export const INACTIVITY_CONFIG = {
    // 10 minutes for production, 30 seconds for testing
    INACTIVE_TIMEOUT_MS: 30 * 1000, // Change to 10 * 60 * 1000 after testing

    LOG_PREFIX: '[SCREEN_SENSOR]',

    ENABLED: true,

    // Check every 5 seconds (change to 30 * 1000 after testing)
    CHECK_INTERVAL_MS: 5 * 1000,
};