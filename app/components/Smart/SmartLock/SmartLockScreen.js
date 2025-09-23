import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { requireNativeComponent } from 'react-native';

const { Akuvox } = NativeModules;
const SmartLockMonitorView = requireNativeComponent('SmartLockMonitorView');

function checkMethod(name) {
  if (!Akuvox || typeof Akuvox[name] !== 'function') {
    throw new Error(`[Akuvox] Missing native method: ${name}`);
  }
}

export default function SmartLockScreen() {
  // Device and demo config
  const residenceId = 'r45844047053e43d78fe5272c5badbd3a';
  const userId = 'a9b41de81c3284515a5e833d53412fe14';
  const deviceId = 'd17a685f1c5dd4aa893cda99623df553e';
  const deviceIp = '192.168.1.100';
  const wanRtspUrl = 'rtsp://rtsp-a.ecloud.akubela.com:10554/507B91E14E64';
  const wanCiphertext = 'mUud6jHgyOriMe31CM4YdN4wBdaPnUSPB34SX17EBxUU4y74REq8CPyGxOAVdgOxR4v/c7yUd6oILUpZ21pTLsr1OE3tN2GOFmTW+VSaQRRS6KbjskTAvbhLumJ6hVBDcpYWwDgatX9EGCFmZ0svKQ==';

  // UI/logic state
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorId, setMonitorId] = useState(null);
  const [unlockStatus, setUnlockStatus] = useState(null);
  const [monitorType, setMonitorType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastEvent, setLastEvent] = useState('');
  const [surfaceViewInfo, setSurfaceViewInfo] = useState('');
  const [videoError, setVideoError] = useState('');
  const [lanRtspUrl, setLanRtspUrl] = useState('');

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(Akuvox);

    // LAN RTSP event (ignore monitorId here, use only rtspUrl)
    const lanSub = eventEmitter.addListener('onSmartLockRtsp', event => {
      console.log('Received LAN RTSP Event:', event);
      setLastEvent('onSmartLockRtsp: ' + JSON.stringify(event, null, 2));
      if (event && event.status === 'rtspReady' && event.rtspUrl) {
        setLanRtspUrl(event.rtspUrl);
        // Only call prepareVideoStart after getting rtspUrl from this event
        safeCall('prepareVideoStart', [deviceId, event.rtspUrl, wanCiphertext], 'Failed to prepare video for LAN');
      }
      if (event && event.status === 'rtspStop') {
        setIsMonitoring(false);
        setMonitorId(null);
        setMonitorType(null);
        setLoading(false);
      }
    });

    // Only use monitorId from here!
    const establishedSub = eventEmitter.addListener('onMonitorEstablished', event => {
      console.log('onMonitorEstablished:', event);
      setLastEvent('onMonitorEstablished: ' + JSON.stringify(event, null, 2));
      if (event && typeof event.monitorId === 'number' && event.monitorId > 0) {
        setMonitorId(event.monitorId);
        setIsMonitoring(true);
        setMonitorType('lan');
        setLoading(false);
        setVideoError('');
      } else {
        setVideoError('Monitor established event received but monitorId was not valid.');
      }
    });

    // SDK callback for surface view (for debug)
    const surfaceViewSub = eventEmitter.addListener('onMonitorLoadSurfaceView', event => {
      console.log('onMonitorLoadSurfaceView:', event);
      setLastEvent('onMonitorLoadSurfaceView: ' + JSON.stringify(event, null, 2));
      setSurfaceViewInfo(event ? event.surfaceViewsParams : '');
    });

    // WAN monitor
    const wanSub = eventEmitter.addListener('onWanMonitorStarted', event => {
      console.log('Received WAN Monitor Event:', event);
      setLastEvent('onWanMonitorStarted: ' + JSON.stringify(event, null, 2));
      if (event && event.monitorId > 0) {
        setMonitorId(event.monitorId);
        setIsMonitoring(true);
        setMonitorType('wan');
        setLoading(false);
        setVideoError('');
      } else {
        setLoading(false);
        setVideoError('WAN Monitor Error: Failed to start WAN monitoring.');
        Alert.alert('WAN Monitor Error', 'Failed to start WAN monitoring');
      }
    });

    return () => {
      lanSub.remove();
      establishedSub.remove();
      surfaceViewSub.remove();
      wanSub.remove();
    };
  }, []);

  // Defensive wrappers
  const safeCall = useCallback((fn, args, alertMsg = '', onError = () => {}) => {
    try {
      checkMethod(fn);
      Akuvox[fn](...args);
    } catch (err) {
      console.error(`[Akuvox] ${fn} error:`, err);
      Alert.alert('Native Error', alertMsg || err.message);
      onError(err);
      setLoading(false);
    }
  }, []);

  // For promise-based calls (WAN)
  const safePromiseCall = useCallback(async (fn, args, alertMsg = '', onError = () => {}) => {
    try {
      checkMethod(fn);
      setLoading(true);
      const result = await Akuvox[fn](...args);
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      console.error(`[Akuvox] ${fn} error:`, err);
      Alert.alert('Native Error', alertMsg || err.message);
      onError(err);
      return null;
    }
  }, []);

  const handleInitLockConfig = () => {
    safeCall('initLockConfig', [residenceId, userId, deviceId, deviceIp], 'Lock initialization failed');
    Alert.alert('Lock initialized');
  };

  const handleUnlock = () => {
    checkMethod('unlockViaLAN');
    Akuvox.unlockViaLAN(deviceId, (success) => {
      setUnlockStatus(success ? 'Unlocked!' : 'Unlock failed');
      Alert.alert(success ? 'Door unlocked' : 'Unlock failed');
    });
  };

  // LAN Monitoring: Set listener first. Only call prepareVideoStart after getting rtspUrl from event.
  const handleStartLanMonitor = () => {
    if (isMonitoring || loading) return;
    setLoading(true);
    setMonitorType('lan');
    setVideoError('');
    safeCall('setRtspMessageListener', [deviceId, userId], 'Failed to set LAN RTSP listener', () => setLoading(false));
    // prepareVideoStart will be called automatically from onSmartLockRtsp event when rtspUrl is available
    // Try calling prepareVideoStart immediately for debug:
  safeCall('prepareVideoStart', [deviceId, "", ""], 'Failed to prepare video for LAN');
  };

  const handleStartWanMonitor = async () => {
    if (isMonitoring || loading) return;
    setLoading(true);
    setMonitorType('wan');
    setVideoError('');
    checkMethod('startWanMonitor');
    try {
      const result = await Akuvox.startWanMonitor(wanRtspUrl, wanCiphertext);
      if (!result || !result.monitorId || result.monitorId <= 0) {
        setLoading(false);
        setVideoError('Native failed to start WAN monitoring.');
        Alert.alert('WAN Monitor Error', 'Native failed to start WAN monitoring');
      }
    } catch (err) {
      setLoading(false);
      setVideoError('Native error starting WAN monitor: ' + (err.message || 'Unknown error'));
      Alert.alert('WAN Monitor Error', err.message || 'Native error');
    }
  };

  const handleStopMonitor = () => {
    if (!monitorType || !monitorId) return;
    setLoading(true);
    setVideoError('');
    try {
      if (monitorType === 'lan') {
        safeCall('stopVideoViaLAN', [deviceId], 'Failed to stop LAN video');
        safeCall('finishMonitor', [monitorId], 'Failed to finish LAN monitor');
        safeCall('clearRtspMessageListener', [], 'Failed to clear LAN RTSP listener');
      } else if (monitorType === 'wan') {
        safeCall('finishMonitor', [monitorId], 'Failed to finish WAN monitor');
      }
      setIsMonitoring(false);
      setMonitorId(null);
      setMonitorType(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setVideoError('Error stopping monitor: ' + (err.message || 'Native error'));
      Alert.alert('Stop Monitor Error', err.message || 'Native error');
    }
  };

  // Render video area or error
  const renderVideoArea = () => {
    if (isMonitoring && monitorId !== null && monitorId > 0) {
      return (
        <View style={styles.videoContainer}>
          <SmartLockMonitorView
            style={{ flex: 1, width: '100%' }}
            monitorId={monitorId}
            // Add other props if needed for debugging
          />
          <Text style={styles.monitorType}>
            Type: {monitorType === 'wan' ? 'WAN' : 'LAN'} Monitoring
          </Text>
          {videoError ? (
            <Text style={styles.videoError}>{videoError}</Text>
          ) : null}
        </View>
      );
    }
    if (videoError) {
      return (
        <View style={styles.videoContainer}>
          <Text style={styles.videoError}>{videoError}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Smart Lock Controls</Text>
      <Button title="Init Lock Config" onPress={handleInitLockConfig} disabled={loading || isMonitoring} />
      <View style={{ height: 16 }} />
      <Button title="Unlock via LAN" onPress={handleUnlock} color="#38a169" disabled={loading || isMonitoring} />
      {unlockStatus && <Text style={styles.status}>{unlockStatus}</Text>}
      <View style={{ height: 16 }} />
      {!isMonitoring && !loading ? (
        <>
          <Button
            title="Start LAN Monitoring"
            onPress={handleStartLanMonitor}
            color="#3182ce"
            disabled={loading}
          />
          <View style={{ height: 12 }} />
          <Button
            title="Start WAN Monitoring"
            onPress={handleStartWanMonitor}
            color="#6b46c1"
            disabled={loading}
          />
        </>
      ) : (
        <Button title="Stop Monitoring" onPress={handleStopMonitor} color="#c53030" disabled={loading} />
      )}
      {loading && (
        <Text style={{ color: '#666', marginTop: 16 }}>Processing...</Text>
      )}

      {/* Show monitorId and debugging info */}
      <View style={styles.debugBox}>
        <Text style={styles.debugTitle}>Debug Info</Text>
        <Text>monitorId: {String(monitorId)}</Text>
        {surfaceViewInfo ? <Text>SurfaceView: {surfaceViewInfo}</Text> : null}
        <Text>Last Native Event:</Text>
        <Text style={styles.debugEvent}>{lastEvent}</Text>
        {videoError ? (
          <Text style={styles.videoError}>{videoError}</Text>
        ) : null}
      </View>

      {/* Video Area */}
      {renderVideoArea()}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  status: { fontSize: 18, color: '#38a169', marginTop: 12 },
  videoContainer: {
    flex: 1,
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monitorType: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 1,
  },
  videoError: {
    color: '#c53030',
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  debugBox: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  debugEvent: {
    marginTop: 4,
    color: '#4a5568',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});