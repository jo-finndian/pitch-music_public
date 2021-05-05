import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, StyleSheet, Image, View, Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export default function FeedbackElement( props ) {
    return (
        <View style={styles.container}>
            <View style={styles.emoji}>
                {/* <Image></Image> */}
            </View>
            <View style={styles.feedback}>
                <Text style={styles.response}>{props.data.response}</Text>
                <Text style={styles.timestamp}>{props.data.timestamp}</Text>
            </View>
           
            <TouchableOpacity style={styles.btnContainer}>
               <Text style={styles.dismiss}>DISMISS</Text>
            </TouchableOpacity>
            
           
            
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '$padding4',
        paddingHorizontal: '$padding5',
    },
    feedback: {
        paddingHorizontal:'$padding2',
    },
    emoji:{
        height: 28,
        width: 28,
        borderColor: '$white',
        borderWidth: 1,
    },
    btnContainer:{
        position: "absolute",
        right: '$padding5',
    },
    dismiss: {
        fontSize: 10,
        color: '$green',
        fontFamily: "Poppins_500Medium",
        textTransform: 'uppercase'
    },
    response: {
        fontSize: '$fontSize4',
        fontFamily: "Poppins_400Regular",
        marginTop: '$padding5',
        color: '$white',
        minWidth: 200, 
        maxWidth: '90%',
    },
    timestamp: {
        fontSize: '$fontSize5',
        fontFamily: "Poppins_300Light",
        color: '$white'
    },
})