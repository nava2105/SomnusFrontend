import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from "@/constants/Colors";

interface ThemedButtonProps {
    title: string;
    onPress: () => void;
    style?: object;
}

export function ThemedButton({ title, onPress, style }: ThemedButtonProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint },
                style
            ]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
    },
});