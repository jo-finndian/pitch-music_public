import React, {useEffect, useState} from 'react';
import { ActivityIndicator, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import * as firebase from "firebase";
import "@firebase/firestore";
import { getDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

import GroupListItem from '../components/GroupListItem';
import ButtonFullWidth from '../components/ButtonFullWidth';
import CircleImage from "../components/CircleImage";
import Header from "../components/Header";

const Home = ({navigation, route}) => {
    const [loading, setLoading] = useState();
    const [openMenu, setOpenMenu] = useState();
    const [deepLinkOpened, setDeepLinkOpened] = useState(false);

    const [user, setUserId] = useState();
    const [isHost, setIsHost] = useState(false);
    const [profilePic, setPic] = useState();
    const [userLocation, setUserLocation] = useState();
    
    const [groupsNearby, setGroupsNearby] = useState([]);
    const [modalVisible, setModalVisible] = useState(true);
    const [groupEnded, setGroupEnd] = useState(false);
    
    var currentGroup = '';
    var groupArray = [];

    function urlRedirect(url) {
        if(!url) {
            console.log('-------------no url found')
            return;
        }
        // parse and redirect to new url
        let { path, queryParams } = Linking.parse(url);

        if (Object.keys(queryParams) == 0) {
            // console.log("2: No query params")
            getGroups(userLocation)
            return
        }
        else {
            setDeepLinkOpened(true)
            updateAsyncStorage('opened-with-deeplink', 'true')
            getLinkedGroup(queryParams)
            // console.log(`2: Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
        }
    }

    useEffect(() => {
        const isFocused = navigation.addListener("focus", () => {
            setLoading(true);
            
            fetchInfo();

            if (deepLinkOpened == false) {
                Linking.getInitialURL().then(urlRedirect)
            }

            if ( profilePic == null ) {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // console.log("USER ID:" + user.uid);
                        userID = user.uid;
                        getProfilePic(user.uid)
                        setUserId(user.uid)
                    }
                });
            }
        })
        return isFocused;

    }, [loading, navigation, groupsNearby, user, isHost]);

    function getProfilePic(user) {
        // console.log("get profile pic of " + user)
        let imageRef = firebase.storage().ref(`images/users/${user}.jpg`);

        imageRef
        .getDownloadURL()
        .then((url) => {
            setPic(url)
            // console.log(url);
            updateAsyncStorage('profilePicture', url)
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

    async function getGroups(userLocation){
        return new Promise(async (resolve, reject) => {
            try {
                const docRef = firebase.firestore().collection("playlists").where("location", "!=", "");

                docRef.get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.exists) {
                            var location = JSON.parse(doc.data().location)
                            const playlistLocation = {"latitude": location["coords"]["latitude"], "longitude": location["coords"]["longitude"]}
                        
                            if (getDistance(playlistLocation, userLocation) <= 1000 ) {
                                let imageRef = firebase.storage().ref(`images/groups/group_${doc.id}.jpg`);
                                
                                var obj = doc.data()
                                
                                imageRef
                                .getDownloadURL()
                                .then((url) => {
                                    // console.log("URL: " + url)
                                    obj["photo"] = url
                                })
                                .catch((e) => console.log('getting downloadURL of image error => ', e));
                                
                                obj["groupID"] = doc.id
                                obj["currentGroup"] = currentGroup

                                groupArray.push(obj)

                            }
                            else {
                                console.log("no groups near by")
                            }
                        }
                        else {
                            console.log("no groups at all")
                        }
                    });
                    setGroupsNearby(groupArray)
                    groupArray = []
                }).catch((error)=> {
                    console.log('finding groups by location error: ' + error)
                });

                setTimeout(() => {
                    setLoading(false);
                }, 2000);
                
                return resolve(true);
            } catch (e) {
                return reject(e);
            } 
        });
    }

    async function getLinkedGroup(linkParams){
        return new Promise(async (resolve, reject) => {
            try {
                const docRef = firebase.firestore().collection("playlists").doc(linkParams["groupID"]);

                docRef.get().then((doc) => {
                    if (doc.exists) {
                        // console.log("Document data:", doc.data());
                        var groupInfo = doc.data();
                        
                        groupInfo["groupID"] = linkParams["groupID"];
                        groupInfo["currentGroup"] = currentGroup;

                        navigation.navigate('My Group', {screen: "Group View", params: {screen: 'Host Group', params: {groupInfo: groupInfo}}});
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });

                setTimeout(() => {
                    setLoading(false);
                }, 2000);
                
                return resolve(true);
            } catch (e) {
                return reject(e);
            } 
        });
    }

    // check if user is already in a group, then if not, allow to create group
    const checkIfInGroup = () => {
        const docRef = firebase.firestore().collection("users").doc(user)
                
        docRef.get().then(function(doc){
            if (doc.exists) {
                var doc = doc.data();
                if (doc["groupRole"]) {
                    updateAsyncStorage('group-role', doc["groupRole"])

                    var timestamp = doc["timestamp"].toMillis(); //firebase timestamp
                    var expiryDate = timestamp + 86399040; //expiry date is 24 Hrs after group is created
                    let currentDate = new Date().getTime(); //current date and time

                    checkExpiry(currentDate, expiryDate);
                }
    
                if (doc["group"]) {
                    updateAsyncStorage('group', doc["group"])
                    alert("You are already in a group.\nYou must leave that group before joining another.")
                }
                else {
                    navigation.navigate('Create Group', {screen: "Onboarding"});
                }
            }
        }).catch((error)=> {
            console.log("HOME: error checking if user is in group: " + error)
        })
    }



    function updateAsyncStorage(label, value) {
        return new Promise(async (resolve, reject) => {
            try {
                await AsyncStorage.removeItem(`${label}`)
    
                await AsyncStorage.setItem(`${label}`, value)

                // console.log('async updated with: ' + label + " = " + value)
                
                return resolve(true)
            } catch (e) {
                console.log('error: ' + e)
                return reject(e)
            }
        });
    }

    async function fetchInfo() {
        const savedPic = await AsyncStorage.getItem('profilePicture');
        const currentLocation = await AsyncStorage.getItem('location');
        const deepLink = await AsyncStorage.getItem('opened-with-deeplink');
        const host = await AsyncStorage.getItem('isHost');
        const group = await AsyncStorage.getItem('group');

        var location = JSON.parse(currentLocation);
        const userLocation = {"latitude": location["coords"]["latitude"], "longitude": location["coords"]["longitude"]}

        if (savedPic) {
            setPic(savedPic)
        }
        
        if (deepLink && deepLink == "true") {
            setDeepLinkOpened(true);
            updateAsyncStorage('opened-with-deeplink', 'false')
        }

        if (currentLocation){
            setGroupsNearby([])
            setUserLocation(userLocation)
            getGroups(userLocation);
        }
        else {
            console.log("no location saved")
        }

        if (host && host == "true") {
            setIsHost(true)
        }
        else {
            setIsHost(false)
        }

        if (group != '') {
            currentGroup = group
        }
        else {
            currentGroup = 'none'
        }
    }
    function checkExpiry(currentTime, expiryTime){
        //if current time is greater than expiry date send warning
        if(currentTime >= expiryTime){
          setGroupEnd(true);
        }
      }

    function removeFromGroupOnEnd() {
        var ref = firebase.firestore().collection("users").doc(userID);
        var groupRef = firebase.firestore().collection('playlists').doc(groupInfo["groupID"])
        
        groupRef.update({
            members: firebase.firestore.FieldValue.arrayRemove(userID)
        })
        .then(() => {
            console.log("Group updated: removed member " + userID)
        })
        .catch((error) => {
            console.error("Error updating group document: ", error);
        });
    
        return ref.update({
            group: '',
            groupRole: ''
        })
        .then(() => {
            console.log("User document successfully updated: group removed");
            setModalVisible(false)
        })
        .catch((error) => {
            console.error("Error updating user document: ", error);
        });
    }

    return (
        <View style={styles.section}>

        {/* GROUP ENDED MODAL */}
        { (groupEnded == true) 
        ?   <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >

            <View style={styles.centeredView}>
                <View style={styles.modalView}> 
                <CircleImage image={require('../../assets/emojis/embarrassed-face.png')} size="medlarge" style={styles.centerAlign}/>
                <Text style={styles.modalText}>Uh Oh!The Group as been Ended</Text>
                
                <ButtonFullWidth
                    label="Return to Home"
                    backgroundColor="$bg_black"
                    color="$white"
                    onPress={() => {
                    removeFromGroupOnEnd();
                    // setModalVisible(false)
                    // navigation.navigate("Home", {screen: "Home"});
                    }}
                />
                </View>
            </View>
            </Modal>
        : <></>
        }
        {/* END MODAL */}

            {/* PROFILE BAR */}
            <Header
                leftItem={
                    <TouchableOpacity
                        onPress={()=> {
                            navigation.openDrawer()
                        }}
                    >
                    <Image style={styles.icon_menu} source={require('../../assets/icons/menu.png')}/>
                    </TouchableOpacity>
                }
                rightItem={                    
                    <TouchableOpacity
                        style={styles.settingsIcon}
                        onPress={()=>{
                            navigation.navigate("Account Settings")
                        }}
                        >
                        <CircleImage size="small" image={{uri: profilePic}}/>
                    </TouchableOpacity>
                }
            />

            {/* // LOGO */}
            <Image style={styles.logo} source={require('../../assets/images/white-logo.png')}/>

            {/* {/* GROUPS NEARBY *} */}
            <View style={[styles.container, { flexGrow: 1}]}>

                <Text style={styles.heading}>Join a Nearby Group</Text>
                <Text style={styles.textDetail}>Within 1km</Text>
                {loading ? 
                <View>
                    <ActivityIndicator color="white" />
                </View>
                :
                <ScrollView style={[styles.scrollView, styles.block_groupList]}>
                    {groupsNearby.map((group, i) => (
                        <GroupListItem key={i} data={group}
                            // onPress={()=>{
                                // isHost && group["currentGroup"] === group["groupID"]
                                // console.log(isHost + " : " + group["currentGroup"] + " : " + group['groupID']) 
                                // group['private']
                                // ? sendJoinRequest(group)
                                // navigation.navigate('My Group', {screen: "Group View", params: {screen: 'Host Group', params: {groupID: group['groupID']}}})
                                // console.log(isHost + " : " + group["currentGroup"] + " : " + group['groupID']) 
                                // : joinGroup(group)
                                // navigation.navigate('My Group', {screen: "Group View", params: {screen: 'User Group', params: {groupID: group['groupID']}}})
                            // }}
                        />
                    ))}
                </ScrollView>
                }
            </View>

            <View style={styles.container}>
                <ButtonFullWidth label="Create Group" color= "$bg_black" backgroundColor="$blue_light"
                    onPress={() => {
                        checkIfInGroup()
                    }}
                />
            </View>

        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: '$padding2',
        paddingVertical: '$padding1',
        backgroundColor: '$bg_black',
    },
    container: {
        flexDirection: 'column',
        width: '100%',
    },
    block_groupList: {
        flex: 1,
        width: '100%',
        flexBasis: 'auto',
        marginTop: '$padding2',
    },
    block_spacebetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        width: '50%',
        alignSelf: 'center',
        marginBottom: '$padding1 + $padding2',
        marginTop: '$padding1',
        resizeMode: 'contain'
    },
    heading: {
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        color: '$white',
        marginBottom: '$padding5'
    },
    textDetail: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_400Regular',
        color: '$textColor_grey',
    },
    icon_menu: {
        width: 20,
        height: 12,
        resizeMode: 'contain',
        zIndex: 5, 
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
})

export default Home;