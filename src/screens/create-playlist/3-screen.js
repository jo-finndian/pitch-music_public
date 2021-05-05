import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Formik } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

import Header from "../../components/Header";
import ButtonSmall from "../../components/ButtonSmall";
import SearchBar from "../../components/SearchBar";

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("playlist");

  var genres = [];

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
            <Text style={styles.heading}>Disable Genres</Text>
            <Text style={styles.note}>Select the genres you don’t want to include.</Text>

            <SearchBar></SearchBar>

            <Text style={styles.label}>Genres</Text>

            <View style={styles.presets}>
              <TouchableOpacity
                style={[styles.tag, (!isFocused1 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                onPress={()=> {
                  if (!isFocused1) {
                    genres.push('party');
                    setFieldValue('disabledGenres', genres)
                    isFocused1=true
                  } else {
                    genres.splice(genres.indexOf("party"), 1);
                    setFieldValue('disabledGenres', genres)
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
                    genres.push('happy');
                    setFieldValue('disabledGenres', genres)
                    isFocused2=true
                  } else {
                    genres.splice(genres.indexOf("happy"), 1);
                    setFieldValue('disabledGenres', genres)
                    isFocused2=false
                  } 
                }}>
                  <Text style={[styles.tag_label, (!isFocused2 ? {color: "#000"} : {color: '#fff'} )]}>Happy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tag, (!isFocused3 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                onPress={()=> {
                  if (!isFocused3) {
                    genres.push('chill');
                    setFieldValue('disabledGenres', genres)
                    isFocused3=true
                  } else {
                    genres.splice(genres.indexOf("chill"), 1);
                    setFieldValue('disabledGenres', genres)
                    isFocused3=false
                  } 
                }}>
                  <Text style={[styles.tag_label, (!isFocused3 ? {color: "#000"} : {color: '#fff'} )]}>Chill</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tag, (!isFocused4 ? {backgroundColor: "transparent"} : {backgroundColor: '#000'} )]}
                onPress={()=> {
                  if (!isFocused4) {
                    genres.push('focus');
                    setFieldValue('disabledGenres', genres)
                    isFocused4=true
                  } else {
                    genres.splice(genres.indexOf("focus"), 1);
                    setFieldValue('disabledGenres', genres)
                    isFocused4=false
                  } 
                }}>
                  <Text style={[styles.tag_label, (!isFocused4 ? {color: "#000"} : {color: '#fff'} )]}>Focus</Text>
              </TouchableOpacity>
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
                  navigation.navigate("Fourth");
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
    textTransform: 'none',
    fontFamily: 'Poppins_300Light',
  },
});