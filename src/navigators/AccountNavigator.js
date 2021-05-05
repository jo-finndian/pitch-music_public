import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountSettings from "../screens/user/AccountSettings";
import AppSettings from "../screens/user/AppSettings";

const Stack = createStackNavigator();

export default () => {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="App Settings" component={AppSettings} />
      <Stack.Screen name="Account Settings" component={AccountSettings} />
    </Stack.Navigator>
  );
};