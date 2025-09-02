import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { NativeModules } from 'react-native';

const { Akuvox } = NativeModules;

export default function SdkUsageScreen() {
  const [sipStatus, setSipStatus] = useState(null);

  const handleInitSdk = () => {
    Akuvox.initSdk();
    Alert.alert('SDK Initialized');
  };

  const handleRegisterSip = async () => {
    try {
      const result = await Akuvox.registerSip(
        "q5sa4p2gwMD6DYkkixg75l/bymQWSz8kPiFiXSNwJflACaNIDR7+4ykJfHCTkZ8tRR0AIePjUBrV+qSskC7F2AYBWO30e198FGr187+vEdDVp0Y8AghGBK6pPe2GVLi9SDMf3OQkPfqyaxTlOLKn9ydX3MDyvYiKsuodonqmKjAg3PpmfEezF76tQNBNbDBztjSHe+Nkz8Yb01jkqtln2qdX8FKQyk/Rzza1ZYAjJzS6DBgcGhLNpwPz7jrjOF1v",
        "User bela"
      );
      Alert.alert('Result', result);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to register SIP');
    }
  };

  const handleGetSipStatus = async () => {
    try {
      const status = await Akuvox.getSipStatus();
      setSipStatus(status);
      Alert.alert('SIP Status', status.toString());
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to get SIP status');
    }
  };

  const handleMakeCall = () => {
    Akuvox.makeCall("1192101703", "Hypanel supreme", 1);
    Alert.alert('Making Call');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Akuvox SDK Usage</Text>
      <Button title="Init SDK" onPress={handleInitSdk} />
      <Button title="Register SIP" onPress={handleRegisterSip} />
      <Button title="Get SIP Status" onPress={handleGetSipStatus} />
      <Button title="Make Call" onPress={handleMakeCall} />
      {sipStatus !== null && <Text>SIP Status: {sipStatus}</Text>}
    </View>
  );
}