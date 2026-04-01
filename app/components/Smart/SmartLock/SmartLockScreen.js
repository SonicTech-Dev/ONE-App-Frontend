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
import Screen from '../../Screen';
import useColors from '../../../hooks/useColors';

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
  const colors = useColors();

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
    safeCall(
      'unlockViaLAN',
      [deviceId, (success) => {
        setUnlockStatus(success ? 'Unlocked' : 'Unlock failed');
        Alert.alert(success ? 'Door unlocked' : 'Unlock failed');
      }],
      'Failed to trigger door unlock'
    );
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
        <View style={[styles.videoContainer, { backgroundColor: colors.dark }] }>
          <SmartLockMonitorView style={styles.nativeVideo} monitorId={monitorId} />
          <Text style={styles.monitorType}>LAN Monitoring</Text>
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
    <Screen style={{ backgroundColor: '#f4f0ff' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>Smart Lock</Text>
          </View>
          <View style={[styles.metaChip, styles.metaChipSoft]}>
            <Text style={styles.metaTextSoft}>{isMonitoring ? 'Live' : 'Standby'}</Text>
          </View>
        </View>

        <View style={styles.lockCard}>
          <Text style={styles.lockCardTitle}>Entrance Door</Text>
          <Text style={styles.lockSubtitle}>Control access and monitor the live lock camera feed.</Text>
          <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock} activeOpacity={0.85}>
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </TouchableOpacity>
          {unlockStatus ? (
            <View style={[styles.statusBadge, unlockStatus === 'Unlocked' ? styles.statusSuccess : styles.statusError]}>
              <Text style={styles.statusText}>{unlockStatus}</Text>
            </View>
          ) : null}
        </View>

        {renderVideoArea()}
        <View style={{ height: 24 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f0ff' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 14 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d8ff',
  },
  metaChipSoft: {
    backgroundColor: '#6f4bd8',
    borderColor: '#6f4bd8',
  },
  metaText: {
    color: '#6346b0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  metaTextSoft: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  lockCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e7dcff',
    shadowColor: '#7f58e2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lockCardTitle: { fontSize: 18, fontWeight: '700', color: '#25344d', marginBottom: 6 },
  lockSubtitle: { fontSize: 13, color: '#6c7a90', marginBottom: 16, lineHeight: 19 },
  unlockButton: {
    width: '100%',
    backgroundColor: '#6f4bd8',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6f4bd8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  unlockButtonText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.4 },
  statusBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusSuccess: {
    backgroundColor: '#f1e9ff',
  },
  statusError: {
    backgroundColor: '#fbe4e4',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5a3aa9',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 1.58,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e7dbff',
    marginTop: 2,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7f58e2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  nativeVideo: { flex: 1, width: '100%', minHeight: 220, backgroundColor: '#111' },
  monitorType: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
    backgroundColor: 'rgba(111,75,216,0.78)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  videoError: {
    color: '#fca5a5',
    fontWeight: '700',
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});