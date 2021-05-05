import React, {useState} from "react";
import { View, TouchableOpacity, Image } from "react-native";
// import { Card, Text } from "react-native-paper";
import { Formik } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import * as ImagePicker from 'expo-image-picker';

import CustomTextInput from "../../components/CustomTextInput";
import CustomInputLabel from "../../components/CustomInputLabel";
import ButtonSmall from "../../components/ButtonSmall"
import ButtonNarrow from "../../components/ButtonNarow"
import CircleImage from "../../components/CircleImage"
import Header from "../../components/Header"

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("playlist");

  const [image, setImage] = useState('');

  const defaultValues = {
    playlist_name: '', 
    mood: [],
    energy: 0.5,
    danceability: 0.5,
    disabledGenres: [],
    private: true,
    allowSkipping: false,
    skipPercent: 0.5,
    allowRequests: false,
    // playlist_image: defaultImg
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

  return (
    <Formik
      innerRef={form}
      initialValues={defaultValues}
      initialErrors={formErrors}
      enableReinitialize
      // validate={validate}
    >
      {({ values, handleChange, setFieldValue }) => (
        <View style={styles.main}>
           <Header
            leftItem={
              <TouchableOpacity
                onPress={()=> {navigation.goBack()}}>
                  <Image source={require('../../../assets/icons/x-large.png')}/>
              </TouchableOpacity>
            }
            middleItem={
              <Image source={require('../../../assets/icons/group1-create.png')}/>
            }
          />

          <View style={styles.container}>
            <View style={{alignSelf:'center', alignItems: 'center', marginBottom: 40,}}>
              <CircleImage size="large" margin={38} image={{uri: image}}/>
              <ButtonNarrow 
                icon={require("../../../assets/icons/upload.png")}
                label="Upload Photo"
                color= "black"
                isLight={true}
                onPress={() => {
                  pickImage()
                }}
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
                if (image == '') {
                  alert("Please choose a group photo.")
                }
                else {
                  setFieldValue('playlist_image', image)
                  navigation.navigate("Second");
                }
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
    height: 300,
  },
  main: {
    flex: 1,
    backgroundColor: '$orange',
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
});