/**
 * Consistent tab bar icons with theme support
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}

export default function TabBarIcon({ name, color }: Props) {
    return <FontAwesome name={name} size={28} color={color} style={{ marginBottom: -3 }} />;
}