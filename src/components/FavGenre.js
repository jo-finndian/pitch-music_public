import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import EStyleSheet from "react-native-extended-stylesheet";

export default function FavArtist( props ) {
    const [clear, setClear] = useState(false);

    const data = [
        {
          name: props.data.genre1,
          genre: props.data.pcent1,
          color: "#92EABD",
        },
        {
          name: props.data.genre2,
          genre: props.data.pcent2,
          color: "#000000",
        },
        {
          name: props.data.genre3,
          genre: props.data.pcent3,
          color: "#FFFFFF",
        },
    ];

    // console.log(data)

    const exitCard = () => {
        setClear(true)
    }
    return (
        <View style={!clear ? styles.container : {display: 'none'}}>
            <View style={styles.row}>
                <Text style={styles.heading}>Favourite Genre</Text>
                <TouchableOpacity style={styles.exit_icon}
                    onPress={exitCard}
                >
                    <Image source={require('../../assets/icons/x-small.png')}/>
                </TouchableOpacity>
            </View> 
            <Text style={styles.textDetail}>The top 3 genres that listeners in <Text style={styles.bold}>{props.data.title}</Text> have most in common.</Text>

                <PieChart
                    style={styles.topArtists}
                    data={data}
                    width={ Dimensions.get('window').width/2}
                    height={140}
                    hasLegend={false}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16
                        }
                      }}
                    accessor={"genre"}
                    backgroundColor={"transparent"}
                    paddingLeft={"5"}
                    absolute
                />
                
            <Text style={styles.genreDetail}>{props.data.pcent1}%   <Text style={styles.bold}>{props.data.genre1}</Text></Text>
            <Text style={styles.genreDetail}>{props.data.pcent2}%   <Text style={styles.bold}>{props.data.genre2}</Text></Text>
            <Text style={styles.genreDetail}>{props.data.pcent3}%   <Text style={styles.bold}>{props.data.genre3}</Text></Text>
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
        backgroundColor: '#F4B77E',
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
        marginTop: 4,
        paddingBottom: '$padding4',
        color: '#0F0F0F',
        fontSize: '$fontSize1',
        fontFamily: "Poppins_600SemiBold",
        fontWeight: '600'
    },
    topArtists:{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 100,
        marginVertical: '$padding1'
    },
    textDetail: {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        marginBottom: 2,
    },    
    genreDetail: {
        fontSize: 12,
        fontFamily: "Poppins_400Regular",
        marginBottom: 2,
        textTransform: 'capitalize'
    },    
    bold: {
        fontFamily: 'Poppins_600SemiBold',
    },
});