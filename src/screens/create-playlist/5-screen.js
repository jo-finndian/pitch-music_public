import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Formik } from "formik";
import { SwitchFull } from 'react-native-switch-full-custom';
import { useFormState, useFormDispatch } from "../../form/form-context";
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import { Slider } from 'react-native-elements';

import Header from "../../components/Header";
import ButtonSmall from "../../components/ButtonSmall";
import CustomSlider from "../../components/CustomSlider";

export default ({ navigation }) => {
  const form = React.useRef();
  const dispatch = useFormDispatch();
  const { values: formValues, errors: formErrors } = useFormState("playlist");

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [skip, setSkip] = useState(0.5)
  
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
            <Text style={styles.heading}>Song Skipping</Text>
            <Text style={styles.note}>Would you like all listeners to be allowed to skip songs?</Text>

            <Text style={styles.label}>skipping</Text>

            <View style={styles.switch_container}>
              <View>
                <Text style={styles.switch_label}>Listener Skipping</Text>
                <Text style={styles.switch_note}>Enable if you want the listeners in the group to be able to skip songs.</Text>
              </View>
              <SwitchFull
                value={isSwitchOn}
                onValueChange={() => {
                  setIsSwitchOn(isSwitchOn ? false : true)
                  setFieldValue('allowSkipping', !isSwitchOn)
                }}
                circleSize={10}
                barHeight={18}
                circleBorderWidth={0}
                backgroundActive={'#0f0f0f'}
                backgroundInactive={'#3E9FB0'}
                circleActiveColor={'#FFF'}
                circleInActiveColor={'#FFF'}
                renderActiveText={false}
                renderInActiveText={false}
                changeValueImmediately={true}
                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                switchWidthMultiplier={3} // multipled by the `circleSize` prop to calculate total width of the Switch
                switchBorderRadius={30}
              />
            </View>

            <View style={isSwitchOn ? styles.slider_container : {display: 'none'}}>
              <View>
                <Text style={styles.switch_label}>Skip Threshold</Text>
                <Text style={styles.switch_note}>Select the percentage of listeners that would need to request to skip before the song changes.</Text>
              </View>

              <CustomSlider 
                label="Skip Percentage" 
                value_left="0%" 
                value_right="100%" 
                slider={
                <Slider
                value={skip}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                onValueChange={(skip) => {setSkip(skip)
                  setFieldValue('skipPercent', skip)
                }}
                minimumTrackTintColor={'#000'}
                maximumTrackTintColor={'#FFF'}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                />} 
              />
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
                  navigation.navigate("Sixth");
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
  switch_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '$padding3',
    height: 'auto',
    width: '100%',
  },
  slider_container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: '$padding1 - 16', 
    marginBottom: '$padding3',
    height: 'auto',
    width: '100%',
  },
  switch: {
    backgroundColor: 'blue',
    borderRadius: 20,
  },
  switch_label: {
    color: '$textColor_dark',
    fontSize: '$fontSize4',
    marginBottom: '$padding5 / 2',
    fontFamily: 'Poppins_600SemiBold'
  },
  switch_note: {
    fontSize: '$fontSize5',
    color: '$medLight_grey',
    maxWidth: '95%',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20
  },
  track: {
    width: '100%',
    borderRadius: 4
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 20,
    backgroundColor: '$bg_black',
  },
});