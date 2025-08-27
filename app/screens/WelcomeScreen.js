import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, StatusBar } from 'react-native';
import { Video } from 'react-native-video';
import routes from '../navigation/routes';
import AppButton from '../components/AppButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialFilledTextField from '../components/MaterialUI/MaterialFilledTextField'
import UploadScreen from "./UploadScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

function WelcomeScreen({ navigation }) {
  const [email, setEmail] = useState('one_demo@oneuae.com');
  const [password, setPassword] = useState('One@1234');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem('userToken', 'logged_in');
    navigation.replace('AppNavigator'); // Replace AuthNavigator with AppNavigator
  };



  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content'/>
      <UploadScreen
        visible={loading}
      />
      {/* Video Background */}
      <Video
        source={require('../assets/videos/video_9ccdee13fd.mp4')} // Ensure the video path is correct
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
        repeat
        playInBackground={false}
        playWhenInactive={false}
        muted
      />

      {/* Content Overlay */}
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image 
            source={require('../assets/one_logo.png')} 
            style={[styles.logo]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>

          <MaterialFilledTextField
          label={"Email"}
            value={email}
            onChangeText={setEmail}
            backgroundColor={'white'}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            />

<MaterialFilledTextField
label={"Password"}
value={password}
onChangeText={setPassword}
marginTop={10}
IconComponent={
  <MaterialCommunityIcons
    name={visible ? "eye-off" : "eye"}
    size={20}
    color={'gray'}
    style={[styles.icon,]}
    onPress={() => setVisible(!visible)}
  />
}
autoCorrect={false}
autoCapitalize="none"
secureTextEntry={!visible}/>

          <AppButton
            title={"Continue"}
            text="background"
            disabled={!isValidEmail(email) || !password || loading}
            opacity={loading ? 0.5 : 1}
            onPress={handleLogin}
            loading={loading}
          />

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: '75%',
    height: 200,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Arial',
  },
  icon: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
});

export default WelcomeScreen;
