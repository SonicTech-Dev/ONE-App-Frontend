import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
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
  const deviceId = 'db8cbfe10650e484d800b2a0a7b07fd78';
  const deviceIp = '192.168.2.103';
  const lanRtspUrl = 'rtsp://admin:Sonic123@192.168.2.103:554/cam/realmonitor?channel=1&subtype=0'; // <-- Use your LAN RTSP URL
  const wanRtspUrl = 'rtsp://rtsp-a.ecloud.akubela.com:10554/507B91E14E64';
  const wanCiphertext = 'mUud6jHgyOriMe31CM4YdN4wBdaPnUSPB34SX17EBxUU4y74REq8CPyGxOAVdgOxR4v/c7yUd6oILUpZ21pTLsr1OE3tN2GOFmTW+VSaQRRS6KbjskTAvbhLumJ6hVBDcpYWwDgatX9EGCFmZ0svKQ==';

  // UI/logic state
  const [isMonitoring, setIsMonitoring] = useState(true); // Monitoring always on
  // const [monitorId, setMonitorId] = useState(null); // Keep but commented
  const [unlockStatus, setUnlockStatus] = useState(null);
  // const [monitorType, setMonitorType] = useState(null); // Keep but commented
  const [monitorType, setMonitorType] = useState('lan'); // Always 'lan'
  const [videoError, setVideoError] = useState('');
  // const [surfaceViewInfo, setSurfaceViewInfo] = useState(''); // Keep but commented
  // const [lanRtspUrlDynamic, setLanRtspUrlDynamic] = useState(''); // Keep but commented

  // Step 1 - Set up event listeners (for WAN, debug, unlock, etc.)
  useEffect(() => {
    // Auto init lock config when screen opens
    handleInitLockConfig();

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
      if (!event || event.monitorId <= 0) {
        setVideoError('WAN Monitor Error: Failed to start WAN monitoring.');
        Alert.alert('WAN Monitor Error', 'Failed to start WAN monitoring');
      }
      // MonitorId will be set in onMonitorEstablished
    });

    // RTSP error
    const rtspErrorSub = eventEmitter.addListener('onRtspError', event => {
      setVideoError(`RTSP error: ${event.error || 'Unknown error'}`);
    });

    return () => {
      // if (lanSub) lanSub.remove();
      // if (establishedSub) establishedSub.remove();
      // if (surfaceViewSub) surfaceViewSub.remove();
      wanSub.remove();
      rtspErrorSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Automatically call on screen open
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

  // LAN Monitoring: Just show RTSPViewer for the LAN RTSP URL (no SDK calls)
  // Monitoring is always enabled, so no button needed!

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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>SL50 Smart Lock</Text>
      <View style={styles.lockCard}>
        <Text style={styles.lockCardTitle}>Unlock Your Door</Text>
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={handleUnlock}
          activeOpacity={0.7}
        >
          <Text style={styles.unlockButtonText}>Unlock</Text>
        </TouchableOpacity>
        {unlockStatus && <Text style={styles.status}>{unlockStatus}</Text>}
      </View>
      {/* Video area always loaded */}
      {renderVideoArea()}
      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  lockCard: {
    width: '98%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },
  lockCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3182ce',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  unlockButton: {
    width: 140,
    backgroundColor: '#38a169',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#38a169',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  unlockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  status: {
    fontSize: 18,
    color: '#38a169',
    marginTop: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  videoContainer: {
    width: '98%',
    maxWidth: 420,
    aspectRatio: 1.6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#222',
    marginTop: 4,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
    elevation: 5,
  },
  nativeVideo: {
    flex: 1,
    width: '100%',
    minHeight: 220,
    backgroundColor: '#111',
    borderRadius: 16,
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
});