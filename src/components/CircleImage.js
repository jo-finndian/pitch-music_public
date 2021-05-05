import React from "react";
import { View, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const CircleImage = ({ size, margin, image, style }) => {

    return(
        <View style={[styles.circle, style, {marginBottom: margin}, (size == 'large') ? styles.large : (size == 'medlarge') ? styles.medlarge :(size == 'medium') ? styles.medium : styles.small]}>
        {(image == undefined || image == '' )
        ? <Image source={require('../../assets/images/default.png')} style={[styles.circle, (size == 'large') ? styles.large : (size == 'medlarge') ? styles.medlarge : (size == 'medium') ? styles.medium : styles.small]}/>
        // : image && <Image source={{uri: image}} style={[styles.circle, styles.image, (size == 'large') ? styles.large : (size == 'medlarge') ? styles.medlarge : (size == 'medium') ? styles.medium : styles.small]}/>}
        : image && <Image source={image} style={[styles.circle, styles.image, (size == 'large') ? styles.large : (size == 'medlarge') ? styles.medlarge : (size == 'medium') ? styles.medium : styles.small]}/>}
        </View>
    )
}

export default CircleImage;

const styles = EStyleSheet.create({
    circle: {
        borderRadius: 60,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '$blue_light',
        resizeMode: 'cover',
    },
    small: {
        height: 28,
        width: 28,
    },
    medium: {
        height: 56,
        width: 56,
    },
    medlarge: {
        height: 83,
        width: 83,
    },
    large: {
        height: 104,
        width: 104,
    },
})