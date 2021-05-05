import React, { useState, useEffect }  from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Location from 'expo-location';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { FormProvider } from "./src/form/form-context";
import * as firebase from "firebase";
import * as Linking from 'expo-linking';
import SpotifyWebAPI from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EStyleSheet from "react-native-extended-stylesheet";
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold} from '@expo-google-fonts/poppins'

import * as secrets from "./src/secrets";
import {refreshTokens} from "./src/scripts/refreshTokens"

import RootNavigator from "./src/navigators/RootNavigator";
import HomeNavigator from './src/navigators/HomeNavigator';
import DrawerNavigator from "./src/navigators/DrawerNavigator";

EStyleSheet.build({
  $pink: '#FFA0A4',
  $orange: '#FFB574',
  $orange_light: '#F6C89F',
  $blue: '#62D9EF',
  $blue_light: '#9CE4F1',
  $green: '#92EABD',

  // NEUTRALS
  $medLight_grey: '#464646',
  $med_grey: '#313131',
  $light_grey: '#D1D1D1',
  
  $bg_black: '#0F0F0F',
  
  $textColor_dark: '#0F0F0F',
  $textColor_grey: '#D1D1D1',
  $textColor_light: '#fff',
  
  $black: '#000',
  $white: '#fff',

  // ALIGNMENT + FORMAT
  $padding1: 40,
  $padding2: 24,
  $padding3: 16,
  $padding4: 12,
  $padding5: 8,

  $iconWidth: 16,
  $iconHeight: 16,

  // FONTS
  $fontSize6: 10,
  $fontSize5: 12,
  $fontSize4: 16,
  $fontSize3: 20,
  $fontSize2: 24,
  $fontSize1: 28,

  $poppins_light: '',
  $poppins_regular: '',
  $poppins_medium: '',
  $poppins_semibold: '',
  $poppins_bold: '', 
});

//FIREBASE CONFIG
var firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "PROJECT-DOMAIN",
  projectId: "PROJECT-ID",
  appId: "YOUR-API-ID",
  measurementId: "MEASUREMENT-ID"
};

//FIREBASE INITIALIZE
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// URL REDIRECT (open app from external link)
function urlRedirect(url) {
  if(!url) return;
  // parse and redirect to new url
  let { path, queryParams } = Linking.parse(url);

  if (queryParams) {
    // console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
    Linking.removeEventListener('url')
  }
  else {
    console.log("No query params")
    return
  }
}
// // listen for new url events coming from Expo
Linking.addEventListener('url', event => {
  urlRedirect(event.url);
});

// navigator
const Stack = createStackNavigator();

//SPOTIFY
var s = new SpotifyWebAPI();

var credentials= {};

export function getSpotifyCredentials() {
  credentials = secrets["spotifyCredentials"];
  return (secrets["spotifyCredentials"])
}

