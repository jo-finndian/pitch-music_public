import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView, Text, TouchableOpacity, View, Image} from 'react-native';
import Swipeable from 'react-native-swipeable';
import EStyleSheet from "react-native-extended-stylesheet";

import * as firebase from "firebase";
import "@firebase/firestore";

export default class SwipeableExample extends Component {

  state = {
    currentlyOpenSwipeable: null
  };

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  render() {
    const {currentlyOpenSwipeable} = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }
        this.setState({currentlyOpenSwipeable: swipeable});
      },
      onClose: () => this.setState({currentlyOpenSwipeable: null}),    
      addQueue: (index, data) => { // ADD TO PLAYLIST
        currentlyOpenSwipeable.recenter();
        AsyncStorage.getItem( 'group', (err, result) =>{
        
            firebase.firestore().collection("playlists").doc(result)
            .update({
                queue: firebase.firestore.FieldValue.arrayUnion(this.props.data.song_id),
                song_requests: firebase.firestore.FieldValue.arrayRemove(this.props.data.song_id)
            })
            .then(() => {
                console.log("Song Request Added to FB!");
            })
            
        } );
      },
      deleteReq: (index, data) => {  // DELETE SONG REQUEST
        AsyncStorage.getItem( 'group', (err, result) =>{
        
            firebase.firestore().collection("playlists").doc(result)
            .update({
                song_requests: firebase.firestore.FieldValue.arrayRemove(this.props.data.song_id)
            })
            .then(() => {
                console.log("Song Request Deleted");
            })
            
        } );
      },
      data: this.props.data
    };

    return (
      <ScrollView onScroll={this.handleScroll} style={styles.container}>
        <SongRequests {...itemProps}/>
      </ScrollView>
    );
  }
}

function SongRequests({onOpen, onClose, addQueue, deleteReq, data}) {

  return (
    <Swipeable
      leftContent={(
        <View style={[styles.leftSwipeItem, {backgroundColor: '#F25359'}]}>
          <Image source={require('../../assets/icons/trash-bin-white.png')}/>
        </View>
      )}
      rightButtonWidth={75}
      rightButtons={[
        <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: '#92EABD'}]} 
            onPress={addQueue}>
          <Image source={require('../../assets/icons/add-song.png')}/>
        </TouchableOpacity>
      ]}
      onLeftActionRelease={deleteReq}
      onRightButtonsOpenRelease={onOpen}
      onRightButtonsCloseRelease={onClose}
    >
      <View style={styles.container}>
        <View style={styles.rowItems}>
            <Image 
                style={styles.song_albumart}
                source={{uri: data.image}}
            />
            <View style={styles.song}>
                <Text style={styles.song_name}>{data.name}</Text>
                <Text style={styles.song_artist}>{data.artist}</Text>
            </View>
            <View style={styles.add_queue}>
                <Image source={require('../../assets/icons/elipses-vertical.png')} style={styles.elipses}/>
            </View>
        </View>
    </View>
    </Swipeable>
  );
}


const styles = EStyleSheet.create({
    
    container: {
        flex: 1,
        paddingVertical: 3,
    },
    rowItems:{
        width: '100%',
        flexDirection: 'row',
    },
    listItem: {
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftSwipeItem: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: '9%'
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: '9%'
    },
    elipses:{
        maxHeight: 16,
        resizeMode: 'contain',
    },
    song: {
        paddingHorizontal: 20,
        minWidth: 200, 
        maxWidth: '80%',
    },
    song_albumart:{
        height: '$padding1',
        width: '$padding1',
    },
    add_queue: {
        width: 16,
        // height: 16,
        position: "absolute",
        right: '$padding2',
    },
    song_name: {
        fontSize: '$fontSize4',
        fontFamily: 'Poppins_400Regular',
        marginTop: '$padding5',
        color: '$white',
        minWidth: 200, 
        maxWidth: '90%',
        maxHeight: 26,
    },
    song_artist: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_300Light',
        color: '$white',
    },

});