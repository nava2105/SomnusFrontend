/**
 * Opens links in external browser on native, respects web platform
 */

import { Link, LinkProps } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

export function ExternalLink(props: LinkProps & { href: string }) {
    const handlePress = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (Platform.OS !== 'web') {
            e.preventDefault();
            WebBrowser.openBrowserAsync(props.href);
        }
    };

    return <Link target="_blank" {...props} onPress={handlePress as any} />;
}