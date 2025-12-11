/**
 * Sample/mock data for development and testing
 * Replace with actual API calls in production
 */

import { ChartSection, DayData } from '@/types';
import Colors from './Colors';

export const weeklyData: DayData[] = [
    { day: 'Sun', asleep: 40, awake: 58, pickups: 2 },
    { day: 'Mon', asleep: 25, awake: 67, pickups: 8 },
    { day: 'Tue', asleep: 35, awake: 60, pickups: 5 },
    { day: 'Wed', asleep: 33, awake: 53, pickups: 14 },
    { day: 'Thu', asleep: 21, awake: 78, pickups: 1 },
    { day: 'Fri', asleep: 50, awake: 46, pickups: 4 },
    { day: 'Sat', asleep: 35, awake: 62, pickups: 3 },
];

export const defaultNightChart: ChartSection[] = [
    { value: 60, color: Colors.awakeColor },
    { value: 5, color: Colors.pickupColor },
    { value: 35, color: Colors.asleepColor },
];