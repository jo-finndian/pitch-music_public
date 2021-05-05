import React, {useEffect, useState} from 'react';
import SpotifyWebAPI from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity, TextInput, FlatList} from 'react-native';

import EStyleSheet from "react-native-extended-stylesheet";
import AddTrack from '../../components/AddTrack';

var s = new SpotifyWebAPI();

export default function Search ({ navigation, ...otherProps }){
    const [search, setSearch] = useState("");
    const [trackData, setTrackData] = useState([]);
    const [groupID, setGroupID] = useState("");

    AsyncStorage.getItem( 'group', (err, result) =>{
          setGroupID(result)
       } );

    AsyncStorage.getItem('accessToken', (err, result) => {
        s.setAccessToken(result);
      });

    useEffect(() =>{
        if( search == ""){
            console.log("search bar is empty")
        }
        else {
            s.searchTracks(search, { limit: 8 }, function (err, data){
                if (err) console.error(err);
                else {
                    setTrackData(data.tracks.items);
                }
            })
        }
       
    }, );


  
  return (
      <View style={styles.section}>
          <View style={styles.searchContainer}>
            <View style={styles.container}>
              <View style={styles.row}>
                <View style={styles.search_container}>
                    <View style={styles.search_icon}></View>
                    <TextInput
                    underlineColorAndroid='transparent'
                    placeholder='Search'
                    placeholderTextColor='#464646'
                    {...otherProps}
                    style={styles.text}
                    onChangeText={text => setSearch(text) }
                    value={search}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => {
                    navigation.navigate("My Group", {screen: "Group View"})
                }}>
                    <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

            <View style={styles.container}>
            <Text style={styles.textDetail}>RESULTS '{search}'</Text>
              <View style={styles.block_groupList}>
                    {/* Map groups into group list item */}
                       <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                       style={ {flexGrow: 0}}
                        data={trackData}
                        renderItem={({ item }) => (
                            <AddTrack data={{ group_id:groupID, song_id:item.id, image:item.album.images[2].url, track:item.name, artist:item.artists[0].name}}></AddTrack>
                        )}
                        keyExtractor={(item, index) => item + index}
                    />
                    {/* <AddTrack data={{name:'ORANGE SODA', members:'Baby Keem'}}></AddTrack> */}
                </View>
            </View>
      </View>
  )
}

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        backgroundColor: "#0F0F0F",
        width: '100%',
    },
    container: {
        flexDirection: 'column',
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 4,
        paddingVertical: 20,
    },
    searchContainer:{
      paddingTop: 35,
      backgroundColor: "#252525",
      flexDirection: 'row',
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16
    },
    block_groupList: {
        width: '100%',
        flexBasis: 'auto',
        marginTop: 20,
    },
    textDetail: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    row:{
      flexDirection: 'row'
    },
    search_container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        marginTop: '$padding1 + 8',
        backgroundColor: '$white',
        borderRadius: 30,
        width: '80%',
    },
    text: {
        fontSize: 16,
        paddingVertical: '$padding4',
        paddingHorizontal: '$padding2',
        left: 16
    },
    search_icon: {
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        position: 'absolute', 
    },
    cancel: {
        color: '#FFFFFF',
        fontSize: 13,
        position: 'absolute', 
        left: 24,
        marginTop: '$padding1 + 12',
        paddingVertical: '$padding4',
    },
})