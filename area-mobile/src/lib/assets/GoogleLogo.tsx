import React from 'react';
import AntDesign from "react-native-vector-icons/AntDesign";

export default function GoogleLogo(color: string, size: number, ...props: any) {
    return <AntDesign name="google" size={size} color={color} {...props} />
}