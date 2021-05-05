import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from "react-native-extended-stylesheet";

export default function CustomPasswordInput({ style, containerStyle, showIcon, icon, icon2, inverse, ...otherProps }) {
  const [changeIcon, setChangeIcon] = useState(true);

  return (
      <View style={[styles.container, containerStyle, inverse ? {borderBottomColor: '#464646'} : {borderBottomColor: 'black'}]}>
        <View style={{ flex: 1, flexDirection:'row', justifyContent:"space-between" }}>
          <TextInput
            underlineColorAndroid='transparent'
            placeholderTextColor={!inverse ? '#000' : '#616161'}
            autoCapitalize='none'
            returnKeyType='next'
            returnKeyLabel='next'
            {...otherProps}
            style={[styles.text, style, inverse ? {color: '#fff'} : {color: "#0f0f0f"}]}
            secureTextEntry={changeIcon}
          />
          <TouchableOpacity 
            onPress={()=> {
              setChangeIcon(changeIcon ? false : true)
            }}>
            <Ionicons style={!showIcon ? {display: 'none'} : styles.icon} name={changeIcon ? icon : icon2} size={16} color={inverse ? '#d1d1d1' : "#0f0f0f"} />
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderBottomWidth: 1,
  },
  text: {
    fontFamily: 'Poppins_500Medium',
    fontSize: '$fontSize4', 
    marginBottom: '$padding5',
    width: '100%',
  },
  icon: {
    display: 'flex',
    position: 'absolute',
    right: 0
  }
});