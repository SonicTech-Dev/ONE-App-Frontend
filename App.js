import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeEventEmitter, NativeModules } from 'react-native';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import { StoreProvider } from './app/context/StoreContext';
import { AuthProvider } from './app/context/AuthContext';
import IncomingCallModal from './app/components/CallUI/IncomingCallModal';
import { navigationRef } from './app/navigation/rootNavigation';

const { Akuvox } = NativeModules;
const eventEmitter = new NativeEventEmitter(Akuvox);

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
  const [incomingCallState, setIncomingCallState] = useState(null);


  // 🔔 Listen for incoming calls
  useEffect(() => {
    const subscription = eventEmitter.addListener('onIncomingCall', (data) => {
      console.log("📞 Incoming call intercepted:", data);
      setIncomingCallState(data);
    });

    const callFinishedSub = eventEmitter.addListener('onCallFinished', () => {
      setIncomingCallState(null); // Dismiss modal if caller hangs up early!
    });

    return () => {
      subscription.remove();
      callFinishedSub.remove();
    };
  }, []);

  const handleReject = () => {
    if (incomingCallState) {
      Akuvox.hangupCall(incomingCallState.callId);
      setIncomingCallState(null);
    }
  };

  const handleAccept = () => {
    if (incomingCallState) {
      const callVideoMode = typeof incomingCallState.callVideoMode === 'number'
        ? incomingCallState.callVideoMode
        : 1;

      if (typeof Akuvox.answerCallWithMode === 'function') {
        Akuvox.answerCallWithMode(incomingCallState.callId, callVideoMode);
      } else {
        Akuvox.answerCall(incomingCallState.callId);
      }
      navigationRef.navigate('ActiveCallScreen', { 
        callId: incomingCallState.callId,
        remoteName: incomingCallState.remoteDisplayName || incomingCallState.remoteUserName
      });
      setIncomingCallState(null);
    }
  };


  return (
    <StoreProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <View style={{ flex: 1 }}>
            {/*{isLoggedIn ? <AppNavigator /> : <AuthNavigator />}*/}
            <AuthNavigator />
          </View>
        </NavigationContainer>
        <IncomingCallModal 
          visible={!!incomingCallState}
          callerName={incomingCallState?.remoteDisplayName || incomingCallState?.remoteUserName}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </AuthProvider>
    </StoreProvider>
  );
}