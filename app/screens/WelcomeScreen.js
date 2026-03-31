import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, StatusBar, Animated } from 'react-native';
import { Video } from 'react-native-video';
import AppButton from '../components/AppButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialFilledTextField from '../components/MaterialUI/MaterialFilledTextField';
import UploadScreen from "./UploadScreen";
import { useAuth, BACKEND_URL } from '../context/AuthContext';

const DEFAULT_RESIDENCE_ID = "rabd2c6d2aecc4ce3be11e25b4ecd3c82";

function TabSwitch({ isLoginMode, setIsLoginMode }) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabButton, isLoginMode ? styles.activeTab : null]} 
        onPress={() => setIsLoginMode(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isLoginMode ? styles.activeTabText : null]}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tabButton, !isLoginMode ? styles.activeTab : null]} 
        onPress={() => setIsLoginMode(false)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, !isLoginMode ? styles.activeTabText : null]}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WelcomeScreen({ navigation }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Use Global Auth Context
  const { login, generateGeneralWanToken } = useAuth();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authRole, setAuthRole] = useState('guest');
  
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const attemptLogin = async () => {
    try {
      // Delegates to our AuthContext to smoothly check LAN vs WAN and perform offline logging!
      const authResult = await login(email, password);
      
      if (authResult.success) {
        navigation.replace('AppNavigator');
      }
    } catch (error) {
      console.warn("Login Failed:", error.message);
      Alert.alert("Login Failed", error.message || "Invalid credentials or network offline.");
    } finally {
      setLoading(false);
    }
  };

  const attemptRegistration = async () => {
    const url = `${BACKEND_URL}/api/register/`;
    const payload = { 
      email, 
      password, 
      first_name: firstName, 
      last_name: lastName,
      auth: authRole,
      residence_id: DEFAULT_RESIDENCE_ID 
    };
    
    try {
      // Generate standard WAN Master Token using the general sonictech account!
      const masterWanToken = await generateGeneralWanToken();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${masterWanToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Registration Failed", data.error || "Could not register on AkuBela.");
        return;
      }

      // Success!
      Alert.alert("Success", "Account created successfully! You can now sign in.");
      setIsLoginMode(true);
      setPassword('');

    } catch (error) {
      Alert.alert("Network Error", "Failed to connect to backend for registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAction = async () => {
    setLoading(true);
    if (isLoginMode) {
      await attemptLogin();
    } else {
      await attemptRegistration();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content'/>
      <UploadScreen visible={loading} />
      
      <Video
        source={require('../assets/videos/video_9ccdee13fd.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
        repeat
      />

      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image 
            source={require('../assets/one_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <TabSwitch isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} />

          <View style={styles.inputCard}>
            
            {!isLoginMode && (
              <>
                <MaterialFilledTextField
                  label={"First Name"}
                  value={firstName}
                  onChangeText={setFirstName}
                  backgroundColor={'#f5f5f5'}
                  autoCorrect={false}
                  marginTop={10}
                />
                <MaterialFilledTextField
                  label={"Last Name"}
                  value={lastName}
                  onChangeText={setLastName}
                  backgroundColor={'#f5f5f5'}
                  autoCorrect={false}
                  marginTop={10}
                />
                <MaterialFilledTextField
                  label={"Auth Role (e.g. guest or admin)"}
                  value={authRole}
                  onChangeText={setAuthRole}
                  backgroundColor={'#f5f5f5'}
                  autoCorrect={false}
                  autoCapitalize="none"
                  marginTop={10}
                />
              </>
            )}

            <MaterialFilledTextField
              label={"Email"}
              value={email}
              onChangeText={setEmail}
              backgroundColor={'#f5f5f5'}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              marginTop={10}
            />

            <MaterialFilledTextField
              label={"Password"}
              value={password}
              onChangeText={setPassword}
              marginTop={10}
              backgroundColor={'#f5f5f5'}
              IconComponent={
                <MaterialCommunityIcons
                  name={visible ? "eye-off" : "eye"}
                  size={20}
                  color={'gray'}
                  style={styles.icon}
                  onPress={() => setVisible(!visible)}
                />
              }
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={!visible}
            />

            <AppButton
              title={isLoginMode ? "Sign In" : "Create Account"}
              text="background"
              disabled={
                !isValidEmail(email) || 
                password.length < 6 || 
                (!isLoginMode && (!firstName || !lastName || !authRole)) || 
                loading
              }
              opacity={loading ? 0.5 : 1}
              onPress={handleAuthAction}
              loading={loading}
              marginTop={25}
            />

          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 70,
  },
  logo: {
    width: '70%',
    height: 180,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', 
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  }
});
