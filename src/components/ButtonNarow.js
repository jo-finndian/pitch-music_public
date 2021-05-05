import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const ButtonNarrow = ({onPress, label, color, isLight, icon }) => (
    <TouchableOpacity
        mode="contained"
        style={[styles.button, {backgroundColor: color}]}
        onPress={onPress}>
        <Image source={icon} style={styles.icon}/>
        <Text style={[styles.button_label, (isLight ? {color: '#fff'} : {borderColor: '#000'})]}>{label}</Text>
    </TouchableOpacity>
)

export default ButtonNarrow;

const screenPadding = 24;

const styles = EStyleSheet.create({
    button: {
        paddingVertical: screenPadding /2 ,
        paddingHorizontal: screenPadding,
        flexDirection: 'row',
        borderRadius: 60,
        borderColor: 'black',
        borderWidth: 1,
        width: 'auto',
        marginHorizontal: 'auto'
    },
    button_label: {
        alignSelf: 'center',
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_500Medium',
        letterSpacing: 0.15
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
})