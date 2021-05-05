import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native"; 
import { Formik } from "formik";
import { useFormState, useFormDispatch } from "../../form/form-context";
import * as yup from "yup";
import EStyleSheet, { create, value } from "react-native-extended-stylesheet";

import CustomPasswordInput from "../../components/CustomPasswordInput";
import CustomInputLabel from "../../components/CustomInputLabel";
import ButtonSmall from "../../components/ButtonSmall"
import Header from "../../components/Header"

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("user");
  const [showConfirm, setShowConfirm] = useState(false);

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

  let schema = yup.object().shape({
    // user_password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Must include blah blah").required('Required'),
    user_password: yup.string().min(8).required('Password must contain minimum 8 characters.')
    // user_passwordConfirm: yup.string().matches(values.user_password)
  })

  const showPasswordConfirm = () => {
      setShowConfirm(true)
  }

  return (
    <Formik
      innerRef={form}
      initialValues={formValues}
      initialErrors={formErrors}
      enableReinitialize
      validateOnChange={true}
      validationSchema={schema}
    >
        {({ values, handleChange, errors}) => (
        <View style={styles.main}>
          <Header
            leftItem={
              <TouchableOpacity
                onPress={()=> {navigation.goBack()}}>
                  <Image source={require('../../../assets/icons/x-large.png')}/>
              </TouchableOpacity>
            }
            middleItem={
              <Image source={require('../../../assets/icons/onboarding2-confirm.png')}/>
            }
          />
          
          <View style={styles.container}>
            <Text style={styles.heading}>Password</Text>
            <Text style={styles.note}>Please choose a password.</Text>

            <View style={{marginTop: EStyleSheet.value('$padding1 * 3')}}>
              <CustomInputLabel label="Password" style={{marginTop: 24}}/>
              <CustomPasswordInput
                autoCapitalize="none"
                label="Password"
                placeholder="Enter password"
                value={values.user_password}
                onChangeText={handleChange("user_password")}
                // textContentType="newPassword"
                // passwordRules="minlength: 8;"
                onEndEditing={()=> {
                  showPasswordConfirm()
                }}
                onSelectionChange={()=> {
                  showPasswordConfirm()
                }}
                autoCapitalize='none'
                returnKeyType='next'
                returnKeyLabel='next'
                underlineColorAndroid='transparent'
                showIcon={true}
                icon={"ios-eye-outline"}
                icon2={"eye-off-outline"}
              />
              {errors.user_password && <Text>{errors.user_password}</Text>}
                
              <View style={!showConfirm ? {display: 'none'} : {display:'flex'}}>
                <CustomInputLabel label="Confirm Password" style={{marginTop: 40}}/>
                <CustomPasswordInput
                  autoCapitalize="none"
                  label="Password"
                  placeholder="Confirm password"
                  value={values.user_passwordConfirm}
                  onChangeText={handleChange("user_passwordConfirm")}
                  autoCapitalize='none'
                  returnKeyType='next'
                  returnKeyLabel='next'
                  // textContentType="newPassword"
                  // passwordRules="minlength: 8;"
                  underlineColorAndroid='transparent'
                  showIcon={true}
                  icon={"ios-eye-outline"}
                  icon2={"eye-off-outline"}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ButtonSmall
                label="Back"
                color= "transparent"
                onPress={() => { navigation.goBack() }}
              />
              <ButtonSmall 
                label="Next"
                color="black"
                isLight={true}
                disable={(values.user_password == values.user_passwordConfirm) ? false : true}
                onPress={() => {
                  // setFieldValue("user_password", values.user_password)
                  console.log("Password: " + values.user_password)
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
    backgroundColor: '$orange',
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
  input: {
    height: 50,
    width: 300,
    marginVertical: 12,
    backgroundColor: 'transparent',
    borderBottomColor: 'black'
  },
  goodPassword: {
    color: 'green'
  },
  badPassword: {
    color: 'red'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
});