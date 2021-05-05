import React, {useEffect, useState} from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import firebase from "firebase";
import "@firebase/firestore";
import EStyleSheet from "react-native-extended-stylesheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpotifyWebAPI from 'spotify-web-api-js';

import QueueElement from '../../components/QueueElement';
import CurrentSong from '../../components/CurrentSong';


var s = new SpotifyWebAPI();
export default function Queue({ navigation, route }){
    const [trackData, setTrackData] = useState([]);
    const [albumArt, setAlbumArt] = useState("");
    const [currTrack, setCurrTrack] = useState([]);
    const [currArtist, setCurrArtist] = useState([]);


    useEffect(() =>{
        AsyncStorage.getItem( 'group', (err, result) =>{

            //CURRENT TRACK
            firebase.firestore().collection("playlists").doc(result)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    var currentSong = doc.data().current_song;
                    // console.log("Document data:", currentSong);
                    if(currentSong != undefined){
                        s.getTrack( currentSong , function(err, data){
                            if (err) console.error(err);
                            else{
                                setAlbumArt(data.album.images[2].url)
                                setCurrTrack(data.name);
                                setCurrArtist(data.artists[0].name);
                            } 
                        })
                    }
                } else {
                    console.log("No such document!");
                }
            })

            //UPCOMING TRACKS
            firebase.firestore().collection("playlists").doc(result)
            .onSnapshot((doc) => {
                if (doc.exists && doc.data().queue != undefined) {
                    // console.log("Document data:", doc.data().queue[0]);
                    var queueArray = [];
                    for (var x = 0; x < doc.data().queue.length; x++){
                        queueArray.push( doc.data().queue[x] );
                    }

                    s.getTracks( queueArray , function(err, data){
                        if (err) console.error(err);
                        else{
                            setTrackData(data.tracks);
                        } 
                    })
                } else {
                    console.log("No such document!");
                }
            })

        } );


    }, []);

  
  return (
      <View style={styles.section}>
          {/* SEARCH */}
          <View style={[styles.container, styles.top]}>
              <Text style={styles.heading}>Queue</Text>
          </View>
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.textDetail}>NOW PLAYING</Text>
             <View style={styles.block_groupList, styles.queue_nowPlaying}>
                 <CurrentSong data={{image:albumArt, name:currTrack, artist:currArtist}}></CurrentSong>
              </View>
          </View>
          <View style={styles.container}>
          <Text style={styles.textDetail}>UP NEXT</Text>
             <View style={styles.block_groupList}>
                  {/* Map groups into group list item */}
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={ {flexGrow: 0}}
                    data={trackData}
                    renderItem={({ item }) => (
                        <QueueElement data={{image:item.album.images[2].url, name:item.name, artist:item.artists[0].name}}></QueueElement>   
                    )}
                    keyExtractor={(item, index) => item + index}
                    />
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
const windowWidth = Dimensions.get('window').width;
const screenPadding = 25;

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
        paddingVertical: 5,
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
    },
    block_spacebetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'green',
    },
    heading: {
        fontSize: '$fontSize1',
        color: '$white',
        marginBottom: '$padding3'
    },
    textDetail: {
        color: '#FFFFFF',
        fontSize: 10,
        marginTop: '$padding3'
    },
    textLink: {
        color: '#FFFFFF',
        fontSize: 16,
        alignSelf: 'center',
        paddingVertical: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    queue_nowPlaying: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    }
})