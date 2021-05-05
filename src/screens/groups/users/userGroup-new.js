import React, {useEffect, useState, useLayoutEffect} from 'react';
import { Modal, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, Image, ScrollView, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "firebase"; 
import "@firebase/firestore";
import SpotifyWebAPI from 'spotify-web-api-js';

import FavArtist from '../../../components/FavArtist';
import CircleImage from '../../../components/CircleImage';
import SearchBar from '../../../components/SearchBar';
import CurrentSong from '../../../components/CurrentSong';
import FavGenre from '../../../components/FavGenre';
// import VibeCheck from '../../../components/VibeCheck';
// import Throwback from '../../../components/Throwback';

import Header from "../../../components/Header";
import ButtonFullWidth from '../../../components/ButtonFullWidth';
import ButtonText from "../../../components/ButtonText";

var s = new SpotifyWebAPI();

export default function Group({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [collapse, setCollapse] = useState(false);
  
  const [hostInfo, setHostInfo] = useState("");
  // const [userID, setUser] = useState();
  var userID = '';

  const [albumArt, setAlbumArt] = useState("");
  const [currTrack, setCurrTrack] = useState([]);
  const [currArtist, setCurrArtist] = useState([]);
  const [sortedTopArtists, setSortedTopArtists] = useState([]);
  const [topArtistImgs, setTopArtistImgs] = useState([]);
  const [sortedGNames, setSortedGNames] = useState([]);
  const [sortedGWeight, setSortedGWeight] = useState([0, 0, 0]);

  let id = '';
  const [groupInfo, setGroupInfo] = useState({});
  let currentGroup = '';
  let currentSong = '';

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

  AsyncStorage.getItem('user', (err, result) => {
    // setUser(result);
    userID = result;
  });

  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {

      AsyncStorage.getItem('group', (err, result) => {
        currentGroup = result;
        
        getGroupInfo(result);
      })
    });
    
    return isFocused;
  }, [hostInfo, loading, navigation, currentGroup]);

  function getGroupInfo(id) {
    console.log("-----setParams-----")
    // console.log("setParams, group: " + id)
    // console.log("setParams, current group: " + currentGroup)

    const docRef = firebase.firestore().collection("playlists").doc(id);

    docRef.get().then((doc) => {
      if (doc.exists) {
        var group = doc.data();
        
        group["groupID"] = id;
        group["currentGroup"] = currentGroup;
        
        let imageRef = firebase.storage().ref(`images/groups/group_${id}.jpg`);

        imageRef
        .getDownloadURL()
        .then((url) => {
          // console.log("URL: " + url)
          group["photo"] = url
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));

        setGroupInfo(group)

      } else {
        console.log("No such document: group info");
      }
      return group
    }).then((group)=> {
      getHostInfo(group);
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  // const checkUser = (id, group) =>{
  //   // check active user's group against group page ID

  //   if (id == group["groupID"]) return setModalVisible(false), getHostInfo(group)
  //   if (id != group["groupID"]) return console.log("No match"), setModalVisible(true), getHostInfo(group)
  // }

  function getHostInfo(group) {
    console.log("----------get host info----------")
    const docRef = firebase.firestore().collection("users").doc(group['host']);

    docRef.get().then(function(doc){
      if (doc.exists) {
        var doc = doc.data();
        console.log(doc)

        let imageRef = firebase.storage().ref(`images/users/${doc["uid"]}.jpg`);
    
        imageRef
        .getDownloadURL()
        .then((url) => {
          // console.log("URL: " + url)
          doc["photo"] = url

          setHostInfo(doc)
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
      } else {
        console.log("Document not exist");
      }
      })
      .then(()=> {
        getMusicInfo(group);
      }).catch((error) => {
      console.log("error getting host info: " + error)
      });
  }

  function getMusicInfo(group) {
    console.log("getMusicInfo")
    
    firebase.firestore().collection("playlists").doc(group["groupID"])
    .onSnapshot((doc) => {
      if (doc.exists) {

        //GET CURRENT TRACK
        if (doc.data().current_song != undefined){
          s.getTrack( doc.data().current_song , function(err, data){
            if (err) console.error("No current track");

            else{
              setAlbumArt(data.album.images[2].url)
              setCurrTrack(data.name);
              setCurrArtist(data.artists[0].name);
            } 
          })
        }
        else {
          currentSong = ''
          console.log('no current track')
        }

        // GET TOP 3 ARTISTS AND GENRES
        var topArtists = doc.data().top_artists;
        var imgs = doc.data().top_artists_images;
  
        // if topArtists is not empty
        if (topArtists != '') {
          setSortedTopArtists(topArtists), setTopArtistImgs(imgs);
        } 
  
        // CALCULATE TOP GENRE WEIGHT + PERCENTAGE
        var topGenresNames = doc.data().top_genres;
        var topGenresWeight = doc.data().top_genre_percents;
  
        if (topGenresNames != undefined && topGenresWeight != undefined) {
          var topWeights = [];
          
          //change top 3 weights to be 'out of 100'
          for (var l = 0; l <= 2 ; l++){
            var totalSortedWeights = Math.ceil(topGenresWeight[0]+topGenresWeight[1]+topGenresWeight[2]);
            var newSortedWeight = Math.ceil((topGenresWeight[l]/totalSortedWeights)*100);
            topWeights.push( newSortedWeight );
          }

          setSortedGNames(topGenresNames.slice(0,3));
          setSortedGWeight(topWeights);

          getQueue(topGenresNames, group);
        }

        setLoading(false)

      } else {
        console.log("No such document!");
      }
    })
  }

   function getQueue(genreMatches, group) {
      
    var d = Math.round((group['danceability'] + Number.EPSILON) * 100) / 100
    var e = Math.round((group['energy'] + Number.EPSILON) * 100) / 100

    var d_min = d - .2
    var e_min = e - .2
    var d_max = d + .1
    var e_max = e + .1

    // add available market

    if (group["queue"].length == 5 || group["queue"].length == 0) {

      if (group["queue"].length == 0) {
        console.log('creating queue')
        //get recommendations and add to queue on firebase
        s.getRecommendations({ seed_genres: `${genreMatches[0]},${genreMatches[1]},${genreMatches[2]},${genreMatches[3]},${genreMatches[4]}`, limit: 50, min_danceability:d_min, max_danceability:d_max, min_energy:e_min, max_energy:e_max }, function(err, data){
          if (err) console.error(err);
          else{
            var queueArray = [];
    
            for (var m = 0; m <= 49; m++){
              queueArray.push(data.tracks[m].id);
            }
    
            firebase.firestore().collection("playlists").doc(group["groupID"]).update({
              queue: queueArray,
            })
            .then(() => {
              console.log("Queue successfully updated!");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });

            // console.log(queueArray)
            setTimeout(()=> {
              setLoading(false)
            }, 500)
          }
        })
      } else if (group["queue"].length == 5){
        console.log('creating queue')
        //get recommendations and add to queue on firebase
        s.getRecommendations({ seed_genres: `${genreMatches[0]},${genreMatches[1]},${genreMatches[2]},${genreMatches[3]},${genreMatches[4]}`, limit: 45, min_danceability:d_min, max_danceability:d_max, min_energy:e_min, max_energy:e_max }, function(err, data){
          if (err) console.error(err);
          else{
            var queueArray = [];
    
            for (var m = 0; m <= 44; m++){
              queueArray.push(data.tracks[m].id);
            }
    
            firebase.firestore().collection("playlists").doc(group["groupID"]).update({
              queue: firebase.firestore.FieldValue.arrayUnion(queueArray),
            })
            .then(() => {
              console.log("Queue successfully updated!");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });

            // console.log(queueArray)
            setTimeout(()=> {
              setLoading(false)
            }, 500)
          }
        })
      }
    } else {
      console.log('queue already exists')
    }

   }

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

  // creates shareable url
  const uri = Linking.createURL('', {
    queryParams: { groupID: groupInfo["groupID"] },
  });

  // collapses card
  const collapseCard = () => {
    collapse ? setCollapse(false) : setCollapse(true)
  }

  return (       
    <ScrollView>
      <View style={styles.section}>

        { loading
        ? <View style={[styles.container, {alignItems: 'center', justifyContent:'center'}]}>
            <ActivityIndicator color='#92EABD'/>
          </View>
        :
        <>

        <Header 
          rightItem={
            <TouchableOpacity
            onPress={onShare}>
              <Image style={styles.icon_share} source={require('../../../../assets/icons/share.png')}/>
            </TouchableOpacity>
          }
          leftItem={
            <TouchableOpacity
            onPress={()=> {
              navigation.openDrawer()
            }}
            >
            <Image style={styles.icon_menu} source={require('../../../../assets/icons/menu.png')}/>
            </TouchableOpacity>
          }
        />

        {/* GROUP INFO */}
        <View style={styles.groupInfo}>
          <CircleImage size="large" image={{uri: groupInfo["photo"]}}/>

          <View style={[styles.row, {marginTop: 40}]}>
            <Text style={styles.heading}>{groupInfo["playlist_name"]}</Text>
            {groupInfo["private"] && <Image style={styles.icon} source={require('../../../../assets/icons/lock.png')}/>}
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
            <Image source={require('../../../../assets/icons/crown-white.png')} style={styles.icon}/>
            <Text style={styles.textDetail}>Host • {hostInfo["name_first"]}</Text>
          </View>
        
          {/* AUDIO */}
          <View style={[styles.row, {marginTop: 8}]}>
            <Image source={require('../../../../assets/icons/volume-up.png')} style={styles.icon}/>
            <Text style={styles.textDetail}>Audio • Groot</Text>
          </View>
        </View>

        {/* NOW PLAYING */}
        <View style={(currentSong != '') ? styles.container : {display: 'none'}}>
          <Text style={styles.textDetail}>NOW PLAYING</Text>
          <TouchableOpacity
            onPress={() => {
            navigation.navigate("Queue Modal");
            }}
            >
            <View style={styles.block_groupList}>
              <CurrentSong data={{image:albumArt, name:currTrack, artist:currArtist}}/>
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
              }
            >
              <SearchBar bgColor="pink" editable="false"/>
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
      </>
      }
    </View>
    </ScrollView>

  )
}

const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
  section: {
    flex: 1,
    paddingTop: '$padding1',
    backgroundColor: "#0F0F0F",
    paddingHorizontal: '$padding2',
    paddingBottom: 120,
    minHeight: Dimensions.get('window').height
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
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8
  },
  mediaPlayer:{
    zIndex: 1,
    position: 'absolute',
    width:windowWidth,
    bottom: 0
  },
  bold: {
    fontFamily: 'Poppins_600SemiBold'
  },
  icon_share: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  icon_menu: {
    width: 20,
    height: 12,
    resizeMode: 'contain'
  },
})