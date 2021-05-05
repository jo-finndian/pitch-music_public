import React, {useState, useEffect} from "react";
import { View, Text, Image, Share, TouchableOpacity } from "react-native";
import * as Linking from 'expo-linking';
import EStyleSheet, { create } from "react-native-extended-stylesheet";
import Clipboard from 'expo-clipboard';
import * as firebase from "firebase";

import Header from "../../components/Header";
import ButtonFullWidth from "../../components/ButtonFullWidth";
import CircleImage from "../../components/CircleImage";
import CustomInputLabel from "../../components/CustomInputLabel";
import ButtonText from "../../components/ButtonText";

export default ({ navigation, route }) => {
  
  const params = route.params;
  var groupInfo = '';

  const uri = Linking.createURL('', {
    queryParams: { groupID: params["groupID"] },
  });

  const copyToClipboard = () => {
    console.log(uri)
    Clipboard.setString(uri);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();

    console.log(text)
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Join our group on Pitch – click here to join!\n",
        title: `Join ${params["name"]} on Pitch.`,
        url: uri
      },
      {
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          // 'com.apple.UIKit.activity.CopyToPasteboard',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToFirefox',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          // 'com.apple.mobilenotes.SharingExtension',
          'com.apple.mobileslideshow.StreamShareService',
          'com.linkedin.LinkedIn.ShareExtension',
          'pinterest.ShareExtension',
          'com.google.GooglePlus.ShareExtension',
          'com.tumblr.tumblr.Share-With-Tumblr',
          // 'net.whatsapp.WhatsApp.ShareExtension', //WhatsApp
        ],
      });
  
      if (result.action === Share.sharedAction) {
        alert("Link copied to clipboard.")
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("share cancelled")
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getGroup = async (groupID) => {
  // async function getGroup(groupID){
    return new Promise(async (resolve, reject) => {
      try {
        // const docRef = firebase.firestore().collection("playlists").doc(params["groupID"]);
        const docRef = firebase.firestore().collection("playlists").doc(groupID);

        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            groupInfo = doc.data();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }).then(() => {
          navigation.navigate('My Group', {screen: "Group View", params: {screen: 'Host Group', params: {groupInfo: groupInfo}}});
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
        return resolve(true);
      } catch (e) {
          return reject(e);
      } 
    });
  }

  return (
    <View style={styles.main}>
      <Header
        leftItem={
          <TouchableOpacity
            onPress={()=> {navigation.navigate("Home")}}>
              <Image source={require('../../../assets/icons/x-large.png')}/>
          </TouchableOpacity>
        }
        middleItem={
          <Image source={require('../../../assets/icons/group4-share.png')}/>
        }
      />

      <View style={styles.container}>
        <Text style={styles.heading}>All Done!</Text>
        <Text style={styles.note}>Your ready to start vibing.</Text>

        <View style={styles.shareCard}>
          <Text style={styles.headingWhite}>Invite Your Friends</Text>
          <View style={{flexDirection: "column", alignItems: 'center', marginTop: 24}}>
            <CircleImage size="medium" image={params["image"]}/>
            <Text style={styles.subHeading}>{params["name"]}</Text>
          </View>

          <TouchableOpacity style={styles.link}
            onPress={copyToClipboard}>
            <CustomInputLabel label="Group Link" style={{color: 'white'}}/>

            <View style={styles.linkContainer}>
              <Text style={styles.shareLink}>{uri}</Text>
              <Image source={require('../../../assets/icons/copy-link.png')} style={styles.icon}/>
            </View>
          </TouchableOpacity>

          <ButtonFullWidth
            label="Share"
            backgroundColor="$white"
            style={{marginTop: 30, borderWidth: 2, borderColor: 'white'}}
            onPress={()=>onShare()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonText
            label="Start Listening"
            onPress={() => {
              getGroup(params["groupID"])
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '$green',
    paddingVertical: '$padding1',
    paddingHorizontal: '$padding2',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: '20%'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center'
  },
  heading: {
    fontSize: '$fontSize1',
    fontFamily: 'Poppins_600SemiBold'
  },
  headingWhite: {
    fontSize: '$fontSize1',
    fontFamily: 'Poppins_600SemiBold',
    color: '$white'
  },
  subHeading: {
    color: '$white',
    fontSize: '$fontSize3',
    fontFamily: 'Poppins_600SemiBold',
    marginTop: '$padding4',
    marginBottom: 32,
    maxWidth: '66%',
    textAlign: 'center'
  },
  note: {
    fontSize: '$fontSize5',
    marginTop: '$padding5',
    color: '$medLight_grey',
    fontFamily: 'Poppins_400Regular'
  },
  shareCard: {
    width: '100%',
    backgroundColor: '$bg_black',
    borderRadius: 12,
    padding: 24,
    marginTop: '$padding1'
  },
  link:{
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    width: '100%'
  },
  linkContainer: {
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  shareLink: {
    color: '$white',
    fontFamily: 'Poppins_500Medium',
    flexDirection: 'row',
  },
  icon: {
    width: 16, 
    resizeMode: 'contain'
  }
})