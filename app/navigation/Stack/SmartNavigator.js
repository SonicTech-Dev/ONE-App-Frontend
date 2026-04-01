import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SmartScreen from "../../screens/SmartScreen";
import SdkTest from "../../screens/SdkTest"; // <-- Import your SDK Usage screen
import SmartLockScreen from "../../components/Smart/SmartLock/SmartLockScreen";
import IntercomScreen from "../../components/Smart/Intercom/Intercom"
import DeviceStatuses from "../../components/Smart/DeviceStatuses";
import IPCamera from "../../components/Smart/IPCameras/IPCamera";
const Stack = createStackNavigator();

const SmartNavigator = ({ route, navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SmartScreen"
        component={SmartScreen}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTitleStyle: { color: 'black' },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="SdkTest"
        component={SdkTest}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SmartLockScreen"
        component={SmartLockScreen}
        options={{
          headerShown: false,
        }}
        />
      <Stack.Screen
        name="IntercomScreen"
        component={IntercomScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DeviceStatuses"
        component={DeviceStatuses}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="IPCameraScreen"
        component={IPCamera}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SmartNavigator;