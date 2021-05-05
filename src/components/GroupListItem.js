import React, {useState} from "react";
import { Modal, Text, Image, View, TouchableOpacity, Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebase from "firebase";
import "@firebase/firestore";

import CircleImage from "./CircleImage";
import ButtonFullWidth from '../components/ButtonFullWidth';
import ButtonText from '../components/ButtonText';

export default function GroupListItem( props, {navgiation} ) {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState();

    var x = '';

    for (let key in props["data"]["members"]) {
        x = props["data"]["members"].length;
    }
    
    if ( props["data"]["members"] == 0) {
        x = 0
    }

    AsyncStorage.getItem('user', (err, result) => {
        setUser(result)
    });

        // send join request for private group to firebase
        const sendJoinRequest = () => {
            firebase.firestore().collection("users").doc(user)
            .onSnapshot(documentSnapshot => {
                const doc = documentSnapshot.data();
    
                if (doc["group"]) {
                    alert("You are already in a group.\nYou must leave that group before joining another.")
                }
                else {
                    return new Promise(async() => {
                        var playlist = firebase.firestore().collection("playlists").doc(props["data"]['groupID']);
    
                        const joinReq = {
                            user: user,
                        }
    
                        return playlist.update({
                            join_requests: firebase.firestore.FieldValue.arrayUnion(joinReq)
                        })
                        .then(() => {
                            alert("Join request sent. When you're accepted, you will be automatically redirected.")
                        })
                        .then(() => {
                            setModalVisible(false)
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                    });
                }
            })
        }
    
        // add user to public group
        const joinGroup = () => {
            
            var userRef = firebase.firestore().collection("users").doc(user);
            var playlistRef = firebase.firestore().collection("playlists").doc(props["data"]["groupID"]);
    
    
            userRef.update({
                group: props["data"]["groupID"],
                groupRole: 'listener'
            })
            .then(() => {
                console.log("User group + group role successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating user document: ", error);
            });
    
            return playlistRef.update({
                members: firebase.firestore.FieldValue.arrayUnion(user)
            })
            .then(() => {
                console.log("Playlist members updated successfully!");
                setModalVisible(false)
            })
            .catch((error) => {
                console.error("Error updating playlist members: ", error);
            });
        }

    return (
        <View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}> 
                        <CircleImage size="medlarge" style={styles.centerAlign} image={{uri: props["data"]["photo"]}}/>
                        <Text style={styles.modalText}>Do you want to join {props["data"]["playlist_name"]}?</Text>

                        {(props["data"]["private"] == true) ?
                        <>
                            <Text style={styles.modalDetail}>
                                <Text style={styles.bold}>{props["data"]["playlist_name"]}</Text>
                                is private. Once you send your request, the host will be notified.
                            </Text>
                            <ButtonFullWidth
                                label="Request to Join"
                                backgroundColor="$bg_black"
                                color="$white"
                                onPress={() => {
                                    sendJoinRequest()
                                }}
                            />
                        </>
                        :
                        <>
                            <Text style={styles.modalDetail}>It's quite the party. :P</Text>

                            <ButtonFullWidth
                                label="Join Group"
                                backgroundColor="$bg_black"
                                color="$white"
                                onPress={() => {
                                    joinGroup()
                                }}
                            />
                        </>
                        }
                        <ButtonText
                            label="Cancel"
                            onPress={() => {
                                setModalVisible(false)
                                // navigation.navigate("Home", {screen: "Home"});
                            }}
                        />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity 
                style={[styles.container, (props['data']['currentGroup'] == props["data"]["groupID"]) ? styles.green : styles.notCurrent]}
                // onPress={props.onPress}
                onPress={()=> {
                    setModalVisible(true)
                    // props['data']['private']
                    // ? sendJoinRequest()
                    // : joinGroup()
                }}
            >
                <CircleImage size="medium" image={{uri: props["data"]["photo"]}}/>

                <View style={styles.group}>
                    <Text style={styles.group_name}>{props["data"]["playlist_name"]}</Text>
                    <Text style={styles.group_details}>{x + 1} listeners</Text>
                </View>

                <View style={styles.group_lock}>
                    { props["data"]["private"] && <Image style={styles.icon} source={require('../../assets/icons/lock.png')}/>}
                </View>
            </TouchableOpacity>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '$padding1 / 2',
        paddingHorizontal: 5,
        borderRadius: 10,
    },
    notCurrent: {
        paddingBottom: '$padding1 / 2',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    green: {
        paddingVertical: '$padding1 / 2',
        borderColor: '$green',
        borderWidth: 2
    },
    group: {
        paddingHorizontal: 20,
    },
    group_lock: {
        width: 16,
        height: 16,
        position: "absolute",
        right: 12,
    },
    group_name: {
        fontSize: '$fontSize4',
        marginBottom: '$padding5',
        fontFamily: 'Poppins_600SemiBold',
        color: '$white',
        minWidth: 200, 
        maxWidth: '90%',
    },
    group_details: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_400Regular',
        color: '$white'
    },
    icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 8
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
      modalView: {
        width: windowWidth - (screenPadding*2),
        marginHorizontal: 24,
        backgroundColor: "#9CE4F1",
        borderRadius: 20,
        padding: 24,
      },
      centerAlign:{
        alignSelf: 'center',
        marginVertical: '$padding2',
      },
      modalText: {
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        fontWeight: '600',
        marginVertical: '$padding4',
      },
      modalDetail:{
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_400Regular',
        marginBottom: '$padding1',
      },
      buttonClose: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignItems: 'center',
        height: 48,
        backgroundColor: '#0F0F0F',
        borderRadius: 30,
        marginTop: '$padding2'
      },
})