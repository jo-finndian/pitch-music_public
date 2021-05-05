import { View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import Onboarding from 'react-native-onboarding-swiper';
import ButtonFW from "../../components/ButtonFullWidth";

const ButtonFullWidth = () => {
  const navigation = useNavigation();

  return(
    <ButtonFW 
      style={{position: 'absolute', bottom: 0}}
      label="Get Started" 
      color="$black"
      backgroundColor="$blue"
      onPress={() => {
        navigation.navigate("First");
      }}
    />
  )
}

const GroupOnboarding = () => {
  const navigation = useNavigation();

  return (
    <Onboarding
      DoneButtonComponent={ButtonFullWidth}
      bottomBarHighlight={false}
      showSkip={false}
      showNext={false}
      pages={[
        {
          backgroundColor: '#0F0F0F',
          // image: <Image source={require('../../../assets/images/Rectangle.png')} />,
          title: 'Hosting a Group',
          subtitle: (
            <View>
              <Text style={styles.text}>When you create a group you will be assigned as the host as well as designated to play the music. You can reassign hosts and the who's playing the music once the group is created.</Text>
              <Text style={styles.tip}><Text style={styles.bold}>Tip! </Text>You can add friends as hosts to the group as well.</Text>
            </View>
            ),
          element: (
          <TouchableOpacity
            onPress={() => navigation.navigate('Create Group', {screen: "First"})}>
            <Text style={styles.skipBtn}>Skip</Text>
          </TouchableOpacity>
          ),
        },
        {
          backgroundColor: '#0F0F0F',
          // image: <Image source={require('../../../assets/images/Rectangle.png')}/>,
          title: 'Location Based',
          subtitle: 'Groups will appear available on listeners devices if the are within 100 yard (football field) radius of the group location.',
          element: (
            <TouchableOpacity
              onPress={() => navigation.navigate('Create Group', {screen: "First"})}>
              <Text style={styles.skipBtn}>Skip</Text>
            </TouchableOpacity>
            ),
        },
        {
          backgroundColor: '#0F0F0F',
          // image: <Image source={require('../../../assets/images/Rectangle.png')} />,
          title: 'Ending a Group',
          subtitle: "A host can end a group at anytime and all the listeners will be removed from the group. After 24 hours a group would expire",
          element:(
            <Text></Text>
          )
        },
      ]}
    />
  )
};

export default GroupOnboarding;

const styles = EStyleSheet.create({
  skipBtn: { 
    paddingHorizontal: '$padding2',
    fontSize: '$fontSize4',
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    color: '$white',
  },
  text: {
    color: "$textColor_grey",
    lineHeight: 18,
    fontSize: 12,
  },
  tip: {
    marginTop: '$padding3', 
    color: "$textColor_grey",
    lineHeight: 18,
    fontSize: '$fontSize5',
  },
  bold: {
    fontWeight: 'bold',
  }
})

