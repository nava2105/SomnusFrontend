/**
 * Header styled text
 */

import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

interface Props {
    text: string;
    size?: number;
    style?: object;
}

export default function HeaderText({ text, size = 24, style }: Props) {
    const { colors } = useTheme();

    return (
        <Text style={[styles.header, { color: colors.text, fontSize: size }, style]}>
            {text}
        </Text>
    );
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 48,
        marginBottom: 24,
    },
});