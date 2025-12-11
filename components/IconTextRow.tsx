/**
 * Row with icon and text for displaying sleep metrics
 */

import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import Colors from '@/constants/Colors';

interface Props {
    iconName: React.ComponentProps<typeof FontAwesome>['name'];
    text: string;
    color?: string;
}

export default function IconTextRow({ iconName, text, color }: Props) {
    const { isDark } = useTheme();
    const iconColor = color ?? (isDark ? Colors.dark.tint : Colors.light.tint);

    return (
        <View style={styles.container}>
            <FontAwesome name={iconName} size={20} color={iconColor} style={styles.icon} />
            <Text style={[styles.text, { color: iconColor }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    icon: {
        marginRight: 10,
        width: 24,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});