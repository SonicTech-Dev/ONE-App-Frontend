import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView, Platform } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
// import { requireNativeComponent } from 'react-native'; // Not needed for RTSPViewer
import RTSPViewer from './RTSPViewer'; // <-- Import your RTSPViewer component

const { Akuvox } = NativeModules;
// const SmartLockMonitorView = requireNativeComponent('SmartLockMonitorView'); // Keep but commented

function checkMethod(name) {
  if (!Akuvox || typeof Akuvox[name] !== 'function') {
    throw new Error(`[Akuvox] Missing native method: ${name}`);
  }
}

export default function SmartLockScreen() {
  // Device config
  const residenceId = 'r45844047053e43d78fe5272c5badbd3a';
  const userId = 'a9b41de81c3284515a5e833d53412fe14';
  const deviceId = 'd17a685f1c5dd4aa893cda99623df553e';
  const deviceIp = '192.168.1.101';
  const lanRtspUrl = 'rtsp://admin:Sonic123@192.168.1.104:554/cam/realmonitor?channel=1&subtype=0'; // <-- Use your LAN RTSP URL
  const wanRtspUrl = 'rtsp://rtsp-a.ecloud.akubela.com:10554/507B91E14E64';
  const wanCiphertext = 'mUud6jHgyOriMe31CM4YdN4wBdaPnUSPB34SX17EBxUU4y74REq8CPyGxOAVdgOxR4v/c7yUd6oILUpZ21pTLsr1OE3tN2GOFmTW+VSaQRRS6KbjskTAvbhLumJ6hVBDcpYWwDgatX9EGCFmZ0svKQ==';

  // UI/logic state
  const [isMonitoring, setIsMonitoring] = useState(false);
  // const [monitorId, setMonitorId] = useState(null); // Keep but commented
  const [unlockStatus, setUnlockStatus] = useState(null);
  // const [monitorType, setMonitorType] = useState(null); // Keep but commented
  const [monitorType, setMonitorType] = useState(null); // 'lan' or 'wan'
  const [loading, setLoading] = useState(false);
  // const [surfaceViewInfo, setSurfaceViewInfo] = useState(''); // Keep but commented
  const [lastEvent, setLastEvent] = useState('');
  const [videoError, setVideoError] = useState('');
  // const [lanRtspUrlDynamic, setLanRtspUrlDynamic] = useState(''); // Keep but commented

  // Step 1 - Set up event listeners (for WAN, debug, unlock, etc.)
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(Akuvox);

    // Uncomment to support dynamic LAN RTSP via event
    /*
    // LAN RTSP listener
    const lanSub = eventEmitter.addListener('onSmartLockRtsp', event => {
      console.log('Received LAN RTSP Event:', event);
      setLastEvent('onSmartLockRtsp: ' + JSON.stringify(event, null, 2));
      if (event && event.status === 'rtspReady' && event.rtspUrl) {
        setLanRtspUrlDynamic(event.rtspUrl);
        safePromiseCall('startMonitorViaLAN', [event.rtspUrl, deviceId], 'Failed to start LAN monitoring')
          .then(res => {
            setLoading(false);
            if (!res || !res.monitorId || res.monitorId <= 0) {
              setVideoError('Failed to start LAN monitor');
            }
            // Do NOT set monitorId here; handled in onMonitorEstablished
          });
      }
      if (event && event.status === 'rtspStop') {
        setIsMonitoring(false);
        setMonitorId(null);
        setMonitorType(null);
        setLoading(false);
      }
    });

    // Monitor Established (authoritative monitorId)
    const establishedSub = eventEmitter.addListener('onMonitorEstablished', event => {
      console.log('onMonitorEstablished:', event);
      setLastEvent('onMonitorEstablished: ' + JSON.stringify(event, null, 2));
      if (event && event.monitorId > 0) {
        setMonitorId(event.monitorId); // Always set monitorId here
        setIsMonitoring(true);
        setMonitorType(prev => prev || 'lan');
        setLoading(false);
        setVideoError('');
      }
      setSurfaceViewInfo(event ? event.surfaceViewsParams : '');
    });

    // SurfaceView params
    const surfaceViewSub = eventEmitter.addListener('onMonitorLoadSurfaceView', event => {
      console.log('onMonitorLoadSurfaceView:', event);
      setLastEvent('onMonitorLoadSurfaceView: ' + JSON.stringify(event, null, 2));
      setSurfaceViewInfo(event ? event.surfaceViewsParams : '');
    });
    */

    // WAN monitor started
    const wanSub = eventEmitter.addListener('onWanMonitorStarted', event => {
      setLastEvent('onWanMonitorStarted: ' + JSON.stringify(event, null, 2));
      if (!event || event.monitorId <= 0) {
        setLoading(false);
        setVideoError('WAN Monitor Error: Failed to start WAN monitoring.');
        Alert.alert('WAN Monitor Error', 'Failed to start WAN monitoring');
      }
      // MonitorId will be set in onMonitorEstablished
    });

    // RTSP error
    const rtspErrorSub = eventEmitter.addListener('onRtspError', event => {
      setVideoError(`RTSP error: ${event.error || 'Unknown error'}`);
      setLoading(false);
    });

    return () => {
      // if (lanSub) lanSub.remove();
      // if (establishedSub) establishedSub.remove();
      // if (surfaceViewSub) surfaceViewSub.remove();
      wanSub.remove();
      rtspErrorSub.remove();
    };
  }, []);

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

  // LAN Monitoring: Just show RTSPViewer for the LAN RTSP URL (no SDK calls)
  const handleStartLanMonitor = () => {
    if (isMonitoring || loading) return;
    setLoading(false); // Not loading, only UI change
    setMonitorType('lan');
    setVideoError('');
    setIsMonitoring(true);
    // No SDK calls, just show RTSPViewer for LAN

    // Uncomment below to use SDK LAN monitoring logic
    /*
    setLoading(true);
    setMonitorType('lan');
    setVideoError('');
    safeCall('setRtspMessageListener', [deviceId, userId], 'Failed to set LAN RTSP listener', () => setLoading(false));
    safeCall('prepareVideoStart', [deviceId], 'Failed to prepare video start', () => setLoading(false));
    */
  };

  // WAN Monitoring: Use original logic
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
      // MonitorId will be set in onMonitorEstablished
      setIsMonitoring(true);
    } catch (err) {
      setLoading(false);
      setVideoError('Native error starting WAN monitor: ' + (err.message || 'Unknown error'));
      Alert.alert('WAN Monitor Error', err.message || 'Native error');
    }
  };

  const handleStopMonitor = () => {
    // Stop monitoring for both LAN and WAN
    setIsMonitoring(false);
    setMonitorType(null);
    setLoading(false);
    setVideoError('');
    // For WAN, you may want to call Akuvox.finishMonitor or similar if needed

    // Uncomment below to use SDK stop logic
    /*
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
    */
  };

  // Render video area or error
  const renderVideoArea = () => {
    if (isMonitoring && monitorType === 'lan') {
      return (
        <View style={styles.videoContainer}>
          {/* RTSPViewer: just stream LAN RTSP URL */}
          <RTSPViewer
            uri={lanRtspUrl}
            style={styles.nativeVideo}
          />
          <Text style={styles.monitorType}>
            Type: LAN Monitoring
          </Text>
          {videoError ? (
            <Text style={styles.videoError}>{videoError}</Text>
          ) : null}
        </View>
      );
    }
    // Uncomment below to use SDK view for LAN
    /*
    if (isMonitoring && monitorType === 'lan' && monitorId !== null && monitorId > 0) {
      return (
        <View style={styles.videoContainer}>
          <SmartLockMonitorView
            style={styles.nativeVideo}
            monitorId={monitorId}
          />
          <Text style={styles.monitorType}>
            Type: LAN Monitoring (SDK)
          </Text>
          {videoError ? (
            <Text style={styles.videoError}>{videoError}</Text>
          ) : null}
        </View>
      );
    }
    */
    // If you want to support WAN, add WAN video logic here
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
          {/* Uncomment to support WAN monitoring */}
          {/* <View style={{ height: 12 }} />
          <Button
            title="Start WAN Monitoring"
            onPress={handleStartWanMonitor}
            color="#6b46c1"
            disabled={loading}
          /> */}
        </>
      ) : (
        <Button title="Stop Monitoring" onPress={handleStopMonitor} color="#c53030" disabled={loading} />
      )}
      {loading && (
        <Text style={{ color: '#666', marginTop: 16 }}>Processing...</Text>
      )}

      <View style={styles.debugBox}>
        <Text style={styles.debugTitle}>Debug Info</Text>
        {/* <Text>monitorId: {String(monitorId)}</Text> */}
        {/* {surfaceViewInfo ? <Text>SurfaceView: {surfaceViewInfo}</Text> : null} */}
        <Text>Last Native Event:</Text>
        <Text style={styles.debugEvent}>{lastEvent}</Text>
        {videoError ? (
          <Text style={styles.videoError}>{videoError}</Text>
        ) : null}
      </View>

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
    width: '100%',
    aspectRatio: 1.6, // Or use a fixed height if you know your video aspect
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222',
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeVideo: {
    flex: 1,
    width: '100%',
    minHeight: 200,
    backgroundColor: '#111',
    borderRadius: 12,
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});