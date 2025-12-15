/**
 * Sample/mock data for development and testing
 * Replace with actual API calls in production
 */

import {ChartSection, DayData, MonthlyDayData, NightGraphEvent, NightGraphPoint, Recommendation} from '@/types';
import Colors from './Colors';

export const monthlyGraphData: MonthlyDayData[] = [
    // September 2025 data
    { date: "2025-11-01", score: 85, day: 1 },
    { date: "2025-11-02", score: 92, day: 2 },
    { date: "2025-11-03", score: 78, day: 3 },
    { date: "2025-11-04", score: 65, day: 4 },
    { date: "2025-11-05", score: 88, day: 5 },
    { date: "2025-11-06", score: 95, day: 6 },
    { date: "2025-11-07", score: 82, day: 7 },
    { date: "2025-11-08", score: 91, day: 8 },
    { date: "2025-11-09", score: 73, day: 9 },
    { date: "2025-11-10", score: 55, day: 10 },
    { date: "2025-11-11", score: 89, day: 11 },
    { date: "2025-11-12", score: 86, day: 12 },
    { date: "2025-11-13", score: 93, day: 13 },
    { date: "2025-11-14", score: 79, day: 14 },
    { date: "2025-11-15", score: 68, day: 15 },
    { date: "2025-11-16", score: 84, day: 16 },
    { date: "2025-11-17", score: 77, day: 17 },
    { date: "2025-11-18", score: 90, day: 18 },
    { date: "2025-11-19", score: 88, day: 19 },
    { date: "2025-11-20", score: 52, day: 20 },
    { date: "2025-11-21", score: 83, day: 21 },
    { date: "2025-11-22", score: 76, day: 22 },
    { date: "2025-11-23", score: 94, day: 23 },
    { date: "2025-11-24", score: 81, day: 24 },
    { date: "2025-11-25", score: 71, day: 25 },
    { date: "2025-11-26", score: 87, day: 26 },
    { date: "2025-11-27", score: 69, day: 27 },
    { date: "2025-11-28", score: 58, day: 28 },
    { date: "2025-11-29", score: 85, day: 29 },
    { date: "2025-11-30", score: 92, day: 30 },
    { date: "2025-12-01", score: 66, day: 1 },
    { date: "2025-12-02", score: 63, day: 2 },
    { date: "2025-12-03", score: 70, day: 3 },
    { date: "2025-12-04", score: 78, day: 4 },
    { date: "2025-12-05", score: 88, day: 5 },
    { date: "2025-12-06", score: 81, day: 6 },
    { date: "2025-12-07", score: 59, day: 7 },
    { date: "2025-12-08", score: 79, day: 8 },
    { date: "2025-12-09", score: 89, day: 9 },
    { date: "2025-12-10", score: 85, day: 10 },
    { date: "2025-12-11", score: 95, day: 11 },
    { date: "2025-12-12", score: 79, day: 12 },
    // { date: "2025-12-13", score: , day: 13 },
    // { date: "2025-12-14", score: , day: 14 },
    // { date: "2025-12-15", score: , day: 15 },
    // { date: "2025-12-16", score: , day: 16 },
    // { date: "2025-12-17", score: , day: 17 },
    // { date: "2025-12-18", score: , day: 18 },
    // { date: "2025-12-19", score: , day: 19 },
    // { date: "2025-12-20", score: , day: 20 },
    // { date: "2025-12-21", score: , day: 21 },
    // { date: "2025-12-22", score: , day: 22 },
    // { date: "2025-12-23", score: , day: 23 },
    // { date: "2025-12-24", score: , day: 24 },
    // { date: "2025-12-25", score: , day: 25 },
    // { date: "2025-12-26", score: , day: 26 },
    // { date: "2025-12-27", score: , day: 27 },
    // { date: "2025-12-28", score: , day: 28 },
    // { date: "2025-12-29", score: , day: 29 },
    // { date: "2025-12-30", score: , day: 30 },
    // { date: "2025-12-31", score: , day: 31 },
];

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

export const recommendationsData: Recommendation[] = [
    {
        id: '1',
        title: 'Maintain Consistent Sleep Schedule',
        brief_explanation: 'Going to bed and waking up at the same time helps regulate your circadian rhythm.',
        detailed_explanation: 'Your body has an internal clock called the circadian rhythm. When you maintain consistent sleep times, you reinforce this rhythm, making it easier to fall asleep and wake up naturally. This can improve sleep quality by up to 23%.'
    },
    {
        id: '2',
        title: 'Reduce Screen Time Before Bed',
        brief_explanation: 'Avoid phones and tablets 1 hour before bedtime to improve melatonin production.',
        detailed_explanation: 'Blue light from screens suppresses melatonin production, the hormone that regulates sleep. Studies show that reducing screen time 1-2 hours before bed can help you fall asleep 30% faster and increase REM sleep duration.'
    },
    {
        id: '3',
        title: 'Optimize Room Temperature',
        brief_explanation: 'Keep your bedroom between 65-68°F (18-20°C) for optimal sleep.',
        detailed_explanation: 'Core body temperature naturally drops during sleep. A cooler room helps facilitate this process. Research indicates that temperatures between 65-68°F promote deeper sleep and reduce nighttime awakenings.'
    },
];

export const nightGraphData: NightGraphPoint[] = [
    // Initial period - getting to sleep
    { time: "22:00", value: 0 }, { time: "22:05", value: 0.1 }, { time: "22:10", value: 0.2 },
    { time: "22:15", value: 0.4 }, { time: "22:20", value: 0.6 }, { time: "22:25", value: 0.8 },

    // Deep sleep phase
    { time: "22:30", value: 1.0 }, { time: "22:35", value: 1.0 }, { time: "22:40", value: 0.9 },
    { time: "22:45", value: 0.95 }, { time: "22:50", value: 1.0 }, { time: "22:55", value: 1.0 },
    { time: "23:00", value: 0.9 }, { time: "23:05", value: 1.0 }, { time: "23:10", value: 0.8 },

    // REM/light sleep cycle
    { time: "23:15", value: 0.6 }, { time: "23:20", value: 0.7 }, { time: "23:25", value: 0.9 },
    { time: "23:30", value: 1.0 }, { time: "23:35", value: 0.95 }, { time: "23:40", value: 0.7 },
    { time: "23:45", value: 0.4 }, { time: "23:50", value: 0.6 }, { time: "23:55", value: 0.8 },

    // Continued through the night...
    { time: "00:00", value: 1.0 }, { time: "00:30", value: 0.9 }, { time: "01:00", value: 1.0 },
    { time: "01:30", value: 0.7 }, { time: "02:00", value: 0.8 }, { time: "02:30", value: 1.0 },
    { time: "03:00", value: 0.9 }, { time: "03:30", value: 0.6 }, { time: "04:00", value: 0.7 },
    { time: "04:30", value: 0.8 }, { time: "05:00", value: 0.9 }, { time: "05:30", value: 0.6 },
    { time: "06:00", value: 0.4 }, { time: "06:30", value: 0.2 }, { time: "07:00", value: 0 },
];

export const nightGraphEvents: NightGraphEvent[] = [
    { time: "03:55", type: "pickup" }, // Phone pickup at 3:55 AM
    { time: "10:11", type: "wakeup" }, // Wake up at 10:11 AM (based on your Figma screenshot)
];