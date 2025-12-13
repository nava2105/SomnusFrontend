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
    briefExplanation: string;
    /** Detailed explanation shown when "Why?" is expanded */
    detailedExplanation: string;
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