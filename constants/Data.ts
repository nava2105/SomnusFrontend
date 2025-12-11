/**
 * Sample/mock data for development and testing
 * Replace with actual API calls in production
 */

import {ChartSection, DayData, Recommendation} from '@/types';
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