import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SmartScreen from "../../screens/SmartScreen";
import SdkTest from "../../screens/SdkTest"; // <-- Import your SDK Usage screen

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
          headerShown: true,
          title: "SDK Test",
          headerTitleStyle: { color: 'black' },
        }}
      />
    </Stack.Navigator>
  );
};

export default SmartNavigator;