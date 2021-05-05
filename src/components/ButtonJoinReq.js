import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export default function ButtonJoinReq({ onPress, reqs, notifNumber}) {
    // const [requests, setRequests] = useState(reqs)

    return (
        <TouchableOpacity
            style={[styles.tab, reqs ? {backgroundColor: EStyleSheet.value('$white')} : {backgroundColor: EStyleSheet.value('$bg_black')}]}
            onPress={onPress}
        >
            <View style={ reqs ? styles.notification_bubble : {display: 'none'}}>
                <Text style={styles.notification_number}>{notifNumber}</Text>
            </View>
            <Image style={styles.icon} source={!reqs ? require('../../assets/icons/add-user-invert.png') : require('../../assets/icons/add-user.png')}/>
            <Text style={[styles.tabText, reqs ? {color: EStyleSheet.value('$bg_black')} : {color: EStyleSheet.value('$white')}]}>Join Request</Text>
        </TouchableOpacity>
    )
}

const styles = EStyleSheet.create({
    tab:{
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '$white',
        borderRadius: 16,
        paddingTop: '$padding4',
        paddingBottom: '$padding3',
        marginRight: '$padding4 / 2',
        flex: 1,
    },
    icon:{
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginBottom: '$padding5',
    },
    tabText:{
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    notification_bubble: {
        backgroundColor: '#F25359',
        borderRadius: 30,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: -6,
        top: -6
    },
    notification_number: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'Poppins_500Medium',
    },
})