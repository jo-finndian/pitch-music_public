import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const ButtonFullWidth = ({onPress, label, color, backgroundColor, style, disabled, ...otherProps }) => (
    <TouchableOpacity 
        {...otherProps}
        disabled={disabled}
        // (isLight ? {color: '#fff'} : {borderColor: '#000'})
        style={[styles.button, style, (!disabled ? {backgroundColor: EStyleSheet.value(backgroundColor)} : styles.disabled)]}
        onPress={onPress}>
        <Text style={[styles.button_label, (!disabled ? {color: EStyleSheet.value(color)} : styles.disabledText)]}>{label}</Text>
    </TouchableOpacity>
)

export default ButtonFullWidth;

const styles = EStyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: '$padding4',
        borderRadius: 60,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button_label: {
        alignSelf: 'center',
        fontSize: '$fontSize4',
        fontFamily: 'Poppins_500Medium',
    },
    disabled: {
        backgroundColor: '$medLight_grey',
        color: '$textColor_dark'
    },
    disabledText: {
        color: '$textColor_grey'
    }
})