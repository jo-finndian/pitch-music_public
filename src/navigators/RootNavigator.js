import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/auth/Login";
import RegistrationNavigator from "./RegistrationNavigator"
import ResetPassword from "../screens/auth/ResetPassword"
import GetStarted from "../screens/auth/GetStarted";

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={RegistrationNavigator} />
      <Stack.Screen name="Reset Password" component={ResetPassword} />
    </Stack.Navigator>
  );
};