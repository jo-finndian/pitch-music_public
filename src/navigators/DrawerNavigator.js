import React, {useState, useEffect} from 'react';
import { Image, StyleSheet } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import firebase from "firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AccountSettings from "../screens/user/AccountSettings";
import AppSettings from "../screens/user/AppSettings";
import ChangePassword from "../screens/user/ChangePassword";
import GroupNavigator from "../navigators/GroupNavigator";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props, { navigation }) {
  const [userID, setUserID] = useState();
  const [groupID, setGroupID] = useState();
  const [isHost, setIsHost] = useState();

  fetchInfo();

  async function fetchInfo() {
    const user = await AsyncStorage.getItem('user');
    const group = await AsyncStorage.getItem('group');
    const isHost = await AsyncStorage.getItem('isHost')

    if (user) {
      setUserID(user)
      // console.log("Drawer Nav, user: " + userID)
    }

    if (isHost) {
      setIsHost(isHost)
      console.log("Is user host? " + isHost)
    }
    else {
      isHost
    }

    if (group) {
      setGroupID(group)
      // console.log("Drawer Nav, group: " + groupID)
    }
    return user, group
  }

  const leaveGroup = () => {
    var ref = firebase.firestore().collection("users").doc(userID);
    var groupRef = firebase.firestore().collection('playlists').doc(groupID)
    
    groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(user.uid)
    })
    .then(() => {
      alert("You have left the group.\nNow you can join another!")
      console.log("Group updated: removed member " + user.uid)
    })
    .catch((error) => {
      console.error("Error updating group document: ", error);
    });

    return ref.update({
      group: '',
      groupRole: ''
    })
    .then(() => {
      console.log("User document successfully updated: group removed");
    })
    .catch((error) => {
      console.error("Error updating user document: ", error);
    });

    
  }

  const endGroup = async () => {
    var groupRef = firebase.firestore().collection('playlists').doc(groupID);

    // get all members of group
    groupRef
    .get().then((doc) => {
      if (doc.exists) { 

        var hostID = doc.data().host; 
        var numOfMembers = doc.data().members.length;
        var memberArray = [];

        if (numOfMembers != 0){
          for (var x = 0; x < numOfMembers; x++){
            memberArray.push(doc.data().members[x]);
          }

          // loop through and remove group and group role from user document
          for(var y= 0; y < numOfMembers; y++){

            firebase.firestore().collection("users").doc(memberArray[y])
            .update({
              group: '',
              groupRole: ''
            })
            .then(() => {
              console.log("Users successfully updated: roles and group removed for "+memberArray[y]);
            })
            .catch((error) => {
              console.error("Error updating user document: ", error);
            });

          }
        }

        // remove group and group role from host document
        firebase.firestore().collection("users").doc(hostID)
        .update({
          group: '',
          groupRole: ''
        })
        .then(() => {
          console.log("Host document successfully updated: group removed");
          alert("The group has been deleted.\nNow you can create or join another!")
        })
        .catch((error) => {
          console.error("Error updating user document: ", error);
        });

        // remove group from FB
        setTimeout(() => {
          groupRef
          .delete().then(() => {
            console.log(groupID+" successfully deleted!");
          }).catch((error) => {
            console.error("Error removing Group: ", error);
          });
        }, 900);


      } else {
        console.log("No such document!"); // doc.data() will be undefined in this case
      }

    }).catch((error) => {
      console.log("Error getting document:", error);
    });

    // const whatever = await AsyncStorage.setItem('user');
    await AsyncStorage.setItem('group', 'none');
    await AsyncStorage.setItem('isHost', 'false');
  }

  const logout = () => {
    firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signout successfull!");
      return new Promise(async (resolve, reject) => {
        try {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('expirationTime');
          return resolve(true)
        } catch (e) {
          console.log('error: ' + e)
          return reject(e)
        }
      });
      // return updateAsyncStorage();
    })
    .then(() => {   
      setTimeout(() => {
        navigation.navigate("GetStarted")
      }, 1000);
    })
    .catch((err) => alert(err.message));
  }

  function updateAsyncStorage() {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('expirationTime');
        return resolve(true)
      } catch (e) {
        console.log('error: ' + e)
        return reject(e)
      }
    });
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label=""
        onPress={()=> {
          navigation.toggleDrawer()
          // send request to host
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


      <DrawerItem label="Controls"
        labelStyle={styles.labelStyle}
        style={styles.label}
      />
      {
        (isHost == 'false')
        ?
        // if LISTENER
        <>
        <DrawerItem label="Request to be a host"
          labelStyle={styles.sub_links}
          style={styles.sub_linksStyle} 
          icon={()=><Image style={styles.icon} source={require('../../assets/icons/crown-grey.png')}/>}
          onPress={()=> {
            // send request to host
          }}
        />
        <DrawerItem label="Request to play audio"
          labelStyle={styles.sub_links}
          style={[styles.sub_linksStyle, {paddingBottom: 20, borderBottomColor: '#0f0f0f', borderBottomWidth: 1}]}
          icon={()=><Image style={styles.icon} source={require('../../assets/icons/volume-up-darkgrey.png')}/>}
          onPress={()=> {
            // switch bluetooth permissions to listener
          }}
        />
        </>
        :
        // if HOST
        <>
        <DrawerItem label="Remove yourself as host"
          labelStyle={[styles.sub_links, styles.sub_links_disable]}
          style={styles.sub_linksStyle} 
          icon={()=><Image style={styles.icon} source={require('../../assets/icons/crown-grey.png')}/>}
          onPress={()=> {
            // assign someone else host?
          }}
        />
        <DrawerItem label="Transfer audio"
          labelStyle={styles.sub_links}
          style={[styles.sub_linksStyle, {paddingBottom: 20, borderBottomColor: '#0f0f0f', borderBottomWidth: 1}]}
          icon={()=><Image style={{width: 16, height: 16, resizeMode: 'contain'}} source={require('../../assets/icons/volume-up-darkgrey.png')}/>}
          onPress={()=> {
            // don't know what this means
          }}
        />
        </>
      }
      <DrawerItem label="Settings"
        labelStyle={styles.labelStyle}
        style={[styles.label, {marginTop: 32}]} />
      
      <DrawerItemList {...props} />

      { (isHost == 'false')
      ?
      <DrawerItem label="Leave Group"
        labelStyle={styles.button}
        style={styles.buttonStyle}
        onPress={leaveGroup}
      />  
      :
      <DrawerItem label="End Group"
        labelStyle={styles.button}
        style={styles.buttonStyle}
        onPress={endGroup}
      />
      }
      <DrawerItem label="Logout"
        labelStyle={styles.textButton}
        style={styles.textButtonStyle}
        onPress={logout}
        />
    </DrawerContentScrollView>
  );
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

export default () => {
  return (
    <Drawer.Navigator
      initialRouteName="My Group"
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
        <Drawer.Screen name="My Group" component={GroupNavigator}/>
        <Drawer.Screen name="Account Settings" component={AccountSettingsStack}/>
        <Drawer.Screen name="App Settings" component={AppSettings}/>

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