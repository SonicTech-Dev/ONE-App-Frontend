import { Alert, StyleSheet, Text, View } from "react-native"
import React,{useContext} from "react"
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import AppNavigator from "./AppNavigator";

const Stack = createStackNavigator();

const AuthNavigator = () => {

return(
<Stack.Navigator screenOptions={{ headerShown: false }}>
     
<Stack.Screen 
      name="WelcomeScreen" 
      component={WelcomeScreen} 
      options={{
        headerBackTitleVisible: false,
        headerShown:false,
        gestureDirection:'horizontal',
        }}
        />

<Stack.Screen name="AppNavigator" component={AppNavigator} />

    </Stack.Navigator>
)}

export default AuthNavigator;
