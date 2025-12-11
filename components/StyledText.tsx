/**
 * Styled text variants using theme-aware Text component
 */

import { Text, TextProps } from './Themed';

/**
 * Monospaced text for code/display purposes
 */
export function MonoText(props: TextProps) {
    return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}