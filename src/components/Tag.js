import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const Tag = ({onPress, label }) => {

    var isFocused = false;

    return(
        <TouchableOpacity
            mode="contained"
            style={[styles.tag, (isFocused ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
            onPress={()=> {
                onPress
                !isFocused ? isFocused=true : isFocused=false
            }}>
            <Text style={[styles.tag_label, (isFocused ? {color: "#000"} : {color: '#fff'} )]}>{label}</Text>
        </TouchableOpacity>
    )
}

export default Tag;

const styles = EStyleSheet.create({
    tag: {
        paddingVertical: '$padding5 / 2',
        paddingHorizontal: '$padding4',
        flexDirection: 'row',
        borderRadius: 60,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: '$padding5',
        marginBottom: '$padding5'
    },
    tag_label: {
        alignSelf: 'center',
        fontSize: '$fontSize5',
        textTransform: 'none'
    },
})