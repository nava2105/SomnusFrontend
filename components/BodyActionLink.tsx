/**
 * Body-level action link with icon
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';

interface BodyActionLinkProps {
    href: string;
    label: string;
    iconName: React.ComponentProps<typeof FontAwesome>['name'];
    position?: 'left' | 'right';
}

export default function BodyActionLink({
                                           href,
                                           label,
                                           iconName,
                                           position = 'right'
                                       }: BodyActionLinkProps) {
    const { colors } = useTheme();
    const router = useRouter();

    const handlePress = () => {
        console.log('Navegando a:', href);
        router.push(href as any);
    };

    return (
        <View style={[
            styles.wrapper,
            position === 'left' ? styles.leftAlign : styles.rightAlign
        ]}>
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    styles.container,
                    { opacity: pressed ? 0.5 : 1 }
                ]}
            >
                <Text style={[styles.text, { color: colors.secondaryText }]}>
                    {label}
                </Text>
                <FontAwesome
                    name={iconName}
                    size={22}
                    color={colors.secondaryText}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingHorizontal: 15,
        marginVertical: 5,
    },
    leftAlign: {
        alignItems: 'flex-start',
    },
    rightAlign: {
        alignItems: 'flex-end',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 30,
    },
    text: {
        fontSize: 16,
        marginRight: 8,
    },
});