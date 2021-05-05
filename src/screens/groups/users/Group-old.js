import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "firebase";
import "@firebase/firestore";

import VibeCheck from '../../../components/VibeCheck';
import CircleImage from '../../../components/CircleImage';
import SearchBar from '../../../components/SearchBar';
import AddTrack from '../../../components/AddTrack';
import FavArtist from '../../../components/FavArtist';
import FavGenre from '../../../components/FavGenre';
import Throwback from '../../../components/Throwback';

export default function Group({ navigation, ...otherProps }){
//   const { params } = route;
//   const {id } = params;

//   const [groupInfo, setGroupInfo] = useState([]);
//   const [loading, setLoading] = useState();

//   const getGroupData = () => {
//     const docRef = firebase.firestore().collection("playlists").doc(id);

//     docRef.get().then(function(doc){
//         if (doc.exists) {
//           const groupData = doc.data();
//           setGroupInfo(groupData);
//           setTimeout(() => {
//             setLoading(false);
//           }, 50);
//         } else {
//           setLoading(false);
//           console.log("Document not exist");
//         }
//     });
//   };

//   useEffect(() => {
//     const isFocused = navigation.addListener("focus", () => {
//       setLoading(true);
//       firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             getGroupData();
//         } else {
//           setGroupInfo(null);
//           setLoading(false);
//           navigation.navigate("Login");
//         }
//       });
//     });
//     return isFocused;
// }, [groupInfo, loading, navigation]);

//   if (loading) {
//       return (
//         <View style={styles.container}>
//         </View>
//       );
//     }
//     if (!groupInfo) {
//       return (
//         <View style={styles.container}>
//           <Text>Playlist not found!</Text>
//         </View>
//       );
//     }

  
  return (
      <View style={styles.section}>
        <ScrollView>

       
          {/* PROFILE BAR */}
          <View style={styles.container}>
              <View style={styles.block_spacebetween}>
                  <TouchableOpacity style={styles.profileIcon}>
                      
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.settingsIcon}
                      onPress={()=>({})}
                      >

                  </TouchableOpacity>
              </View>
          </View>

          {/* GROUP INFO */}
          <View style={[styles.container, styles.groupInfo]}>
              <CircleImage size="large"></CircleImage>
              <Text style={styles.heading}>The Talking Tulips</Text>
              <TouchableOpacity
                style={styles.listeners}
                onPress={() => {
                  navigation.navigate("Listener Modal");
              }}>
                  <CircleImage size="small" style={styles.leftCircle}></CircleImage>
                  <CircleImage size="small" style={styles.rightCircle}></CircleImage>
                  <CircleImage size="small" style={styles.middleCircle}></CircleImage>
                  <Text style={styles.textLink}>13 Listeners</Text>
              </TouchableOpacity>
              
              <Text style={styles.textDetail}>Host • Dwayne the Rock Johnson</Text>
              <View style={styles.speaker}>
                {/* <Image></Image> */}
                <Text style={styles.textDetail}>• Groot</Text>
              </View>
              

          </View>

          {/* NOW PLAYING */}
          <View style={styles.container}>
            <Text style={styles.textDetail}>NOW PLAYING</Text>
              <View style={styles.block_groupList}>
                  <AddTrack data={{track:'ORANGE SODA', artist:'Baby Keem'}}></AddTrack>
              </View>
          </View>

          {/* REQUEST SONG */}
          <View style={styles.container}>
            <Text style={styles.textDetail}>REQUEST SONGS</Text>
              <TouchableOpacity
                 onPress={() => {
                  navigation.navigate("Search Modal");
              }}>
                <SearchBar bgColor="pink"></SearchBar> 
              </TouchableOpacity>
              
          </View>

          {/* GROUP FEED */}
          <View style={styles.container}>
            <Text style={styles.textDetail}>GROUP FEED</Text>

          <VibeCheck></VibeCheck>
          <FavArtist></FavArtist>
          <FavGenre></FavGenre>
          <Throwback></Throwback>
             
          </View>
          </ScrollView>
      </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenPadding = 25;

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#0F0F0F",
        paddingHorizontal: screenPadding,
        // paddingVertical: screenPadding,

    },
    container: {
        flexDirection: 'column',
        width: windowWidth - (screenPadding*2),
        borderWidth: 1,
        borderColor: 'red',
        paddingVertical: 20,
    },
    block_groupList: {
        width: '100%',
    },
    block_spacebetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'green',
        
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
    groupInfo:{
      alignSelf:'center', 
      alignItems: 'center',
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
        color: '#FFFFFF',
        fontSize: 30,
        marginTop: 40,
        fontWeight: '600'
    },
    textLink:{
      color: '#FFFFFF',
      fontSize: 16,
      textDecorationLine: 'underline',
      paddingVertical: 10,

    },
    textDetail: {
        marginTop: '$padding5',
        color: '#FFFFFF',
        fontSize: 10,
    },
    listeners:{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '$padding5',
    },
    leftCircle:{
      backgroundColor: 'blue',
      borderRadius: 60,
    },
    rightCircle:{
      backgroundColor: 'red',
      borderRadius: 60,
      left: 17
    },
    middleCircle:{
      backgroundColor: 'green',
      borderRadius: 60,
      right: 34
    },
    
    speaker:{
      flexDirection: 'row'
    }
})