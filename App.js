import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import { StoreProvider } from './app/context/StoreContext';
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
    };

    checkAuthStatus();
  }, []);


  return (
    <StoreProvider>

    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
      </View>
    </NavigationContainer>
    </StoreProvider>

  );
}
