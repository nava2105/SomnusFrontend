import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface TabBarIconProps {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}

export default function TabBarIcon({ name, color }: TabBarIconProps) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}