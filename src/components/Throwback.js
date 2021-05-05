import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from "react-native-extended-stylesheet";
import SearchBar from '../components/SearchBar';


export default function Throwback({ ...otherProps }) {
    const navigation = useNavigation();

    const [clear, setClear] = useState(false);

    const exitCard = () => {
        setClear(true)
    }

    return (
        <View style={!clear ? styles.container : {display: 'none'}}>
        <View style={styles.row}>
            <Text style={styles.heading}>Is it time for a throwback?</Text>
            <TouchableOpacity style={styles.exit_icon}
                onPress={exitCard}
            >
                <Image source={require('../../assets/icons/x-small.png')}/>
            </TouchableOpacity>
        </View> 
        <Text style={styles.textDetail}>Are you enjoying the music right now?</Text>
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Search Modal");
            }}
        >
            <SearchBar bgColor='black'/>
        </TouchableOpacity>
    </View>
  );
}

const styles = EStyleSheet.create({
    container: {
        justifyContent: "flex-start",
        marginVertical: '$padding2',
        paddingHorizontal: '$padding2',
        paddingVertical: '$padding2',
        backgroundColor: '$green',
        borderRadius: 30,
    },
    row:{
        flexDirection: 'row'
    },
    exit_icon:{
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', 
        right: 0,
    },
    button:{
        alignItems: 'center',
        height: 48,
        marginTop: '$padding2',
        backgroundColor: '$light_grey',
        borderRadius: 30,
    },
    heading: {
        marginTop: 5,
        color: '$textColor_dark',
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        fontWeight: '600'
    },
    textDetail: {
        fontSize: '$fontSize5',
        fontFamily: "Poppins_400Regular",
        paddingVertical: '$padding4',
        marginBottom: '$padding2',
    },
    search_box:{
        justifyContent: "flex-start",
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        marginTop: '$padding2',
        backgroundColor: '$white',
        borderRadius: 30,
    },
    search_icon:{
        backgroundColor: '$light_grey', 
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        position: 'absolute', 
        right: 0
    },
    text: {
        fontSize: 16,
        paddingVertical: '$padding4',
        paddingHorizontal: '$padding2',
    },
});