import React from "react";
import { Dimensions, View, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import ButtonFullWidth from "../../components/ButtonFullWidth";

const GetStarted = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/logo-text-white.png")} style={styles.logo}/>

      <View style={styles.buttonContainer}>
        <ButtonFullWidth
          label= "Get Started"
          color="$bg_black"
          backgroundColor="$blue_light"
          onPress={() => {
            navigation.navigate("Signup", {screen: "Connect Spotify"});
          }}
          style={{marginBottom: 20}}
        />

        <ButtonFullWidth
          label="I already have an account"
          color="$white"
          backgroundColor="$bg_black"
          style={{borderWidth: 1, borderColor: "white"}}
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      </View>
    </View>
  );
};

export default GetStarted;

const windowWidth = Dimensions.get('window').width;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "$bg_black",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: '$padding1',
    paddingHorizontal: '$padding2',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  logo: {
    width: '44%',
    height: '25%',
    marginTop: windowWidth / 4,
    resizeMode: 'contain'
  },
});
