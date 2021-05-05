import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const ButtonText = ({onPress, label, color, style }) => (
    <TouchableOpacity 
        onPress={onPress}>
        <Text style={[styles.button_label, style, {color: EStyleSheet.value(color)}]}>{label}</Text>
    </TouchableOpacity>
)

export default ButtonText;

const styles = EStyleSheet.create({
    button_label: {
        marginTop: '$padding5',
        alignSelf: 'center',
        fontSize: '$fontSize4',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins_400Regular',
    },
})