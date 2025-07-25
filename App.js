import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  useColorScheme,
} from 'react-native';

import { NativeModules } from 'react-native';
import TabbedRTSPViewer from './Components/TabbedRTSPViewer';
const { Akuvox } = NativeModules;

// Initialize SDK once
Akuvox.initSdk();


export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#f0f0f0',
    flex: 1,
  };

  const ciphertext = "q5sa4p2gwMD6DYkkixg75l/bymQWSz8kPiFiXSNwJflACaNIDR7+4ykJfHCTkZ8tRR0AIePjUBrV+qSskC7F2AYBWO30e198FGr187+vEdDVp0Y8AghGBK6pPe2GVLi9SDMf3OQkPfqyaxTlOLKn96dFjOgs/eC1erq/IDY/gmOsPAuGcBSYEhYKamezBFo1kZJVy9kxP4PiabgH4hJSSqooLihC63vebt6kgOlhSNOZRFxUYjwWaeB6XYPTr3LL";
  const displayName = "fayis@sonictech.ae";

  const [remoteUserName, setRemoteUserName] = useState('');
  const [remoteDisplayName, setRemoteDisplayName] = useState('');
  const [callVideoMode, setCallVideoMode] = useState(0); // 0 = audio, 1 = video

  // Reusable input component
  const CustomInput = ({ placeholder, value, onChangeText, editable = true }) => (
    <TextInput
      style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      editable={editable}
    />
  );

  const registerAccount = () => {
    try {
      Akuvox.registerSip(ciphertext, displayName)
      .then((message) => {
      console.log('Success:', message);
      Alert.alert('Success', message);
        // 1. Check status
      Akuvox.getSipStatus().then(status => {
        console.log('SIP Status:', status); // 2 = registered
      })
    })
    } catch (err) {
      Alert.alert('Registration error', err.message);
    }

  };



  const makeCall = (mode) => {
    if (!remoteUserName.trim() || !remoteDisplayName.trim()) {
      Alert.alert('Error', 'Please enter remote user name and display name');
      return;
    }
    setCallVideoMode(mode);

    Akuvox.makeCall(remoteUserName, remoteDisplayName, mode)
      .then((res) => Alert.alert('Call Success', JSON.stringify(res)))
      .catch((err) => {
        console.error('Call error:', err);
        Alert.alert('Call Failed', err?.message || JSON.stringify(err));
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>SIP Account Setup</Text>
          <CustomInput placeholder="Ciphertext" value={ciphertext} editable={false} />
          <CustomInput placeholder="Display Name" value={displayName} editable={false} />
          <Button title="Register SIP Account" onPress={registerAccount} />

          <View style={{ height: 40 }} />

          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Make a Call</Text>
          <CustomInput placeholder="Remote User Name" value={remoteUserName} onChangeText={setRemoteUserName} />
          <CustomInput placeholder="Remote Display Name" value={remoteDisplayName} onChangeText={setRemoteDisplayName} />

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Audio Call" onPress={() => makeCall(0)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Video Call" onPress={() => makeCall(1)} />
            </View>
          </View>
        </View>
        <TabbedRTSPViewer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
