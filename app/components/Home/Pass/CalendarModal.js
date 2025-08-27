import React,{useRef,useState,useEffect,useContext} from 'react';
import {  
    View,
    Image,
    StyleSheet,
    Platform,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Modal,
    Alert,
    Text,
    Dimensions,
    Animated
} from 'react-native';
import useColors from '../hooks/useColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import UploadScreen from "../screens/UploadScreen";
import { LanguageContext } from '../context/LanguageContext';
import { BlurView } from '@react-native-community/blur';
import useAuth from "../auth/useAuth";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MaterialFilledTextField from "../components/MaterialUI/MaterialFilledTextField"
import AppButton from '../components/AppButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function CalendarModal({modalVisible,setModalVisible, date}) {
  const colors = useColors();
  const { language, direction, changeLanguage,boldFont, regularFont,flipStyles,screenWidth,isRTL } = useContext(LanguageContext);
  const { user, setUser } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current;
  const [innerModalHeight, setInnerModalHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading]=useState(false)
  const [selectedDate, setSelectedDate]=useState()

  useEffect(() => {
    setInnerModalHeight(screenHeight * 0.75); // Set inner modal height to 75% of the screen height
  }, [screenHeight]);

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,  // Assuming this value closes the modal
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [modalVisible]);

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };
  
  const onDateChange=(date)=>{
    setSelectedDate(date);
}


    return(
      <>
      <Modal 
visible={modalVisible} 
animationType="none"
transparent={true}
onRequestClose={hideModal}
>

<UploadScreen
        visible={loading}
        opacity={0.5}
      />

<BlurView
    style={[StyleSheet.absoluteFill, styles.blurContainer]}
    intensity={15}
  >
    <TouchableOpacity onPress={()=>{
      hideModal();
    }} 
    style={StyleSheet.absoluteFill} 
    />
  </BlurView>
  
  <Animated.View style={[styles.modalContent, { height: innerModalHeight*1, transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, innerModalHeight] }) }], opacity: fadeAnim }]}>
    <View style={[styles.innerModalContent,{backgroundColor:colors.background}]}>
    <TouchableOpacity 
  onPress={() => {
    hideModal();
  }}
 style={{
   zIndex:1,
   height:40,
   width:40,
   backgroundColor:colors.primary,
   justifyContent:"center",alignItems:"center",borderRadius:20,
   shadowColor: 'rgba(0,0,0, .2)', // IOS
          shadowOffset: { height: 1, width: 1 }, // IOS
          shadowOpacity: 1, // IOS
          shadowRadius: 1, //IOS
          elevation: 2, // Android
          marginBottom:10,
          marginLeft:10
   }}>
 <MaterialIcons name="close" size={32} color={colors.background}/>
 </TouchableOpacity>

<ScrollView 
            bounces={false} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{paddingBottom:0, marginHorizontal:10}}
            scrollEventThrottle={16}
            >

<View style={{paddingTop:20,paddingBottom:0,paddingHorizontal:0,flexDirection: direction,}}>
               <Text style={[styles.header,{fontSize:screenWidth>=414?28:24,color:colors.primary,fontFamily:boldFont,textAlign: flipStyles?'right':'left'}]}>
               Create New Pass
                 <Text style={{color:colors.primary,fontSize:36,fontFamily:boldFont,}}>
                   .
                   </Text>             
                </Text> 
</View>

<ScrollView contentContainerStyle={{padding:0,}}>
        
        <MaterialFilledTextField
        label={'First Name'}        
        // value={firstName}
        // onChangeText={(text)=>setFirstName(text)}
        // backgroundColor={colors.background}
        // required
        autoFocus
        autoCorrect={false}
        autoCapitalize='none'      
        />

        <MaterialFilledTextField
        label={'Last Name'}        
        // value={lastName}
        // onChangeText={(text)=>setLastName(text)}
        // backgroundColor={colors.background}
        // required
        // autoFocus
        autoCorrect={false}
        autoCapitalize='none'
        // maxLength={10}
      />

<TouchableOpacity style={{
    marginHorizontal:0,
    marginTop:10,
    backgroundColor:colors.white,
    flex:1,
    borderRadius:10,    
    }}
    
    onPress={()=>{
        console.log('cycle');
        openModal();
      }}
    >

          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center', marginTop:10,marginLeft:-10}}>
          <MaterialCommunityIcons name='calendar' size={32} color={colors.primary}/>
          <Text style={{color:colors.chime,fontWeight:'600'}}> 
            {/* {selectedDate} */}
            </Text>
      </View>
      </TouchableOpacity>

</ScrollView>
<AppButton 
title={`Create`}
color={colors.primary}
text='background'
onPress={()=>{
handleSaveAddress()
}}
/>

</ScrollView>

      </View>
      </Animated.View>
      </Modal>
</>
);
}

const styles=StyleSheet.create({
  blurContainer: {
    justifyContent: 'flex-end',
    flex:1
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  innerModalContent: {
    // backgroundColor: 'white',
    paddingTop: 20,
    // alignItems: 'flex-start',
    flex:1,
    borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  notificationLeftContent: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    marginBottom: 4,
    color: '#6B7280',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Optional, adjust for layout
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyListContainer: {
    flex: 1, // Ensure FlatList stretches to take available space
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarModal;