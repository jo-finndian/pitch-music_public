import React, {useState, useEffect} from "react";
import { Text, View, Platform, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";
import * as yup from "yup";
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import * as ImagePicker from 'expo-image-picker';
import SpotifyWebAPI from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomTextInput from "../../components/CustomTextInput";
import CustomInputLabel from "../../components/CustomInputLabel";
import ButtonSmall from "../../components/ButtonSmall";
import ButtonNarrow from "../../components/ButtonNarow";
import CircleImage from "../../components/CircleImage";
import Header from "../../components/Header";

var s = new SpotifyWebAPI();

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("user");

  const [loading, setLoading] = useState()

  const [tokenReceived, setTokenReceived] = useState(false);
  const [image, setImage] = useState(null);
  const [spotifyID, setSpotifyID] = useState();
  const [topArtistsIDs, setTopArtistIDs] = useState();
  const [topArtistsNames, setTopArtistNames] = useState();
  const [topTracks, setTopTracks] = useState();
  const [topGenres, setTopGenres] = useState();
  const [topGenrePercents, setTopGenrePercents] = useState();

  const defaultValues = {
    user_firstname: spotifyID,
    user_image: image,
  }
  
  AsyncStorage.getItem('accessToken', (err, result) => {
    s.setAccessToken(result);
    setTokenReceived(true)
    console.log("token received")
  });

  useEffect(() => {
    setLoading(true)

    if (tokenReceived == true) {
      s.getMe(function(err, data){
        if (err) console.error(err);
        else{
          setSpotifyID(data.display_name)
          setImage(data.images[0].url)
        }
      })
      getUserMusicInfo();
    }

    setLoading(false)
    return
  }, [tokenReceived, loading])
  
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (form.current) {
        const { values, errors } = form.current;
        dispatch({
          type: "UPDATE_FORM",
          payload: {
            id: "user",
            data: { values, errors }
          }
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const getUserMusicInfo = () => {
    console.log("get user music info")
    var artistIDs = [];
    var artistNames = [];
    var genres = [];
    var tracks = [];

    //LONG TERM
    s.getMyTopArtists({time_range: 'short_term', limit: 10}, function (err, data){
      if (err) console.error(err);
      else {
        for (var i = 0; i <= 9; i++){
          artistIDs.push(data.items[i].id);
          artistNames.push(data.items[i].name);
        }
        setTopArtistIDs(artistIDs);
        setTopArtistNames(artistNames);
        // console.log(artistIDs)
        // console.log(artistNames)

        for (var k = 0; k <= 9; k++){
          var types = data.items[k].genres;
          for (var l = 0; l < types.length; l++){
            genres.push(data.items[k].genres[l] ); 
          }
        }

        // check for duplicates
        var occurences = {};

        genres.forEach(function(i) { occurences[i] = (occurences[i] || 0) + 1; });
        
        // ----sort data from most to least popular (based on # of occurences)
        var sorted = Object.entries(occurences).sort((a,b)=> b[1]-a[1])

        var sortedObjs =[];

        for (var i=0 ; i <= sorted.length -1; i++) {
          var x = [sorted[i][0], sorted[i][1]];
          
          sortedObjs.push(x)
        }

        // calculate pop weight of each genre and add to users array
        var genreArray = [];
        var genreWeightArray = [];

        for (var i = 0; i <= sortedObjs.length - 1; i++){
          //calculate weight percentage from # of genre specific occurances
          
          //sum of genre pop weight % per user
          var userWeight = Math.ceil(( sortedObjs[i][1] / sortedObjs.length ) * 100); 
          
          genreWeightArray.push(userWeight)
          genreArray.push(sortedObjs[i][0])
        }

        setTopGenres(genreArray);
        setTopGenrePercents(genreWeightArray);
      }
    })

    s.getMyTopTracks({time_range: 'short_term',limit: 5}, function (err, data){
      if (err) console.error(err);
      else {
        // console.log(data.items[0].id)
        for (var k = 0; k <= 4 ; k++){
          console.log(data.items[k].id)
          tracks.push(data.items[k].id);
        }
        setTopTracks(tracks);
      }
    })
  }

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('image access granted')
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Result: " + result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  let schema = yup.object().shape({
    user_email: yup.string().email().required(),
    user_firstname: yup.string().required(),
  })

  return (
    <Formik
      innerRef={form}
      initialValues={defaultValues}
      initialErrors={formErrors}
      enableReinitialize
      validateOnChange={true}
      validationSchema={schema}
    >
      {({ values, handleChange, setFieldValue, errors }) => (
        <View style={styles.main}>
          <Header
            leftItem={
              <TouchableOpacity
                onPress={()=> {navigation.goBack()}}>
                  <Image source={require('../../../assets/icons/x-large.png')}/>
              </TouchableOpacity>
            }
            middleItem={
              <Image style={styles.feedback} source={require('../../../assets/icons/onboarding1-connect.png')}/>
            }
          />

          {loading ? 
            <View>
              <ActivityIndicator color="#0f0f0f" />
            </View>
          :
            <View style={styles.container}>
              <Text style={styles.heading}>Confirm Account</Text>
              <Text style={styles.note}>Confirm that this is you Spotify Account. If you edit you information here it will not change you Spotify information.</Text>

              <View style={{alignSelf:'center', alignItems: 'center', marginTop: 40, marginBottom: 24,}}>
                <CircleImage size="large" margin={40} image={{uri: image}}/>
                <ButtonNarrow 
                  label="Upload Photo"
                  icon={require('../../../assets/icons/upload.png')}
                  color= "black"
                  isLight={true}
                  onPress={() => { 
                    pickImage()
                  }}
                />
              </View>

              <CustomInputLabel label="First Name"/>
              <CustomTextInput
                placeholder={values.user_firstname}
                value={values.user_firstname}
                onChangeText={handleChange("user_firstname")}
                autoCapitalize='none'
                returnKeyType='next'
                returnKeyLabel='next'
                underlineColorAndroid='transparent'
                maxLength={45}
                showIcon={true}
                icon={"ios-pencil-sharp"}
                />
              {errors.user_firstname &&  <Text>This is a required field.</Text>}

              <CustomInputLabel label="Email" style={{marginTop: 24}}/>
              <CustomTextInput
                placeholder="Email"
                value={values.user_email}
                onChangeText={handleChange("user_email")}
                autoCapitalize='none'
                returnKeyType='next'
                returnKeyLabel='next'
                underlineColorAndroid='transparent'
                maxLength={45}
                showIcon={true}
                icon={"ios-pencil-sharp"}
              />
                {errors.user_email && <Text>Please provide a valid email address.</Text>}

              <View style={styles.buttonContainer}>
                <ButtonSmall
                  label="Back"
                  color= "transparent"
                  onPress={() => { 
                    navigation.goBack() }}
                />
                <ButtonSmall 
                  label="Confirm"
                  color= "black"
                  isLight={true}
                  onPress={() => {
                    if (image == '') {
                      alert("Please choose a profile photo.")
                    }
                    else {
                      setFieldValue('top_tracks', topTracks);
                      setFieldValue('top_artist_ids', topArtistsIDs);
                      setFieldValue('top_artist_names', topArtistsNames);
                      setFieldValue('top_genres', topGenres);
                      setFieldValue('top_genre_percents', topGenrePercents);
                      setFieldValue('user_image', image);
                      navigation.navigate("Second");
                    }
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
    backgroundColor: '$orange',
    paddingHorizontal: '$padding2',
    paddingVertical: '$padding1'
  },
  errorInput: {
    color: 'red',
    textAlign: 'center',
    marginTop: 4
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  feedback: {
    height: 25,
    resizeMode: 'contain'
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
  input: {
    height: 50,
    width: 300,
    marginVertical: 12,
    backgroundColor: 'transparent',
    borderBottomColor: 'black'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
});