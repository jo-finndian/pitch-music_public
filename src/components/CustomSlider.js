import React, {useState} from "react";
import { Text, Image, View } from "react-native";
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import { Slider } from 'react-native-elements';


export default function CustomSlider({ label, value_right, value_left, icon_right, icon_left, margin, slider }) {

    return (
        <View style={[styles.slider_container, {marginTop: margin}]}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.slider_icons}>
                <View style={styles.slider_leftIcon}> 
                    {icon_left && <Image source={icon_left}/>}
                </View>
                <View style={styles.slider_rightIcon}>
                    {icon_right && <Image source={icon_right}/>}
                </View>
            </View>
            {slider}
            <View style={styles.slider_labels}>
                <Text style={styles.slider_label}>
                    {value_left}
                </Text>
                <Text style={styles.slider_label}>
                    {value_right}
                </Text>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    slider_container: {
        flexDirection: 'column',
    },
    label: {
        fontSize: '$fontSize6',
        fontFamily: "Poppins_500Medium",
        textTransform: 'uppercase',
        marginTop: '$padding2',
        marginBottom: '$padding4',
    },
    slider: {
        marginVertical: '$padding4',
        height: 18
    },
    track: {
        width: '100%',
        borderRadius: 4
    },
    thumb: {
        width: 18,
        height: 18,
        borderRadius: 20,
        backgroundColor: '$bg_black',
    },
    slider_icons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    slider_leftIcon: {
        width: '$iconHeight',
        height: '$iconHeight',
    },
    slider_rightIcon: {
        width: '$iconHeight',
        height: '$iconHeight',
    },
    slider_labels: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    slider_label: {
        textTransform: 'uppercase',
        fontSize: '$fontSize6',
        fontFamily: "Poppins_500Medium",
    },
});