/**
 * Theme-aware logo component that switches between light/dark versions
 */

import { Image, ImageProps } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';

interface Props extends Omit<ImageProps, 'source'> {
    lightSource: ImageProps['source'];
    darkSource: ImageProps['source'];
}

export function ThemedLogo({ lightSource, darkSource, ...imageProps }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return <Image source={isDark ? darkSource : lightSource} {...imageProps} />;
}