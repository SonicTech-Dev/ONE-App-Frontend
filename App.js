import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabbedRTSPViewer from './Components/TabbedRTSPViewer';
import FullScreenRTSP from './Components/FullScreenRTSP';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="RTSP Test" component={TabbedRTSPViewer} />
        <Stack.Screen name="FullScreenRTSP" component={FullScreenRTSP} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}