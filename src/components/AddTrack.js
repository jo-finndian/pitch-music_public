import React, { useState } from "react";
import * as firebase from "firebase";
import "@firebase/firestore";
import { TouchableOpacity } from "react-native";
import { Text, Image, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export default function addTrack( props ) {
    const [clear, setClear] = useState(false);

    const changeBtn = () => {
        setClear(true)
    }

    // send song request to firebase
    const sendSongRequest = () => {

        firebase.firestore().collection("playlists").doc(props.data.group_id)
        .update({
            song_requests: firebase.firestore.FieldValue.arrayUnion(props.data.song_id)
        })
        .then(() => {
            console.log("Song Request Added to FB!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }


    return (
        <View style={styles.container}>
            <Image 
                style={styles.track_albumart}
                source={{uri: props.data.image}}
            />
            <View style={styles.track}>
                <Text style={styles.track_name}>{props.data.track}</Text>
                <Text style={styles.track_artist}>{props.data.artist}</Text>
            </View>

            {/* song request button */}
            <TouchableOpacity
                style={!clear ? styles.add_queue : {display: 'none'}}
                onPress={() => {
                    sendSongRequest()
                    changeBtn()
                }}
            >
                <Image style={styles.icon} source={require('../../assets/icons/add-border.png')}/>   
            </TouchableOpacity>
            {/* song requested feedback*/}
            <View style={clear ? styles.queue_added : {display: 'none'}}>
                <Text style={styles.requested}>Requested</Text>
                <Image source={require('../../assets/icons/checkbox-active.png')}/>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '$padding4',
        borderBottomWidth: 1,
        borderColor: '#464646'
    },
    track: {
        paddingHorizontal: '$padding4',
    },
    track_albumart:{
        height: 40,
        width: 40,
    },
    queue_added: {
        flexDirection: 'row',
        height: 16,
        position: "absolute",
        right: 12,
    },
    requested: {
        fontSize: 10,
        color: '$green',
        fontFamily: "Poppins_500Medium",
        paddingHorizontal: '$padding5',
    },
    add_queue: {
        width: 16,
        height: 16,
        // backgroundColor: 'lightgrey',
        // borderRadius: 30,
        position: "absolute",
        right: 12,
    },
    icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
    },  
    track_name: {
        fontSize: '$fontSize4',
        fontFamily: "Poppins_400Regular",
        marginTop: '$padding5',
        color: '$white',
        minWidth: 200, 
        maxWidth: '80%',
    },
    track_artist: {
        fontFamily: "Poppins_300Light",
        fontSize: '$fontSize5',
        color: '$white'
    },
})