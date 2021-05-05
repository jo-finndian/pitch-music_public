import React from "react";
import { View, Text, Image } from "react-native";
import EStyleSheet, { create } from "react-native-extended-stylesheet";

import ButtonFullWidth from "../../components/ButtonFullWidth";

export default ({ navigation }) => {
  
  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <Image style={{width: '16%', height: 'auto'}} source={require('../../../assets/images/logo.png')}/>
        <Text style={styles.heading}>All Done!</Text>
        <Text style={styles.note}>Your ready to start vibing.</Text>

        <View style={styles.buttonContainer}>
          <ButtonFullWidth 
            label="Get Started"
            color= "$white"
            backgroundColor="$bg_black"
            onPress={()=> (
              navigation.navigate("Fourth")
            )}
          />
        </View>
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '$blue_light',
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
  switch_label: {
    color: '$textColor_dark',
    fontSize: '$fontSize4',
    marginBottom: '$padding5 / 2',
    fontFamily: 'Poppins_400Regular',
  },
  switch_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '$padding3',
    height: 'auto',
    maxWidth: '100%',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0
  },
});