import React from 'react';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function MicrosoftLogo(color: string, size: number, ...props: any) {
    return <MaterialCommunityIcons name="microsoft" size={size} color={color} {...props} />
}