export default function App({navigation}) {
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [loading, setLoading] = useState();
  const [token, setToken] = useState(null);
  const [expireTime, setExpireTime] = useState();
  const [group, setGroup] = useState();
  const [inGroup, setIsInGroup] = useState(null)
  const time = new Date().getTime()
  var userID = '';
  var oldToken = '';

  // get Spotify Credentials
  getSpotifyCredentials();

  // get user location
  useEffect(() => {
    setLoading(true);
    checkForUser();

    // const isFocused = navigation.addListener("focus", () => {
    new Promise(async (resolve, reject) => {
      try {
        let { status } = await Location.requestPermissionsAsync();
  
        if (!status == 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const jsonValue = JSON.stringify(location)
        updateAsyncStorage('location', jsonValue)

        fetchToken();

        // fetch Spotify Access Token
        async function fetchToken() {
          const token = await AsyncStorage.getItem('accessToken');
          const xTime = await AsyncStorage.getItem('expirationTime')
          
          if (token != '') {
            oldToken = token;
            console.log('old token set')
          }
          else {
            console.log('old token not set')
          }

          if (xTime) {
            setExpireTime(xTime)
          }
          
          checkIfTokenValid(xTime);
        }

        // if Spotify token present, check if still valid
        async function checkIfTokenValid(xTime) {
          // const time = new Date().getTime()

          if (xTime <= time) { 
            try {
              await refreshTokens(credentials);
            } catch (error) {
              console.log(error)
            }
            return fetchNewToken();
          }
          else {
            s.setAccessToken(oldToken);
            console.log('old token not expired')
          }
        }

        // if Spotify token is expired, fetch new one
        async function fetchNewToken() {
          const newToken = await AsyncStorage.getItem('accessToken');
          
          if (newToken != '') {
            s.setAccessToken(newToken)
          }
          else {
            console.log('new token not set')
          }
        }

        return resolve(true)
      } catch (error) {
        console.log("getting location failed")
        return reject(e)
      }
    });
    return
  }, [token, expireTime]);

  // check for user auth, check for group and group role
  const checkForUser = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setToken(true)
        userID = user.uid;
        updateAsyncStorage('user', user.uid);

        getUserInfo();
      } 
      else {
        setToken(false)
      }
    });
  }
    
  const getUserInfo = () => {
    firebase.firestore().collection("users").doc(userID)
    .onSnapshot(documentSnapshot => {
      const doc = documentSnapshot.data();

      updateAsyncStorage('user_email', doc['email'])
      updateAsyncStorage('user_name', doc['name_first'])

      if (doc["groupRole"] == "host") {
        updateAsyncStorage('isHost', 'true')
      }
      else {
        updateAsyncStorage('isHost', 'false')
      }

      if (doc["group"] == '') {
        updateAsyncStorage('group', 'none')
        setIsInGroup(false)
      }
      else {
        updateAsyncStorage('group', doc["group"])
        setGroup(doc["group"])

        setTimeout(() => {
          setIsInGroup(true)
        }, 1500)
        
        // if new acceptance into a group, then user is notified
        if (doc["notified"] == false ) {
          var docRef = db.collection("playlists").doc(doc["group"]);
          var userRef = db.collection("users").doc(userID);
  
          docRef.get()
          .then((doc) => {
            if (doc.exists) {
              alert(`You've been accepted into ${doc.data()['playlist_name']}!\n\nCheck it out now!`)
            }
            else {
              console.log("No such document!")
            }
          }).catch((error) => {
            console.log("Error getting document: " + error);
          });
      
          userRef.update({
            notified: true,
          })
          .then(() => {
            console.log("User has been notified!");
          })
          .catch((error) => {
            console.error("Error updating notified: ", error);
          });
        }
      }
      setTimeout(()=>{
        setLoading(false)
      }, 2000)
    })
  }

  function updateAsyncStorage(label, value) {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem(`${label}`);

        await AsyncStorage.setItem(label, value);
        
        console.log('async storage update with ' + label + " = " + value)
        return resolve(true)
      } 
      catch (e) {
        console.log('APP.js error: ' + e)
        return reject(e)
      }
    });
  }

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.animationContainer}>
        <LottieView style={styles.animation}source={require('./assets/splash.json')} autoPlay loop/>
      </View>
    )
  } else {
    return (
      <PaperProvider>
        <FormProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ 
                headerShown: false
              }}
            >
            { !token ? (
              <Stack.Screen name="Root" component={RootNavigator} />
            ) : (
              inGroup
              // ? <Stack.Screen name="Group View" component={DrawerNavigator} initialParams={{groupID: group}}/>
              ? <Stack.Screen name="Group View" component={DrawerNavigator}/>
              : <Stack.Screen name="Home" component={HomeNavigator} initialRouteName="Home"/>
            )}
              {/* <Stack.Screen name="Account Navigator" component={AccountNavigator}/> */}
            </Stack.Navigator>
          </NavigationContainer>
        </FormProvider>
      </PaperProvider>
    );
  }
}

const styles = EStyleSheet.create({
  animationContainer: {
    backgroundColor: '#0F0F0F', 
    height: '100%', 
    width: '100%', 
    alignItems: 'center', 
    justifyContent:'center'
  },
  animation: {
    width: '75%', 
    alignSelf: 'center', 
    alignItems: 'center'
  },
})