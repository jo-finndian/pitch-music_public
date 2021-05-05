import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const ButtonEmoji = ({onPress, label, style, image }) => (
    <TouchableOpacity
        style={styles.button}
        onPress={onPress}>
        <Image sourece={image}/>
        <Text style={style}>{label}</Text>
    </TouchableOpacity>
)

export default ButtonText;

const styles = EStyleSheet.create({
    button: {
        marginTop: '$padding5',
        alignSelf: 'center',
        fontSize: '$fontSize4',
        textDecorationLine: 'underline',
        fontFamily: 'Poppins_400Regular',
    },
})