import { Image } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';

interface ThemedLogoProps {
    lightSource: any;
    darkSource: any;
    style?: object;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export function ThemedLogo({ lightSource, darkSource, style, resizeMode = 'contain' }: ThemedLogoProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Image
            source={isDark ? darkSource : lightSource}
            style={style}
            resizeMode={resizeMode}
        />
    );
}