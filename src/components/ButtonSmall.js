import React from "react";
import { Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const ButtonSmall = ({onPress, label, color, isLight, disable }) => (
    <TouchableOpacity
        mode="contained"
        disabled={disable}
        style={[styles.button, !disable ? {backgroundColor: color} : {backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 0}]}
        onPress={onPress}>

        <Text style={[styles.button_label, (isLight ? {color: '#fff'} : {borderColor: '#000'})]}>{label}</Text>
    </TouchableOpacity>
)

export default ButtonSmall;

const screenPadding = 24;

const styles = StyleSheet.create({
    button: {
        paddingVertical: screenPadding /2 ,
        paddingHorizontal: screenPadding,
        borderRadius: 60,
        borderColor: 'black',
        borderWidth: 1,
        maxWidth: 'auto',
    },
    button_label: {
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        fontWeight: '600'
    }
})