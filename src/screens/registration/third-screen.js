import React, {useState, useEffect} from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SpotifyWebAPI from 'spotify-web-api-js';
import { Formik, setNestedObjectValues } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";
import validate from "../../form/form-validation";
import { SwitchFull } from 'react-native-switch-full-custom';
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import firebase from "firebase";

import ButtonFullWidth from "../../components/ButtonFullWidth";
import ButtonText from "../../components/ButtonText";
import Header from "../../components/Header";

var s = new SpotifyWebAPI();

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("user");
  
  const [loading, setLoading] = useState()

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // const [topArtists, setTopArtists] = useState();
  // const [topTracks, setTopTracks] = useState();
  // const [topGenres, setTopGenres] = useState();

  var currentLocation = '';
  
  AsyncStorage.getItem('accessToken', (err, result) => {
    s.setAccessToken(result);
  });

  useEffect(() => {
    if (isSwitchOn) {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      if (isSwitchOn) {
        let location = await Location.getCurrentPositionAsync({});
        currentLocation = JSON.stringify(location);

        updateAsyncStorage("locationpermission", status)
        updateAsyncStorage("location", currentLocation)
      }
      else {
        updateAsyncStorage("locationpermission", "none")
      }
    })();
  }
  }, [isSwitchOn]);

  function updateAsyncStorage(label, value) {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem(`${label}`);

        await AsyncStorage.setItem(label, value);
        
        console.log(`${label} updated successfully: ` + value);
        return resolve(true);
      } catch (e) {
        return reject(e);
      } 
    });
  }

  if (errorMsg) {
    text = errorMsg;
  } else if (isSwitchOn) {
    text = "Location has been enabled. This can be turned off in Settings.";
  } else {
    text = "Location permission not granted"
  }

  const createAccount = (values) => {
    return new Promise(() => {
      setLoading(true);

      firebase
        .auth()
        .createUserWithEmailAndPassword(values.user_email, values.user_password)
        .then((res) => {
          firebase
          .firestore()
          .collection("users")
          .doc(res.user.uid)
          .set({
            uid: res.user.uid,
            email: res.user.email,
            name_first: values.user_firstname,
            group: '',
            groupRole: '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(()=> {
            userMusicProfile(values, res.user.uid);
          })
          .then(() => {
            return uriToBlob(values.user_image);
          })
          .then((blob) => {
            return uploadToFirebase(blob, res.user.uid);
          })
          .then((snapshot) => {
            console.log("User created in Firebase");
          })
          .catch((err) => {
            console.log(err);
            console.log("Error creating account: " + err.message);
          });
        })
        .catch((err) => alert("General Error" + err.message));
    });
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }

  const uploadToFirebase = (blob, id) => {
    return new Promise((resolve, reject)=>{
      var storageRef = firebase.storage().ref();

      storageRef.child(`images/users/${id}.jpg`).put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot)=>{
        blob.close();
        resolve(snapshot);
      }).catch((error)=>{
        reject(error);
      });

      console.log("----upload image to Firebase----");
    });
  }

  const userMusicProfile = (values, user) =>{
    return new Promise(() => {
      console.log("Create user music profile")

      firebase
      .firestore()
      .collection("user-music-profile")
      .add({
        genres: values.top_genres, //get from spotify
        genre_percents: values.top_genre_percents, //get from spotify
        top_artists: values.top_artist_ids, //get from spotify
        top_artist_names: values.top_artist_names, //get from spotify
        top_tracks: values.top_tracks, //get from spotify
        user: user,
      })
      .then(()=> {
        console.log("User music profile created in Firebase")
        setLoading(false);
      })
    })
  }
  
  return (
    <Formik
      innerRef={form}
      initialValues={formValues}
      initialErrors={formErrors}
      enableReinitialize
    >
      {({ values, errors, handleChange }) => (
        <View style={styles.main}>
          <Header></Header>

          {loading ? 
            <View>
              <ActivityIndicator color="#0f0f0f" />
            </View>
          :
            <View style={styles.container}>
              <Text style={styles.heading}>Enable Locations</Text>
              <Text style={styles.note}>To discover and participate in groups we need to access your location; this helps us keep groups secure. Groups are location based, meaning you will only see ones available near you.</Text>

              <View style={[styles.switch_container, {marginTop: EStyleSheet.value('$padding1 * 3')}]}>
                <View>
                  <Text style={styles.switch_label}>Enable Location Services</Text>
                  <Text style={styles.note}>{text}</Text>
                </View>
                <SwitchFull
                  value={isSwitchOn}
                  onValueChange={()=> {
                    setIsSwitchOn(isSwitchOn ? false : true)
                    console.log(isSwitchOn)
                  }}
                  disabled={false}
                  activeText={'On'}
                  inActiveText={'Off'}
                  circleSize={10}
                  barHeight={18}
                  circleBorderWidth={0}
                  backgroundActive={'#0f0f0f'}
                  backgroundInactive={'#3E9FB0'}
                  circleActiveColor={'#FFF'}
                  circleInActiveColor={'#FFF'}
                  changeValueImmediately={true}
                  innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                  renderActiveText={false}
                  renderInActiveText={false}
                  switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                  switchWidthMultiplier={3} // multipled by the `circleSize` prop to calculate total width of the Switch
                  switchBorderRadius={30}
                />
              </View>
              <View style={styles.buttonContainer}>
                <ButtonText label="Back" onPress={() => { navigation.goBack() }} color="$black"/>

                <ButtonFullWidth 
                  label="Create Account"
                  color= "$white"
                  backgroundColor="$bg_black"
                  disabled={!isSwitchOn}
                  onPress={() => {
                    dispatch({
                      type: "UPDATE_FORM",
                      payload: {
                        id: "user",
                        data: { values, errors }
                      }
                    });
                    createAccount(values);
                    navigation.navigate("Fourth")
                  }}
                />
              </View>
            </View>
          }
        </View>
      )}
    </Formik>
  );
};

const styles = EStyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '$blue_light',
    paddingHorizontal: '$padding2',
    paddingVertical: '$padding1'
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: '$fontSize1',
    fontFamily: 'Poppins_600SemiBold',
  },
  note: {
    fontSize: '$fontSize5',
    marginTop: '$padding5',
    color: '$medLight_grey',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  switch_label: {
    color: '$textColor_dark',
    fontSize: '$fontSize4',
    marginBottom: '$padding5 / 2',
    fontFamily: 'Poppins_400Regular',
  },
  switch_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '$padding3',
    height: 'auto',
    maxWidth: '100%',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
});