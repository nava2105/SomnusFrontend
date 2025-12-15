/**
 * Core data models for the Somnus sleep tracking application
 */

export interface DayData {
    /** Day abbreviation (e.g., 'Mon', 'Tue') */
    day: string;
    /** Minutes spent asleep */
    asleep: number;
    /** Minutes spent awake */
    awake: number;
    /** Number of phone pickups during night */
    pickups: number;
}

export interface MonthlyDayData {
    /** Date in YYYY-MM-DD format */
    date: string;
    /** Sleep score (0-100) */
    score: number;
    /** Day of month (1-31) */
    day: number;
}

export interface ChartSection {
    /** Value/percentage for chart segment */
    value: number;
    /** Color identifier for the segment */
    color: string;
    /** Optional descriptive label */
    label?: string;
}

export interface Recommendation {
    /** Unique identifier */
    id: string;
    /** Title of the recommendation */
    title: string;
    /** Brief explanation shown by default */
    brief_explanation: string;
    /** Detailed explanation shown when "Why?" is expanded */
    detailed_explanation: string;
}

export interface NightGraphPoint {
    time: string; // Format: "HH:MM"
    /** Sleep depth: 0=awake, 0.3=light, 0.7=deep, 1.0=very deep */
    value: number;
}

export interface NightGraphEvent {
    time: string; // Format: "HH:MM"
    type: 'pickup' | 'wakeup';
}

export interface UserTimeSetting {
    hour: number;
    minute: number;
    isPM: boolean;
}

export interface UserSettings {
    bedtime: UserTimeSetting;
    wakeUpTime: UserTimeSetting;
    permissionsGranted: boolean;
}

export interface UserProfile {
    /** Username chosen by user */
    username: string;
    /** Birth date in YYYY-MM-DD format */
    birthDate: string;
    /** Calculated age in years */
    age: number;
    /** Selected avatar image path */
    avatar: string;
}