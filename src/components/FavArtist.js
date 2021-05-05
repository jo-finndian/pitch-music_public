import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import CircleImage from './CircleImage';
import EStyleSheet from "react-native-extended-stylesheet";


export default function FavArtist(props) {

    const [clear, setClear] = useState(false);

    // console.log(props)

    const exitCard = () => {
        setClear(true)
    }

  return (
    <View style={(!clear || props.data.artist1 == undefined) ? styles.container : {display: 'none'}}>
        <View style={styles.row}>
            <Text style={styles.heading}>Favourite Artists</Text>
            <TouchableOpacity style={styles.exit_icon}
                onPress={exitCard}
            >
                <Image source={require('../../assets/icons/x-small.png')}/>
            </TouchableOpacity>
        </View>  
        <Text style={styles.textDetail}>The top 3 artist that listeners in <Text style={styles.bold}>{props.data.title}</Text> have most in common.</Text>
       <View style={styles.topArtists}>
            <CircleImage size="medlarge" style={styles.leftCircle} image={{uri: props.data.img2}}/>
            <CircleImage size="large" style={styles.middleCircle} image={{uri: props.data.img1}} />
            <CircleImage size="medlarge" style={styles.rightCircle} image={{uri: props.data.img3}} />
       </View>
        <Text style={styles.textDetail}>#1   <Text style={styles.bold}>{props.data.artist1}</Text></Text>
        <Text style={styles.textDetail}>#2   <Text style={styles.bold}>{props.data.artist2}</Text></Text>
        <Text style={styles.textDetail}>#3   <Text style={styles.bold}>{props.data.artist3}</Text></Text>
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
        backgroundColor: '#9CE4F1',
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
    heading: {
        marginTop: 5,
        paddingBottom: '$padding4',
        color: '#0F0F0F',
        fontSize: '$fontSize1',
        fontFamily: "Poppins_600SemiBold",
        fontWeight: '600'
    },
    topArtists:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '$padding1',
        height: 'auto'
    },
    leftCircle:{
        borderRadius: 60,
        left: '-35%',
    },
    rightCircle:{
        borderRadius: 60,
        right: '-35%',
    },
    middleCircle:{
        borderRadius: 60,
        position: 'absolute',
        zIndex: 1
    },
    textDetail: {
        fontSize: '$fontSize5',
        marginBottom: 2,
        fontFamily: "Poppins_400Regular",
    },
    bold: {
        fontFamily: 'Poppins_600SemiBold',
    },
});