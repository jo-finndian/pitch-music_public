import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from "react-native-extended-stylesheet";
import FeedbackElement from "../components/FeedbackElement";

export default function Feedback() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <View style={styles.row}>
            <Text style={styles.heading}>Feedback</Text>
        </View>  
        <Text style={styles.textDetail}>Here's what people are feeling in the group</Text>
        <Text style={styles.note}>MOST RECENT</Text>
            <View style={styles.separator}>
                <FeedbackElement data={{response:'Currently Vibing', timestamp:'3 min ago'}} />
            </View>
            <View style={styles.separator}>
                <FeedbackElement data={{response:'Wants Party Vibes', timestamp:'7 min ago'}} />
            </View>
            <View>
                <FeedbackElement data={{response:'Wants Nostalgic Vibe', timestamp:'12 min ago'}}></FeedbackElement>
            </View>
            
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Feedback Modal");
            }}
        >
            <Text style={[styles.textDetail,{textDecorationLine: 'underline'}]}>View All</Text>
        </TouchableOpacity>
        
    </View>
  );
}

const screenPadding = 24;

const styles = EStyleSheet.create({
    container: {
        justifyContent: "flex-start",
        marginTop: '$padding2',
        marginBottom: '$padding2',
        paddingHorizontal: screenPadding,
        paddingVertical: screenPadding,
        backgroundColor: '#252525',
        borderRadius: 30,
    },
    row:{
        flexDirection: 'row'
    },
    heading: {
        marginTop: 5,
        color: '$white',
        fontSize: '$fontSize1',
        fontFamily: "Poppins_600SemiBold",
        fontWeight: '600'
    },
    textDetail: {
        color:'$white',
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        paddingVertical: '$padding5',
    },
    note:{
        color:'$white',
        fontSize: 10,
        fontFamily: "Poppins_400Regular",
        paddingTop: '$padding2',
    },
    separator:{
        borderBottomWidth: 1, 
        borderBottomColor: 'grey'
    }
});