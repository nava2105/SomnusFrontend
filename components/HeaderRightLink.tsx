/**
 * Header right-side link with icon for navigation bar
 */

import { Pressable, StyleSheet } from 'react-native';
import { Link, Href } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';

interface Props {
    // @ts-ignore
    href: Href<string>;
    label: string;
    iconName: React.ComponentProps<typeof FontAwesome>['name'];
}

export default function HeaderRightLink({ href, label, iconName }: Props) {
    const { colors } = useTheme();

    return (
        // @ts-ignore
        <Link href={href} asChild>
            <Pressable style={styles.container}>
                {({ pressed }) => (
                    <>
                        <Text style={[styles.text, { color: colors.text, opacity: pressed ? 0.5 : 1 }]}>
                            {label}
                        </Text>
                        <FontAwesome
                            name={iconName}
                            size={25}
                            color={colors.text}
                            style={[styles.icon, { opacity: pressed ? 0.5 : 1 }]}
                        />
                    </>
                )}
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    text: {
        fontSize: 16,
    },
    icon: {
        marginHorizontal: 15,
    },
});