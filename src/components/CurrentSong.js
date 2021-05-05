import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, StyleSheet, Image, View, Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export default function CurrentSong( props ) {
    return (
        <View style={styles.container}>
            <Image 
                style={styles.song_albumart}
                source={{uri: props.data.image}}
            />
            <View style={styles.song}>
                <Text style={styles.song_name}>{props.data.name}</Text>
                <Text style={styles.song_artist}>{props.data.artist}</Text>
            </View>
           
            <TouchableOpacity
                style={styles.nextSong}
            >
                <Image style={styles.icon} source={require('../../assets/icons/next.png')}/>
            </TouchableOpacity>
            
           
            
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '$padding2',
        paddingHorizontal: '$padding5',
    },
    song: {
        paddingHorizontal: '$padding2',
    },
    song_albumart:{
        height: 40,
        width: 40,
    },
    nextSong: {
        width: 16,
        height: 16,
        position: "absolute",
        right: 12,
    },
    song_name: {
        fontSize: '$fontSize4',
        marginTop: '$padding5',
        fontFamily: "Poppins_500Medium",
        color: '$white',
        minWidth: 200, 
        maxWidth: '90%',
    },
    song_artist: {
        fontSize: '$fontSize5',
        fontFamily: "Poppins_400Regular",
        color: '$white'
    },
    icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 8
    },
})