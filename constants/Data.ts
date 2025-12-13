/**
 * Sample/mock data for development and testing
 * Replace with actual API calls in production
 */

import {ChartSection, DayData, NightGraphEvent, NightGraphPoint, Recommendation} from '@/types';
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

export const recommendationsData: Recommendation[] = [
    {
        id: '1',
        title: 'Maintain Consistent Sleep Schedule',
        briefExplanation: 'Going to bed and waking up at the same time helps regulate your circadian rhythm.',
        detailedExplanation: 'Your body has an internal clock called the circadian rhythm. When you maintain consistent sleep times, you reinforce this rhythm, making it easier to fall asleep and wake up naturally. This can improve sleep quality by up to 23%.'
    },
    {
        id: '2',
        title: 'Reduce Screen Time Before Bed',
        briefExplanation: 'Avoid phones and tablets 1 hour before bedtime to improve melatonin production.',
        detailedExplanation: 'Blue light from screens suppresses melatonin production, the hormone that regulates sleep. Studies show that reducing screen time 1-2 hours before bed can help you fall asleep 30% faster and increase REM sleep duration.'
    },
    {
        id: '3',
        title: 'Optimize Room Temperature',
        briefExplanation: 'Keep your bedroom between 65-68°F (18-20°C) for optimal sleep.',
        detailedExplanation: 'Core body temperature naturally drops during sleep. A cooler room helps facilitate this process. Research indicates that temperatures between 65-68°F promote deeper sleep and reduce nighttime awakenings.'
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