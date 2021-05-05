import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import ConnectSpotify from "../screens/registration/ConnectSpotify";
import ConnectSpotify from "../screens/registration/ConnectSpotify copy";
import FirstScreen from "../screens/registration/first-screen";
import SecondScreen from "../screens/registration/second-screen";
import ThirdScreen from "../screens/registration/third-screen";
import FourthScreen from "../screens/registration/fourth-screen";
import ModalSorry from "../screens/registration/ModalSorry";

const Stack = createStackNavigator();
const MainStack = createStackNavigator();

function MainRegistrationStackScreen() {
  return (
    <MainStack.Navigator
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Connect Spotify" component={ConnectSpotify} />
      <Stack.Screen name="First" component={FirstScreen} />
      <Stack.Screen name="Second" component={SecondScreen} />
      <Stack.Screen name="Third" component={ThirdScreen} />
      <Stack.Screen name="Fourth" component={FourthScreen} />
    </MainStack.Navigator>
  );
}

export default () => {
  return (
    <Stack.Navigator
    mode="modal"
    screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Signup" component={MainRegistrationStackScreen} screenOptions={{ headerShown: false }}/>
      <Stack.Screen name="Modal - No Spotify" component={ModalSorry} />

      {/* <Stack.Screen name="Connect Spotify" component={ConnectSpotify} />
      <Stack.Screen name="First" component={FirstScreen} />
      <Stack.Screen name="Second" component={SecondScreen} />
      <Stack.Screen name="Third" component={ThirdScreen} /> */}
    </Stack.Navigator>
  );
};