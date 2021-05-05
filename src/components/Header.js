import React from "react";
import { View } from "react-native";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

const Header = ({ leftItem, rightItem, middleItem, additional }) => (
    <View style={[styles.header, {additional}]}>
        <View style={[styles.header_item, styles.header_leftItem]}>{leftItem}</View>
        <View style={[styles.header_item, styles.header_middleItem]}>{middleItem}</View>
        <View style={[styles.header_item, styles.header_rightItem]}>{rightItem}</View>
    </View>
)

export default Header;

const styles = EStyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '$padding4',
        marginBottom: '$padding1',
        justifyContent: 'space-between',
        minHeight: 40,
        maxHeight: '5%',
        zIndex: 1,
    },
    header_item: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    header_leftItem: {
        alignItems: 'flex-start',
    },
    header_middleItem: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    header_rightItem: {
        alignItems: 'flex-end',
    },
})