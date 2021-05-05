import React, {useEffect, useState} from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import firebase from "firebase";
import "@firebase/firestore";
import EStyleSheet from "react-native-extended-stylesheet";
// import { Text, View, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
// import firebase from "firebase";
// import "@firebase/firestore";
// import SpotifyWebAPI from 'spotify-web-api-js';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import EStyleSheet from "react-native-extended-stylesheet"; 

import QueueElement from '../../../components/QueueElement';

var s = new SpotifyWebAPI();

export default function SongRequests({ navigation }){
    const [trackData, setTrackData] = useState([]);
    const [reqLength, setReqLength] = useState("");

    AsyncStorage.getItem('accessToken', (err, result) => {
        s.setAccessToken(result);
    });

    useEffect(() =>{
        AsyncStorage.getItem( 'group', (err, result) =>{
            //pull song request uids from firebase
            firebase.firestore().collection("playlists").doc(result)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setReqLength(doc.data().song_requests.length);
                    //pull request data from firebase
                    var requestArray = [];
                    for (var x = 0; x < doc.data().song_requests.length; x++){
                        requestArray.push( doc.data().song_requests[x] );
                    }

                    //pull track data from spotify
                    s.getTracks( requestArray , function(err, data){
                        if (err) console.error(err);
                        else{
                            setTrackData(data.tracks);
                        }
                    })
                
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            });
        } );
    },  []);

  
  return (
      <View style={styles.section}>
          {/* SEARCH */}
          <View style={[styles.container, styles.top]}>
              <Text style={styles.heading}>Song Requests</Text>
              <Text style={styles.textDetail}>{reqLength} Pending Requests</Text>
          </View>
        <ScrollView>
          <View style={styles.container}>
             <View style={styles.block_groupList}>
                  {/* Map groups into group list item */}
                  <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={ {flexGrow: 0}}
                        data={trackData}
                        renderItem={({ item }) => (
                            <QueueElement data={{image:item.album.images[2].url, name:item.name, artist:[item.artists[0].name]}}/> 
                        )}
                        keyExtractor={(item, index) => item + index}
                    />
              </View>
          </View>
          </ScrollView>

{/* export default function SongRequests({ navigation, route }){
    var s = new SpotifyWebAPI();
    
    AsyncStorage.getItem('accessToken', (err, result) => {
        s.setAccessToken(result);
    });

    const groupID = route.params["params"]
    const [songReqs, setSongReqs] = useState([]);
    var songArray = [];
    const [loading, setLoading] = useState();
    
    useEffect(() => {
        const isFocused = navigation.addListener("focus", () => {
            setLoading(true)
            var doc = [];

            firebase.firestore().collection("playlists").doc(groupID)
            .onSnapshot(documentSnapshot => {
                doc = documentSnapshot.data()["song_requests"]
                getSongInfo(doc)
            }, err => {
                console.log(`Encountered error: ${err}`);
            })
        });
        return isFocused
    }, [songReqs, loading, navigation])


    const getSongInfo = (doc) => {
        console.log("Get Song Reqs")

        s.getTracks( [doc], function(err, data){
            if (err) console.error(err);
            else{
                for (var i = 0 ; i <= doc.length -1 ; i++) {
                    var song = {
                        name: data.tracks[i].name,
                        artist: data.tracks[i].album.artists[0].name,
                        image: data.tracks[i].album.images[2].url,
                        uri: data.tracks[i].uri,
                        id: data.tracks[i].id,
                    }

                    // console.log(song)
                    songArray.push(song)
                }
                
                setSongReqs(songArray)
            }
        })
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }
  
  return (
      <View style={styles.section}>
            <View style={[styles.container, styles.top]}>
                <Text style={styles.heading}>Song Requests</Text>
                <Text style={styles.textDetail}>{songReqs.length} Pending Requests</Text>
            </View>
            <ScrollView>
            {loading ? 
                <View>
                    <ActivityIndicator color="white" />
                </View>
            :
                <View style={styles.container}>
                    <View style={styles.block_groupList}>
                        {songReqs.map((song, i) => (
                            <QueueElement key={i} data={song}/>
                            // <QueueElement key={i} data={{name:'ORANGE SODA', artist:'Baby Keem'}} />
                        ))}
                    </View>
                </View>
            }
            </ScrollView> */}
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
        marginTop: 16,
    },
    heading: {
        fontSize: '$fontSize1',
        fontFamily: "Poppins_600SemiBold",
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
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    }
})