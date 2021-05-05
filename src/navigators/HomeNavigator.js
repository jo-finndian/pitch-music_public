import React, {useState} from "react";
import { Image, StyleSheet } from 'react-native';
import firebase from "firebase";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerActions } from '@react-navigation/drawer';

import CreatePlaylistNavigator from "./CreatePlaylistNavigator"
import AccountSettings from "../screens/user/AccountSettings";
import ChangePassword from "../screens/user/ChangePassword";
import Home from "../screens/Home";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStackScreens() {
  return(
    <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ 
      headerShown: false 
    }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Create Group" component={CreatePlaylistNavigator} />
    </Stack.Navigator>
  )
}

function AccountSettingsStack() {
  return(
    <Stack.Navigator
    initialRouteName="Account Settings"
    screenOptions={{ 
      headerShown: false 
    }}
    >
      <Stack.Screen name="Account Settings" component={AccountSettings}/>
      <Stack.Screen name="Change Password" component={ChangePassword} />
    </Stack.Navigator>
  )
}

function CustomDrawerContent(props) {

  const navigation = useNavigation();

  const logout = () => {
    firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signout successfull!");
      // return new Promise(async (resolve, reject) => {
      //   try {
      //     await AsyncStorage.removeItem('accessToken');
      //     await AsyncStorage.removeItem('refreshToken');
      //     await AsyncStorage.removeItem('expirationTime');
      //     return resolve(true)
      //   } catch (e) {
      //     console.log('error: ' + e)
      //     return reject(e)
      //   }
      // });
      // return updateAsyncStorage();
    })
    .then(() => {   
      setTimeout(() => {
        navigation.navigate("GetStarted")
      }, 1000);
    })
    .catch((err) => alert(err.message));
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label=""
        onPress={()=> {
          props.navigation.closeDrawer();
        }}
        icon={()=>
          <Image source={require('../../assets/icons/x-large.png')}
            style={{alignSelf: 'flex-end', position: 'absolute', right: 0}}
          />
        }
      />
      <DrawerItem
        style={{marginBottom: '15%', alignSelf:'center', right: -24}}
        label=""
        labelStyle={{}}
        icon={() => 
          <Image source={require('../../assets/images/logo-text.png')}/>
      }/>

      <DrawerItem label="Settings"
        labelStyle={styles.labelStyle}
        style={[styles.label, {marginTop: 32}]} />
      
      <DrawerItemList {...props} />

      <DrawerItem label="Logout"
        labelStyle={styles.button}
        style={styles.buttonStyle}
        onPress={logout}
      />
    </DrawerContentScrollView>
  );
}

export default () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      title="Settings"
      drawerType="slide"
      drawerStyle={{width: '83%', backgroundColor: '#0f0f0f'}}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: "#0f0f0f",
        inactiveTintColor: "#0f0f0f",
        activeBackgroundColor: "transparent",
        style: styles.drawer,
        labelStyle: styles.drawer_links,
        itemStyle: {marginBottom: -2, marginTop:0, marginLeft: 0},
        contentContainerStyle: {paddingLeft: 24, marginLeft: 0, height: '100%', position: 'relative'},
      }}>

      <Drawer.Screen name="Home" component={HomeStackScreens}/>
      <Drawer.Screen name="Account Settings" component={AccountSettingsStack}/>
      {/* <Drawer.Screen name="App Settings" component={AppSettings}/> */}
    </Drawer.Navigator>
  );
};


const styles = StyleSheet.create({
  label: {
    marginLeft: 0,
    marginBottom: -10
  },
  labelStyle: {
    textTransform: 'uppercase',
    fontSize: 10,
    color:"#0f0f0f"
  },
  sub_links: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: 'black',
    marginLeft: -20,
  },
  sub_links_disable: {
    color: '#0f0f0f9a'
  },
  sub_linksStyle: {
    marginBottom: -10,
    marginLeft: 0
  },
  drawer_links: {
    fontSize: 16,  
    height: 'auto',
    fontFamily: "Poppins_600SemiBold"
  },
  drawer: {
    width: '100%',
    backgroundColor: '#9CE4F1',
    paddingLeft: 0,
    paddingRight: 16, 
    marginLeft: 0,
    borderBottomRightRadius: 24, 
    borderTopRightRadius: 24
  },
  button: {
    color: 'white',
    fontSize: 16, 
    textAlign: 'center', 
    marginRight: '-10%',
    fontFamily: 'Poppins_500Medium'
  },
  buttonStyle: {
    marginLeft:0,
    borderRadius: 30,
    backgroundColor: 'black', 
    width: '100%', 
    position: 'absolute', 
    bottom: 70, 
    left: 20
  },
  textButton: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline',
    color: 'black',
    textAlign: 'center',
  },
  textButtonStyle: {
    position: 'absolute', 
    width: '100%', 
    bottom: 20, 
    left: 20,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  disable: {
    display: 'none'
  }
})