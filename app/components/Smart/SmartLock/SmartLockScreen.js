import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  requireNativeComponent,
  UIManager,
  Platform,
} from 'react-native';

const { Akuvox } = NativeModules;

const VIEW_NAME = 'SmartLockMonitorView';
const isNativeViewRegistered =
  (UIManager.getViewManagerConfig
    ? UIManager.getViewManagerConfig(VIEW_NAME)
    : UIManager[VIEW_NAME]) != null;

// Fallback throws a helpful error if the native view isn’t registered
const SmartLockMonitorView = isNativeViewRegistered
  ? requireNativeComponent(VIEW_NAME)
  : () => {
      throw new Error(
        `${VIEW_NAME} is not registered. Rebuild the app after adding SmartLockMonitorViewManager and ensure the package is linked.`
      );
    };

function checkMethod(name) {
  if (!Akuvox || typeof Akuvox[name] !== 'function') {
    throw new Error(`[Akuvox] Missing native method: ${name}`);
  }
}

export default function SmartLockScreen() {
  // Device config
  const residenceId = 'r45844047053e43d78fe5272c5badbd3a';
  const userId = 'a9b41de81c3284515a5e833d53412fe14';
  const deviceId = 'db8cbfe10650e484d800b2a0a7b07fd78';
  const deviceIp = '192.168.2.100';

  // UI state
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorId, setMonitorId] = useState(null);
  const [unlockStatus, setUnlockStatus] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [loading, setLoading] = useState(false);

  const safePromiseCall = useCallback(async (fn, args = [], alertMsg = '', onError = () => {}) => {
    try {
      checkMethod(fn);
      const result = Akuvox[fn](...args);
      if (result && typeof result.then === 'function') {
        return await result;
      }
      return result;
    } catch (err) {
      console.error(`[Akuvox] ${fn} error:`, err);
      Alert.alert('Native Error', alertMsg || err.message);
      onError(err);
      return null;
    }
  }, []);

  const safeCall = useCallback((fn, args, alertMsg = '', onError = () => {}) => {
    try {
      checkMethod(fn);
      Akuvox[fn](...args);
    } catch (err) {
      console.error(`[Akuvox] ${fn} error:`, err);
      Alert.alert('Native Error', alertMsg || err.message);
      onError(err);
    }
  }, []);

  function handleInitLockConfig() {
    safeCall('initLockConfig', [residenceId, userId, deviceId, deviceIp], 'Lock initialization failed');
  }

  const handleUnlock = () => {
    checkMethod('unlockViaLAN');
    Akuvox.unlockViaLAN(deviceId, (success) => {
      setUnlockStatus(success ? 'Unlocked!' : 'Unlock failed');
      Alert.alert(success ? 'Door unlocked' : 'Unlock failed');
    });
  };

  useEffect(() => {
    handleInitLockConfig();

    const eventEmitter = new NativeEventEmitter(Akuvox);

    // Register RTSP listener and kick off monitor handshake
    safeCall('setRtspMessageListener', [deviceId, userId], 'Failed to set RTSP listener');
    safeCall('prepareVideoStart', [deviceId], 'Failed to prepare video start');

    const lanSub = eventEmitter.addListener('onSmartLockRtsp', async (event) => {
      if (event?.status === 'rtspReady' && event.rtspUrl) {
        setLoading(true);
        const res = await safePromiseCall(
          'startMonitorViaLAN',
          [event.rtspUrl, deviceId],
          'Failed to start LAN monitoring'
        );
        setLoading(false);
        if (!res || !res.monitorId || res.monitorId <= 0) {
          setVideoError('Failed to start LAN monitor');
        }
      }
      if (event?.status === 'rtspStop') {
        setIsMonitoring(false);
        setMonitorId(null);
        setLoading(false);
      }
    });

    const establishedSub = eventEmitter.addListener('onMonitorEstablished', (event) => {
      if (event?.monitorId > 0) {
        setIsMonitoring(true);
        setVideoError('');
        setMonitorId(event.monitorId);
      }
    });

    const surfaceViewSub = eventEmitter.addListener('onMonitorLoadSurfaceView', (event) => {
      if (event?.monitorId > 0) {
        // Force re-attachment of the native view
        setMonitorId(-1);
        setTimeout(() => setMonitorId(event.monitorId), 0);
      }
    });

    const rtspErrorSub = eventEmitter.addListener('onRtspError', (event) => {
      setVideoError(`RTSP error: ${event?.error || 'Unknown error'}`);
    });

    return () => {
      try {
        lanSub.remove();
        establishedSub.remove();
        surfaceViewSub.remove();
        rtspErrorSub.remove();
      } catch {}
      if (monitorId && monitorId > 0) {
        safeCall('finishMonitor', [monitorId]);
      }
      safeCall('stopVideoViaLAN', [deviceId]);
      safeCall('clearRtspMessageListener', []);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderVideoArea = () => {
    if (isMonitoring && monitorId && monitorId > 0) {
      return (
        <View style={styles.videoContainer}>
          <SmartLockMonitorView style={styles.nativeVideo} monitorId={monitorId} />
          <Text style={styles.monitorType}>LAN Monitoring (SDK)</Text>
          {videoError ? <Text style={styles.videoError}>{videoError}</Text> : null}
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>SL50 Smart Lock</Text>
      <View style={styles.lockCard}>
        <Text style={styles.lockCardTitle}>Unlock Your Door</Text>
        <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock} activeOpacity={0.7}>
          <Text style={styles.unlockButtonText}>Unlock</Text>
        </TouchableOpacity>
        {unlockStatus && <Text style={styles.status}>{unlockStatus}</Text>}
      </View>
      {renderVideoArea()}
      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  scrollContent: { padding: 24, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#2d3748', marginBottom: 16, letterSpacing: 1, textAlign: 'center' },
  lockCard: {
    width: '98%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 20, padding: 22, marginBottom: 30,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4, alignItems: 'center',
  },
  lockCardTitle: { fontSize: 20, fontWeight: '600', color: '#3182ce', marginBottom: 14, letterSpacing: 0.5 },
  unlockButton: {
    width: 140, backgroundColor: '#38a169', paddingVertical: 14, borderRadius: 12, alignItems: 'center',
    marginVertical: 8, shadowColor: '#38a169', shadowOpacity: 0.18, shadowRadius: 8, elevation: 3,
  },
  unlockButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 },
  status: { fontSize: 18, color: '#38a169', marginTop: 12, fontWeight: '600', letterSpacing: 0.5 },
  videoContainer: {
    width: '98%', maxWidth: 420, aspectRatio: 1.6,
    // borderRadius: 16,
    // overflow: 'hidden',
    backgroundColor: '#222',
    marginTop: 4,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  nativeVideo: { flex: 1, width: '100%', minHeight: 220, backgroundColor: '#111' },
  monitorType: { color: '#fff', fontWeight: 'bold', marginTop: 12, fontSize: 16, letterSpacing: 1 },
  videoError: { color: '#c53030', fontWeight: 'bold', marginTop: 12, fontSize: 16, letterSpacing: 1, textAlign: 'center' },
});