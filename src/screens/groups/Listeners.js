import React, {useEffect, useState} from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import firebase from "firebase";
import EStyleSheet from "react-native-extended-stylesheet";

import ListenerListItem from '../../components/ListenerListItem';
import { ScrollView } from 'react-native';
import { getPhotos } from '@react-native-community/cameraroll';
import { SectionList } from 'react-native';

export default function Listeners({ navigation, route }){
    const [loading, setLoading] = useState();
    const [list, setList] = useState([]);

    const groupInfo = route.params["groupInfo"];
    const hostInfo = route.params["hostInfo"];
    
    var userArray = [];

    // formatting host info
    const user = {
        uid: hostInfo["uid"],
        name: hostInfo['name_first'],
        photo: hostInfo["photo"],
        role: "host",
        group: groupInfo['groupID'],
        music_profile: hostInfo["music-profile"]
    }

    console.log(user["music_profile"].genres)

    // runs on page load, gets host info and allows time for other async tasks to run so that UI can load properly
    useEffect(() => {
        const isFocused = navigation.addListener("focus", () => {
            setLoading(true);

            getMemberInfo();

            return isFocused;
        }, [loading, navigation]);
    })

    function getMemberInfo() { 
        var member = route.params["groupInfo"]["members"];

        for (var i = 0; i <= member.length -1; i++) {
            const docRef = firebase.firestore().collection("users").doc(`${member[i]}`)
            
            docRef.get().then(function(doc){
                if (doc.exists) {
                    
                    var doc = doc.data();

                    var user = {
                        uid: doc.uid,
                        name: doc["name_first"],
                        timestamp: "2 minutes ago",
                        group: groupInfo['groupID'],
                    };
                    
                    var memberMusic = {};
                    
                    //pull from host music profile
                    firebase.firestore().collection("user-music-profile").where("user", "==", doc.uid)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            memberMusic = {
                                genres: doc.data().genres.slice(0,3),
                                top_artists: doc.data().top_artists.slice(0,3),
                                top_tracks: doc.data().top_tracks.slice(0,3)
                            }
                        });
                    }).catch((error) => {
                        console.log("Error getting member music profile: ", error);
                    });

                    // get host photo
                    let imageRef = firebase.storage().ref(`images/users/${doc.uid}.jpg`);
            
                    imageRef
                    .getDownloadURL()
                    .then((url) => {
                        user["photo"] = url;
                        user["music_profile"] = memberMusic;
                        
                        userArray.push(user)
                        setList(userArray)
                    })
                    .catch((e) => console.log('getting downloadURL of image error => ', e));
                
                } else {
                    setLoading(false);
                    console.log("Member document not exist");
                }
            }).catch((error) => {
                console.log('error getting member info: ' + error)
            });
        }

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    if (loading) {
        return (
            <View style={styles.section}>
                <ActivityIndicator color="white"/>
            </View>
        );
    }
    return (
        <View style={styles.section}>
            {/* SEARCH */}
            <View style={[styles.container, styles.top]}>
                <Text style={styles.heading}>Listeners</Text>
                <Text style={styles.textDetail}>{groupInfo["members"].length + 1} listeners</Text>
            </View>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.block_groupList, styles.listener_host}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Listener Modal", {screen: "Listener Profile", params: {user}});
                            }}
                        >
                            <ListenerListItem data={{type: 'HOST', name: hostInfo["name_first"], likes: hostInfo["music-profile"]['genres'], image: hostInfo["photo"], uid: hostInfo["uid"]}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={styles.textDetail}>GROUP</Text>
                    <View style={styles.block_groupList}>
                            {list.map((user, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => {
                                        navigation.navigate("Listener Modal", {screen: "Listener Profile", params: {user}});
                                    }}
                                >
                                    <ListenerListItem key={i} data={{type: 'LISTENER', name: user["name"], likes: user['music_profile']['genres'], image: user["photo"], uid: user['uid']}}/>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Text style={styles.textLink}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    section: {
        width: '100%',
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#0F0F0F",
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    top:{
        marginTop: 65,
    },
    container: {
        flexDirection: 'column',
        paddingVertical: 5,
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
        marginTop: '$padding3',
    },
    block_spacebetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        alignSelf: 'center',
        paddingVertical: 20,
        textAlign: 'center',
        marginBottom: 50,
    },
    groupIcon:{
      width: 80,
      height: 80,
    },
    profileIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
    },
    settingsIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
    },
    heading: {
        fontSize: '$fontSize1',
        color: '$white',
        marginBottom: '$padding5'
    },
    textDetail: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    textLink: {
        color: '#FFFFFF',
        fontSize: 16,
        alignSelf: 'center',
        paddingVertical: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    listener_host: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    }
})