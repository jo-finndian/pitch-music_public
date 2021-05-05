import React, {useEffect, useState, createRef, useLayoutEffect} from 'react';
import { Modal, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, Image, ScrollView, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "firebase"; 
import "@firebase/firestore";
import SpotifyWebAPI from 'spotify-web-api-js';

// import VibeCheck from '../../../components/VibeCheck';
import FavArtist from '../../../components/FavArtist';
import CircleImage from '../../../components/CircleImage';
import SearchBar from '../../../components/SearchBar';
import CurrentSong from '../../../components/CurrentSong';
import FavGenre from '../../../components/FavGenre';
// import Throwback from '../../../components/Throwback';
import Header from "../../../components/Header";
import ButtonFullWidth from '../../../components/ButtonFullWidth';
import ButtonText from "../../../components/ButtonText";

var s = new SpotifyWebAPI();

export default function Group({ navigation, route }){
  const { groupInfo } = '';

  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState();
  const [collapse, setCollapse] = useState(false);
  
  const [hostInfo, setHostInfo] = useState("");
  const [userID, setUser] = useState(false);
  const [currentGroup, setCurrentGroup] = useState();

  const [albumArt, setAlbumArt] = useState("");
  const [currTrack, setCurrTrack] = useState([]);
  const [currArtist, setCurrArtist] = useState([]);
  const [sortedTopArtists, setSortedTopArtists] = useState([]);
  const [topArtistImgs, setTopArtistImgs] = useState([]);
  const [sortedGNames, setSortedGNames] = useState([]);
  const [sortedGWeight, setSortedGWeight] = useState([0, 0, 0]);

  //refresh and set access token
  AsyncStorage.getItem('expirationTime', (err, result) => {
    if (new Date().getTime() > result) {
       refreshTokens();
      AsyncStorage.getItem('accessToken', (err, result) => {
        console.log("new token "+result);
      });
      s.setAccessToken(result);
    }
  })
  
  // creates shareable url
  const uri = Linking.createURL('', {
    queryParams: { groupID: groupInfo["groupID"] },
  });

  // send join request for private group to firebase
  const sendJoinRequest = () => {
    firebase.firestore().collection("users").doc(userID)
    .onSnapshot(documentSnapshot => {
      const doc = documentSnapshot.data();

      if (doc["group"]) {
        alert("You are already in a group.\nYou must leave that group before joining another.")
      }
      else {
        return new Promise(async() => {
          var playlist = firebase.firestore().collection("playlists").doc(groupInfo["groupID"]);

          const joinReq = {
            user: userID,
          }

          return playlist.update({
            join_requests: firebase.firestore.FieldValue.arrayUnion(joinReq)
          })
          .then(() => {
            alert("Join request sent")
          })
          .then(() => {
            setModalVisible(false)
            navigation.navigate("Home", {screen: "Home"});
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
    var userRef = firebase.firestore().collection("users").doc(userID);
    var playlistRef = firebase.firestore().collection("playlists").doc(groupInfo['groupID']);

    setCurrentGroup(groupInfo['groupID'])

    userRef.update({
      group: groupInfo['groupID'],
      groupRole: 'listener'
    })
    .then(() => {
      console.log("User group + group role successfully updated!");
      // setModalVisible(false)
    })
    .catch((error) => {
      console.error("Error updating user document: ", error);
    });

    return playlistRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(userID)
    })
    .then(() => {
      console.log("Playlist members updated successfully!");
      console.log("Triggering getMusicInfo");
      getMusicInfo()
      setModalVisible(false)
    })
    .catch((error) => {
      console.error("Error updating playlist members: ", error);
    });
  }

  // collapses card
  const collapseCard = () => {
    collapse ? setCollapse(false) : setCollapse(true)
  }

  // get current track for queue
  useEffect(() => {
    if (currentGroup == groupInfo["groupID"]) {
      const docRef = firebase.firestore().collection("playlists").doc(groupInfo['groupID']);
      //CURRENT TRACK
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().current_song);
  
          s.getTrack( doc.data().current_song , function(err, data){
            if (err) console.error(err);
            else{
              setAlbumArt(data.album.images[2].url)
              setCurrTrack(data.name);
              setCurrArtist(data.artists[0].name);
            } 
          })
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }
  }, []);

  // runs on page load, gets host info and allows time for other async tasks to run so that UI can load properly
  useEffect(() => {
    AsyncStorage.getItem('user', (err, result) => {
      setUser(result);
    });

    const isFocused = navigation.addListener("focus", () => {
      setLoading(true);

      console.log("User's Current Group: " + currentGroup)
      console.log("Group ID: " + groupInfo['groupID'])
      
      // check active user's group against group page ID
      if (currentGroup == groupInfo["groupID"]) {
        console.log('match')

        setModalVisible(false)
        
        // get host info
        const docRef = firebase.firestore().collection("users").doc(groupInfo['host']);
    
        docRef.get().then(function(doc){
          if (doc.exists) {
            var doc = doc.data();

            let imageRef = firebase.storage().ref(`images/users/${doc["uid"]}.jpg`);
          
            imageRef
            .getDownloadURL()
            .then((url) => {
              console.log("URL: " + url)

              doc["photo"] = url

              setHostInfo(doc)
            })
            .catch((e) => console.log('getting downloadURL of image error => ', e));
            
            setTimeout(() => {
              setLoading(false);
            }, 500);
          } else {
            setLoading(false);
            console.log("Document not exist");
          }
        }).then(()=> {
          getMusicInfo();
        }).catch((error) => {
          console.log("error getting host info")
        });
        // setLoading(false)
      }
      else {
        setLoading(false)
        console.log('no match')
        
      }
    });

    return isFocused;
  }, [groupInfo, hostInfo, loading, navigation, currentGroup]);

  // share group
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Join our group on Pitch – click here to join!\n",
        title: `Join ${groupInfo["playlist_name"]} on Pitch.`,
        url: uri
      },
      {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToFirefox',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          'com.apple.mobileslideshow.StreamShareService',
          'com.linkedin.LinkedIn.ShareExtension',
          'pinterest.ShareExtension',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
        ],
      });
  
      if (result.action === Share.sharedAction) {
        alert("Post Shared!")
      } else if (result.action === Share.dismissedAction) {
        console.log("share cancelled")
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  // useEffect(() =>{
  //   // AsyncStorage.getItem( 'group_id', (err, result) =>{
  //     //CURRENT TRACK
  //     firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
  //     .onSnapshot((doc) => {
  //       if (doc.exists) {
  //         //pulls hosts current song
  //         var currentSong = doc.data().current_song;

  //         if(currentSong != undefined){
  //           s.getTrack( currentSong , function(err, data){
  //             if (err) console.error(err);
  //             else{
  //               setAlbumArt(data.album.images[2].url)
  //               setCurrTrack(data.name);
  //               setCurrArtist(data.artists[0].name);
  //             } 
  //           })
  //         }

  //         //pulls top 3 genres & pulls top 3 genre weights
  //         var topArtists = doc.data().top_artists;

  //         if(topArtists != undefined){
  //           s.getArtists([ topArtists[0], topArtists[1], topArtists[2]] , function(err, data){
  //             if (err) console.error(err);
  //             else{
  //               var favArtistName = [];
  //               var favArtistImage = [];
        
  //               for (var m = 0; m < 3; m++){
  //                 favArtistName.push(data.artists[m].name);
  //                 favArtistImage.push(data.artists[m].images[2].url)
  //               }
  //               setSortedTopArtists( favArtistName );
  //               setTopArtistImgs( favArtistImage );
  //             }
  //           })
  //         }

  //         //pulls top 3 genres & pulls top 3 genre weights
  //         var topGenresNames = doc.data().top_genres;
  //         var topGenresWeight = doc.data().top_genre_percent;

  //         if(topGenresNames != undefined && topGenresWeight != undefined){
  //           //change top 3 weights to be 'out of 100'
  //           var topWeights = [];

  //           for(var l = 0; l < 3; l++){
  //             var totalSortedWeights = Math.round(topGenresWeight[0]+topGenresWeight[1]+topGenresWeight[2]);
  //             var newSortedWeight = Math.round((topGenresWeight[l]/totalSortedWeights)*100);
  //             topWeights.push( newSortedWeight );
  //           }
  //           setSortedGNames(topGenresNames);
  //           setSortedGWeight(topWeights);
  //         }


  //       } else {
  //         console.log("No such document!");
  //       }
  //     })

  //   // } );

  // }, []);

  // if (!groupInfo) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Playlist not found!</Text>
  //     </View>
  //   );
  // }

  // useEffect(() =>{
  //   // AsyncStorage.getItem( 'group_id', (err, result) =>{
  //     //CURRENT TRACK
  //     firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
  //     .onSnapshot((doc) => {
  //       if (doc.exists) {
  //         //pulls hosts current song
  //         var currentSong = doc.data().current_song;

  //         if(currentSong != undefined){
  //           s.getTrack( currentSong , function(err, data){
  //             if (err) console.error(err);
  //             else{
  //               setAlbumArt(data.album.images[2].url)
  //               setCurrTrack(data.name);
  //               setCurrArtist(data.artists[0].name);
  //             } 
  //           })
  //         }

  //         //pulls top 3 genres & pulls top 3 genre weights
  //         var topArtists = doc.data().top_artists;

  //         if(topArtists != undefined){
  //           s.getArtists([ topArtists[0], topArtists[1], topArtists[2]] , function(err, data){
  //             if (err) console.error(err);
  //             else{
  //               var favArtistName = [];
  //               var favArtistImage = [];
        
  //               for (var m = 0; m < 3; m++){
  //                 favArtistName.push(data.artists[m].name);
  //                 favArtistImage.push(data.artists[m].images[2].url)
  //               }
  //               setSortedTopArtists( favArtistName );
  //               setTopArtistImgs( favArtistImage );
  //             }
  //           })
  //         }

  //         //pulls top 3 genres & pulls top 3 genre weights
  //         var topGenresNames = doc.data().top_genres;
  //         var topGenresWeight = doc.data().top_genre_percent;

  //         if(topGenresNames != undefined && topGenresWeight != undefined){
  //           //change top 3 weights to be 'out of 100'
  //           var topWeights = [];

  //           for(var l = 0; l < 3; l++){
  //             var totalSortedWeights = Math.round(topGenresWeight[0]+topGenresWeight[1]+topGenresWeight[2]);
  //             var newSortedWeight = Math.round((topGenresWeight[l]/totalSortedWeights)*100);
  //             topWeights.push( newSortedWeight );
  //           }
  //           setSortedGNames(topGenresNames);
  //           setSortedGWeight(topWeights);
  //         }


  //       } else {
  //         console.log("No such document!");
  //       }
  //     })

  //   // } );

  // }, []);


  function getMusicInfo() {
    console.log("getMusicInfo")

    //CURRENT TRACK
    firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
    .onSnapshot((doc) => {
      if (doc.exists) {
        //pulls hosts current song
        var currentSong = doc.data().current_song;
        
        console.log(doc.data())

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
  
        //pulls top 3 genres & pulls top 3 genre weights
        var topArtists = doc.data().top_artists;
  
        if(topArtists != undefined){
          s.getArtists([ topArtists[0], topArtists[1], topArtists[2]] , function(err, data){
            if (err) console.error(err);
            else{
              var favArtistName = [];
              var favArtistImage = [];
      
              for (var m = 0; m < 3; m++){
                favArtistName.push(data.artists[m].name);
                favArtistImage.push(data.artists[m].images[2].url)
              }
              setSortedTopArtists( favArtistName );
              setTopArtistImgs( favArtistImage );
            }
          })
        }
  
        //pulls top 3 genres & pulls top 3 genre weights
        var topGenresNames = doc.data().top_genres;
        var topGenresWeight = doc.data().top_genre_percent;
  
        if(topGenresNames != undefined && topGenresWeight != undefined){
          //change top 3 weights to be 'out of 100'
          var topWeights = [];
  
          for(var l = 0; l < 3; l++){
            var totalSortedWeights = Math.round(topGenresWeight[0]+topGenresWeight[1]+topGenresWeight[2]);
            var newSortedWeight = Math.round((topGenresWeight[l]/totalSortedWeights)*100);
            topWeights.push( newSortedWeight );
          }
          setSortedGNames(topGenresNames);
          setSortedGWeight(topWeights);
        }
  
      } else {
        console.log("No such document!");
      }
      setLoading(false)
    })
  }

  if (!groupInfo) {
    return (
      <View style={styles.container}>
        <Text>Playlist not found!</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator/>
      </View>
    );
  }
  else {
    return (        
      <ScrollView>
        <View style={styles.section}>
  
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
  
            <View style={styles.centeredView}>
              <View style={styles.modalView}> 
                <CircleImage size="medlarge" style={styles.centerAlign} image={{uri: groupInfo["photo"]}}/>
                <Text style={styles.modalText}>Do you want to join {groupInfo['playlist_name']}?</Text>

                {(groupInfo["private"] == true) ?
                  <>
                    <Text style={styles.modalDetail}>Once you send your request, the host will be notified.</Text>
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
                    navigation.navigate("Home", {screen: "Home"});
                  }}
                />
              </View>
            </View>
          </Modal>
          {/* GROUP ENDED MODAL */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>

            <View style={styles.centeredView}>
              <View style={styles.modalView}> 
                <CircleImage image={require('../../../../assets/emojis/embarrassed-face.png')} size="medlarge" style={styles.centerAlign}/>
                {/* eMOJI */}
                <Text style={styles.modalText}>Uh Oh!The Group as been Ended</Text>
                
                <ButtonFullWidth
                  label="Return to Home"
                  backgroundColor="$bg_black"
                  color="$white"
                  onPress={() => {
                    setModalVisible(false)
                    navigation.navigate("Home", {screen: "Home"});
                  }}
                />
              </View>
            </View>
          </Modal>
          {/* END MODAL */}

          <Header 
            rightItem={
              <TouchableOpacity
                onPress={onShare}>
                <Image source={require('../../../../assets/icons/share.png')}/>
              </TouchableOpacity>
            }
            leftItem={
              <TouchableOpacity
                onPress={()=> {
                  navigation.openDrawer()
                }}
              >
                <Image source={require('../../../../assets/icons/menu.png')}/>
              </TouchableOpacity>
            }
          />

          {/* GROUP INFO */}
          <View style={styles.groupInfo}>
            <CircleImage size="large" image={{uri: groupInfo["photo"]}}/>

            <View style={[styles.row, {marginTop: 40}]}>
              <Text style={styles.heading}>{groupInfo["playlist_name"]}</Text>
              {groupInfo["private"] && <Image source={require('../../../../assets/icons/lock.png')}/>}
            </View>

            {/* LISTENERS */}
            <TouchableOpacity
              style={styles.listeners}
              onPress={() => {
                navigation.navigate("Listener Modal", {screen:"Listeners", params: {groupInfo: groupInfo, hostInfo: hostInfo}});
              }}>

              <CircleImage size="small" style={styles.leftCircle} image={require('../../../../assets/emojis/beaming-face.png')}/>
              <CircleImage size="small" style={styles.rightCircle} image={require('../../../../assets/emojis/smiling-face.png')}/>
              <CircleImage size="small" style={styles.middleCircle} image={require('../../../../assets/emojis/embarrassed-face.png')}/>

              <Text style={styles.textLink}>{groupInfo["members"].length + 1} Listeners</Text>
            </TouchableOpacity>

            {/* HOST */}
            <View style={[styles.row, {marginTop: 8}]}>
              <Image source={require('../../../../assets/icons/crown-white.png')}/>
              <Text style={styles.textDetail}>Host • {hostInfo["name_first"]}</Text>
            </View>
            
            {/* AUDIO */}
            <View style={[styles.row, {marginTop: 8}]}>
              <Image source={require('../../../../assets/icons/volume-up.png')}/>
              <Text style={styles.textDetail}>Audio • Groot</Text>
            </View>
          </View>
  
          {/* NOW PLAYING */}
          <View style={styles.container}>
            <Text style={styles.textDetail}>NOW PLAYING</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Queue Modal");
              }}
              >
              <View style={styles.block_groupList}>
                <CurrentSong data={{image:albumArt, name:currTrack, artist:currArtist}}></CurrentSong>
              </View>
            </TouchableOpacity>
          </View>

          {/* REQUEST SONG */}
          <View style={[styles.container, {borderBottomColor: '#464646', borderBottomWidth: 1, paddingBottom: 24}]}>
            <Text style={styles.textDetail}>REQUEST SONGS</Text>
              <TouchableOpacity
                  onPress={() => 
                  // navigation.navigate("My Group", {screen: "Search Modal"});
                  navigation.navigate("Search Modal")
                }>
                <SearchBar bgColor="pink"/>
              </TouchableOpacity>
          </View>

          {/* GROUP FEED */}
          <View style={styles.container}>
            <Text style={styles.textDetail}>GROUP FEED</Text>
            {/* <VibeCheck/> */}
            <FavArtist data={{ title:groupInfo["playlist_name"], img1:topArtistImgs[0], artist1:sortedTopArtists[0], img2:topArtistImgs[1], artist2:sortedTopArtists[1], img3:topArtistImgs[2], artist3:sortedTopArtists[2]  }} />
            <FavGenre data={{ title:groupInfo["playlist_name"], pcent1:sortedGWeight[0], genre1:sortedGNames[0], pcent2:sortedGWeight[1], genre2:sortedGNames[1], pcent3:sortedGWeight[2], genre3:sortedGNames[2]}} />
            {/* <Throwback/> */}
          </View>     
        </View>
      </ScrollView>
    )
  }
}

const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
  section: {
    flex: 1,
    paddingTop: '$padding1',
    backgroundColor: "#0F0F0F",
    paddingHorizontal: '$padding2',
    paddingBottom: 120
  },
  container: {
    width: '100%',
    paddingTop: '$padding2',
  },
  groupInfo:{
    width: '100%',
    alignSelf:'center', 
    alignItems: 'center',
  },
  block_groupList: {
    width: '100%',
    // flexBasis: 'auto',
    marginTop: '$padding4',
  },
  block_spacebetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    alignSelf: 'center',
    paddingVertical: '$padding2',
    textAlign: 'center',
    marginBottom: '$padding1',
  },
  groupIcon:{
    width: '$padding1 * 2',
    height: '$padding1 * 2',
  },
  headerIcon: {
    width: 'auto',
    height: 'auto',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: '$fontSize2',
    fontFamily: 'Poppins_600SemiBold',
    marginRight: '$padding4'
  },
  textLink:{
    color: '#FFFFFF',
    fontSize: '$fontSize4',
    textDecorationLine: 'underline',
    paddingVertical: '$padding5',
    fontFamily: 'Poppins_400Regular',
  },
  textDetail: {
    color: '#FFFFFF',
    fontSize: '$fontSize5',
    fontFamily: 'Poppins_400Regular',
    // marginLeft: '$padding5'
  },
  listeners:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '$padding5',
  },
  rightCircle:{
    borderRadius: 60,
    left: 17
  },
  middleCircle:{
    borderRadius: 60,
    right: 34
  },
  speaker:{
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    borderRadius: 60,
  },
  tabRow:{
    marginTop: '$padding1',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  image:{
    height: 18,
    width: 18,
    backgroundColor: 'lightgray',
    marginBottom: '$padding5',
    borderRadius: 60
  },
  tab:{
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '$white',
    borderRadius: 16,
    paddingTop: '$padding4',
    paddingBottom: '$padding3',
    width: 170,
  },
  songreqContainer: {
    justifyContent: "flex-start",
    marginTop: '$padding1',
    paddingHorizontal: '$padding2',
    paddingVertical: '$padding2',
    backgroundColor: '#252525',
    borderRadius: 30,
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  exit_icon: {
    marginTop: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', 
    right: 0,
  },
  songReqDetails: {
    display: 'flex'
  },
  srHeading: {
    marginTop: 5,
    color: '$white',
    fontSize: '$fontSize1',
    fontFamily: "Poppins_600SemiBold",
    fontWeight: '600'
  },
  srTextDetail: {
    color: '$white',
    fontFamily: "Poppins_400Regular",
    fontSize: '$fontSize5',
    paddingVertical: '$padding4',
  },
  speaker:{
    flexDirection: 'row'
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
  textStyle: {
    color: '$white',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 75,
    fontWeight: '500'
  },
})