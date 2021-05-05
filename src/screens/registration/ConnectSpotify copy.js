import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import * as secrets from "../../secrets";
import {getTokens} from "../../scripts/getTokens";

import Header from "../../components/Header";
import ButtonFullWidth from "../../components/ButtonFullWidth";
import ButtonFullWidthIcon from "../../components/ButtonFullWidthIcon";

var credentials= {};

export function getSpotifyCredentials() {
  credentials = secrets["spotifyCredentials"];
  return (secrets["spotifyCredentials"])
}

export default ({ navigation }) => {

  getSpotifyCredentials();

  async function promptAsync() {
    try {
      await getTokens(credentials);
    } catch (error) {
      console.log(error)
    }
    return navigation.navigate("First")
  }

  return (
      <View style={styles.main}>
        <Header
          leftItem={
            <TouchableOpacity
              onPress={()=> {navigation.goBack()}}>
                <Image source={require('../../../assets/icons/back-arrow.png')}/>
            </TouchableOpacity>
          }
          middleItem={
            <Image source={require('../../../assets/icons/onboarding1-connect.png')}/>
          }
        />
  
        <View style={styles.container}>
          <Text style={styles.heading}>Connect Your Account</Text>
          <Text style={[styles.subtitle, {marginBottom: 24}]}>Login with your Spotify account to get started.</Text>
          <Text style={styles.subtitle}><Text style={styles.bold}>Note:</Text> To access all of Pitch's features, a Spotify premium account is recommended.</Text>
  
          <View style={styles.buttonContainer}>
            <ButtonFullWidthIcon
              label= "Login to Spotify"
              color="$bg_black"
              backgroundColor="$green"
              icon={require('../../../assets/icons/spotify-icon.png')}
              style={{marginBottom: 20}}
              onPress={() => {
                promptAsync();
              }}
            />
  
            <ButtonFullWidth
              label="I don't have Spotify"
              color="$white"
              backgroundColor="$bg_black"
              style={{borderWidth: 1, borderColor: "white"}}
              onPress={() => {
                navigation.navigate("Modal - No Spotify");
              }}
            />
          </View>
        </View>
  
      </View>
  );
};

const styles = EStyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '$bg_black',
    paddingHorizontal: '$padding2',
    paddingVertical: '$padding1'
  },
  container: {
    flex: 1,
    backgroundColor: "$bg_black",
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0
  },
  heading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: '$fontSize1',
    color: '$white',
    marginBottom: '$padding5',
    marginTop: '$padding1'
  },
  subtitle: {
    fontSize: 14,
    maxWidth: '90%',
    color: '$white',
    fontFamily: 'Poppins_400Regular',
  },
  bold: {
    fontFamily: 'Poppins_600SemiBold'
  }
});