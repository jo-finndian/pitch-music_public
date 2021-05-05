import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Formik } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import { Slider } from 'react-native-elements';

import Header from "../../components/Header";
import ButtonSmall from "../../components/ButtonSmall";
import CustomSlider from "../../components/CustomSlider";

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("playlist");

  var moods = [];
  const [energy, setEnergy] = useState(0.5)
  const [danceability, setDance] = useState(0.5)

  var isFocused1 = false
  var isFocused2 = false
  var isFocused3 = false
  var isFocused4 = false

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (form.current) {
        const { values, errors } = form.current;
        dispatch({
          type: "UPDATE_FORM",
          payload: {
            id: "playlist", // CREATES NEW FORM BASED ON ID
            data: { values, errors }
          }
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

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
              <Image source={require('../../../assets/icons/group2-vibes.png')}/>
            }
          />

          <View style={styles.container}>
            <Text style={styles.heading}>Set the Mood</Text>
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
                  navigation.navigate("Third");
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
  main: {
    flex: 1,
    backgroundColor: '$pink',
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
  slider_container: {
    marginTop: '$padding2 + 4',
    marginBottom: '$padding1',
    flexDirection: 'column',
  },
  heading: {
    fontSize: '$fontSize1',
    fontFamily: 'Poppins_600SemiBold'
  },
  label: {
    fontSize: '$fontSize6',
    textTransform: 'uppercase',
    marginTop: '$padding2',
    marginBottom: '$padding4',
    fontFamily: 'Poppins_500Medium'
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
    marginBottom: '$padding5'
  },
  tag_label: {
    alignSelf: 'center',
    fontSize: '$fontSize5',
    textTransform: 'none',
    fontFamily: 'Poppins_300Light',
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
});