import { encode as btoa } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTokens} from "./getTokens";

export const refreshTokens = async (credentials) => {
  try {
    // const credentials = await getSpotifyCredentials() //we wrote this function above
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens(credentials);
    } else {
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = responseJson;

      console.log("-----REFRESH TOKEN----")
      console.log(responseJson)
      
      const expirationTime = new Date().getTime() + expiresIn * 1000;

      // await setUserData('accessToken', newAccessToken);
      await AsyncStorage.setItem('accessToken', accessToken)
      console.log("new accessToken set")
      
      if (refreshToken) {
        // await setUserData('refreshToken', newRefreshToken);
        await AsyncStorage.setItem('refreshToken', refreshToken)
        console.log("new refreshToken set")
      }
      // await setUserData('expirationTime', expirationTime);
      await AsyncStorage.setItem('expirationTime', String(expirationTime))
      console.log("new expire time set")
    }
  }
   catch (err) {
    console.log('-------REFRESH ERROR-----------')
    console.log("Error: " + err)
    console.error(err)
  }
}