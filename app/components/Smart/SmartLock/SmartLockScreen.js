import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { requireNativeComponent } from 'react-native';

const { Akuvox } = NativeModules;
const SmartLockMonitorView = requireNativeComponent('SmartLockMonitorView');
export default function SmartLockScreen() {
  // Dummy for demo, replace with real cloud/device data
  const residenceId = 'r45844047053e43d78fe5272c5badbd3a';
  const userId = 'a9b41de81c3284515a5e833d53412fe14';
  const deviceId = 'd17a685f1c5dd4aa893cda99623df553e';
  const deviceIp = '192.168.1.104';

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorId, setMonitorId] = useState(null);
  const [unlockStatus, setUnlockStatus] = useState(null);

  // 1. Call this ONCE when page loads (or in useEffect)
  const handleInitLockConfig = () => {
    Akuvox.initLockConfig(residenceId, userId, deviceId, deviceIp);
    Alert.alert('Lock initialized');
  };

  // 2. Unlock via LAN
  const handleUnlock = () => {
    Akuvox.unlockViaLAN(deviceId, (success) => {
      setUnlockStatus(success ? 'Unlocked!' : 'Unlock failed');
      Alert.alert(success ? 'Door unlocked' : 'Unlock failed');
    });
  };

  // 3. Start monitoring
  const handleStartMonitor = () => {
    Akuvox.setRtspMessageListener();
    Akuvox.prepareVideoStart(deviceId);
    Akuvox.startMonitorViaLAN(deviceId, userId);
    setIsMonitoring(true);
    // You may want to listen for monitorId from event!
  };

  // 4. Stop monitoring
  const handleStopMonitor = () => {
    if (monitorId) {
      Akuvox.stopVideoViaLAN(deviceId);
      Akuvox.finishMonitor(monitorId);
    }
    Akuvox.setRtspMessageListener(null);
    setIsMonitoring(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Lock Controls</Text>
      <Button title="Init Lock Config" onPress={handleInitLockConfig} />
      <View style={{ height: 16 }} />
      <Button title="Unlock via LAN" onPress={handleUnlock} color="#38a169" />
      {unlockStatus && <Text style={styles.status}>{unlockStatus}</Text>}
      <View style={{ height: 16 }} />
      {!isMonitoring ? (
        <Button title="Start Monitoring" onPress={handleStartMonitor} color="#3182ce" />
      ) : (
        <Button title="Stop Monitoring" onPress={handleStopMonitor} color="#c53030" />
      )}
      {isMonitoring && (
        <View style={styles.videoContainer}>
          <SmartLockMonitorView style={{flex: 1}} monitorId={monitorId} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  status: { fontSize: 18, color: '#38a169', marginTop: 12 },
  videoContainer: { flex: 1, marginTop: 24, borderRadius: 12, overflow: 'hidden', backgroundColor: '#222' },
});