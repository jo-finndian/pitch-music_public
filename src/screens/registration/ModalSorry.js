import * as React from "react";
import { View, Dimensions, Text, TouchableOpacity, Image } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import EStyleSheet from "react-native-extended-stylesheet";

import ButtonFullWidthIcon from "../../components/ButtonFullWidthIcon";
import Header from "../../components/Header";

export default ({ navigation }) => {

  return (
    <View style={styles.main}>
        <Header
          leftItem={
            <TouchableOpacity
              onPress={()=> {navigation.goBack()}}>
                <Image source={require('../../../assets/icons/back-arrow.png')}/>
            </TouchableOpacity>
          }
        />

      <View style={styles.container}>
        <Text style={styles.heading}>Sorry to Break the News :(</Text>
        <Text style={styles.subtitle}>At this time Pitch requires to use a Spotify account so that we can access your music preferences.</Text>

        <Text style={styles.subheading}>Don’t give up yet!</Text>
        <Text style={styles.note}>You can create a Spotify account for free!</Text>

        <View style={styles.buttonContainer}>
          <ButtonFullWidthIcon
            label= "Create a Spotify Account"
            color="$bg_black"
            backgroundColor="$green"
            icon={require('../../../assets/icons/spotify-icon.png')}
            style={{marginBottom: 20}}
            onPress={() => {
              WebBrowser.openBrowserAsync('https://www.spotify.com');
              navigation.goBack();
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
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: '$fontSize1',
    fontFamily: 'Poppins_600SemiBold',
    color: '$white'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: '$padding4',
    color: '$textColor_grey',
    lineHeight: 20
  },
  subheading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: '$fontSize4',
    marginTop: '$padding1',
    color: '$textColor_light',
    lineHeight: 20
  },
  note: {
    fontFamily: 'Poppins_400Regular',
    fontSize: '$fontSize5',
    marginTop: '$padding5 /2',
    color: '$textColor_grey',
    lineHeight: 20
  },
  card: {
    width: 200,
    height: 200,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
  },
});