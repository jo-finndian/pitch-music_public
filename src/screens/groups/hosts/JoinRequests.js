import React, {useEffect, useState} from 'react';
import { Text, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import firebase from "firebase";
import "@firebase/firestore";
import EStyleSheet, { value } from "react-native-extended-stylesheet";

import UserRequest from '../../../components/UserJoinRequest';
import { ScrollView } from 'react-native';

export default function JoinRequests({ navigation, route }){
    const groupID = route.params
    const [joinReqs, setJoinReqs] = useState([]);
    var userArray = [];
    const [loading, setLoading] = useState();
    
    
    useEffect(() => {
        const isFocused = navigation.addListener("focus", () => {
            setLoading(true)
            var doc = [];
            
            const id = groupID["groupID"];

            firebase.firestore().collection("playlists").doc(id)
            .onSnapshot(documentSnapshot => {
                doc = documentSnapshot.data()["join_requests"]
                getJoinReqs(doc)
                console.log(doc)
        
            }, err => {
                console.log(`Encountered error: ${err}`);
            })
        });
        return isFocused
    }, [joinReqs, loading, navigation])


    const getJoinReqs = (doc) => {
        console.log("Get Join Reqs")

        for (var i = 0; i <= doc.length - 1; i++) {

            const docRef = firebase.firestore().collection("users").doc(doc[i])
            
            docRef.get().then(function(doc){
                if (doc.exists) {
                    var data = doc.data();
    
                    let user = {
                        uid: data.uid,
                        name: data["name_first"],
                        timestamp: "2 minutes ago"
                    }
                    
                    userArray.push(user)
                } else {
                    console.log('No such document!');
                }
                setJoinReqs(userArray)

                return userArray
            }).then((userArray)=> {

                console.log("then: user array")
                for (let key in userArray) {
                    var x = userArray[key];

                    let imageRef = firebase.storage().ref(`images/users/${x["uid"]}.jpg`);
    
                    imageRef
                    .getDownloadURL()
                    .then((url) => {
                        console.log("URL: " + url)
    
                        x["photo"] = url
                    })
                    .catch((e) => console.log('getting downloadURL of image error => ', e));
                }
            });
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    return (
        <View style={styles.section}>
            <View style={[styles.container, styles.top]}>
                <Text style={styles.heading}>Join Requests</Text>
                <Text style={styles.textDetail}>{joinReqs.length} Pending Requests</Text>
            </View>
            <ScrollView>
            {loading ? 
                <View>
                    <ActivityIndicator color="white" />
                </View>
            :
                <View style={styles.container}>
                    <View style={styles.block_groupList}>
                        {joinReqs.map((user, i) => (
                            <UserRequest key={i} data={user} groupID={groupID}/>
                        ))}
                    </View>
                </View>
            }
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
const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#0F0F0F",
        paddingHorizontal: screenPadding,
        paddingVertical: screenPadding,
    },
    top:{
        marginTop: 65,
    },
    container: {
        flexDirection: 'column',
        width: windowWidth - (screenPadding*2),
        paddingVertical: 4,
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
        marginTop: 24,
    },
    heading: {
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        color: '$white',
        marginBottom: '$padding4',
    },
    textDetail: {
        fontFamily: 'Poppins_400Regular',
        color: '#FFFFFF',
        fontSize: 12,
        marginBottom: '$padding3'
    },
    textLink: {
        color: '#FFFFFF',
        fontSize: 16,
        alignSelf: 'center',
        paddingVertical: 24,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
})