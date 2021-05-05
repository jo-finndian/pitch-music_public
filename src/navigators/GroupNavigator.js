import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

import hGroup from "../screens/groups/hosts/Group-new";
import joinReq from "../screens/groups/hosts/JoinRequests";
import settings from "../screens/groups/hosts/GroupSettings";
import songReq from "../screens/groups/hosts/SongRequests";
import feedback from "../screens/groups/hosts/FeedbackModal";

import uGroup from "../screens/groups/users/userGroup-new";

import Search from "../screens/groups/Search-active";
import InactiveSearch from "../screens/groups/Search-inactive";
import Listeners from "../screens/groups/Listeners";
import LProfile from "../screens/groups/ListenerProfile";
import Queue from "../screens/groups/Queue";

const Stack = createStackNavigator();
const MainStack = createStackNavigator();


function MainGroupStackScreen({navigation}) {
  const [isHost, setHost] = useState(true);
  var group = '';
  var groupID = '';
  var currentGroup = '';

  AsyncStorage.getItem('isHost', (err, result) => {
    if (result == 'true') {
      setHost(true)
    }
    else {
      setHost(false)
    }
  });

  return(
    <MainStack.Navigator
      screenOptions={{ headerShown: false}}
      initialRouteName="Host Group"
    >
      { isHost
        ? 
        <Stack.Screen name="Host Group" component={hGroup} initialParams={{groupID: group}}/>
        :
        <Stack.Screen name="User Group" component={uGroup} initialParams={{groupID: group}}/>
      }
    </MainStack.Navigator>
  )
  
}

function MainListenerStackScreen() {
  return(
    <MainStack.Navigator
      screenOptions={{ headerShown: false }}
    >
     <Stack.Screen name="Listeners" component={Listeners} />
     <Stack.Screen name="Listener Profile" component={LProfile} />
    </MainStack.Navigator>
  )
}

export default () => {

  return (
    <Stack.Navigator
    mode="modal"
    initialRouteName="Group View"
    screenOptions={{
      headerShown: false
    }}>
      {/* ALL USER ACCESS */}
      {/* <Stack.Screen name="Group View" component={MainGroupStackScreen} initialParams={{groupRole: isHost}}/> */}
      <Stack.Screen name="Group View" component={MainGroupStackScreen}/>
      <Stack.Screen name="Listener Modal" component={MainListenerStackScreen}/>
      <Stack.Screen name="Search Modal" component={Search}/>
      <Stack.Screen name="Search View" component={InactiveSearch}/>
      <Stack.Screen name="Queue Modal" component={Queue}/>

      {/* HOST ACCESS ONLY */}
      <Stack.Screen name="Join Req Modal" component={joinReq} />
      <Stack.Screen name="Grp Settings Modal" component={settings} />
      <Stack.Screen name="Song Req Modal" component={songReq} />
      <Stack.Screen name="Feedback Modal" component={feedback} />
    </Stack.Navigator>
  );
};