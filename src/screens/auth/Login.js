import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Image, Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "firebase";

import CustomTextInput from "../../components/CustomTextInput";
import CustomInputLabel from "../../components/CustomInputLabel";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import ButtonFullWidth from "../../components/ButtonFullWidth";
import ButtonText from "../../components/ButtonText";
import Header from "../../components/Header"

const Login = ({ navigation }) => {

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const onChangeTextEmail = (email) => {
    setLoginForm({
      ...loginForm,
      email,
    });
  };
  const onChangeTextPassword = (password) => {
    setLoginForm({
      ...loginForm,
      password,
    });
  };

  const loginHandler = () => {
    return new Promise(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(loginForm.email, loginForm.password)
        .then((res) => {
        })
        .catch((err) => alert(err.message));
    });
  };

  return (
    <View style={styles.section}>
        <Header
          leftItem={
            <TouchableOpacity
              onPress={()=> {navigation.goBack()}}>
              <Image source={require('../../../assets/icons/back-arrow.png')}/>
            </TouchableOpacity>
          }
        />
      <View style={styles.container}>
        <Image style={{alignSelf: 'center'}} source={require('../../../assets/images/logo-text-white.png')}/>
        <View style={{flexDirection: 'column', marginTop: 40, alignItems: 'flex-start'}}>
          <CustomInputLabel
            label="Email"
            style={{marginTop: 24, color:"#d1d1d1"}}
          />
          <CustomTextInput
            placeholder="Email"
            autoCapitalize="none"
            value={loginForm.email}
            onChangeText={onChangeTextEmail}
            inverse={true}
          />
          <CustomInputLabel 
            label="Password"
            style={{marginTop: 40, color:"#d1d1d1"}}
          />
          <CustomPasswordInput
            placeholder="Password"
            value={loginForm.password}
            secureTextEntry
            onChangeText={onChangeTextPassword}
            autoCapitalize="none"
            label="Password"
            autoCapitalize='none'
            returnKeyType='next'
            returnKeyLabel='next'
            underlineColorAndroid='transparent'
            showIcon={true}
            icon={"ios-eye-outline"}
            icon2={"eye-off-outline"}
            inverse={true}
          />
          <ButtonText
            label="Forgot your password?"
            color="#d1d1d1"
            style={{fontSize: 12, marginTop: 24}}
            onPress={() => {
              navigation.navigate("Reset Password");
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonFullWidth
            label= "Login"
            color="$bg_black"
            backgroundColor="$blue"
            style={{marginTop: 40, marginBottom: 6}}
            onPress={loginHandler}
          />
          <ButtonText
            label="Create Account"
            color="#D1D1D1"
            // style={{textDecorationLine: "none"}}
            onPress={() => {
              navigation.navigate("Signup", {screen: "Connect Spotify"});
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Login;

const windowWidth = Dimensions.get('window').width;

const styles = EStyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: "$bg_black",
    paddingHorizontal: '$padding2',
    paddingVertical: '$padding1',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
  logo: {
    width: '44%',
    height: '25%',
    marginTop: windowWidth / 4,
    resizeMode: 'contain'
  },
});
