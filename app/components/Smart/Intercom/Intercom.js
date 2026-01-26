import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  NativeEventEmitter,
  NativeModules,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { requireNativeComponent } from 'react-native';

const { Akuvox } = NativeModules;
const SmartLockMonitorView = requireNativeComponent('SmartLockMonitorView');

async function requestPermissionsIfNeeded() {
  if (Platform.OS === 'android') {
    const camera = PermissionsAndroid.PERMISSIONS.CAMERA;
    const audio = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const granted = await PermissionsAndroid.requestMultiple([camera, audio]);
    return (
      granted[camera] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[audio] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
}

export default function IntercomScreen() {
  const [mode, setMode] = useState('LAN'); // 'LAN' | 'WAN'
  const [deviceId, setDeviceId] = useState(''); // for LAN
  const [userId, setUserId] = useState('');     // optional, not used by listener but logged
  const [rtspUrl, setRtspUrl] = useState('');   // for WAN or to inspect LAN returned URL
  const [ciphertext, setCiphertext] = useState('q5sa4p2gwMD6DYkkixg75l/bymQWSz8kPiFiXSNwJflACaNIDR7+4ykJfHCTkZ8tRR0AIePjUBrV+qSskC7F2AYBWO30e198FGr187+vEdDVp0Y8AghGBK6pPe2GVLi9SDMf3OQkPfqyaxTlOLKn9ydX3MDyvYiKsuodonqmKjAg3PpmfEezF76tQNBNbDBztjSHe+Nkz8Yb01jkqtln2qdX8FKQyk/Rzza1ZYAjJzS6DBgcGhLNpwPz7jrjOF1v'); // for WAN
  const [monitorId, setMonitorId] = useState(null);
  const [status, setStatus] = useState('Idle');

  const eventEmitter = useMemo(() => new NativeEventEmitter(Akuvox), []);

  // Subscribe to SDK events
  useEffect(() => {
    const subs = [
      eventEmitter.addListener('onSmartLockRtsp', (p) => {
        if (p?.status === 'rtspReady' && mode === 'LAN') {
          setRtspUrl(p.rtspUrl);
        }
        if (p?.status === 'rtspStop' && mode === 'LAN') {
          setStatus('RTSP stopped by device');
        }
      }),
      eventEmitter.addListener('onMonitorEstablished', (p) => {
        if (typeof p?.monitorId === 'number') {
          setMonitorId(p.monitorId);
          setStatus('Monitor established');
        }
      }),
      eventEmitter.addListener('onMonitorLoadSurfaceView', () => {
        // SurfaceView refreshed; no-op except maybe UI logging
      }),
      eventEmitter.addListener('onMonitorFinished', () => {
        setStatus('Monitor finished');
        setMonitorId(null);
      }),
      eventEmitter.addListener('onRtspError', (p) => {
        setStatus(`RTSP error: ${p?.error || 'unknown'}`);
      }),
    ];
    return () => subs.forEach(s => s.remove());
  }, [eventEmitter, mode]);

  // Init SDK on mount (safe to call again; your SmartScreen also does this)
  useEffect(() => {
    (async () => {
      const ok = await requestPermissionsIfNeeded();
      if (!ok) {
        Alert.alert('Permission Denied', 'Camera and microphone permissions are required.');
        return;
      }
      try {
        Akuvox?.initSdk?.();
      } catch (e) {
        Alert.alert('SDK Init Error', e?.message || 'Failed to initialize SDK');
      }
    })();
  }, []);

  const startLanMonitor = async () => {
    if (!deviceId) {
      Alert.alert('Missing deviceId', 'Enter the lock/intercom deviceId for LAN.');
      return;
    }
    try {
      setStatus('Preparing video start...');
      Akuvox.setRtspMessageListener(deviceId, userId || '');
      const res = await Akuvox.prepareVideoStart(deviceId);
      // RTSP URL will arrive via onSmartLockRtsp(rtspReady)
      setStatus('Waiting for rtspReady...');
    } catch (e) {
      Alert.alert('LAN Monitor Error', e?.message || 'Failed to prepare video.');
    }
  };

  // When rtspUrl is updated (from rtspReady), start monitor via LAN
  useEffect(() => {
    (async () => {
      if (mode !== 'LAN') return;
      if (!rtspUrl || !deviceId) return;
      try {
        setStatus('Starting LAN monitor...');
        const params = await Akuvox.startMonitorViaLAN(rtspUrl, deviceId);
        setMonitorId(params?.monitorId ?? null);
        setStatus('LAN monitor started');
      } catch (e) {
        Alert.alert('LAN Monitor Error', e?.message || 'Failed to start LAN monitor.');
      }
    })();
  }, [rtspUrl, deviceId, mode]);

  const stopLanMonitor = async () => {
    try {
      setStatus('Stopping LAN monitor...');
      if (deviceId) Akuvox.stopVideoViaLAN(deviceId);
      if (monitorId !== null) Akuvox.finishMonitor(monitorId);
      Akuvox.clearRtspMessageListener();
      setMonitorId(null);
      setStatus('LAN monitor stopped');
    } catch (e) {
      Alert.alert('Stop Error', e?.message || 'Failed to stop LAN monitor.');
    }
  };

  const startWanMonitor = async () => {
    if (!rtspUrl || !ciphertext) {
      Alert.alert('Missing WAN fields', 'Enter RTSP URL and ciphertext.');
      return;
    }
    try {
      setStatus('Starting WAN monitor...');
      const params = await Akuvox.startWanMonitor(rtspUrl, ciphertext);
      setMonitorId(params?.monitorId ?? null);
      setStatus('WAN monitor started');
    } catch (e) {
      Alert.alert('WAN Monitor Error', e?.message || 'Failed to start WAN monitor.');
    }
  };

  const stopWanMonitor = async () => {
    try {
      setStatus('Stopping WAN monitor...');
      if (monitorId !== null) Akuvox.finishMonitor(monitorId);
      setMonitorId(null);
      setStatus('WAN monitor stopped');
    } catch (e) {
      Alert.alert('Stop Error', e?.message || 'Failed to stop WAN monitor.');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        if (mode === 'LAN') {
          if (deviceId) Akuvox.stopVideoViaLAN(deviceId);
          if (monitorId !== null) Akuvox.finishMonitor(monitorId);
          Akuvox.clearRtspMessageListener();
        } else {
          if (monitorId !== null) Akuvox.finishMonitor(monitorId);
        }
      } catch {}
    };
  }, [mode, deviceId, monitorId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Intercom Monitor</Text>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, mode === 'LAN' && styles.segmentActive]}
            onPress={() => setMode('LAN')}
          >
            <Text style={[styles.segmentText, mode === 'LAN' && styles.segmentTextActive]}>LAN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, mode === 'WAN' && styles.segmentActive]}
            onPress={() => setMode('WAN')}
          >
            <Text style={[styles.segmentText, mode === 'WAN' && styles.segmentTextActive]}>WAN</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.status}>Status: {status}</Text>
      </View>

      {mode === 'LAN' ? (
        <View style={styles.form}>
          <TextInput
            placeholder="Device ID"
            value={deviceId}
            onChangeText={setDeviceId}
            style={styles.input}
          />
          <TextInput
            placeholder="User ID (optional)"
            value={userId}
            onChangeText={setUserId}
            style={styles.input}
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.primary} onPress={startLanMonitor}>
              <Text style={styles.btnText}>Start LAN Monitor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={stopLanMonitor}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            placeholder="RTSP URL"
            value={rtspUrl}
            onChangeText={setRtspUrl}
            style={styles.input}
          />
          <TextInput
            placeholder="Ciphertext"
            value={ciphertext}
            onChangeText={setCiphertext}
            style={styles.input}
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.primary} onPress={startWanMonitor}>
              <Text style={styles.btnText}>Start WAN Monitor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={stopWanMonitor}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.monitorContainer}>
        {monitorId !== null ? (
          <SmartLockMonitorView style={styles.monitor} monitorId={monitorId} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No monitor started</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b132b' },
  header: { padding: 16, backgroundColor: '#1c2541' },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  segment: { flexDirection: 'row', marginTop: 12 },
  segmentBtn: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16,
    backgroundColor: '#3a506b', marginRight: 8,
  },
  segmentActive: { backgroundColor: '#5bc0be' },
  segmentText: { color: '#a1b2c3', fontWeight: '600' },
  segmentTextActive: { color: '#0b132b' },
  status: { marginTop: 12, color: '#cde7f2' },
  form: { padding: 16, backgroundColor: '#1c2541' },
  input: {
    backgroundColor: '#3a506b', color: '#fff', padding: 10, borderRadius: 8,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  primary: {
    backgroundColor: '#5bc0be', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flex: 1, marginRight: 8,
  },
  secondary: {
    backgroundColor: '#6c757d', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flex: 1, marginLeft: 8,
  },
  btnText: { color: '#0b132b', fontWeight: '700', textAlign: 'center' },
  monitorContainer: { flex: 1, backgroundColor: '#0b132b' },
  monitor: { flex: 1, backgroundColor: '#000' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#6c757d' },
});