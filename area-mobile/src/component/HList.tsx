import React from "react";
import { FlatList } from "react-native";

export default function HList({ ...props }) {
    return (
        <FlatList
            style={{
                width: "100%",
                flex: 1,  
            }}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
            }}
            horizontal
            data={props.data}
            renderItem={props.renderItem}
            {...props}
        />
    );
}