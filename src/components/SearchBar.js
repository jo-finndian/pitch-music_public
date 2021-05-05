import React from 'react';
import { TextInput, TouchableOpacity, Image, View } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { useNavigation } from '@react-navigation/native';

const SearchBar = ({ bgColor, editable, ...otherProps }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("My Group", {screen: "Search Modal"});
      }}
    >
      <View  style={[styles.search_icon, (bgColor == 'pink') ? styles.pink : styles.black ]}>
        <Image style={{width:16, height: 16}} source={(bgColor == 'pink') ? require('../../assets/icons/search-black.png') : require('../../assets/icons/search-grey.png')}/>
      </View>
      <TextInput
        underlineColorAndroid='transparent'
        placeholder='Search'
        placeholderTextColor='#464646'
        {...otherProps}
        style={styles.text}
        editable={ (editable == "false" ) ? false : true }
      />
    </TouchableOpacity>
  );
}
export default SearchBar;

const styles = EStyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '$padding2',
    backgroundColor: '$white',
    borderRadius: 30,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    paddingVertical: '$padding4',
    paddingHorizontal: '$padding2',
  },
  search_icon: {
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    position: 'absolute', 
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pink:{
    backgroundColor: '#FFA0A4',
  },
  black:{
    backgroundColor: 'black',
  }
});