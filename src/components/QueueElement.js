import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, Image, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export default function QueueElement( props ) {
    
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center', maxWidth: '95%'}}>
                <Image 
                    style={styles.song_albumart}
                    source={{uri: props.data.image}}
                />
                <View style={styles.song}>
                    <Text style={styles.song_name}>{props.data.name}</Text>
                    <Text style={styles.song_artist}>{props.data.artist}</Text>
                </View>
            </View>
           
            <TouchableOpacity
                style={styles.add_queue}
            >
                <Image source={require('../../assets/icons/elipses.png')}/>
            </TouchableOpacity>
            
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    song: {
        paddingHorizontal: 24,
    },
    song_albumart:{
        height: 40,
        width: 40,
        // borderWidth: 1,
        // borderColor: 'white'
    },
    add_queue: {
        width: 16,
        height: 16,
        justifyContent: 'center'
    },
    song_name: {
        fontSize: '$fontSize4',
        fontFamily: "Poppins_400Regular",
        color: '$white',
        minWidth: 200, 
        maxWidth: '90%',
    },
    song_artist: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_300Light',
        color: '$white'
    },
})