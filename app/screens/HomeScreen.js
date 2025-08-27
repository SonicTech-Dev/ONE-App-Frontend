import React, { useState } from 'react';
import { View, ScrollView, FlatList, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import useColors from '../hooks/useColors';
import Header from '../components/Home/Header';
import MenuDrawer from '../components/Home/MenuDrawer';
import Screen from '../components/Screen';
import routes from '../navigation/routes';
import UploadScreen from "./UploadScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NotificationsModal from '../components/Home/NotificationsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const colors = useColors();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading]=useState(false)
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  const drawerItems = [
      // Amenities Section
      {
        id: 1,
        name: 'ID Badge',
        Icon: <MaterialIcons name="badge" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {
          // setIsDrawerOpen(false);
        }
      },
      {
        id: 2,
        name: 'Gate Pass',
        Icon: <MaterialCommunityIcons name="badge-account" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {
          // setIsDrawerOpen(false);
        }
      },
      {
        id: 12,
        name: 'Health',
        Icon: <FontAwesome name="heartbeat" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {
          setIsDrawerOpen(false);
          navigation.navigate(routes.HEALTHSCREEN)
        }
      },
      {
        id: 3,
        name: 'Requests',
        Icon: <Ionicons name="document-text-outline" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {
          // setIsDrawerOpen(false);
        }
      },
      {
        id: 4,
        name: 'Feedback',
        Icon: <MaterialIcons name="feedback" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {}
      },
      {
        id: 5,
        name: 'Utilities',
        Icon: <Ionicons name="bulb" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {}
      },
      {
        id: 6,
        name: 'Fees',
        Icon: <MaterialIcons name="account-balance-wallet" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {}
      },
      // {
      //   id: 7,
      //   name: 'Payments',
      //   Icon: <MaterialIcons name="account-balance-wallet" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
      //   onPress: () => {}
      // },
      {
        id: 8,
        name: 'Reservations',
        Icon: <Ionicons name="calendar" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {}
      },
      {
        id: 9,
        name: 'Manage Users',
        Icon: <MaterialCommunityIcons name="account-multiple" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {}
      },
      {
        id: 10,
        name: 'Manage Properties',
        Icon: <MaterialCommunityIcons name="office-building" size={26} color={colors.primary} />, // Explicitly provide an icon JSX element
        onPress: () => {}
      },
      {
        id: 11,
        name: 'Log Out',
        Icon: <Ionicons name="log-out-outline" size={26} color={colors.danger} />, // Explicitly provide an icon JSX element
        onPress: ()=>handleLogout()
      },
    ];

  const handleLogout =async()=>{

    Alert.alert('Are you sure?',"You'll need to login again to keep using the application", 
    [
      { text: 'Log Out',
      onPress:async()=> {
        setLoading(true);
        await AsyncStorage.removeItem('userToken')
          // navigation.navigate(routes.WELCOME)

          setLoading(false);
      }},
      { text: 'Cancel',style:"cancel" },
    ])
  }

  const data = [
    { id: '1', title: 'Who are we?', description: 'A homegrown boutique developer on a journey towards global recognition.' },
    { id: '2', title: 'One mission', description: 'We aim to create modern living spaces where people feel connected to each other and the world around them, all through one unique experience' },
    { id: '3', title: 'One Ethos', description: 'We maintain integrity in all we do, incorporate innovation into our designs, and empower our team and partners to deliver personalized, customer-centric experiences.' },
    { id: '4', title: 'At the heart of our enterprise',},
    { id: '5', title: 'Real estate redefined',},
  ];

  const quickActions = [
    { id: '1', title: 'ID Badge', 
      // onPress: ()=>navigation.navigate(routes.IDBADGE)
    },
    { id: '2', title:  'Requests', 
      // onPress: ()=>navigation.navigate(routes.REQUESTSCREEN) 
    },
    { id: '3', title:'Gate Pass', 
      // onPress: ()=>navigation.navigate(routes.PASS)
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} 
    // onPress={()=>navigation.navigate(routes.FEEDDETAILS,{item})}
    >
      <Image source={require('../assets/Towers_Final.jpg')} style={styles.image} />
      <View style={styles.textContainer}>
        {item.title&&<Text style={styles.title}>{item.title}</Text>}
        {item.description&&<Text style={styles.description}>{item.description}</Text>}
      </View>
    </TouchableOpacity>
  );

  const onAccountDetailsPress=()=>{
    setIsDrawerOpen(false);
  }

  return (
    <>
    <UploadScreen visible={loading} />
    <Screen>
      <Header onMenuPress={() => setIsDrawerOpen(true)} notificationOnPress={()=>setNotificationModalVisible(true)}/>
        <ScrollView
          horizontal
          style={styles.buttonsContainer}
          contentContainerStyle={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flex:1,
            paddingHorizontal:20,
          }}
        >
          {quickActions.map((item, index) => (
            <TouchableOpacity key={item.id} style={styles.navButton(colors)} onPress={item.onPress}>
              <Text style={styles.navButtonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          </ScrollView>

          <View style={{paddingHorizontal:20}}>
        <Text style={styles.greeting}>Hello</Text>
          </View>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={{paddingHorizontal:20}}/>
      
      <MenuDrawer onProfilePress={()=>onAccountDetailsPress()} visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} items={drawerItems} />

      {notificationModalVisible?
      <NotificationsModal modalVisible={notificationModalVisible} setModalVisible={setNotificationModalVisible}/>
      :null}

    </Screen>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexGrow: 0, // Ensure the container doesn't grow vertically
    marginVertical: 0,
    height:80,
    width:'100%'
  },
  navButton: (colors) => ({
    backgroundColor: colors.primary,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    shadowColor: 'rgba(0,0,0, 0.25)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
  }),
  navButtonText: {
    color: '#fff',
    fontFamily:'Arial',
    fontSize: 16,
  },
  greeting: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'left',
    textTransform:'capitalize',
    fontFamily:'Arial'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius:10
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent:'center',
    alignItems:'flex-start'
  },
  title: {
    fontFamily:'Arial',
    color: '#6A0572',
    fontSize:16
  },
  description: {
    color: '#333',
    fontSize:14
  },
  button: (colors) => ({
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  }),
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});