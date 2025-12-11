import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface HeaderRightLinkProps {
    href: string;
    label: string;
    iconName: React.ComponentProps<typeof FontAwesome>['name'];
}

export default function HeaderRightLink({ href, label, iconName }: HeaderRightLinkProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        // @ts-ignore
        <Link href={href} asChild>
            <Pressable style={styles.container}>
                {({ pressed }) => (
                    <>
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: theme.text,
                                    opacity: pressed ? 0.5 : 1,
                                },
                            ]}>
                            {label}
                        </Text>
                        <FontAwesome
                            name={iconName}
                            size={25}
                            color={theme.text}
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