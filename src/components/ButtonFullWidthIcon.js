import React from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const ButtonFullWidthIcon = ({onPress, label, color, backgroundColor, icon, style }) => (
    <TouchableOpacity 
        style={[styles.button, style, {backgroundColor: EStyleSheet.value(backgroundColor)} ]}
        onPress={onPress}>
        <View style={styles.button_icon}>
            <Image source={icon}></Image>
        </View>
        <Text style={[styles.button_label, {color: EStyleSheet.value(color)}]}>{label}</Text>
    </TouchableOpacity>
)

export default ButtonFullWidthIcon;

const styles = EStyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 60,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button_label: {
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    button_icon: {
        width: 'auto',
        height: '$iconHeight',
        marginRight: '$padding4',
    }
})