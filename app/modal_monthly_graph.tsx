/**
 * Modal screen for monthly sleep graph history
 */


import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import BaseInfoScreen from '@/components/BaseInfoScreen';

export default function ModalScreen() {
    return (
        <>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <BaseInfoScreen title="Monthly Graph" path="app/modal_monthly_graph.tsx" />
        </>
    );
}