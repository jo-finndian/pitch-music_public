import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import GroupOnboarding from "../screens/create-playlist/onboarding";
import FirstScreen from "../screens/create-playlist/1-screen";
import SecondScreen from "../screens/create-playlist/2-screen";
import ThirdScreen from "../screens/create-playlist/3-screen";
import FourthScreen from "../screens/create-playlist/4-screen";
import FifthScreen from "../screens/create-playlist/5-screen";
import SixthScreen from "../screens/create-playlist/6-screen";
import SeventhScreen from "../screens/create-playlist/7-screen";

const Stack = createStackNavigator();

export default () => {
  const [isFirstLaunched, setFirstLaunched] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if(value == null) {
        AsyncStorage.removeItem("alreadyLaunched");
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setFirstLaunched(true);
      }
      else {
        setFirstLaunched(false); //change to FALSE when live`
      }
    });
  }, []);

  if( isFirstLaunched == null) {
    return null;
  }
  else {
    return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>

        {isFirstLaunched && <Stack.Screen name="Onboarding" component={GroupOnboarding} />}
        
        <Stack.Screen name="First" component={FirstScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
        <Stack.Screen name="Third" component={ThirdScreen} />
        <Stack.Screen name="Fourth" component={FourthScreen} />
        <Stack.Screen name="Fifth" component={FifthScreen} />
        <Stack.Screen name="Sixth" component={SixthScreen} />
        <Stack.Screen name="Seventh" component={SeventhScreen} />
      </Stack.Navigator>
    );
  }
};