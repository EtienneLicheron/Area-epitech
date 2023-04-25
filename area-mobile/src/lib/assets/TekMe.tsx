import React from 'react';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function TekMeLogo(color: string, size: number, ...props: any) {
    return <MaterialCommunityIcons name="door-open" size={size} color={color} {...props} />
}