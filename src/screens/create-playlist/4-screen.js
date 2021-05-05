import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Formik } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";

import EStyleSheet, { create } from "react-native-extended-stylesheet";

import Header from "../../components/Header";
import ButtonSmall from "../../components/ButtonSmall";

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("playlist");
  
  const [checked, setChecked] = useState('second');

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
              <Image source={require('../../../assets/icons/group3-settings.png')}/>
            }
          />

          <View style={styles.container}>
            <Text style={styles.heading}>Group Privacy</Text>
            <Text style={styles.note}>Select how you want your listeners to be able to join.</Text>

            <Text style={styles.label}>Privacy</Text>

            <View>
              <View style={styles.radio_container}>
                <View>
                  <Text style={styles.radio_label}>Private</Text>
                  <Text style={styles.radio_note}>Listeners can request your permission to join or can join direcetly with a group link.</Text>
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

              {/* <Card style={styles.card}>
                <Text>{JSON.stringify(values, null, 2)}</Text>
              </Card> */}
              
            </View>

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
                  navigation.navigate("Fifth");
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
  radio_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '$padding2'
  }, 
  radio_label: {
    color: '$textColor_dark',
    fontSize: '$fontSize4',
    marginBottom: '$padding5 / 2',
    fontFamily: 'Poppins_600SemiBold'
  },
  radio_note: {
    fontSize: '$fontSize5',
    color: '$medLight_grey',
    maxWidth: '95%',
    minWidth: '90%',
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular'
  },
});