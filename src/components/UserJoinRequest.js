import React, {useState} from "react";
import { TouchableOpacity } from "react-native";
import { Text, Image, View } from "react-native";
import firebase from "firebase";
import EStyleSheet from "react-native-extended-stylesheet";
import CircleImage from "./CircleImage";

export default function UserRequest( props, { navigation } ) {
    const groupID = props["groupID"]["groupID"]
    const [accepted, setAccepted] = useState(false)
    const userID = props["data"]["uid"]

    const deleteJoinReq = () => {
        return new Promise(async() => {
            var playlist = firebase.firestore().collection("playlists").doc(groupID);

            return playlist.update({
                join_requests: firebase.firestore.FieldValue.arrayRemove(userID)
            })
            .then(() => {
                setAccepted(true)
                alert("Join request declined")
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
        });
    }

    const acceptJoinReq = () => {
        return new Promise(async() => {
            var playlist = firebase.firestore().collection("playlists").doc(groupID);
            var userDoc = firebase.firestore().collection("users").doc(userID);

            playlist.update({
                join_requests: firebase.firestore.FieldValue.arrayRemove(userID),
                members: firebase.firestore.FieldValue.arrayUnion(userID)
            })
            .then(() => {
                setAccepted(true)
                alert("Join request accepted, member added to list")
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
        
            return userDoc.update({
                group: groupID,
                groupRole: 'listener',
                notified: false
            })
            .then(() => {
              console.log("User document successfully updated: added to group " + groupID + "as a listener");
            })
            .catch((error) => {
              console.error("Error updating user document: ", error);
            });
        });
    }

    return (
        <View style={!accepted ? styles.container : {display: "none"}}>
            <View style={styles.row}>
                <CircleImage size="medium" image={{uri: props["data"]["photo"]}}/>
                <View style={styles.user_info}>
                    <Text style={styles.user_name}>{props["data"]["name"]}</Text>
                    <Text style={styles.user_artist}>{props["data"]["timestamp"]}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.button, styles.delete]}
                            onPress={deleteJoinReq}
                            >
                            <Text style={[styles.text, {color: '#ffffff',}]}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.accept]}
                            onPress={acceptJoinReq}
                            >
                            <Text style={styles.text}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: '$padding3',
        paddingHorizontal: 5,
    },
    row:{
        width: '100%',
        flexDirection: 'row',
    },
    user_info: {
        paddingHorizontal: 20,
    },
    user_name: {
        fontSize: '$fontSize4',
        marginTop: '$padding5',
        fontFamily: "Poppins_400Regular",
        color: '$white',
        minWidth: 200, 
        maxWidth: '90%',
        fontWeight: '600'
    },
    user_artist: {
        fontSize: '$fontSize5',
        fontFamily: "Poppins_400Regular",
        color: '$white'
    },
    text:{
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        paddingHorizontal: 43,
        paddingVertical: 10,
    },
    button:{
        marginTop: '$padding3',
        borderRadius: 60,
    },
    delete: {
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    accept: {
        backgroundColor: '$green',
        marginLeft: 24,
    },
})