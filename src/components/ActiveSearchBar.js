import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TextInput, View, Text } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";

export default function activeSearchBar({navigation, ...otherProps }) {
  return (
      <View style={styles.row}>
        <View style={styles.search_container}>
            <View style={styles.search_icon}></View>
            <TextInput
            underlineColorAndroid='transparent'
            placeholder='Search'
            placeholderTextColor='#464646'
            {...otherProps}
            style={styles.text}
            />
        </View>
        <TouchableOpacity
            onPress={() => {
            navigation.navigate("Group");
        }}>
        
            <Text style={styles.textDetail}>Cancel</Text>
        </TouchableOpacity>
      </View>
    
  );
}

const styles = EStyleSheet.create({
    row:{
        flexDirection: 'row'
    },
    search_container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        marginTop: '$padding1',
        backgroundColor: '$white',
        borderRadius: 30,
        width: '80%',
    },
    text: {
        fontSize: '$fontSize4',
        fontFamily: "Poppins_500Medium",
        paddingVertical: '$padding4',
        paddingHorizontal: '$padding2',
        left: '$padding3'
    },
    search_icon: {
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        position: 'absolute', 
    },
    cancel: {
        color: '#FFFFFF',
        fontSize: '$fontSize5',
        fontFamily: "Poppins_400Regular",
        position: 'absolute', 
        left: '$padding2',
        marginTop: '$padding1',
        paddingVertical: '$padding4',
    },
});