import React, {useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Dimensions, Share, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SpotifyWebAPI from 'spotify-web-api-js';

import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "firebase";
import "@firebase/firestore";
import * as Linking from 'expo-linking';

import MediaPlayer from '../../../components/MediaPlayer';
import CircleImage from '../../../components/CircleImage';
import SearchBar from '../../../components/SearchBar';
import FavArtist from '../../../components/FavArtist';
import FavGenre from '../../../components/FavGenre';
import Header from "../../../components/Header";
import QueueRequest from '../../../components/RequestElement';
import ButtonJoinReq from '../../../components/ButtonJoinReq';
import ButtonGroupSettings from '../../../components/ButtonGroupSettings';
import ButtonFullWidth from '../../../components/ButtonFullWidth';
// import Throwback from '../../../components/Throwback';
// import Feedback from '../../../components/Feedback';

var s = new SpotifyWebAPI();

export default function Group({navigation, route }) {
  console.log(route.params.groupID)
  const [modalVisible, setModalVisible] = useState(true);
  const [expiryWarning, setExpiryWarning] = useState(false);
  const [loading, setLoading] = useState();
  const [collapse, setCollapse] = useState(false);
  
  const [hostInfo, setHostInfo] = useState("");
  const [userID, setUser] = useState();

  var hostGenreArray = [];
  var hostGenrePercentArray = [];
  var hostArtistArray = [];
  var memberGenreArray = [];
  var memberGenrePercentArray = [];
  var memberArtistArray = [];

  let id = '';
  const [groupInfo, setGroupInfo] = useState({});
  let currentGroup = '';
  let currentSong = '';
  const [numUsers, setNumUsers] = useState();

  // const [songRequestArray, setRequestArray] = useState([]);
  const [songReqList, setSongReqList] = useState([]);
  // const [requestImg, setRequestImg] = useState("");
  // const [requestName, setRequestName] = useState("");
  // const [requestArtist, setRequestArtist] = useState("");
  const [reqLength, setReqLength] = useState("");

  const [joinNotificationNumber, setJoinNotificationNumber] = useState('');
  const [notifications, setNotifications] = useState(false);

  const [groupTopArtists, setGroupTopArtists] = useState([]);
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

  useEffect(() => {
    AsyncStorage.getItem('user', (err, result) => {
      setUser(result);
    });

    const isFocused = navigation.addListener("focus", () => {

      AsyncStorage.getItem('group', (err, result) => {
        currentGroup = result;
        
        getGroupInfo(result);

        //JOIN RECS: Firebase notification listener
        firebase.firestore().collection("playlists").doc(result)
        .onSnapshot((doc) => {
          console.log('LISTENING FOR JOIN REQS')
          var obj = doc.data()["join_requests"]

          
          if (obj.length < 1) {
            setNotifications(false)
            setJoinNotificationNumber(null)
          }
          else {
            console.log(obj.length)
            setJoinNotificationNumber(obj.length)
            setNotifications(true)
          }

          console.log('listening for song requests')

          var songReqs = doc.data()["song_requests"]
          
          console.log(songReqs.length)

          //pull request data
          if (songReqs.length >= 3 ){
            getTracks(songReqs.slice(0,3));
          }
          else (
            getTracks(songReqs)
          )

          setReqLength(songReqs.length);

          //CHECK IF GROUP ENDS
          //Timestamps in milliseconds
          var timestamp = doc.data()["timestamp"].toMillis(); //firebase timestamp
          var expiryDate = timestamp + 86399040; //expiry date is 24 Hrs after group is created
          var warningStarts = expiryDate - 600000; //expiry date is 10 Mins before Expiry date
          let currentDate = new Date().getTime(); //current date and time
  
          //Viewing datetimes in console
          // var edate = new Date(expiryDate);
          // var wdate = new Date(warningStarts);
          // var cdate = new Date(currentDate);

          // console.log("timestamp: "+doc.data()["timestamp"].toDate());
          // console.log("expiry date: "+ edate.toString());
          // console.log("warning date: "+ wdate.toString());
          // console.log("current date: "+ cdate.toString());

          checkExpiry(currentDate, warningStarts, expiryDate);
          

        }); // listener


      }) // async get
    }); // isFocused
    
    return isFocused;
  }, [hostInfo, loading, navigation, currentGroup]);

  function checkExpiry(currentTime, warningTime, expiryTime){

    //if current time is greater than expiry date send warning
    if(currentTime >= warningTime && currentTime < expiryTime){
      setExpiryWarning(true);
    }
    //deletes group if over expiry time
    else if (currentTime >= expiryTime){

      //deletes group
      AsyncStorage.getItem('group', (err, result) => {

        // get all members of group
        firebase.firestore().collection('playlists').doc(result)
        .get().then((doc) => {
          if (doc.exists) { 

            var hostID = doc.data().host; 
            var numOfMembers = doc.data().members.length;
            var memberArray = [];

            if (numOfMembers != 0){
              for (var x = 0; x < numOfMembers; x++){
                memberArray.push(doc.data().members[x]);
              }

              // loop through and remove group and group role from user document
              for(var y= 0; y < numOfMembers; y++){

                firebase.firestore().collection("users").doc(memberArray[y])
                .update({
                  group: '',
                  groupRole: ''
                })
                .then(() => {
                  console.log("Users successfully updated: roles and group removed for "+memberArray[y]);
                })
                .catch((error) => {
                  console.error("Error updating user document: ", error);
                });

              }
            }

            // remove group and group role from host document
            firebase.firestore().collection("users").doc(hostID)
            .update({
              group: '',
              groupRole: ''
            })
            .then(() => {
              console.log("Host document successfully updated: group removed");
              alert("The group has been deleted.\nNow you can create or join another!")
            })
            .catch((error) => {
              console.error("Error updating user document: ", error);
            });

            // remove group from FB
            setTimeout(() => {
              firebase.firestore().collection('playlists').doc(result)
              .delete().then(() => {
                console.log(result+" successfully deleted!");
              }).catch((error) => {
                console.error("Error removing Group: ", error);
              });
            }, 900);


          } else {
            console.log("No such document!"); // doc.data() will be undefined in this case
          }

        }).catch((error) => {
          console.log("Error getting document:", error);
        });


        AsyncStorage.setItem('group', 'none');
        AsyncStorage.setItem('isHost', 'false');

      })
    }

  }

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
        currentSong = group["current_song"];

        let imageRef = firebase.storage().ref(`images/groups/group_${id}.jpg`);

        imageRef
        .getDownloadURL()
        .then((url) => {
          // console.log("URL: " + url)
          group["photo"] = url
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));

        setNumUsers(group['members'].length)

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

  function getHostInfo(group) {
    const docRef = firebase.firestore().collection("users").doc(group['host']);
                
    docRef.get().then(function(doc){
      if (doc.exists) {
        var doc = doc.data();
        var hostMusic = {};
        
        //pull from host music profile
        firebase.firestore().collection("user-music-profile").where("user", "==", group['host'])
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log("getting host music profile")
            
            //pull genre data
            hostGenreArray = doc.data().genres;
            hostGenrePercentArray = doc.data().genre_percents;

            //  pull artist data
            hostArtistArray = doc.data().top_artists;

            hostMusic = {
              genres: doc.data().genres.slice(0,3),
              top_artists: doc.data().top_artists.slice(0,3),
              top_tracks: doc.data().top_tracks.slice(0,3)
            }
          });
        })
        .catch((error) => {
          console.log("Error getting host music profile: ", error);
        });

        // get host photo
        let imageRef = firebase.storage().ref(`images/users/${doc["uid"]}.jpg`);
    
        imageRef
        .getDownloadURL()
        .then((url) => {
          // console.log(hostMusic)
          console.log("host photo")
          doc["photo"] = url;
          doc["music-profile"] = hostMusic;

          setHostInfo(doc)
        })
        .then(()=> {

          console.log('trigger getMemberMusicProfiles')
          
          if (group["members"].length != 0) {
            return getMemberMusicProfile(group);
          } else {
            console.log('no members yet')
            return setLoading(false)
          }
          
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
      }
      else {
        setLoading(false);
        console.log("Host document not exist");
      }
    })
    .catch((error) => {
      console.log('error getting host info: ' + error)
    });
  }

  function getMemberMusicProfile(group) {
    firebase.firestore().collection("user-music-profile").where("user", "==", group["members"][0])
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log('getting member music profile')

        //pull genre data
        var x = doc.data().genres
        var y = doc.data().genre_percents
    
        //  pull artist data
        var z = doc.data().top_artists;
        
        memberGenreArray = x;
        memberGenrePercentArray = y;
        memberArtistArray = z;
      });
    })
    .then(()=> {
      getGroupTopArtists(group);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }
  
  //CALCULATE TOP ARTISTS
  function getGroupTopArtists(group) {
    var topArtists = [];

    console.log("checking for top artist matches")

    // compare top artists between host and member
    for (var i = 0; i < hostArtistArray.length; i++){
      for (var j = 0; j < memberArtistArray.length; j++){
        
        //if artists match push it to array
        if (hostArtistArray[i] == memberArtistArray[j]){
          topArtists.push(memberArtistArray[j]);
          // console.log('top artist match')
        }

      }
    }
        
    //If matches push top artists to Firebase
    if (topArtists.length != 0) return getArtistInfo(topArtists, group);
    if (topArtists.length == 0) return getGroupTopGenres(group);
  }

  const getArtistInfo = (groupTopArtists, group) => {
    var favArtistName = [];
    var favArtistImage = [];

    s.getArtists([ groupTopArtists[0], groupTopArtists[1], groupTopArtists[2]] , function(err, data){
      if (err) console.error(err);
      else{
        console.log('getting fav artists')

        for (var m = 0; m < 3; m++){
          favArtistName.push(data.artists[m].name);
          favArtistImage.push(data.artists[m].images[2].url)
        }
        setSortedTopArtists(favArtistName);
        setTopArtistImgs(favArtistImage);

        firebase.firestore().collection("playlists").doc(group["groupID"])
        .update({
          top_artists: favArtistName,
          top_artists_images: favArtistImage,
        })
        .then(() => {
          console.log("Top Artists successfully updated!");
          getGroupTopGenres(group);
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      }
    })
  }

  function getGroupTopGenres(group) {
    //CALCULATE TOP GENRES
    var genreMatches = [];
    var topGenres = [];
    var topGweight = [];

    console.log('checking for top genre matches')

    // host and member genres
    for (var i=0; i <= hostGenreArray.length - 1; i++){ //loop through host
      for (var j=0; j <= memberGenreArray.length - 1; j++){ // loop through member

        // if there is a match between genres
        if ( hostGenreArray[i] == memberGenreArray[j] ) {

          var sum = memberGenrePercentArray[j] + hostGenrePercentArray[j];

          var weight = Math.ceil(sum/2);

          genreMatches.push(memberGenreArray[j]);
          topGenres.push(memberGenreArray[j]);
          topGweight.push(weight);
        }
      }
    }

    //Push top genres to firebase
    firebase.firestore().collection("playlists").doc(group["groupID"])
    .update({
      top_genres: genreMatches,
      top_genre_percents: topGweight,
    })
    .then(() => {
      console.log("Top Genres successfully updated!");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });

    //change top 3 weights to be 'out of 100'
    var topWeights = [];
    var totalSortedWeights = Math.ceil(topGweight[0]+topGweight[1]+topGweight[2]);

    for (var l = 0; l <= 2 ; l++) {
      var newSortedWeight = Math.ceil((topGweight[l]/totalSortedWeights)*100);
      topWeights.push( newSortedWeight );
    }

    // set top 3 genre matches
    setSortedGNames(topGenres.slice(0, 3));
    setSortedGWeight(topWeights);

    getQueue(genreMatches, group);
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

  function getTracks(songReqs) {
    // console.log("song reqs: "+songReqs)

      s.getTracks([songReqs], function(err, data){
        if (err) console.log("please make a song request");
        else{
          // var rImgArray = [];
          // var rNameArray = [];
          // var rArtistArray = [];
          var songReqList = [];
  
          for (var z = 0; z <= songReqs.length - 1; z++){
            var artistBundle = [];
            
            for(var y=0; y <= data.tracks[z].artists.length -1; y++){
              // console.log(data.tracks[z].artists[y].name)
              artistBundle.push(data.tracks[z].artists[y].name );
            }
  
            var song = {
              key: z,
              image: data.tracks[z].album.images[2].url,
              artist: artistBundle,
              name: data.tracks[z].name,
              song_id: data.tracks[z].id,
            };
  
            // rImgArray.push(data.tracks[z].album.images[2].url)
            // rNameArray.push(data.tracks[z].name);
            // rArtistArray.push([artistBundle]);
            songReqList.push(song)
          }
          // console.log(songReqList)
  
          setSongReqList(songReqList)
          // setRequestImg(rImgArray);
          // setRequestName(rNameArray);
          // setRequestArtist(rArtistArray)
        }
      })
  }

  const uri = Linking.createURL('', {
    queryParams: { groupID: groupInfo["groupID"] },
  }); 
  
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
        // 'com.apple.UIKit.activity.CopyToPasteboard',
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
        // 'com.apple.mobilenotes.SharingExtension',
        'com.apple.mobileslideshow.StreamShareService',
        'com.linkedin.LinkedIn.ShareExtension',
        'pinterest.ShareExtension',
        'com.google.GooglePlus.ShareExtension',
        'com.tumblr.tumblr.Share-With-Tumblr',
        // 'net.whatsapp.WhatsApp.ShareExtension', //WhatsApp
        ],
      });
  
      if (result.action === Share.sharedAction) {
        alert("Post Shared")
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("share cancelled")
      }
    }
    catch (error) {
      alert(error.message);
    }
  };

  // Collapse group feed cards
  const collapseCard = () => {
    collapse ? setCollapse(false) : setCollapse(true)
  }
    
    // getSongReqs();
  if (loading) {
    return (
      <View style={styles.section}>
        <Text>TESTING</Text>
        <ActivityIndicator color="green" />
      </View>
    );
  }
  else {
    return (
      <View>
        { (expiryWarning == true) 
        ?
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >

          <View style={styles.centeredView}>
            <View style={styles.modalView}> 
              <CircleImage image={require('../../../../assets/emojis/grimacing-face.png')} size="medlarge" style={styles.centerAlign}/>
              <Text style={styles.modalText}>This Group will be Ending Soon</Text>
              <Text style={styles.modalDetail}>Want to keep Vibing? You can always create a new Group on the Home screen</Text>

              
              <ButtonFullWidth
                label="Sounds Good"
                backgroundColor="$bg_black"
                color="$white"
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
        :
        <></>
        }
        
        <ScrollView>
          <View style={styles.section}>
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
  
                {/* <CircleImage size="small" style={styles.leftCircle} image={require('../../../../assets/emojis/beaming-face.png')}/> */}
                <CircleImage size="small" style={styles.rightCircle} image={require('../../../../assets/emojis/smiling-face.png')}/>
                <CircleImage size="small" style={styles.middleCircle} image={require('../../../../assets/emojis/embarrassed-face.png')}/>
    
                <Text style={styles.textLink}>{numUsers + 1} Listeners</Text>
              </TouchableOpacity>
  
              {/* HOST */}
              <View style={[styles.row, {marginTop: 8}]}>
                <Image style={styles.icon} source={require('../../../../assets/icons/crown-white.png')}/>
                <Text style={styles.textDetail}>Host • {hostInfo["name_first"]}</Text>
              </View>
              
              {/* AUDIO */}
              <View style={[styles.row, {marginTop: 8}]}>
                <Image style={styles.icon} source={require('../../../../assets/icons/volume-up.png')}/>
                <Text style={styles.textDetail}>Audio • Groot</Text>
              </View>
  
              {/* JOIN REQUESTS / GROUP SETTINGS */}
              <View style={styles.tabRow}>
                <ButtonJoinReq 
                  reqs={notifications}
                  notifNumber={joinNotificationNumber}
                  onPress={() => {
                    navigation.navigate("My Group", {screen: "Join Req Modal", params: {groupID: groupInfo["groupID"]} });
                  }}
                />
                <ButtonGroupSettings
                  onPress={() => {
                    navigation.navigate("My Group", {screen: "Grp Settings Modal", params: {groupInfo: groupInfo}});
                  }}
                />
              </View>          
  
              {/* REQUEST SONG */}
              <View style={styles.container}>
                <Text style={styles.textDetail}>ADD SONGS TO QUEUE</Text>
                <TouchableOpacity
                  onPress={() => {
                  navigation.navigate("My Group", {screen: "Search Modal"});
                }}>
                  <SearchBar bgColor="pink" editable="false" />
                </TouchableOpacity>

                { (numUsers == 0) ?
                  <View style={styles.songreqContainer}>
                    <Text style={[styles.heading, {marginTop: 4}]}>Curious about your group's musical profile?</Text>
                    <Text style={[styles.textDetail, {fontSize: 16, marginTop: 24, color: "#d1d1d1"}]}>Then you gotta invite friends to your group!</Text>
                    <ButtonFullWidth
                      label="Invite Friends"
                      backgroundColor="$blue_light"
                      color="$bg_black"
                      style={{marginTop: 40}}
                      onPress={onShare}
                    />
                  </View>
                  :
                  <>
                  <View style={styles.songreqContainer}>
                    <View style={styles.row}>
                      <Text style={styles.srHeading}>Song Requests</Text>
                      <TouchableOpacity
                        style={[styles.exit_icon, !collapse ? {transform: [{ rotate: '0deg' }]} : {transform: [{ rotate: '180deg' }]} ]}
                        onPress={collapseCard}
                      >
                        <Image source={require('../../../../assets/icons/up-arrow.png')}/>
                      </TouchableOpacity>
                    </View>  

                    <Text style={styles.srTextDetail}>{reqLength} Pending Requests</Text>
                    
                    <View style={!collapse ? styles.songReqDetails : { display:'none' }}>
                      {/* MAP OUT SONG REQUESTS, must save song request info (name, img, artist) to object first */}
                      { (songReqList.length == 0)
                      ?
                      <></>
                      : 
                      <> 
                      {songReqList.map((song, i) => (
                        <QueueRequest key={i} data={song}/>
                      ))}
                        {/* <QueueRequest data={[
                          { key:1, image: requestImg[0], name: requestName[0], artist: requestArtist[0] },
                          { key:2, image: requestImg[1], name: requestName[1], artist: requestArtist[1] },
                          { key:3, image: requestImg[2], name: requestName[2], artist: requestArtist[2] }
                        ]}/> */}
                        <TouchableOpacity
                          style={{}}
                          onPress={() => {
                            navigation.navigate("Song Req Modal", {params: groupInfo['groupID']});
                          }}>
                          <Text style={[styles.srTextDetail,{textDecorationLine: 'underline'}]}>View All</Text>
                        </TouchableOpacity>
                      </>
                      }
                    </View>
                  </View>
  
                  {/* GROUP FEED */}
                  <View style={styles.container}>
                    <Text style={styles.textDetail}>GROUP FEED</Text>
                    {/* <Feedback /> */}
                    <FavArtist data={{ title: groupInfo["playlist_name"], img1: topArtistImgs[0], artist1: sortedTopArtists[0], img2:topArtistImgs[1], artist2:sortedTopArtists[1], img3:topArtistImgs[2], artist3: sortedTopArtists[2]  }} />
                    <FavGenre data={{ title:groupInfo["playlist_name"], pcent1:sortedGWeight[0], genre1:sortedGNames[0], pcent2:sortedGWeight[1], genre2:sortedGNames[1], pcent3:sortedGWeight[2], genre3:sortedGNames[2]}} />
                    {/* <Throwback />   */}
                  </View>
                  </>
                }
              </View>
            </View>
          </View>
        </ScrollView>

        { (numUsers == 0) ?
        <View style={styles.mediaPlayer}>
          <MediaPlayer active="group"/>
        </View>
        : <></>
        }
      </View>
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
      paddingBottom: 160
    },
    container: {
      width: '100%',
      // height: height,
      paddingTop: '$padding1',
    },
    groupInfo:{
      width: '100%',
      alignSelf:'center', 
      alignItems: 'center',
    },
    block_groupList: {
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
    subheading: {
      fontSize: 16,
      color: '$light_grey',
      fontFamily: 'Poppins_300Light',
      paddingVertical: '$padding3'
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
      fontSize: '$fontSize6',
      fontFamily: 'Poppins_400Regular',
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
    mediaPlayer:{
      zIndex: 1,
      position: 'absolute',
      width: windowWidth,
      bottom: 0
    },
    icon: {
      width: 16,
      height: 16,
      resizeMode: 'contain',
      marginRight: 8
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