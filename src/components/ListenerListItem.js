import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Text, Image, View, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EStyleSheet from "react-native-extended-stylesheet";

import CircleImage from "./CircleImage";

export default function ListenerListItem( props ) {
    // const [currentUser, setCurrentUser] = useState();
    var currentUser = '';
    const [loading, setLoading] = useState();
    
    useEffect(() => {
        setLoading(true)

        async function fetchInfo() {
            const user = await AsyncStorage.getItem('user');
    
            if (user) {
                currentUser = user;
            }
        }
        fetchInfo();
        setLoading(false)
        return
    }, [loading])

    if (loading) {
        return (
          <View style={styles.container}>
          </View>
        );
    }
    else {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <CircleImage size="medium" image={{uri: props.data.image}}/>
                    <View style={styles.listener}>
                        {
                            currentUser == props.data.uid
                            ? <Text style={styles.listener_type}>{props.data.type} - YOU</Text>
                            : <Text style={styles.listener_type}>{props.data.type}</Text>
                        }
                        <Text style={styles.listener_name}>{props.data.name}</Text>
                        <View style={styles.like_container}>
                            <Image style={styles.listener_heart} source={require('../../assets/icons/heart-grey.png')}/>
                            <View style={styles.listener}>
                                <Text style={styles.listener_details}>{props.data.likes[0]}, {props.data.likes[1]}, {props.data.likes[2]}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.listener_profile}>
                    <Image style={styles.elipses} source={require("../../assets/icons/elipses-vertical.png")}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        paddingBottom: '$padding2',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    listener: {
        paddingLeft: 24,
    },
    elipses:{
        maxHeight: 16,
        resizeMode: 'contain',
    },
    listener_type: {
        color: '$white',
        fontSize: 10,
        fontFamily: "Poppins_500Medium",
        paddingBottom: 2,
        textTransform: 'uppercase'
    },
    listener_name: {
        fontSize: '$fontSize4',
        fontFamily: "Poppins_400Regular",
        color: '$white',
        paddingBottom: 2,
    },
    like_container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listener_heart: {
        width: 10,
        height: 10,
        resizeMode: 'contain'
    },
    listener_details: {
        right: 16,
        fontSize: '$fontSize5',
        fontFamily: "Poppins_400Regular",
        color: '$white',
        textTransform: 'capitalize',
    },
})