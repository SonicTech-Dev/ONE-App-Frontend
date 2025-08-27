import { Alert, StyleSheet, Text, View } from "react-native"
import React,{useContext} from "react"
import { createStackNavigator } from "@react-navigation/stack";
import SmartScreen from "../../screens/SmartScreen";

const Stack = createStackNavigator();

const SmartNavigator = ({route,navigation}) => {

return(
<Stack.Navigator>
      <Stack.Screen 
      name="SmartScreen" 
      component={SmartScreen} 
      options={{
        headerShown:false,
        headerBackTitleVisible: false,
        headerTitleStyle: {color:'black',},
        gestureEnabled: false,
      }}/>
      

    </Stack.Navigator>
)}

export default SmartNavigator;
