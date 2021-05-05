import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import { SwitchFull } from 'react-native-switch-full-custom';
import { useFormState, useFormDispatch } from "../../form/form-context";
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import firebase from "firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from "../../components/Header";
import ButtonSmall from "../../components/ButtonSmall";

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("playlist");
  const [loading, setLoading] = useState();

  var groupID = '';

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => {setIsSwitchOn(isSwitchOn ? false : true)};
  const [user, setUser] = useState();
  const [location, setLocation] = useState();

  useEffect(() => {
    fetchInfo();
  }, [])

  async function fetchInfo() {
    const user = await AsyncStorage.getItem('user')
    const currentLocation = await AsyncStorage.getItem('location')

    if (user && currentLocation) {
      setUser(user);
      setLocation(currentLocation);
    }

    console.log("grabbed async location value")
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (form.current) {
        const { values, errors } = form.current;
        dispatch({
          type: "UPDATE_FORM",
          payload: {
            id: "playlist",
            data: { values, errors }
          }
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  const createPlaylist = (values) => {
    return new Promise(() => {
      firebase
        .firestore()
        .collection("playlists")
        .add({
          playlist_name: values.playlist_name,
          moods: values.mood,
          energy: values.energy,
          danceability: values.danceability,
          disabled_genres: values.disabledGenres,
          private: values.private,
          allow_skipping: values.allowSkipping,
          skip_percent: values.skipPercent,
          allow_requests: values.allowRequests,
          join_requests: [],
          song_requests: [],
          host: user,
          admins: [],
          members: [],
          location: location,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function(docRef) {
          setLoading(true)
          groupID = docRef.id;
          console.log('NEXT: URI TO BLOB')
          return uriToBlob(values.playlist_image)
        })
        .then(function(blob) {
          console.log('NEXT: Upload to Firebase')
          return uploadToFirebase(blob);
        })
        .then(()=>{
          setLoading(false)
          console.log('NEXT: Update user DB')
          updateUserDB(groupID)
          navigation.navigate("Seventh", {groupID: groupID, name: values.playlist_name, image: values.playlist_image});
        })
        .catch((err) => {
          console.log("Playlist failed, Error:" + err);
          alert("Playlist failed, Error:" + err.message);
        });
    })
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('HERE: URI to blob')
        const xhr = new XMLHttpRequest();
  
        xhr.onload = function() {
          // return the blob
          resolve(xhr.response);
        };
        
        xhr.onerror = function() {
          // something went wrong
          reject(new Error('uriToBlob failed'), console.log(reject));
        };
  
        // this helps us get a blob
        xhr.responseType = 'blob';
  
        xhr.open('GET', uri, true);
        xhr.send(null);
      } catch (error) {
        console.log('URI TO BLOB error: ' + error)
        return reject(error)
      }
    });
  }

  const uploadToFirebase = (blob) => {
    return new Promise((resolve, reject)=>{
      console.log('HERE: Upload to Firebase')

      var storageRef = firebase.storage().ref();
      
      storageRef.child(`images/groups/group_${groupID}.jpg`).put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot)=>{
        blob.close();
        resolve(snapshot, console.log("File uploaded"));
      }).catch((error)=>{
        console.log("PHoto upload error: " +  error)
        reject(error);
      });
    });
  }

  const updateUserDB = (groupID) => {
    return new Promise(async() => {
      console.log('HERE: Update user DB')
      var userRecord = firebase.firestore().collection("users").doc(user);

      // Set the "capital" field of the city 'DC'
      return userRecord.update({
        group: groupID,
        groupRole: "host"
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
    })
  }

  return (
    <Formik
      innerRef={form}
      initialValues={formValues}
      initialErrors={formErrors}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <View style={styles.main}>
          <Header
            leftItem={
              <TouchableOpacity
                onPress={()=> {navigation.navigate("Home")}}>
                  <Image source={require('../../../assets/icons/x-large.png')}/>
              </TouchableOpacity>
            }
            middleItem={
              <Image source={require('../../../assets/icons/group3-settings.png')}/>
            }
          />

          <View style={loading ? {display: 'flex'} : {display:'none'}}>
            <ActivityIndicator color="white" />
            <Text style={{marginTop: 40, fontSize: 28, fontFamily: 'Poppins_600SemiBold', color: 'black', textAlign: 'center'}}>Creating Group...</Text>
          </View>

          <View style={[styles.container, !loading ? {display: 'flex'} : {display:'none'}]}>
            <Text style={styles.heading}>Song Requests</Text>
            <Text style={styles.note}>Would you like listeners song requests be automcatically added to the queue or would you like them to request your approval?</Text>

            <Text style={styles.label}>Song requests</Text>

            <View style={styles.switch_container}>
              <View>
                <Text style={styles.switch_label}>Auto Add Song Requests to Queue</Text>
              </View>
              <SwitchFull
                value={isSwitchOn}
                onValueChange={()=> {
                  setIsSwitchOn(isSwitchOn ? false : true)
                  setFieldValue('allowRequests', !isSwitchOn)}}
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
            {/* <Card style={styles.card}>
                <Text>{JSON.stringify(values, null, 2)}</Text>
              </Card> */}

            <View style={styles.buttonContainer}>
              <ButtonSmall
                label="Back"
                color= "transparent"
                onPress={() => { navigation.goBack() }}
              />

              <ButtonSmall 
                label="Next"
                color= "black"
                isLight={true}
                onPress={() => {
                  dispatch({
                    type: "UPDATE_FORM",
                    payload: {
                      id: "playlist",
                      data: { values }
                    }
                  });
                  createPlaylist(values);
                }}
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = EStyleSheet.create({
  card: {
    width: 200,
    height: 200,
  },
  main: {
    flex: 1,
    backgroundColor: '$blue_light',
    paddingVertical: '$padding1',
    paddingHorizontal: '$padding2',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: '10%'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
  heading: {
    fontSize: '$fontSize1',
    fontFamily: 'Poppins_600SemiBold'
  },
  note: {
    fontSize: '$fontSize5',
    marginTop: '$padding5',
    color: '$medLight_grey',
    fontFamily: 'Poppins_400Regular'
  },
  label: {
    fontSize: '$fontSize6',
    textTransform: 'uppercase',
    marginTop: '$padding1',
    marginBottom: '$padding4',
    fontFamily: 'Poppins_500Medium'
  },
  switch_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '$padding3',
    height: 'auto',
    width: '100%',
  },
  slider_container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 40, 
    marginBottom: '$padding3',
    height: 'auto',
    width: '100%',
  },
  switch_label: {
    color: '$textColor_dark',
    fontSize: '$fontSize4',
    marginBottom: '$padding5 / 2',
    fontFamily: 'Poppins_600SemiBold'
  },
});