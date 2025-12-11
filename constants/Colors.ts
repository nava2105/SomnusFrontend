/**
 * Centralized color palette for Somnus app
 * Supports light and dark themes with semantic naming
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#10B981';

export default {
    light: {
        text: '#000000',
        secondaryText: '#565656',
        background: '#ffffff',
        tint: tintColorLight,
        tabIconDefault: '#cccccc',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#ffffff',
        secondaryText: '#7D7D7D',
        background: '#0F172A',
        tint: tintColorDark,
        tabIconDefault: '#cccccc',
        tabIconSelected: tintColorDark,
    },
    // Semantic colors for sleep states
    awakeColor: '#FF8D28',
    pickupColor: '#FF383C',
    asleepColor: '#34C759',
} as const;