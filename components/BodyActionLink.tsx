import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

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
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handlePress = () => {
        console.log('Navegando a:', href);
        // @ts-ignore
        router.push(href);
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
                <Text style={[styles.text, { color: theme.secondaryText }]}>
                    {label}
                </Text>
                <FontAwesome
                    name={iconName}
                    size={22}
                    color={theme.secondaryText}
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