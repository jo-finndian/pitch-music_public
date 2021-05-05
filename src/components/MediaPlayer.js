import React, {useRef, useState, useEffect} from "react";
import SpotifyWebAPI from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, Text, Image, View, Animated } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useNavigation } from '@react-navigation/native';
import firebase from "firebase";
import "@firebase/firestore";

import TabBar from "./Header";
var s = new SpotifyWebAPI();

//for the timer
function useInterval(callback, delay) {
    
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}

const MediaPlayer = ({active}) => {
    const [albumArt, setAlbumArt] = useState("");
    const [trackData, setTrackData] = useState("");
    const [artistData, setArtistData] = useState("");
    const [explicit, setExplicit] = useState("");
    const [trackDuration, setDuration] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [currTrack, setCurrTrack] = useState("");
    const [nextTrack, setNextTrack] = useState("");
    const [lastTrack, setLastTrack] = useState("");
    const [playOnload, setPlayOnload] = useState("");

    const [isHost, setHost] = useState("");
    const [groupID, setGroup] = useState("");
    const [deviceID, setDeviceID] = useState(0)
    const [playing, setPlaying] = useState();
    const [width, setWidth] = useState("0%");

    const navigation = useNavigation();
 
    //check if host in order to navigate between tabs
    AsyncStorage.getItem( 'isHost', (err, result) =>{
        setHost(result);
    } );

    //getting track ID for the next song in queue
    AsyncStorage.getItem( 'group', (err, result) =>{
        
        if(result != null){
            setGroup(result);

            if(result != undefined && result != ''){
                firebase.firestore().collection("playlists").doc(result)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        setCurrTrack(doc.data().current_song); //current track id
                        setNextTrack("spotify:track:"+doc.data().queue[1]); //URI, necessary to skip track
                        setLastTrack(doc.data().queue[0]); //necessary to delete track on firebase
                    } else {
                        console.log("No such document!");
                    }
                })
            }
        }
           
    } );

    AsyncStorage.getItem('accessToken', (err, result) => {
        s.setAccessToken(result);
      });

    //this happens when the media player loads
    useEffect(() =>{
        //get playback info
        s.getMyCurrentPlaybackState({limit: 1}, function (err, data){
            if (err)  alert("Spotify must be open to play music on Pitch");
            else {
                if (data.is_playing == true){
                    console.log("music is playing (onload)")

                    //getting last active session device
                    s.getMyDevices(function(err, data){
                        if (err)  alert("Spotify must be open to play music on Pitch");
                        else{
                            if(data.devices[0] == undefined){
                                alert("Spotify must be open to play music on Pitch");
                            }
                            else{
                                setDeviceID(data.devices[0].id);
                            }
                        }
                        
                    })

                    //sets track info
                    setAlbumArt(data.item.album.images[2].url);
                    setTrackData(data.item.name);
                    setArtistData(data.item.artists[0].name);
                    setExplicit(data.item.explicit)
                    setPlaying(true);
                    setSeconds(data.progress_ms)
                    setDuration(data.item.duration_ms);
                    var track_id = data.item.id;

                    //set current song in firebase
                    if(groupID != undefined && groupID != ""){
                        firebase.firestore().collection("playlists").doc(groupID).update({
                            current_song: track_id,
                        })
                        .then(() => {
                            console.log("Current song successfully updated!");
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                    }

                    //add track 1 from queue array on firebase to the next track in spotify queue
                    // addtoQueue();

                }
                else if (data.is_playing == false || data.is_playing == undefined){
                    console.log("music is not playing (onload)")

                    setPlayOnload('1stTime');

                    if(currTrack == undefined || currTrack == ''){
                        //set last track info
                        s.getMyRecentlyPlayedTracks({limit: 1}, function(err, data){
                            setAlbumArt(data.items[0].track.album.images[2].url);
                            setTrackData(data.items[0].track.name);
                            setArtistData(data.items[0].track.artists[0].name);
                            setExplicit(data.items[0].track.explicit);
                            setPlaying(false);
                        }) 
                    }
                    else{
                        s.getTrack(currTrack, function(err, data){
                            setAlbumArt(data.album.images[2].url);
                            setTrackData(data.artists[0].name);
                            setArtistData(data.name);
                            setExplicit(data.explicit);
                            setPlaying(false);
                        }) 
                    }

                    //getting last active session device
                    s.getMyDevices(function(err, data){
                        if (err)  alert("Spotify must be open to play music on Pitch");
                        else{
                            if(data.devices[0] == undefined){
                                alert("Spotify must be open to play music on Pitch");
                            }
                            else{
                                setDeviceID(data.devices[0].id);
                            }
                        }
                    })
                }
  
                
            }
        })

    }, [nextTrack] );

    // //timer
    function Counter() {
        useInterval(() => {
            setSeconds(seconds + 1000)  //add 1 second to progress

            let progress = seconds; //current progress of song
            let duration = trackDuration; //duration of song

            let durPercent = Math.round((progress/duration)*100)+'%'; 
            setWidth(durPercent); //width of playback fill

            //changes the current song to the next song
            if(progress >= duration-1){
                s.getMyCurrentPlaybackState({limit: 1}, function (err, data){
                    if (err)  alert("Spotify must be open to play music on Pitch");
                    else {
                        console.log("song ended, playing next song");
                        //sets track info
                        setAlbumArt(data.item.album.images[2].url);
                        setTrackData(data.item.name);
                        setArtistData(data.item.artists[0].name);
                        setExplicit(data.item.explicit)
                        setPlaying(data.is_playing);
                        setSeconds(data.progress_ms)
                        setDuration(data.item.duration_ms);
                        var track_id = data.item.id;

                        if (data.is_playing == true && groupID != undefined && groupID != ""){
                            console.log("music is playing (track complete)")
                            firebase.firestore().collection("playlists").doc(groupID).update({
                                current_song: track_id, //changes the current song in the queue screen
                                queue: firebase.firestore.FieldValue.arrayRemove(lastTrack), //deletes first item in queue on FB
                            })
                            .then(() => {
                                console.log("Current song successfully updated!");
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                            });
                        }
                        else{
                            console.log("music is not playing (track complete)")
                        }

                        
                    }
                })

                //add track 1 from queue array on firebase to the next track in spotify queue
                addtoQueue();
                 
            }

        }, playing ? 1000 : null);
    }

    const addtoQueue = () =>{
        //add track 1 from queue array on firebase to the next track in spotify queue
        if(nextTrack != undefined && nextTrack != ''){
            s.queue(nextTrack, function(err, data){
                if (err)  alert("Spotify must be open to play music on Pitch");
                else{
                    console.log("next track added to spotify queue")
                }
            })
        }
    }

    const playTrack = () => {
        //Spotify needs to be open somewhere for there to be a deviceID
        if(deviceID == undefined || deviceID == ''){
            s.getMyDevices(function(err, data){
                if (err)  alert("Spotify must be open to play music on Pitch");
                else{
                    if(data.devices[0] == undefined){
                        alert("Spotify must be open to play music on Pitch");
                    }
                    else{
                        setDeviceID(data.devices[0].id);
                        console.log("device ID: "+data.devices[0].id);
                    
                        //play on the last active session device
                        s.play({device_id: data.devices[0].id}, function(err, data){
                            if (err);
                            else{
                                console.log("pressed play");
                                setPlaying(true);
                                //add track 1 from queue array on firebase to the next track in spotify queue
                                if(playOnload == '1stTime'){
                                    // addtoQueue();
                                    setPlayOnload('')
                                }
                            } 
                        })
                    }
                }
                
            })
        }
        //play on the last active session device
        s.play({device_id: deviceID}, function(err, data){
            if (err)  alert("Spotify must be open to play music on Pitch");
            else{
                console.log("pressed play");
                setPlaying(true);
                //add track 1 from queue array on firebase to the next track in spotify queue
                if(playOnload == '1stTime'){
                    // addtoQueue();
                    setPlayOnload('')
                }
            } 
        })

        

        
        
    }

    const pauseTrack = () => {
        s.pause( function(err, data){
            if (err)  alert("Spotify must be open to play music on Pitch");
            else{
                setPlaying(false);
                console.log("pressed paused");
            }
        })
    }
   
    const skipTrack = () => {
        
        //skips to next track
        s.skipToNext( function(err, data){
            if (err)  alert("Spotify must be open to play music on Pitch");
        })

        //waits until song changes and then updates track info
        setTimeout(function(){
            
            s.getMyCurrentPlaybackState({limit: 1}, function (err, data){
                if (err)  alert("Spotify must be open to play music on Pitch");
                else {
                    
                    var track_id = data.item.id;
                    //sets track info
                    setAlbumArt(data.item.album.images[2].url);
                    setTrackData(data.item.name);
                    setArtistData(data.item.artists[0].name);
                    setExplicit(data.item.explicit)
                    setPlaying(data.is_playing);
                    setSeconds(data.progress_ms)
                    setDuration(data.item.duration_ms);
                    console.log("music is playing (skipped track)")
                     
                    if(groupID != undefined && groupID != ""){
                        firebase.firestore().collection("playlists").doc(groupID).update({
                            current_song: track_id, //changes the current song in the queue screen
                            queue: firebase.firestore.FieldValue.arrayRemove(lastTrack), //deletes first item in queue on FB
                        })
                        .then(() => {
                            console.log("Current song updated!");
                            //add track 1 from queue array on firebase to the next track in spotify queue
                            if(nextTrack != undefined || nextTrack != ''){
                                s.queue(nextTrack, function(err, data){
                                    if (err) console.error(err);
                                })
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                    }
                    

                }
            })  

        }, 500);
  
    }

    Counter();

    return (
        <View style={styles.playerTabBar}>
            {/* { (playing == true) ?
                <View style={[styles.playerContainer]}>
                    <View style={[styles.playback]}>
                        <Animated.View style={[styles.playbackFill, {backgroundColor: '#92EABD', width }]}/>
                    </View>
                    <View style={styles.container}>
                        <TouchableOpacity
                                style={styles.nextSong}
                                onPress={playPauseTrack}
                        >
                            <Image
                                style={styles.song_albumart}
                                source={{uri: albumArt}}
                            />
                        </TouchableOpacity>
                        <View style={styles.song}>
                            <Text style={styles.song_name}>{trackData}</Text>
                            <View style={styles.row}>
                                {(explicit == undefined || explicit == '' )
                                ? <Image style={[styles.explicit, {display: "none"}]} source={require('../../assets/icons/explicit.png')}/>
                                : explicit && <Image style={styles.explicit} source={require('../../assets/icons/explicit.png')}/>
                                }
                                <Text style={styles.song_artist}>{artistData}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.nextSong}
                            onPress={skipTrack}
                        >
                            <Image source={require('../../assets/icons/next.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <></>
            } */}
              
            <View style={[styles.playerContainer]}>
                <View style={[styles.playback]}>
                    <Animated.View style={[styles.playbackFill, {backgroundColor: '#92EABD', width }]}/>
                </View>
                <View style={[styles.container, styles.track_container]}>
                    <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.album_container}
                        onPress={
                            (playing == false )
                            ? playTrack 
                            : pauseTrack
                        }
                    >
                        {(playing == false )
                        ? <Image source={require('../../assets/icons/play.png')} style={[styles.playPause, styles.icon]} />
                        : <Image source={require('../../assets/icons/pause.png')} style={[styles.playPause, styles.icon]}/>
                        }
                        
                        <Image
                            style={[styles.song_albumart, (playing == false ) ? {opacity: 0.5} : {opacity: 1}]}
                            source={{uri: albumArt}}
                        />
                    </TouchableOpacity>
                    <View style={styles.song}>
                        <Text style={styles.song_name}>{trackData}</Text>
                        <View style={styles.row}>
                            {(explicit == undefined || explicit == '' )
                            ? <Image style={[styles.explicit, {display: "none"}]} source={require('../../assets/icons/explicit.png')}/>
                            : explicit && <Image style={styles.explicit} source={require('../../assets/icons/explicit.png')}/>
                            }
                            <Text style={styles.song_artist}>{artistData}</Text>
                        </View>
                    </View>
                    </View>
                    <TouchableOpacity
                        style={styles.nextSong}
                        onPress={skipTrack}
                    >
                        <Image style={styles.icon} source={require('../../assets/icons/next.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={[styles.tabBar, {borderRadius: "0px", borderTopWidth: 1, borderTopColor: "#464646"}
                // (playing == true) 
                // ? {borderRadius: "0px", borderTopWidth: 1, borderTopColor: "#464646"}
                // : {borderRadius: "16px 16px 0px 0px"}
            ]}>
                <TabBar
                    leftItem={
                        <TouchableOpacity
                        style={styles.tab}
                        onPress={()=>{
                            // changeIcon()
                            (isHost)
                            ? navigation.navigate('My Group', {screen: "Group View", params: {screen: 'Host Group' }})
                            : navigation.navigate('My Group', {screen: "Group View", params: {screen: 'User Group'}})
                        }}
                        >
                        <Image source={(active === 'group') ?  require('../../assets/icons/home-active.png') :  require('../../assets/icons/home-inactive.png')}/>
                    </TouchableOpacity>
                    }
                    middleItem={
                        <TouchableOpacity
                        style={[styles.tab, {top: 38}]}
                        onPress={() => {
                            // changeIcon()
                            navigation.navigate("My Group", {screen: "Search View"});
                        }}
                        >
                        <Image source={(active === 'search') ? require('../../assets/icons/search-active.png') : require('../../assets/icons/search-grey.png')}/>
                    </TouchableOpacity>
                    }
                    rightItem={
                        <TouchableOpacity
                        style={[styles.tab, {top: 4}]}
                        onPress={() => {
                            navigation.navigate("Queue Modal");
                        }}
                        >
                        <Image source={require('../../assets/icons/queue-inactive.png')}/>
                    </TouchableOpacity>
                    }
                />
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    playerContainer:{
        backgroundColor: '$white',
    },
    playback:{
        flexDirection: 'row',
        height: 4,
    },
    playbackFill:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#252525',
        paddingTop: '$padding5',
        paddingBottom: '$padding4',
        paddingHorizontal: '$padding2',
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    track_container: {
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    album_container: {
        width: 40, 
        height: 40, 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    song_albumart:{
        height: '100%',
        width: '100%',
        zIndex: -1,
        position:'absolute'
    },
    explicit:{
        height: 8,
        width: 8,
        marginRight: 5
    },
    icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    song: {
        paddingLeft: '$padding4',
        maxHeight: 40,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    nextSong: {
        width: 16,
        height: 16,
        position: 'absolute',
        right: 25,
    },
    song_name: {
        fontSize: '$fontSize4',
        fontFamily: 'Poppins_400Regular',
        color: '$white',
        minWidth: 200, 
        maxWidth: 260,
    },
    song_artist: {
        fontSize: '$fontSize5',
        color: '$white',
        fontFamily: 'Poppins_300Light',
    },
    tabBar:{
        backgroundColor: '#252525',
        height: 64
    },
    tab:{
       paddingHorizontal:'$padding1',
       paddingVertical: '$padding3/2'
    },
})
export default MediaPlayer;