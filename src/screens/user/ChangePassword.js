import React, {useEffect, useState} from 'react';
import { ActivityIndicator, Text, View, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import * as firebase from "firebase";
import "@firebase/firestore";

import Header from "../../components/Header";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import CustomInputLabel from "../../components/CustomInputLabel";
import ButtonFullWidth from '../../components/ButtonFullWidth';

const ChangePassword = ({navigation}) => {

    const [loading, setLoading] = useState();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorMsg2, setErrorMsg2] = useState('');

    const [passwordForm, setPassword] = useState({
        user_password: "",
        confirm_password: "",
    });
    
    const onChangeTextPassword = (user_password) => {
        setPassword({
            ...passwordForm,
            user_password,
        });
    };

    const onChangeTextPasswordConfirm = (confirm_password) => {
        setPassword({
            ...passwordForm,
            confirm_password,
        });

        return validatePasswords();
    };

    function validatePasswords() {
        console.log('validation')
        if (passwordForm.user_password != passwordForm.confirm_password) {
            setError(true)
            setErrorMsg("Passwords do not match!")
        }

        if (passwordForm.user_password.length == 8) {
            setErrorMsg2("")
        }
        else {
            setError(true)
            setErrorMsg2("Password must be minimum 8 characters!")
        }
    }

    const updatePassword = () => {
        var user = firebase.auth().currentUser;

        return new Promise(() => {
            user.updatePassword(passwordForm.confirm_password)
            .then(function() {
                console.log('password changed')
            }).catch(function(error) {
                alert(error)
                console.log('error updating password: ' + error)
            });
        });

    }


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
                <Header
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
    
                <View style={styles.container}>
                    <View>

                        <Text style={styles.heading}>Change Password</Text>

                        <CustomInputLabel label="Password" style={{color: '#d1d1d1', marginTop: 40}}/>
                        <CustomPasswordInput
                            placeholder="• • • • • • • •"
                            value={passwordForm.user_password}
                            onChangeText={onChangeTextPassword}
                            autoCapitalize='none'
                            returnKeyType='next'
                            returnKeyLabel='next'
                            underlineColorAndroid='transparent'
                            maxLength={45}
                            placeholderTextColor='white'
                            showIcon={true}
                            inverse={true}
                            icon={"ios-pencil-sharp"}
                            containerStyle={{marginBottom: 40}}
                            />
                        
                        <CustomInputLabel label="Confirm password" style={{color: '#d1d1d1'}}/>
                        <CustomPasswordInput
                            placeholder="• • • • • • • •"
                            value={passwordForm.confirm_password}
                            onChangeText={onChangeTextPasswordConfirm}
                            autoCapitalize='none'
                            returnKeyType='next'
                            returnKeyLabel='next'
                            underlineColorAndroid='transparent'
                            maxLength={45}
                            showIcon={true}
                            inverse={true}
                            icon={"ios-pencil-sharp"}
                            // style={{marginBottom: 40}}
                        />
                    </View>
                    <Text style={error ? styles.error : {display: 'none'}}>{errorMsg}</Text>
                    <Text style={error ? styles.error : {display: 'none'}}>{errorMsg2}</Text>

                </View>
                    <View style={styles.button_container}>
                        <ButtonFullWidth label="Update Password" color= "$bg_black" backgroundColor="$blue_light"
                            onPress={() => {
                                updatePassword()
                            }}
                        />
                    </View>
            </View>
    
        )
    }
}

const styles = EStyleSheet.create({
    section: {
        flex: 1,
        paddingHorizontal: '$padding2',
        paddingVertical: '$padding1',
        backgroundColor: '$bg_black',
    },
    container: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    button_container: {
        width: '100%',
        position: 'absolute',
        bottom: 40,
        marginHorizontal: 24
    },
    heading: {
        fontSize: '$fontSize1',
        fontFamily: 'Poppins_600SemiBold',
        color: '$white',
        marginBottom: '$padding2'
    },
    error: {
        fontSize: '$fontSize5',
        fontFamily: 'Poppins_400Regular',
        color: 'red',
    },
})

export default ChangePassword;