import React,{useContext} from "react";
import { Platform,Dimensions,View,TouchableWithoutFeedback,Appearance, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ShopNavigator from "./Stack/ShopNavigator";
import SmartNavigator from "./Stack/SmartNavigator";
import HomeNavigator from "./Stack/HomeNavigator";
import ServicesNavigator from "./Stack/ServicesNavigator";
import AmenitiesNavigator from "./Stack/AmenitiesNavigator";
import useColors from "../hooks/useColors";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
const colors = useColors();

   return (
<Tab.Navigator
    screenOptions={{
  tabBarShowLabel: false,  //to remove labels from tab bar
  tabBarHideOnKeyboard:true,
  headerShown:false,
    tabBarStyle: {
      position: 'absolute',
      height: 70, // or desired value
      paddingBottom: 0, // remove extra padding
      paddingTop: 0,
      backgroundColor: '#fff', // your color
      borderTopWidth: 0, // removes shadow/border
      elevation: 0,       // removes shadow on Android
    },
}}
    initialRouteName={"HomeScreen"}
    >
      
      <Tab.Screen
        name="HomeScreen"
        component={HomeNavigator}
        options={({ route }) => {
         
          return {
            
          tabBarIcon: ({ size, color,focused }) => (
          <Entypo name="home" size={30} color={focused?colors.primary:'#969696'}/>
            ),
            headerShown:false,
            unmountOnBlur: true,
        }}}
      />

<Tab.Screen
        name="Services"
        component={ServicesNavigator}
        options={({ route }) => {
          return {
            
          tabBarIcon: ({ focused }) => (
            <MaterialIcons name="home-repair-service" size={30} color={focused?colors.primary:'#969696'} />
            ),
            headerShown:false,
            unmountOnBlur: true,
        }}}
      />

<Tab.Screen
        name="LifestyleBasket"
        component={SmartNavigator}
        options={({ route, navigation }) => {
         
          return {
            
          tabBarIcon: ({ size, color,focused }) => (
    <Feather
      name="smartphone"
      size={30}
      color={focused?colors.primary:'#969696'}
    />            
            ),
            headerShown:false,
            unmountOnBlur: true,
        }}}
      />

       <Tab.Screen
        name="LifestyleSaved"
        component={AmenitiesNavigator}
        options={({ route }) => {
          
          return {
            
            tabBarIcon: ({ size, color, focused }) => (
              <Feather name="share-2" size={30} color={focused?colors.primary:'#969696'} />
            ),
            headerShown: false,
          };
        }}
      />

       <Tab.Screen
        name="LifestyleAccount"
        component={ShopNavigator}
        options={({ route }) => {
         
          return {
            
          tabBarIcon: ({ size, color,focused }) => (
          <MaterialCommunityIcons name="store" size={30} color={focused?colors.primary:'#969696'}/>
            ),
            headerShown:false,
            unmountOnBlur: true,
        }}}
      />

    </Tab.Navigator>
  )  
};

export default AppNavigator;
