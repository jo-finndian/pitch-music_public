import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import ButtonFullWidth from './ButtonFullWidth';

export default function VibeCheck() {

    const [clear, setClear] = useState(false)
    
    const exitCard = () => {
        setClear(true)
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.heading}>Vibe Check</Text>
                <TouchableOpacity style={!clear ? styles.exit_icon : {display: 'none'}}
                    onPress={exitCard}
                >
                    <Image source={require('../../assets/icons/x-small.png')}/>
                </TouchableOpacity>
            </View>  
            <Text style={styles.textDetail}>Are you enjoying the music right now?</Text>
            <ButtonFullWidth
                label="I'm Vibing"
                backgroundColor="$bg_black"
                color="$white"
                style={{marginBottom: 16}}
            />
            <ButtonFullWidth
                label="Could be Better"
                backgroundColor="$bg_black"
                color="$white"
            />
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
        backgroundColor: '#FFA0A4',
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
        marginTop: 20,
        backgroundColor: '#0F0F0F',
        borderRadius: 30,
    },
    buttonText:{
        color: '$white',
        fontSize: '$fontSize4',
        fontFamily: 'Poppins_500Medium',
        paddingVertical: '$padding4',
        paddingHorizontal: '$padding2',
    },
    heading: {
        marginTop: 5,
        color: '$bg_black',
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        fontWeight: '600'
    },
    textDetail: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_400Regular',
        paddingTop: '$padding5',
        marginBottom: '$padding1',
        color: '$medLight_grey'
    },
});