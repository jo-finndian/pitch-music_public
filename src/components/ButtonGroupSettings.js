import React from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const ButtonGroupSettings = ({onPress, label, color, isLight, icon }) => (
    <TouchableOpacity
        style={styles.tab}
        onPress={onPress}
        >
        <Image style={styles.icon} source={require('../../assets/icons/settings.png')}/>
        <Text style={styles.tabText}>Group Settings</Text>
    </TouchableOpacity>
)

export default ButtonGroupSettings;

const styles = EStyleSheet.create({
    tab:{
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '$white',
        borderRadius: 16,
        paddingTop: '$padding4',
        paddingBottom: '$padding3',
        marginLeft: '$padding4 / 2',
        flex: 1,
    },
    icon:{
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginBottom: '$padding5',
    },
    tabText:{
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '$white'
    },
})