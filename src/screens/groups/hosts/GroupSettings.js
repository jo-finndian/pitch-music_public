import React, { useState} from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useFormState, useFormDispatch } from "../../../form/form-context";
import { Formik } from "formik";
import { Slider } from 'react-native-elements';
import { SwitchFull } from 'react-native-switch-full-custom';
import EStyleSheet from "react-native-extended-stylesheet";
import * as ImagePicker from 'expo-image-picker';
import firebase from "firebase";

import CircleImage from "../../../components/CircleImage"
import CustomTextInput from "../../../components/CustomTextInput";
import CustomInputLabel from "../../../components/CustomInputLabel";
import ButtonNarrow from "../../../components/ButtonNarow"
import SearchBar from "../../../components/SearchBar";
import CustomSlider from "../../../components/CustomSlider";
import ButtonFullWidth from "../../../components/ButtonFullWidth";
import ButtonText from "../../../components/ButtonText";

export default function GroupSettings({ navigation, route }){
    const [setting, setSetting] = useState("mood");
    const [bgCol, setBgCol] = useState("#FFA0A4");
    const [showMood, setShowMood] = useState(styles.show);
    const [showGenre, setShowGenre] = useState(styles.hide);
    const [showPriv, setShowPriv] = useState(styles.hide);
    const [showSkip, setShowSkip] = useState(styles.hide);
    const [showReq, setShowReq] = useState(styles.hide);
    const [showInfo, setShowInfo] = useState(styles.hide);
    const [loading, setLoading] = useState();

    const form = React.useRef();
    const dispatch = useFormDispatch();
    const { values: formValues, errors: formErrors } = useFormState("playlist");

    const groupInfo = route.params["groupInfo"]
    // console.log(groupInfo)

    const defaultValues = {
        playlist_name: groupInfo["playlist_name"], 
        mood: groupInfo["moods"],
        energy: groupInfo["energy"],
        danceability: groupInfo["danceability"],
        disabledGenres: groupInfo["disabled_genres"],
        private: groupInfo['private'],
        allowSkipping: groupInfo['allow_skipping'],
        skipPercent: groupInfo['skip_percent'],
        allowRequests: groupInfo['allow_requests'],
    }

    var moods = [];
    var genres = [];

    const [energy, setEnergy] = useState(defaultValues["energy"])
    const [danceability, setDance] = useState(defaultValues['danceability'])
    const [checked, setChecked] = useState(groupInfo["private"]);
    const [isSwitchOn1, setIsSwitchOn1] = useState(false);
    const [skip, setSkip] = useState(defaultValues['skipPercent'])
    const [isSwitchOn2, setIsSwitchOn2] = useState(false);
    const [user, setUser] = React.useState();
    const [image, setImage] = useState(groupInfo["photo"]);

    var isFocused1 = false
    var isFocused2 = false
    var isFocused3 = false
    var isFocused4 = false
    var isFocused5 = false
    var isFocused6 = false
    var isFocused7 = false
    var isFocused8 = false

    
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

    const updateSettings = (values) => {
        var ref = firebase.firestore().collection("playlists").doc(groupInfo['groupID']);

        return ref.update({
            playlist_name: values.playlist_name,
            moods: values.mood,
            energy: values.energy,
            danceability: values.danceability,
            disabled_genres: values.disabledGenres,
            private: values.private,
            allow_skipping: values.allowSkipping,
            skip_percent: values.skipPercent,
            allow_requests: values.allowRequests,
        })
        .then(function(docRef) {
            setLoading(true)
            // groupID = docRef.id;
            console.log('NEXT: URI TO BLOB')
            return uriToBlob(values.playlist_image)
        })
        .then(function(blob) {
            console.log('NEXT: Upload to Firebase')
            return uploadToFirebase(blob);
        })
        .then(()=>{
            setLoading(false)
            navigation.goBack();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

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

    //change tab highlight
    function SettingTabs(){

        if (setting === 'mood') {   
            setShowMood(styles.show);
            setShowGenre(styles.hide);
            setShowPriv(styles.hide);
            setShowPriv(styles.hide);
            setShowSkip(styles.hide);
            setShowReq(styles.hide);
            setShowInfo(styles.hide);
            setBgCol('#FFA0A4');
            return (
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={[styles.active, { backgroundColor: '#FFA0A4', marginLeft: 25}]}
                        onPress={() => setSetting('mood')}
                    > 
                        <Text style={[styles.text, {color: 'black'}]}>Mood</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button]}
                        onPress={() => setSetting('genres')}
                    >
                        <Text style={[styles.text]}>Genres</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button]}
                        onPress={() => setSetting('privacy')}
                    > 
                        <Text style={[styles.text]}>Privacy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button]}
                        onPress={() => setSetting('skipping')}
                    > 
                        <Text style={[styles.text]}>Skipping</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button]}
                        onPress={() => setSetting('requests')}
                    > 
                        <Text style={[styles.text]}>Song Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, {marginRight: 25}]}
                        onPress={() => setSetting('group info')}
                    > 
                        <Text style={[styles.text]}>Group Info</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else if (setting === 'genres') 
          {  setShowMood(styles.hide);
            setShowGenre(styles.show);
            setShowPriv(styles.hide);
            setShowPriv(styles.hide);
            setShowSkip(styles.hide);
            setShowReq(styles.hide);
            setShowInfo(styles.hide);
            setBgCol('#FFA0A4'); 
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setSetting('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#FFA0A4',}]}
                    onPress={() => setSetting('genres')}
                >
                    <Text style={[styles.text, {color: 'black'}]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setSetting('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setSetting('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setSetting('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            );  
        } 
        else if (setting === 'privacy'){
            setShowMood(styles.hide);
            setShowGenre(styles.hide);
            setShowPriv(styles.show);
            setShowSkip(styles.hide);
            setShowReq(styles.hide);
            setShowInfo(styles.hide);
            setBgCol('#9CE4F1');
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setSetting('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#9CE4F1',}]}
                    onPress={() => setSetting('privacy')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setSetting('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setSetting('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
    
            ); 
        }
        else if (setting === 'skipping'){
            setShowMood(styles.hide);
            setShowGenre(styles.hide);
            setShowPriv(styles.hide);
            setShowPriv(styles.hide);
            setShowSkip(styles.show);
            setShowReq(styles.hide);
            setShowInfo(styles.hide);
            setBgCol('#9CE4F1');
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setSetting('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setSetting('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#9CE4F1',}]}
                    onPress={() => setSetting('skipping')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setSetting('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            ); 
        }
        else if (setting === 'requests'){
            setShowMood(styles.hide);
            setShowGenre(styles.hide);
            setShowPriv(styles.hide);
            setShowPriv(styles.hide);
            setShowSkip(styles.hide);
            setShowReq(styles.show);
            setShowInfo(styles.hide);
            setBgCol('#9CE4F1');
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setSetting('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setSetting('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setSetting('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#9CE4F1',}]}
                    onPress={() => setSetting('requests')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setSetting('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            ); 
        }
        else if (setting === 'group info'){
            setShowMood(styles.hide);
            setShowGenre(styles.hide);
            setShowPriv(styles.hide);
            setShowPriv(styles.hide);
            setShowSkip(styles.hide);
            setShowReq(styles.hide);
            setShowInfo(styles.show);
            setBgCol('#FFB574');
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setSetting('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setSetting('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#FFB574', marginRight: 25}]}
                    onPress={() => setSetting('group info')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            ); 
        }
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
    
        console.log("Result: " + result.uri);
        
        if (!result.cancelled) {
          setImage(result.uri);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.container}>
                <Text style={styles.heading}>Group Settings</Text>
            </View>

            <View>
                <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator = {false}
                >
                    <SettingTabs/>
                </ScrollView>
            </View>
            
            { loading ?
            <View><ActivityIndicator color="white" /></View>
            :
            // {/* SETTING CONTENT */}
            <Formik
                innerRef={form}
                initialValues={defaultValues}
                initialErrors={formErrors}
                enableReinitialize
                >
                {({ values, setFieldValue, handleChange  }) => (
                    <View style={[styles.content, {backgroundColor: bgCol}]}>
                        {/* MOOD */}
                        <View style={[styles.main, showMood, {backgroundColor: bgCol} ] }>

                            <Text style={[styles.heading, styles.contentText, {marginTop: 25}]}>Set the Mood</Text>
                            <Text style={styles.label}>Presets</Text>

                            <View style={styles.presets}>
                            <TouchableOpacity
                                style={[styles.tag, (!isFocused1 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                onPress={()=> {
                                    if (!isFocused1) {
                                        moods.push('party');
                                        setFieldValue('mood', moods)
                                        isFocused1=true
                                    } else {
                                        moods.splice(moods.indexOf("party"), 1);
                                        setFieldValue('mood', moods)
                                        isFocused1=false
                                    } 
                                }}>
                                <Text style={[styles.tag_label, (!isFocused1 ? {color: "#000"} : {color: '#fff'} )]}>
                                    Party
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.tag, (!isFocused2 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                onPress={()=> {
                                if (!isFocused2) {
                                    moods.push('happy');
                                    setFieldValue('mood', moods)
                                    isFocused2=true
                                } else {
                                    moods.splice(moods.indexOf("happy"), 1);
                                    setFieldValue('mood', moods)
                                    isFocused2=false
                                } 
                                }}>
                                <Text style={[styles.tag_label, (!isFocused2 ? {color: "#000"} : {color: '#fff'} )]}>Happy</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.tag, (!isFocused3 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                onPress={()=> {
                                if (!isFocused3) {
                                    moods.push('chill');
                                    setFieldValue('mood', moods)
                                    isFocused3=true
                                } else {
                                    moods.splice(moods.indexOf("chill"), 1);
                                    setFieldValue('mood', moods)
                                    isFocused3=false
                                } 
                                }}>
                                <Text style={[styles.tag_label, (!isFocused3 ? {color: "#000"} : {color: '#fff'} )]}>Chill</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tag, (!isFocused4 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                onPress={()=> {
                                if (!isFocused4) {
                                    moods.push('focus');
                                    setFieldValue('mood', moods)
                                    isFocused4=true
                                } else {
                                    moods.splice(moods.indexOf("focus"), 1);
                                    setFieldValue('mood', moods)
                                    isFocused4=false
                                } 
                                }}>
                                <Text style={[styles.tag_label, (!isFocused4 ? {color: "#000"} : {color: '#fff'} )]}>Focus</Text>
                            </TouchableOpacity>
                            </View>
                            
                            <CustomSlider 
                                icon_left={require('../../../../assets/icons/low-energy.png')}
                                icon_right={require('../../../../assets/icons/high-energy.png')}
                                slider={
                                    <Slider
                                        value={energy}
                                        minimumValue={0}
                                        maximumValue={1}
                                        step={0.01}
                                        onValueChange={(energy) => {setEnergy(energy)
                                            setFieldValue('energy', energy)
                                        }}
                                        minimumTrackTintColor={'black'}
                                        maximumTrackTintColor={'white'}
                                        style={styles.slider}
                                        trackStyle={styles.track}
                                        thumbStyle={styles.thumb}
                                    />
                                } 
                                label="Energy" 
                                value_left="Low" 
                                value_right="high" 
                                margin={40} 
                            />
                            <CustomSlider 
                                icon_left={require('../../../../assets/icons/couch.png')}
                                icon_right={require('../../../../assets/icons/mirror-ball.png')}
                                slider={
                                    <Slider
                                        value={danceability}
                                        minimumValue={0}
                                        maximumValue={1}
                                        step={0.01}
                                        onValueChange={(danceability) => {setDance(danceability)
                                            setFieldValue('danceability', danceability)
                                        }}
                                        minimumTrackTintColor={'black'}
                                        maximumTrackTintColor={'white'}
                                        trackStyle={styles.track}
                                        thumbStyle={styles.thumb}
                                    />
                                } 
                                label="Dance" 
                                value_left="Low" 
                                value_right="high" 
                                margin={40} 
                            />
                        </View>
                    
                        {/* GENRES */}
                        <View style={[styles.main, showGenre, {backgroundColor: bgCol} ]}>
                            <View >
                                <Text style={[styles.heading, styles.contentText, {marginTop: 25}]}>Disable Genres</Text>
                                <Text style={[styles.textDetail, styles.contentText]}>Select the genres you don’t want to include.</Text>

                                <SearchBar></SearchBar>

                                <Text style={styles.label}>GENRES</Text>

                                <View style={styles.presets}>
                                <TouchableOpacity
                                    style={[styles.tag, (!isFocused5 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                    onPress={()=> {
                                    if (!isFocused5) {
                                        genres.push('Country');
                                        setFieldValue('disabledGenres', genres)
                                        isFocused5=true
                                    } else {
                                        genres.splice(genres.indexOf("Country"), 1);
                                        setFieldValue('disabledGenres', genres)
                                        isFocused5=false
                                    } 
                                    }}>
                                    <Text style={[styles.tag_label, (!isFocused5 ? {color: "#000"} : {color: '#fff'} )]}>
                                        Country</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tag, (!isFocused6 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                    onPress={()=> {
                                    if (!isFocused6) {
                                        genres.push('Rap');
                                        setFieldValue('disabledGenres', genres)
                                        isFocused6=true
                                    } else {
                                        genres.splice(genres.indexOf("Rap"), 1);
                                        setFieldValue('disabledGenres', genres)
                                        isFocused6=false
                                    } 
                                    }}>
                                    <Text style={[styles.tag_label, (!isFocused6 ? {color: "#000"} : {color: '#fff'} )]}>Rap</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tag, (!isFocused7 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                    onPress={()=> {
                                    if (!isFocused7) {
                                        genres.push('R & B');
                                        setFieldValue('disabledGenres', genres)
                                        isFocused7=true
                                    } else {
                                        genres.splice(genres.indexOf("R & B"), 1);
                                        setFieldValue('disabledGenres', genres)
                                        isFocused7=false
                                    } 
                                    }}>
                                    <Text style={[styles.tag_label, (!isFocused7 ? {color: "#000"} : {color: '#fff'} )]}>R &#38; B</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tag, (!isFocused8 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                                    onPress={()=> {
                                    if (!isFocused8) {
                                        genres.push('Hip Hop');
                                        setFieldValue('disabledGenres', genres)
                                        isFocused8=true
                                    } else {
                                        genres.splice(genres.indexOf("Hip Hop"), 1);
                                        setFieldValue('disabledGenres', genres)
                                        isFocused8=false
                                    } 
                                    }}>
                                    <Text style={[styles.tag_label, (!isFocused8 ? {color: "#000"} : {color: '#fff'} )]}>Hip Hop</Text>
                                </TouchableOpacity>
                                </View>

                            </View>
                            </View>
                    
                        {/* PRIVACY */}
                        <View style={[styles.main, showPriv, {backgroundColor: bgCol} ]}>
                        
                            <Text style={[styles.heading, styles.contentText, {marginTop: 25}]}>Group Privacy</Text>
                            <Text style={styles.note}>Select how you want your listeners to be able to join.</Text>

                            <Text style={styles.label}>Privacy</Text>

                            <View>
                                <View style={styles.radio_container}>
                                <View>
                                    <Text style={styles.radio_label}>Private</Text>
                                    <Text style={styles.radio_note}>Listeners can request your permission to join or can join direcetly with agroup link.</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.radio, (checked == true) ? styles.checked : styles.unchecked]}                
                                    onPress={() => {
                                    setFieldValue('private', true)
                                    setChecked(true)
                                    }}
                                    value="true"
                                    status={ checked == true ? 'checked' : 'unchecked' }
                                    >
                                    <View style={[styles.checked_inner, (checked== true) ? {backgroundColor: 'black'} : {backgroundColor:"transparent"}]}/>
                                </TouchableOpacity>
                                </View>
                                
                                <View style={styles.radio_container}>
                                <View>
                                    <Text style={styles.radio_label}>Public</Text>
                                    <Text style={styles.radio_note}>Any listeners can join.</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.radio, (checked == false ) ? styles.checked : styles.unchecked]}
                                    onPress={() => {
                                    setFieldValue('private', false)
                                    setChecked(false)
                                    }}
                                    value="false"
                                    status={ checked == false ? 'checked' : 'unchecked' }
                                    >
                                    <View style={[styles.checked_inner, (checked== false) ? {backgroundColor: 'black'} : {backgroundColor:"transparent"}]}/>
                                </TouchableOpacity>
                                </View>

                            </View>

                        </View>

                        {/* SKIPPING */}
                        <View style={[styles.main, showSkip, {backgroundColor: bgCol} ]}>
                                <Text style={[styles.heading, styles.contentText, {marginTop: 25}]}>Song Skipping</Text>
                                <Text style={styles.note}>Would you like all listeners to be allowed to skip songs?</Text>

                                <Text style={styles.label}>skipping</Text>

                                <View style={styles.switch_container}>
                                <View>
                                    <Text style={styles.switch_label}>Listener Skipping</Text>
                                    <Text style={styles.switch_note}>Enable if you want the listeners in the group to be able to skip songs.</Text>
                                </View>
                                <SwitchFull
                                    value={isSwitchOn1}
                                    onValueChange={() => {
                                    setIsSwitchOn1(isSwitchOn1 ? false : true)
                                    setFieldValue('allowSkipping', !isSwitchOn1)
                                    }}
                                    circleSize={10}
                                    barHeight={18}
                                    circleBorderWidth={0}
                                    backgroundActive={'#0f0f0f'}
                                    backgroundInactive={'#3E9FB0'}
                                    circleActiveColor={'#FFF'}
                                    circleInActiveColor={'#FFF'}
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                    changeValueImmediately={true}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                                    switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                    switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                    switchWidthMultiplier={3} // multipled by the `circleSize` prop to calculate total width of the Switch
                                    switchBorderRadius={30}
                                />
                                </View>

                                <View style={isSwitchOn1 ? styles.slider_container : {display: 'none'}}>
                                <View>
                                    <Text style={styles.switch_label}>Skip Threshold</Text>
                                    <Text style={styles.switch_note}>Select the percentage of listeners that would need to request to skip before the song changes.</Text>
                                </View>

                                <CustomSlider 
                                    label="Skip Percentage" 
                                    value_left="0%" 
                                    value_right="100%" 
                                    slider={
                                    <Slider
                                    value={skip}
                                    minimumValue={0}
                                    maximumValue={1}
                                    step={0.01}
                                    onValueChange={(skip) => {setSkip(skip)
                                    setFieldValue('skipPercent', skip)
                                    }}
                                    minimumTrackTintColor={'black'}
                                    maximumTrackTintColor={'white'}
                                    trackStyle={styles.track}
                                    thumbStyle={styles.thumb}
                                    />} 
                                />
                                </View>

                            </View>

                        {/* SONG REQUESTS */}
                        <View style={[styles.main, showReq, {backgroundColor: bgCol} ]}>

                                <Text style={[styles.heading, styles.contentText, {marginTop: 25}]}>Song Requests</Text>
                                <Text style={styles.note}>Would you like listeners song requests be automcatically added to the queue or would you like them to request your approval?</Text>

                                <Text style={styles.label}>Song requests</Text>

                                <View style={styles.switch_container}>
                                <View>
                                    <Text style={styles.switch_label}>Auto Add Song Requests to Queue</Text>
                                </View>
                                <SwitchFull
                                    value={isSwitchOn2}
                                    onValueChange={()=> {
                                    setIsSwitchOn2(isSwitchOn2 ? false : true)
                                    setFieldValue('allowRequests', !isSwitchOn2)}}
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
                            </View>

                        {/* GROUP INFO */}
                        <View style={[styles.main, showInfo,  {backgroundColor: bgCol} ]}>
                            <View style={{alignSelf:'center', alignItems: 'center', marginBottom: 40,}}>
                                <CircleImage size="large" margin={24} image={{uri: image}}/>
                                <ButtonNarrow 
                                label="Upload Photo"
                                color= "black"
                                isLight={true}
                                icon={require("../../../../assets/icons/upload.png")}
                                onPress={pickImage}
                                />
                            </View>

                            <CustomInputLabel label="Name Group"/>
                            
                            <CustomTextInput
                                placeholder="Name Group"
                                value={values.playlist_name}
                                onChangeText={handleChange("playlist_name")}
                                autoCapitalize='none'
                                returnKeyType='next'
                                returnKeyLabel='next'
                                underlineColorAndroid='transparent'
                                maxLength={45}
                            />
                        </View>
                        
                        <View style={[{backgroundColor: bgCol}, styles.bottom]}>
                            <ButtonFullWidth
                                label="Update Settings"
                                backgroundColor="$bg_black"
                                color="$white"
                                onPress={()=> {
                                    setFieldValue('playlist_image', image)
                                    updateSettings(values)
                                }}
                            />
                            <ButtonText
                                label="Close"
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            {/* <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <Text style={[styles.textLink, styles.contentText]}>Close</Text>
                            </TouchableOpacity>   */}
                        </View>
                    </View>
                )}
            </Formik>
            }
        </View>
    )
}
const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#0F0F0F",
        // justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        maxHeight: '10%',
        paddingHorizontal: screenPadding,
        paddingBottom: '$padding1',
    },
    content:{
        flex: 1,
        width: '100%',
        justifyContent: 'space-between'
    },
    main: {
        height: 'auto',
        backgroundColor: '$pink',
        paddingHorizontal: screenPadding,
        paddingVertical: screenPadding,
        width: '100%',
        height: 'auto'
    },
    show:{
        zIndex:1
    },
    hide:{
        zIndex: 0,
        height: 10,
        position: 'absolute'
    },
    row:{
        flexDirection:'row'
    },
    text:{
        fontSize: 12,
        paddingHorizontal: 13,
        paddingVertical: 4,
        color: '#ffffff'
    },
    button:{
        marginBottom: '$padding5',
        marginHorizontal: 5,
        borderRadius: 60,
        borderWidth: 1, 
        borderColor: '#ffffff',
    },
    active:{
        color: 'black',
        paddingBottom: 10,
        marginHorizontal: 5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
        marginTop: 20,
    },
    heading: {
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        color: '$white',
        fontWeight: '600',
    },
    note: {
        fontSize: '$fontSize5',
        marginTop: '$padding5',
        color: '$medLight_grey'
      },
    textDetail: {
        color: '#FFFFFF',
        fontSize: 12,
        marginVertical: '$padding3'
    },
    contentText:{
        color: 'black',
    },
    label: {
        fontSize: '$fontSize6',
        textTransform: 'uppercase',
        marginTop: '$padding1',
        marginBottom: '$padding4',
    },
    presets: {
        width: '100%',
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: 'row',
        fontSize: '$fontSize6',
    },
    tag: {
        paddingVertical: '$padding5 / 2',
        paddingHorizontal: '$padding4',
        flexDirection: 'row',
        borderRadius: 60,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: '$padding5',
        marginBottom: '$fontSize6'
    },
    tag_label: {
        alignSelf: 'center',
        fontSize: '$fontSize5',
        textTransform: 'none'
    },
    textLink: {
        color: '#FFFFFF',
        fontSize: 16,
        alignSelf: 'center',
        paddingVertical: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    bottom:{
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
        marginBottom: 40
    },
    radio_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '$padding3',
        height: 'auto',
    },
    radio: {
        borderWidth: 3, 
        backgroundColor: '$bg_black',
        borderRadius: 20, 
        width: 16, 
        height: 16,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    checked: {
        backgroundColor: '$bg_black',
    },
    unchecked: {
        backgroundColor: 'transparent',
    },
    checked_inner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '$blue_light',
    },
    radio_label: {
        color: '$textColor_dark',
        fontSize: '$fontSize4',
        marginBottom: '$padding5 / 2',
    },
    radio_note: {
        fontSize: '$fontSize5',
        color: '$medLight_grey',
        maxWidth: '80%'
    },
    switch_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '$padding3',
        height: 'auto',
        maxWidth: '100%',
      },
    switch: {
        backgroundColor: 'blue',
        borderRadius: 20,
    
      },
      switch_label: {
        color: '$textColor_dark',
        fontSize: '$fontSize4',
        marginBottom: '$padding5 / 2',
      },
      switch_note: {
        fontSize: '$fontSize5',
        color: '$medLight_grey',
        maxWidth: '80%'
      },
      track: {
        width: '100%',
        borderRadius: 4
      },
      thumb: {
        width: 18,
        height: 18,
        borderRadius: 20,
        backgroundColor: '$bg_black',
      },
})