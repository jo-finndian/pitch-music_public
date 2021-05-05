import React, {useEffect, useState} from 'react';
import { ActivityIndicator, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import * as ImagePicker from 'expo-image-picker';
import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ButtonText from "../../components/ButtonText";
import ButtonNarrow from "../../components/ButtonNarow";
import CircleImage from "../../components/CircleImage";
import CustomTextInput from "../../components/CustomTextInput";
import CustomTextInput2 from "../../components/CustomTextInput-Simple";
import CustomInputLabel from "../../components/CustomInputLabel";

const AccountSettings = ({navigation}) => {

    const [loading, setLoading] = useState();
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const [loginForm, setLoginForm] = useState({
        user_email: "",
        user_name: "",
    });
    
    const onChangeTextEmail = (user_email) => {
        setLoginForm({
            ...loginForm,
            user_email,
        });
    };

    const onChangeTextName = (user_name) => {
        setLoginForm({
            ...loginForm,
            user_name,
        });
    };

    useEffect(() => {
        const isFocused = navigation.addListener("focus", () => {
            
            setLoading(true);
            
            AsyncStorage.getItem('user_name', (err, result) => {
                setName(result);
            });
            AsyncStorage.getItem('user_email', (err, result) => {
                setEmail(result);
            });
            // fetchInfo();

            if ( image == null ) {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // console.log("USER ID:" + user.uid);
                        var userID = user.uid;
                        getProfilePic(user.uid)
                    }
                });
            }
        })
        
        setLoading(false)

        return isFocused;

    }, [loading, navigation, email, name, image]);

    function getProfilePic(user) {
        // console.log("get profile pic of " + user)
        let imageRef = firebase.storage().ref(`images/users/${user}.jpg`);

        imageRef
        .getDownloadURL()
        .then((url) => {
            setImage(url)
            // console.log(url);
            updateAsyncStorage('profilePicture', url)
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          console.log('image access granted')
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log("Result: " + result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
    };
    if (loading) {
        return (
            <View style={styles.section}>
                <ActivityIndicator color="white" />
            </View>
            );
    }
    else {
        return (
            <View style={styles.section}>
                {/* <Header
                    leftItem={
                        <TouchableOpacity
                            onPress={()=> {
                                navigation.goBack()
                            }}
                        >
                        <Image source={require('../../../assets/icons/back-arrow.png')}/>
                    </TouchableOpacity>
                  }
                />
     */}
                <View style={styles.container}>
                    <Text style={styles.heading}>Account Settings</Text>
    
                    <View style={{alignSelf:'center', alignItems: 'center', marginTop: 40, marginBottom: 24,}}>
                        <CircleImage size="large" margin={40} image={{uri: image}}/>
                        <ButtonNarrow 
                            label="Change Photo"
                            icon={require('../../../assets/icons/upload.png')}
                            color= "black"
                            isLight={true}
                            onPress={() => { 
                                pickImage()
                            }}
                        />
                  </View>
                    <CustomInputLabel label="Name" style={{color: '#d1d1d1'}}/>
                    <CustomTextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={onChangeTextName}
                        autoCapitalize='none'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        underlineColorAndroid='transparent'
                        maxLength={45}
                        showIcon={true}
                        inverse={true}
                        icon={"ios-pencil-sharp"}
                        containerStyle={{marginBottom: 40}}
                    />

                    <CustomInputLabel label="Email" style={{color: '#d1d1d1'}}/>
                    <CustomTextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={onChangeTextEmail}
                        autoCapitalize='none'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        underlineColorAndroid='transparent'
                        maxLength={45}
                        showIcon={true}
                        inverse={true}
                        icon={"ios-pencil-sharp"}
                        containerStyle={{marginBottom: 40}}
                    />

                    <CustomInputLabel label="Password" style={{color: '#d1d1d1'}}/>
                    <CustomTextInput2
                        // onPress={()=>{navigation.navigate("My Group", {screen: "Account Settings", params: {screen: 'Change Password'}})}}
                        onPress={()=>{navigation.navigate('Change Password')}}
                        showIcon={true}
                        label="Change Password"
                        inverse={true}
                        icon={"arrow-right"}
                        containerStyle={{marginBottom: 40}}
                    />
                </View>
                <ButtonText
                    label="Close"
                    color="white"
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
    
        )
    }
}

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        paddingHorizontal: '$padding2',
        paddingTop: '25%',
        paddingBottom: '$padding1',
        backgroundColor: '$bg_black',
        justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'column',
        width: '100%',
    },
    block_groupList: {
        flex: 1,
        width: '100%',
        flexBasis: 'auto',
        marginTop: '$padding2',
    },
    block_spacebetween: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        width: '50%',
        alignSelf: 'center',
        marginBottom: '$padding1 + $padding2',
        marginTop: '$padding1',
        resizeMode: 'contain'
    },
    heading: {
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        color: '$white',
        marginBottom: '$padding5'
    },
    textDetail: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_400Regular',
        color: '$textColor_grey',
    },
})

export default AccountSettings;