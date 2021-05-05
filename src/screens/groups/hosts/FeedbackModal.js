import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import firebase from "firebase";
import "@firebase/firestore";
import EStyleSheet from "react-native-extended-stylesheet";

import FeedbackElement from '../../../components/FeedbackElement';
import { ScrollView } from 'react-native';

export default function FeedbackModal({ navigation }){
  
  return (
      <View style={styles.section}>
          {/* SEARCH */}
          <View style={[styles.container, styles.top]}>
              <Text style={styles.heading}>Feedback</Text>
              <Text style={styles.textDetail}>Here's what the people are feeling in the group.</Text>
          </View>
        <ScrollView>
          <View style={styles.container}>
             <View style={styles.block_groupList}>
                  {/* Map groups into group list item */}
                  <View style={styles.separator}>
                    <FeedbackElement data={{response:'Currently Vibing', timestamp:'3 mins ago'}} />
                  </View>
                  <View style={styles.separator}>
                    <FeedbackElement data={{response:'Wants Party Vibes', timestamp:'7 mins ago'}} />
                  </View>
                  <View style={styles.separator}>
                    <FeedbackElement data={{response:'Wants Nostalgic Vibes', timestamp:'12 mins ago'}} />
                  </View>
                  <View style={styles.separator}>
                    <FeedbackElement data={{response:'Wants Relaxed Vibes', timestamp:'22 mins ago'}} />
                  </View>
                  <View style={styles.separator}>
                    <FeedbackElement data={{response:'Wants Romantic Vibes', timestamp:'25 mins ago'}} />
                  </View>
                  <View style={styles.separator}>
                    <FeedbackElement data={{response:'Wants Slow Vibes', timestamp:'7 min ago'}} />
                  </View>
                  <View>
                    <FeedbackElement data={{response:'Wants All the Feels Vibes', timestamp:'7 min ago'}} />
                  </View>
              </View>
          </View>
          </ScrollView>
          <View style={styles.container}>
              <TouchableOpacity
                 onPress={() => {
                    navigation.goBack();
                }}
              >
                <Text style={styles.textLink}>Close</Text>
              </TouchableOpacity>
          </View>
      </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#0F0F0F",
        paddingHorizontal: screenPadding,
        paddingVertical: screenPadding,
    },
    top:{
      marginTop: 65,
    },
    container: {
        flexDirection: 'column',
        width: windowWidth - (screenPadding*2),
        borderWidth: 1,
        borderColor: 'red',
        paddingVertical: 5,
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
        marginTop: 20,
    },
    block_spacebetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'green',
    },
    logo: {
        alignSelf: 'center',
        paddingVertical: 20,
        textAlign: 'center',
        marginBottom: 50,
    },
    groupIcon:{
      width: 80,
      height: 80,
    },
    profileIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
    },
    settingsIcon: {
        width: 40,
        height: 40,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
    },
    heading: {
        fontSize: '$fontSize1',
        color: '$white',
        marginBottom: '$padding5'
    },
    textDetail: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    textLink: {
        color: '#FFFFFF',
        fontSize: 16,
        alignSelf: 'center',
        paddingVertical: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    listener_host: {
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    separator:{
        borderBottomWidth: 1, 
        borderBottomColor: 'grey'
    }
})