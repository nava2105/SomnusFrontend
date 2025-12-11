/**
 * Modal screen for sleep recommendations
 */

import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import BaseInfoScreen from '@/components/BaseInfoScreen';

export default function ModalScreen() {
    return (
        <>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <BaseInfoScreen title="Recommendations" path="app/modal_recommendations.tsx" />
        </>
    );
}