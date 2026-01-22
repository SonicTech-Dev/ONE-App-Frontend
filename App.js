import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter, NativeModules } from 'react-native';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import { StoreProvider } from './app/context/StoreContext';

const { AkuvoxModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(AkuvoxModule);

export default function App() {
  /*
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  useEffect(() => {
    const checkAuthStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      //setIsLoggedIn(!!userToken);
    };

    checkAuthStatus();
  }, []);
  */

  // 🔔 Listen for incoming calls
  useEffect(() => {
    const subscription = eventEmitter.addListener('onIncomingCall', (data) => {
      console.log("📞 Incoming call:", data);

      Alert.alert(
        "Incoming Call",
        `Caller: ${data.remoteDisplayName || data.remoteUserName}`,
        [
          {
            text: "Reject",
            onPress: () => {
              console.log("Call rejected");
              AkuvoxModule.hangupCall(data.callId);
            },
            style: "destructive"
          },
          {
            text: "Accept",
            onPress: () => {
              console.log("Call accepted");
              AkuvoxModule.answerCall(data.callId, data.callVideoMode);
            }
          }
        ]
      );
    });

    return () => subscription.remove();
  }, []);

  return (
    <StoreProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          {/*{isLoggedIn ? <AppNavigator /> : <AuthNavigator />}*/}
          <AuthNavigator />
        </View>
      </NavigationContainer>
    </StoreProvider>
  );
}