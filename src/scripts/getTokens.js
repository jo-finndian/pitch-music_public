import { encode as btoa } from 'base-64';
import {getAuthorizationCode} from './getAuthCode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getTokens(credentials) {
  
  console.log("Get Tokens")
  
  try {
      const authorizationCode = await getAuthorizationCode(credentials) //we wrote this function above
      // const credentials = await getSpotifyCredentials() //we wrote this function above (could also run this outside of the functions and store the credentials in local scope)
      const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credsB64}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
          credentials.redirectUri
        }`,
      });
      const responseJson = await response.json();
      // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      
      console.log("-----accessToken------")
      console.log(accessToken)
      console.log("------refreshToken------")
      console.log(refreshToken)

      await updateAsyncStorage('accessToken', accessToken);
      await updateAsyncStorage('refreshToken', refreshToken);
      await updateAsyncStorage('expirationTime', String(expirationTime));

    } catch (err) {
      console.error(err);
    }
  }

  const updateAsyncStorage = async (label, value) => {
    try {
      await AsyncStorage.setItem(`${label}`, value)
      
      console.log('Async updated: ' + label)
    } catch (e) {
      console.log('Async Error: ' + e)
    }
  }