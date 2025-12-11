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