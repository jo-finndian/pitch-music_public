import React, {useEffect, useState} from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import firebase from "firebase";
import SpotifyWebAPI from 'spotify-web-api-js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EStyleSheet from "react-native-extended-stylesheet";

import CircleImage from '../../components/CircleImage';
import AddTrack from '../../components/AddTrack';
import Header from "../../components/Header";

var s = new SpotifyWebAPI();

export default function ListenerProfile({ navigation, route}){
  const { params } = route;

  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState();
  const [tracks, setTrackInfo] = useState([]);
 
  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      setLoading(true)
  
      if (params['user']['role']) {
        setHost(true)
        console.log("host true")
      }
      else {
        setHost(false)
        console.log("host false")
      }
      getTrackInfo();
    })
    return isFocused
  }, [navigation, loading])

  function getTrackInfo(){
    var trackIDs = [];

    for (var i=0 ; i <= 2 ; i++) {
      trackIDs.push(params.user["music_profile"].top_tracks[i])
    }

    var trackIDs = [`${params.user["music_profile"].top_tracks[0]},${params.user["music_profile"].top_tracks[1]},${params.user["music_profile"].top_tracks[2]}`];

    s.getTracks(trackIDs, function(err, data){
      if (err) console.error(err);
      else{
        var x = [];
        
        for (var i=0; i <= 2; i++) {
          // console.log(data.tracks[i].id);
          // console.log(data.tracks[i].album.images[2].url);
          // console.log(data.tracks[i].artists[0].name);
          // console.log(data.tracks[i].name);
          
          var trackInfo = {
            song_id: data.tracks[i].id,
            artist: data.tracks[i].artists[0].name,
            track: data.tracks[i].name,
            image: String(data.tracks[i].album.images[2].url),
            group_id: params.user.group,
          }

          x.push(trackInfo)
        }
      }
      setTrackInfo(x)
    })
    setLoading(false)
  }

  const removeUserFromGroup = () => {
    var ref = firebase.firestore().collection("users").doc(params.user.uid);
    var groupRef = firebase.firestore().collection('playlists').doc(params.user.group)

    ref.update({
      group: '',
      groupRole: ''
    })
    .then(() => {
      console.log("User document successfully updated: group/group role removed");
    })
    .catch((error) => {
      console.error("Error updating user document: ", error);
    });

    return groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(params.user.uid)
    })
    .then(() => {
      alert("You have removed " + params.user.name + " from the group.")
      // console.log("Group updated: removed member " + params.user.uid)
    })
    .then(()=> {
      navigation.goBack();
    })
    .catch((error) => {
      console.error("Error updating group document: ", error);
    });
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator color="white"></ActivityIndicator>
      </View>
    );
  }
  return (
    <View style={styles.section}>
      <Header
        leftItem={
          <TouchableOpacity
            onPress={()=> {
              navigation.goBack();
            }}
          >
            <Image source={require('../../../assets/icons/back-arrow.png')}/>
          </TouchableOpacity>
        }
      />
      <ScrollView>
        {/* PROFILE IMAGE */}
        <View style={[styles.container, styles.groupInfo]}>
          <CircleImage size="large" image={{uri: params.user.photo}}></CircleImage>
        </View>

        {/* LISTENER NAME */}
        <View style={styles.container}>
          <Text style={styles.textDetail}>{params.user.role}</Text>
          <Text style={styles.listenerName}>{params.user.name}</Text>

          <View style={styles.listenerActions}>
            <TouchableOpacity style={!host ? styles.actionContainer : {display: 'none'}}>
              <Image source={require('../../../assets/icons/crown-white.png')} style={styles.icon}/>
              <Text style={styles.link}>Add as a Host</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionContainer}>
              <Image source={require('../../../assets/icons/volume-up.png')} style={styles.icon}/>
              <Text style={styles.link}>Transfer Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionContainer}
              onPress={removeUserFromGroup}
              >
              <Image style={styles.icon} source={require('../../../assets/icons/remove.png')} style={styles.icon}/>
              <Text style={!host ? styles.link : {display: 'none'}}>Remove From Group</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LISTENER TOP GENRES */}
        <View style={styles.container}>
          <Text style={styles.textDetail}>TOP GENRES</Text>
          <Text style={styles.textLink}>{params.user["music_profile"].genres[0]}, {params.user["music_profile"].genres[1]}, {params.user["music_profile"].genres[2]}</Text>
        </View>

        {/* LISTENER TOP SONGS */}
        <View style={styles.container}>
          <Text style={styles.textDetail}>TOP SONGS</Text>
          {tracks.map((track, i) => (
            <AddTrack key={i} data={track}/>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = EStyleSheet.create({
  section: {
    flex: 1,
    paddingVertical: '$padding1',
    backgroundColor: "#0F0F0F",
    paddingHorizontal: '$padding2',
    width: '100%'
  },
  container: {
    flexDirection: 'column',
    paddingVertical: 24,
  },
  groupInfo:{
    alignSelf:'center', 
    alignItems: 'center',
  },
  listenerName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: '$fontSize3',
    marginTop: '$padding4',
    fontWeight: '600'
  },
  textLink:{
    color: '#FFFFFF',
    fontFamily: 'Poppins_400Regular',
    fontSize: '$fontSize4',
    marginTop: '$padding4',
    textTransform: 'capitalize'
  },
  textDetail: {
    color: '#FFFFFF',
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
    textTransform: 'uppercase'
  },
  link: {
    fontFamily: "Poppins_500Medium",
    color: '#FFFFFF',
    fontSize: '$fontSize5',
  },
  listenerActions: {
    marginTop: '$padding3'
  },
  icon: {
    width: 16,
    height: 'auto',
    resizeMode: 'contain',
    marginRight: 12
  },
  actionContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 16
  }
})