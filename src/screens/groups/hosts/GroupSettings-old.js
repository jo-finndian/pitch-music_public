import React, { useState} from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useFormState, useFormDispatch } from "../../../form/form-context";
import { Formik } from "formik";
import { Card } from "react-native-paper";
import { Slider } from 'react-native-elements';
import { SwitchFull } from 'react-native-switch-full-custom';
import EStyleSheet from "react-native-extended-stylesheet";

import firebase from "firebase";
import "@firebase/firestore";

import CircleImage from "../../../components/CircleImage"
import CustomTextInput from "../../../components/CustomTextInput";
import CustomInputLabel from "../../../components/CustomInputLabel";
import ButtonNarrow from "../../../components/ButtonNarow"
import SearchBar from "../../../components/SearchBar";
import CustomSlider from "../../../components/CustomSlider";

export default function GroupSettings({ navigation }){
    const [parentName, setParentName] = useState("mood");

    const form = React.useRef();
    const dispatch = useFormDispatch();
    const { values: formValues, errors: formErrors } = useFormState("playlist");

    const defaultValues = {
        playlist_name: '', 
        mood: [],
        energy: Number(),
        danceability: Number(),
        disabledGenres: [],
        private: true,
        allowSkipping: false,
        skipPercent: Number(),
        allowRequests: false,
      }

    var moods = [];
    var genres = [];
    var index = 0;

    const [energy, setEnergy] = useState(0.5)
    const [danceability, setDance] = useState(0.5)
    const [checked, setChecked] = useState('second');
    const [isSwitchOn1, setIsSwitchOn1] = useState(false);
    const [skip, setSkip] = useState(0.5)
    const [isSwitchOn2, setIsSwitchOn2] = useState(false);
    const [user, setUser] = React.useState();
  
    var isFocused1 = false
    var isFocused2 = false
    var isFocused3 = false
    var isFocused4 = false
    var isFocused5 = false
    var isFocused6 = false
    var isFocused7 = false
    var isFocused8 = false

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('user')
          if (jsonValue != null ) {
            setUser(JSON.parse(jsonValue));
          }
        } catch(e) {
          // error reading value
        }
      }
    
      getData();

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

    //change tab highlight
    function SettingTabs(){

        if (parentName === 'mood') 
          { return (
            <View style={styles.row}>
            <TouchableOpacity 
                style={[styles.active, { backgroundColor: '#FFA0A4', marginLeft: 25}]}
                onPress={() => setParentName('mood')}
            > 
                <Text style={[styles.text, {color: 'black'}]}>Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button]}
                onPress={() => setParentName('genres')}
            >
                <Text style={[styles.text]}>Genres</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button]}
                onPress={() => setParentName('privacy')}
            > 
                <Text style={[styles.text]}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button]}
                onPress={() => setParentName('skipping')}
            > 
                <Text style={[styles.text]}>Skipping</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button]}
                onPress={() => setParentName('requests')}
            > 
                <Text style={[styles.text]}>Song Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button, {marginRight: 25}]}
                onPress={() => setParentName('group info')}
            > 
                <Text style={[styles.text]}>Group Info</Text>
            </TouchableOpacity>
        </View>
            ); }
        else if (parentName === 'genres') 
          {    
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setParentName('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#FFA0A4',}]}
                    onPress={() => setParentName('genres')}
                >
                    <Text style={[styles.text, {color: 'black'}]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setParentName('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setParentName('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setParentName('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            );  
        } 
        else if (parentName === 'privacy'){
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setParentName('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#9CE4F1',}]}
                    onPress={() => setParentName('privacy')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setParentName('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setParentName('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
    
            ); 
        }
        else if (parentName === 'skipping'){
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setParentName('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setParentName('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#9CE4F1',}]}
                    onPress={() => setParentName('skipping')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setParentName('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            ); 
        }
        else if (parentName === 'requests'){
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setParentName('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setParentName('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button,]}
                    onPress={() => setParentName('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#9CE4F1',}]}
                    onPress={() => setParentName('requests')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, {marginRight: 25}]}
                    onPress={() => setParentName('group info')}
                > 
                    <Text style={[styles.text]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            ); 
        }
        else if (parentName === 'group info'){
            return (
                <View style={styles.row}>
                <TouchableOpacity 
                    style={[styles.button, {marginLeft: 25}]}
                    onPress={() => setParentName('mood')}
                > 
                    <Text style={[styles.text]}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('genres')}
                >
                    <Text style={[styles.text]}>Genres</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('privacy')}
                > 
                    <Text style={[styles.text]}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('skipping')}
                > 
                    <Text style={[styles.text]}>Skipping</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={() => setParentName('requests')}
                > 
                    <Text style={[styles.text]}>Song Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.active, { backgroundColor: '#FFB574', marginRight: 25}]}
                    onPress={() => setParentName('group info')}
                > 
                    <Text style={[styles.text, {color: 'black'}]}>Group Info</Text>
                </TouchableOpacity>
            </View>
            ); 
        }
      }

    //change setting page content
    function SettingContent(){

        if (parentName === 'mood') 
        { return (
                <View style={[styles.content, {backgroundColor: '#FFA0A4'}]}>
                <Formik
                    innerRef={form}
                    initialValues={defaultValues}
                    initialErrors={formErrors}
                    enableReinitialize
                    >
                    {({ values, setFieldValue }) => (
                        <View style={styles.main}>

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
                                    Party</Text>
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
                            slider={
                            <Slider
                            value={energy}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            onValueChange={(energy) => {setEnergy(energy)
                            setFieldValue('energy', energy)
                            }}
                            minimumTrackTintColor={'#000'}
                            maximumTrackTintColor={'#FFF'}
                            style={styles.slider}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            />} 
                            label="Energy" 
                            value_left="Low" 
                            value_right="high" 
                            margin={40} 
                            />
                            <CustomSlider 
                            slider={
                            <Slider
                            value={danceability}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            onValueChange={(danceability) => {setDance(danceability)
                            setFieldValue('danceability', danceability)
                            }}
                            minimumTrackTintColor={'#000'}
                            maximumTrackTintColor={'#FFF'}
                            trackStyle={styles.track}
                            thumbStyle={styles.thumb}
                            />} 
                            label="Dance" 
                            value_left="Low" 
                            value_right="high" 
                            margin={40} 
                            />

                            <Card style={styles.card}>
                            <Text>{JSON.stringify(values, null, 2)}</Text>
                            </Card>

                        </View>
                    )}
                    </Formik>
                </View>
            ); }
        else if (parentName === 'genres') 
        {    
            return (
                <View style={[styles.content, {backgroundColor: '#FFA0A4'}]}>
                    <Formik
                        innerRef={form}
                        initialValues={defaultValues}
                        initialErrors={formErrors}
                        enableReinitialize
                        >
                        {({ values, setFieldValue }) => (
                            <View style={styles.main}>
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
                                
                                <Card style={styles.card}>
                                <Text>{JSON.stringify(values, null, 2)}</Text>
                                </Card>

                            
                            </View>
                            </View>
                        )}
                    </Formik>
                </View>
            );  
        } 
        else if (parentName === 'privacy'){
            return (
                <View style={[styles.content, {backgroundColor: '#9CE4F1'}]}>
                    <Formik
                        innerRef={form}
                        initialValues={defaultValues}
                        initialErrors={formErrors}
                        enableReinitialize
                    >
                        {({ values, setFieldValue }) => (
                        <View style={styles.main}>
                        
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
                                    style={[styles.radio, (checked == 'second') ? styles.checked : styles.unchecked]}                
                                    onPress={() => {
                                    setFieldValue('private', true)
                                    setChecked('second')
                                    }}
                                    value="second"
                                    status={ checked === 'second' ? 'checked' : 'unchecked' }
                                    >
                                    <View style={[styles.checked_inner, (checked=='second') ? {backgroundColor: 'black'} : {backgroundColor:"transparent"}]}/>
                                </TouchableOpacity>
                                </View>
                                
                                <View style={styles.radio_container}>
                                <View>
                                    <Text style={styles.radio_label}>Public</Text>
                                    <Text style={styles.radio_note}>Any listeners can join.</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.radio, (checked=='first') ? styles.checked : styles.unchecked]}
                                    onPress={() => {
                                    setFieldValue('private', false)
                                    setChecked('first')
                                    }}
                                    value="first"
                                    status={ checked === 'first' ? 'checked' : 'unchecked' }
                                    >
                                    <View style={[styles.checked_inner, (checked=='first') ? {backgroundColor: 'black'} : {backgroundColor:"transparent"}]}/>
                                </TouchableOpacity>
                                </View>

                                <Card style={styles.card}>
                                <Text>{JSON.stringify(values, null, 2)}</Text>
                                </Card>
                                
                            </View>

                        </View>
                        )}
                    </Formik>
                </View>

            ); 
        }
        else if (parentName === 'skipping'){
            return (
                <View style={[styles.content, {backgroundColor: '#9CE4F1'}]}>
                    <Formik
                        innerRef={form}
                        initialValues={defaultValues}
                        initialErrors={formErrors}
                        enableReinitialize
                        >
                        {({ values, setFieldValue }) => (
                            <View style={styles.main}>
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
                                    minimumTrackTintColor={'#000'}
                                    maximumTrackTintColor={'#FFF'}
                                    trackStyle={styles.track}
                                    thumbStyle={styles.thumb}
                                    />} 
                                />
                                </View>
                                <Card style={styles.card}>
                                <Text>{JSON.stringify(values, null, 2)}</Text>
                                </Card>

                            </View>
                        )}
                    </Formik>
                </View>
            ); 
        }
        else if (parentName === 'requests'){
            return (
                <View style={[styles.content, {backgroundColor: '#9CE4F1'}]}>
                    <Formik
                        innerRef={form}
                        initialValues={defaultValues}
                        initialErrors={formErrors}
                        enableReinitialize
                        >
                        {({ values, setFieldValue }) => (
                            <View style={styles.main}>

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
                                <Card style={styles.card}>
                                    <Text>{JSON.stringify(values, null, 2)}</Text>
                                </Card>

                            </View>
                        )}
                    </Formik>           
                </View>
            ); 
        }
        else if (parentName === 'group info'){
            return (
                <View style={[styles.content, {backgroundColor: '#FFB574'}]}>
                    <Formik
                        innerRef={form}
                        initialValues={defaultValues}
                        initialErrors={formErrors}
                        enableReinitialize
                        >
                        {({ values, handleChange }) => (
                            <View style={styles.main}>

                            <View style={{alignSelf:'center', alignItems: 'center', marginBottom: 40,}}>
                                <CircleImage size="large" style={{marginBottom: 40}} margin={40}/>
                                <ButtonNarrow 
                                label="Upload Photo"
                                color= "black"
                                isLight={true}
                                style={{marginTop: 40}}
                                onPress={() => { navigation.goBack() }}
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
                            {/* <Card style={styles.card}>
                                <Text>{JSON.stringify(values, null, 2)}</Text>
                            </Card> */}

                            </View>
                        )}
                    </Formik>
                </View>
            ); 
        }
    }

    //close button background
    function CloseBtn(){
        if (parentName === 'privacy' || parentName === 'skipping' || parentName === 'requests') 
        { return (
            <View style={[styles.content, {backgroundColor: '#9CE4F1'}, styles.bottom]}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Text style={[styles.textLink, styles.contentText]}>Close</Text>
                </TouchableOpacity>  
            </View>
        ); }
        else if(parentName === 'mood' || parentName === 'genres')
        { return (
            <View style={[styles.content, {backgroundColor: '#FFA0A4'}, styles.bottom]}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Text style={[styles.textLink, styles.contentText]}>Close</Text>
                </TouchableOpacity>  
            </View>
        ); }
        else{
            return (
                <View style={[styles.content, {backgroundColor: '#FFB574'}, styles.bottom]}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Text style={[styles.textLink, styles.contentText]}>Close</Text>
                    </TouchableOpacity>  
                </View>
            );}
    }
  
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
            
            <SettingContent />

            <CloseBtn />
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
    },
    container: {
        flexDirection: 'column',
        width: windowWidth - (screenPadding*2),
        borderWidth: 1,
        borderColor: 'red',
        marginHorizontal: screenPadding,
        paddingVertical: 5,
        paddingBottom: '$padding1'
    },
    content:{
        paddingHorizontal: screenPadding,
        paddingVertical: screenPadding,
        // backgroundColor: '#FFA0A4'
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
        color: '$white',
        fontWeight: '600',
        // paddingTop: '$padding3'
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
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: screenPadding
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
        borderColor: '$blue',
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