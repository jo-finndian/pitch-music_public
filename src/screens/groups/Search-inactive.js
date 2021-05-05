import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';

import MediaPlayer from '../../components/MediaPlayer';
import SearchBar from '../../components/SearchBar';


export default function Search({ navigation }){
  return (
      <View style={styles.section}>
        <View>
          {/* SEARCH */}
          <View style={[styles.container, styles.top]}>
              <Text style={styles.heading}>Request a Song</Text>
              <SearchBar bgColor="pink" editable="false"></SearchBar>
          </View>
        </View>
        <View style={styles.mediaPlayer}>
            <MediaPlayer active="search"/>
        </View>
      </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const screenPadding = 24;

const styles = StyleSheet.create({
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
        paddingVertical: 4,
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
        marginTop: 20,
        },
    heading: {
        color: '#FFFFFF',
        fontSize: 30,
    },
    textDetail: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    mediaPlayer:{
        zIndex: 1,
        position: 'absolute',
        width:windowWidth,
        bottom: 0
    }
})