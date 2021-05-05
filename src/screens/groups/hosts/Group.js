import React, {useEffect, useState} from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Image, Dimensions, Share } from 'react-native';
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

const Group = ({navigation, route }) => {
  const { groupInfo } = route.params

  const [loading, setLoading] = useState();
  const [collapse, setCollapse] = useState(false);
  // const [expirationTime, setExpirationTime] = useState("");
  // const [musicProfile, setMusicProfile] = useState("");
  
  const [hostInfo, setHostInfo] = useState("");
  var hostGenreArray = [];
  var hostArtistArray = [];
  var memberGenreArray = [];
  var memberArtistArray = [];

  const [songRequestArray, setRequestArray] = useState("");
  const [requestImg, setRequestImg] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestArtist, setRequestArtist] = useState("");
  const [reqLength, setReqLength] = useState("");

  const [joinNotificationNumber, setJoinNotificationNumber] = useState('');
  const [notifications, setNotifications] = useState();
  // const [firstArray, setFirstArray] = useState([]);

  const [groupTopArtists, setGroupTopArtists] = useState([]);
  const [sortedTopArtists, setSortedTopArtists] = useState([]);
  const [topArtistImgs, setTopArtistImgs] = useState([]);
  const [sortedGNames, setSortedGNames] = useState([]);
  const [sortedGWeight, setSortedGWeight] = useState([0, 0, 0]);

  // var v_hostGenreArray = [];
  // var v_hostArtistArray = []; 
  // var genreArray = [];
  // var artistArray = []; 

  AsyncStorage.getItem('accessToken', (err, result) => {
    s.setAccessToken(result);
  });

  const collapseCard = () => {
    collapse ? setCollapse(false) : setCollapse(true)
  }

  useEffect(() => {
    const isFocused = navigation.addListener("focus", () => {
      setLoading(true);

      // get host info
      const docRef = firebase.firestore().collection("users").doc(groupInfo['host']);
        
      docRef.get().then(function(doc){
        if (doc.exists) {
          var doc = doc.data();
          var hostMusic = {};
          
          //pull from host music profile
          firebase.firestore().collection("user-music-profile").where("user", "==", groupInfo['host'])
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log("getting host music profile")
              
              //pull genre data
              hostGenreArray = doc.data().genres;
              // console.log("hostGenreArray")
              // console.log(hostGenreArray)

              //  pull artist data
              hostArtistArray = doc.data().top_artists;
              // console.log("hostArtistArray")
              // console.log(hostArtistArray)

              hostMusic = {
                genres: doc.data().genres.slice(0,3),
                top_artists: doc.data().top_artists.slice(0,3),
                top_tracks: doc.data().top_tracks.slice(0,3)
              }
            });
          })
          .then(()=> {
            console.log('trigger getMemberMusicProfile')
            if (groupInfo["members"].length != 0) return getMemberMusicProfile();
          })
          .catch((error) => {
            console.log("Error getting host music profile: ", error);
          });

          // get host photo
          let imageRef = firebase.storage().ref(`images/users/${doc["uid"]}.jpg`);
        
          imageRef
          .getDownloadURL()
          .then((url) => {
            doc["photo"] = url;
            doc["music_profile"] = hostMusic;
            console.log("host photo and music profile")

            setHostInfo(doc)
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

      //GET SONG REQUESTS
      firebase.firestore().collection("playlists").doc(groupInfo['groupID'])
      .get().then((doc) => {
        if (doc.exists) {

          console.log('getting requests')
          //pull request data
          var requestArray = [];

          if (doc.data().song_requests.length != 0 ){
            for (var x = 0; x < 3; x++){
              requestArray.push( doc.data().song_requests[x] );
            }
          }
          setRequestArray(requestArray); //set requests
          setReqLength(doc.data().song_requests.length);
          
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

      if( songRequestArray.length != 0){
        //get track info
        s.getTracks([songRequestArray], function(err, data){
          if (err) console.error(err);
          else{
            var rImgArray = [];
            var rNameArray = [];
            var rArtistArray = [];
  
            for (var z = 0; z <= 2; z++){
  
              rImgArray.push(data.tracks[z].album.images[2].url)
              rNameArray.push(data.tracks[z].name);
  
              var artistBundle = [];
  
              for(var y=0; y < data.tracks[z].artists.length; y++){
                artistBundle.push(data.tracks[z].artists[y].name );
              }
              
              rArtistArray.push([artistBundle]);
            }
            setRequestImg(rImgArray);
            setRequestName(rNameArray);
            setRequestArtist(rArtistArray)
          }
        })
      }
    })

    return isFocused;

  }, [groupInfo, hostInfo, loading, navigation, songRequestArray, memberArtistArray, hostArtistArray ]);

  function getMemberMusicProfile() {
    firebase.firestore().collection("user-music-profile").where("user", "==", groupInfo["members"][0])
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log('getting member music profile')

        //pull genre data
        var x = doc.data().genres
      
        //  pull artist data
        var y = doc.data().top_artists;
        
        memberGenreArray = x;
        memberArtistArray = y;

        // console.log("memberGenreArray")
        // console.log(memberGenreArray)
        // console.log("memberArtistArray")
        // console.log(memberArtistArray)
      });
    })
    .then(()=> {
      getGroupTopArtists();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }

  const users = groupInfo["members"].length+1;
  
  //CALCULATE TOP ARTISTS
  function getGroupTopArtists() {
    var topArtists = [];

    console.log("checking for top artist matches")
    // console.log("host artist array")
    // console.log(hostArtistArray)
    // console.log("member artist array")
    // console.log(memberArtistArray)

    // compare top artists between host and member
    for (var i = 0; i < hostArtistArray.length; i++){

      for (var j = 0; j < memberArtistArray.length; j++){

        //if artists match push it to array
        if (hostArtistArray[i] == memberArtistArray[j]){
          //calculate common percentage
          topArtists.push(memberArtistArray[j]);
          console.log('top artist match')
        }
      }
      // console.log('looping through artists')
    }
      
    //If matches push top artists to Firebase
    if (topArtists.length != 0) return addTopArtistsToFirebase(topArtists);

    // setLoading(false)
  }

  const addTopArtistsToFirebase = (topArtists) => {
    // console.log(topArtists)
    // for (var k = 0; k <= topArtists.length ; k++) {
      firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
      .update({
        top_artists: topArtists,
      })
      .then(() => {
        console.log("Top Artists successfully updated!");
        getArtistInfo(topArtists);
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    // }
  }

  const getArtistInfo = (groupTopArtists) => {
    console.log(groupTopArtists)
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
      }
      // console.log(favArtistName)
    })
    getGroupTopGenres();
  }

  function getGroupTopGenres() {
    //CALCULATE TOP GENRES
    var genreMatches = [];
    var topGenres = [];
    var topGweight = [];

    console.log('checking for top genre matches')

    console.log(hostGenreArray)
    console.log(memberGenreArray)

    // compare last array and current array
    // for (var i = 0; i < hostGenreArray.length; i++){
    //   for (var j = 0; j < memberGenreArray.length; j++){
    //     //if the genres match push it to the sorted array
    //     if (hostGenreArray[i][0] == memberGenreArray[j]){

    //       //calculate common percentage
    //       var percent = Math.round(((hostGenreArray[i][1] + memberGenreArray[j][1])/2));
          
    //       genreMatches.push([memberGenreArray[j][0], percent]);
    //       topGenres.push(memberGenreArray[j][0]);
    //       topGweight.push(percent);

    //       console.log('genre match: ' + memberGenreArray[j][0])
    //     }
    //     else {
    //       console.log('no genre matches')
    //     }
    //   }
    // }

    setLoading(false)
    // //Push top genres and artists to firebase
    // for(var k = 0; k < genreMatches.slice(0, 3).length; k++){
    //   firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
    //   .update({
    //     top_genres: firebase.firestore.FieldValue.arrayUnion(genreMatches[k][0]),
    //     top_genre_percent: firebase.firestore.FieldValue.arrayUnion(genreMatches[k][1]),
    //     top_artists: firebase.firestore.FieldValue.arrayUnion(favArtistName),
    //     top_artists_images: firebase.firestore.FieldValue.arrayUnion(favArtistImage),
    //   })
    //   .then(() => {
    //     console.log("Top Genres successfully updated!");
    //   })
    //   .catch((error) => {
    //     console.error("Error updating document: ", error);
    //   });
    // }

    // //change top 3 weights to be 'out of 100'
    // var topWeights = [];

    // for(var l = 0; l < topGweight.slice(0, 3).length; l++) {
    //   var totalSortedWeights = Math.round(topGweight[0]+topGweight[1]+topGweight[2]);
    //   var newSortedWeight = Math.round((topGweight[l]/totalSortedWeights)*100);
    //   topWeights.push( newSortedWeight );
    // }

    // // set top 3 genre matches
    // setSortedGNames(topGenres.slice(0, 3));
    // setSortedGWeight(topWeights);

    // getRecs();
    // }
  }

    //only run if sorted genre name ISN'T empty, check if firebase has 49 queue already
    // if( sortedGNames != ""){

  function getRecs() {
    //get recommendations and add to queue on firebase
    s.getRecommendations({ seed_genres: `${sortedGNames[0]},${sortedGNames[1]},${sortedGNames[2]}`, limit: 50 }, function(err, data){
      if (err) console.error(err);
      else{
        var queueArray = [];

        for (var m = 0; m <= 49; m++){
          queueArray.push(data.tracks[m].id);
        }

        firebase.firestore().collection("playlists").doc(groupInfo["groupID"]).update({
          queue: queueArray,
        })
        .then(() => {
          console.log("Queue successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      }
    })
  }

  // Firebase notification listener
  firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
  .onSnapshot((doc) => {
    // console.log("Current data: ", doc.data());
    var obj = doc.data()["join_requests"]
    for (let key in obj) {
      // console.log(obj.length)

      if (obj.length >= 1) {
        setJoinNotificationNumber(obj.length)
        setNotifications(true)
      }
      else {
        setNotifications(false)
        setJoinNotificationNumber(0)
      }
    }
  });
  
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
    } catch (error) {
      alert(error.message);
    }
  };

    //   return
    // }, [ lastArray, currArray, hostArtistArray, memberArtistArray ]);
  // }
  if (users > 2){
    console.log("3+ listeners")
  }
    //     //CALCULATE TOP ARTISTS
    //     //only run if last array and curr array is NOT null
    //     if( hostArtistArray != "" && memberArtistArray != ""){
    //       var topArtists = [];
    //       // compare last array and current array
    //       for (var i = 0; i < hostArtistArray.length; i++){
    //         for (var j = 0; j < memberArtistArray.length; j++){
    //           //if the genres match push it to the sorted array
    //           if(hostArtistArray[i] == memberArtistArray[j]){
    //             //calculate common percentage
    //             topArtists.push( memberArtistArray[j] );
    //           }
    //         }
    //       }
    //       //Push top artists to firebase
    //       for(var k = 0; k < topArtists.slice(0, 3).length; k++){
    //         firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
    //         .update({
    //           top_genres: firebase.firestore.FieldValue.arrayUnion(topArtists[k]),
    //         })
    //         .then(() => {
    //             console.log("Top Artists successfully updated!");
    //         })
    //         .catch((error) => {
    //             console.error("Error updating document: ", error);
    //         });
    //       }
    //       //get artist data from spotify
    //       s.getArtists([ topArtists[0], topArtists[1], topArtists[2]] , function(err, data){
    //         if (err) console.error(err);
    //         else{
    //           var favArtistName = [];
    //           var favArtistImage = [];
      
    //           for (var m = 0; m < 3; m++){
    //             favArtistName.push(data.artists[m].name);
    //             favArtistImage.push(data.artists[m].images[2].url)
    //           }
    //           setSortedTopArtists( favArtistName );
    //           setTopArtistImgs( favArtistImage );
    //         }
    //       })
    //     }

    //     //CALCULATE TOP GENRES
    //     //only run if last array and curr array is NOT null
    //     if( lastArray != "" && currArray != ""){
    //       var genreMatches = [];
    //       var topGenres = [];
    //       var topGweight = [];

    //       // compare last array and current array
    //       for (var i = 0; i < lastArray.length; i++){
    //         for (var j = 0; j < currArray.length; j++){
    //           //if the genres match push it to the sorted array
    //           if(lastArray[i][0] == currArray[j][0]){
    //             //calculate common percentage
    //             var percent = Math.round(((lastArray[i][1] + currArray[j][1])/2));
                
    //             genreMatches.push( [currArray[j][0], percent] );
    //             topGenres.push( currArray[j][0] );
    //             topGweight.push( percent );

    //           }
    //         }
    //       }
    //       //Push top genres to firebase
    //       for(var k = 0; k < genreMatches.slice(0, 3).length; k++){
    //         firebase.firestore().collection("playlists").doc(groupInfo["groupID"])
    //         .update({
    //           top_genres: firebase.firestore.FieldValue.arrayUnion(genreMatches[k][0]),
    //           top_genre_percent: firebase.firestore.FieldValue.arrayUnion(genreMatches[k][1]),
    //         })
    //         .then(() => {
    //             console.log("Top Genres successfully updated!");
    //         })
    //         .catch((error) => {
    //             console.error("Error updating document: ", error);
    //         });
    //       }
    //       //change top 3 weights to be 'out of 100'
    //       var topWeights = [];
    //       for(var l = 0; l < topGweight.slice(0, 3).length; l++){
    //         var totalSortedWeights = Math.round(topGweight[0]+topGweight[1]+topGweight[2]);
    //         var newSortedWeight = Math.round((topGweight[l]/totalSortedWeights)*100);
    //         topWeights.push( newSortedWeight );
    //       }
    
    //       // set top 3 genre matches
    //       setSortedGNames(topGenres.slice(0, 3));
    //       setSortedGWeight(topWeights);
           
    //     }

    //     //only run if sorted genre name ISN'T empty, check if firebase has 49 queue already
    //     if( sortedGNames != ""){
    //      //get recommendations and add to queue on firebase
    //      s.getRecommendations({ seed_genres: `${sortedGNames[0]}, ${sortedGNames[1]}, ${sortedGNames[2]}`, limit: 50, }, function(err, data){
    //         if (err) console.error(err);
    //         else{
    //           var queueArray = [];
    //           // console.log(data.tracks[0].id);
    //           for (var m = 0; m < 50; m++){
    //             queueArray.push(data.tracks[m].id );
    //           }

    //           firebase.firestore().collection("playlists").doc(groupInfo["groupID"]).update({
    //             queue: queueArray,
    //           })
    //           .then(() => {
    //               console.log("Queue successfully updated!");
    //           })
    //           .catch((error) => {
    //               console.error("Error updating document: ", error);
    //           });
    //         }
    //       })
    //     }

    // }, [ lastArray, currArray, hostArtistArray, memberArtistArray ]);
   
  //   //GET HOST MUSIC PROFILE
  //   useEffect(() => {
  //     const isFocused = navigation.addListener("focus", () => {
  //       setLoading(true);

  //       firebase.firestore().collection("user-music-profile").where("user", "==", hostID)
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //           var Array1 = [];
  //           for (var i = 0; i < 5; i++){
  //             Array1.push( [ doc.data().genres[i][0], doc.data().genres[i][1] ]);
  //             // lastArray.push( [ doc.data().genres[i][0], doc.data().genres[i][1] ]);
  //           }
  //           setFirstArray(Array1);
  //           setHostGenreArray(Array1);
  //         });
  //       })
  //       .catch((error) => {
  //         console.log("Error getting documents: ", error);
  //       });
  //     })
  //     return isFocused;
  //   }, [lastArray, loading, navigation])

    
    //   //GET MEMBER MUSIC PROFILE
    //   useEffect(() => {
    //     const isFocused = navigation.addListener("focus", () => {
    //       setLoading(true);
    //       var matches = [];

    //       for (var a = 0; a < membID.length; a++){
    //         var lastloop = membID.length-1;

    //         //last loop
    //         if(a == lastloop){
    //           firebase.firestore().collection("user-music-profile").where("user", "==", membID[a])
    //           .get()
    //           .then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //               var Array3 = [];
    //               for (var g = 0; g < 5; g++){
    //                 Array3.push( [ doc.data().genres[g][0], doc.data().genres[g][1] ]);
    //               }
    //               setMemberGenreArray(Array3);
    //             });
    //           })
    //           .catch((error) => {
    //             console.log("Error getting documents: ", error);
    //           });
    //           //compare last array with first array
    //           for (var e = 0; e < currArray.length; e++){
    //             for (var f = 0; f < firstArray.length; f++){

    //               //if the genres match push it to the sorted array
    //               if(currArray[e][0] == firstArray[f][0]){

    //                 //calculate common percentage
    //                 var percent = Math.round(((currArray[e][1] + firstArray[f][1])/3));
    //                 matches.push( [firstArray[f][0], percent] );
    //               }
                  
    //             }
    //           }
    //           console.log("loop "+a+"matches: "+matches);
    //         }
    //         else{
              
    //           firebase.firestore().collection("user-music-profile").where("user", "==", membID[a])
    //           .get()
    //           .then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //               var Array2 = [];
    //               for (var b = 0; b < 5; b++){
    //                 Array2.push( [ doc.data().genres[b][0], doc.data().genres[b][1] ]);
    //               }
    //               setOtherArray(Array2);
    //             });
    //           })
    //           .catch((error) => {
    //             console.log("Error getting documents: ", error);
    //           });
    //           //compare last array with current array
    //           for (var c = 0; c < lastArray.length; c++){
    //             for (var d = 0; d < otherArray.length; d++){
    //               //if the genres match push it to the sorted array
    //               if(lastArray[c][0] == otherArray[d][0]){

    //                 //calculate common percentage
    //                 var percent = Math.round(((lastArray[c][1] + otherArray[d][1])/3));
    //                 matches.push( [otherArray[d][0], percent] );
    //               }
    //             }
    //           }
    //           console.log("loop "+a+"matches: "+matches);
    //         }
    //       }
      
    //       for (var x = 0; x < matches.length; x++){
    //         for (var y = x+1; y < matches.length; y++){
    //           // if(matches[x][0] == matches[y][0]){
    //           //   var percent = Math.round(((matches[x][1] + matches[y][1])/3));
    //           //   sorted.push( [matches[x][0], percent] );
    //           // }
    //           // else 
    //           if(matches[x][0] != matches[y][0]){
    //             sorted.push( [matches[x][0], matches[x][1]] );
    //           }
    //         }
    //       }
    //       console.log("sorted matches outside the loop: "+sorted.slice(0, 3));
    //       setSortedArray(sorted.slice(0, 3));
    //     });
        
    //     return isFocused;
    //   }, [ loading, navigation]);

    //   //TOP GENRES
    //   console.log("sorted:"+sortedArray); //push top genres to firebase

      
    //   return firebase.firestore().collection("playlists").doc(groupInfo["groupID"]).update({
    //       top_genres: sortedArray,
    //   })
    //   .then(() => {
    //       console.log("Document successfully updated!");
    //   })
    //   .catch((error) => {
    //       console.error("Error updating document: ", error);
    //   });

  if (loading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator color="white" />
      </View>
    );
  }
  if (!groupInfo) {
    return (
      <View style={styles.section}>
        <Text>Playlist not found!</Text>
      </View>
    );
  }
  else {
    return (
    <View>
      <ScrollView>
        
        <View style={styles.section}>
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
                <SearchBar bgColor="pink"/>
              </TouchableOpacity>
              { (users <= 1) ?
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
                    <Text style={styles.srTextDetail}>{songRequestArray.length} Pending Requests</Text>
                    <View style={!collapse ? styles.songReqDetails : { display:'none' }}>
                    {/* MAP OUT SONG REQUESTS, must save song request info (name, img, artist) to object first

                    {songRequestArray.map((group, i) => (
                      <QueueRequest key={i} data={songRequestArray}/>
                    ))} */}
                      <QueueRequest data={[
                        { key:1, image: requestImg[0], name: requestName[0], artist: requestArtist[0] },
                        { key:2, image: requestImg[1], name: requestName[1], artist: requestArtist[1] },
                        { key:3, image: requestImg[2], name: requestName[2], artist: requestArtist[2] }
                      ]}/>

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("Song Req Modal", {params: groupInfo['groupID']});
                        }}>
                        <Text style={[styles.srTextDetail,{textDecorationLine: 'underline'}]}>View All</Text>
                      </TouchableOpacity>
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
      <View style={styles.mediaPlayer}>
        {/* <MediaPlayer active="group"/> */}
      </View>
    </View>
    )
  }
}

const windowWidth = Dimensions.get('window').width;

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
  }
})

export default Group;