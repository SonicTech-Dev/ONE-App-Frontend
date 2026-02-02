import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import RTSPViewer from './RTSPViewer';
import { buildLanHeaders } from '../SmartScreenSections/auth';

const FALLBACK_LAN_RTSP_URL = 'rtsp://admin:Sonic123@192.168.2.114:';
const FALLBACK_WAN_RTSP_URL = 'rtsp://user:J19IE753w25867v6@35.156.199.213:554/0C11052C6E92';
const FALLBACK_DEVICE_ID = '0C11052C6E92';
const BACKEND_CONTROL_URL = 'http://3.227.99.254:8010/control_devices/';

export default function Intercom({ route }) {
  const params = route?.params || {};

  // Accept selectedOption props and normalize
  const selectedOptionRaw = params.selectedOption || 'LAN';
  const isLAN = String(selectedOptionRaw).toLowerCase() === 'lan';
  const selectedOption = isLAN ? 'LAN' : 'WAN';

  // RTSP URLs and device info
  const deviceId = params.deviceId || FALLBACK_DEVICE_ID;
  const lanRtspUrl = params.lanRtspUrl || FALLBACK_LAN_RTSP_URL;
  const wanRtspUrl = params.wanRtspUrl || FALLBACK_WAN_RTSP_URL;

  // Build LAN headers inside the component (not via props)
  const [lanHeaders, setLanHeaders] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const headers = await buildLanHeaders(); // works whether buildLanHeaders is sync or async
        if (mounted) {
          setLanHeaders(headers);
          console.log('[Intercom] Built LAN_HEADERS:', headers);
        }
      } catch (err) {
        console.error('[Intercom] Failed to build LAN_HEADERS:', err);
        if (mounted) {
          setLanHeaders(null);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Pick the correct RTSP feed based on selectedOption
  const uri = useMemo(
    () => (isLAN ? lanRtspUrl : wanRtspUrl),
    [isLAN, lanRtspUrl, wanRtspUrl]
  );

  const onPressUnlockDoor = async () => {
    try {
      if (isLAN) {
        if (!lanHeaders || typeof lanHeaders !== 'object') {
          Alert.alert('Missing headers', 'LAN headers are not ready yet.');
          return;
        }
        const lanApiUrl = `http://192.168.2.115/api/v1.0/device`;
        const body = {
          command: 'control_device',
          id: 'c45e846ca23ab42c9ae469d988ae32a96',
          param: {
            device_id: deviceId,
            ability_id: `doorphone.${deviceId}`,
            action: 'unlock',
            attribute: {
              lock: [0],
            },
          },
        };

        const resp = await fetch(lanApiUrl, {
          method: 'POST',
          headers: lanHeaders,
          body: JSON.stringify(body),
        });

        if (resp.ok) {
          Alert.alert('Success', 'Door unlocked via LAN.');
        } else {
          Alert.alert('Error', 'LAN control failed. Please check device connection.');
        }
      } else {
        const apiUrl = BACKEND_CONTROL_URL;
        const body = {
          command: 'trigger_akuvox_remote_open_door',
          id: 'c45e846ca23ab42c9ae469d988ae32a96',
          param: {
            mac: deviceId,
            residence_id: 'r45844047053e43d78fe5272c5badbd3a',
            relay_id: '0',
          },
        };

        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (resp.ok) {
          Alert.alert('Success', 'Door unlocked via WAN (backend).');
        } else {
          Alert.alert('Error', 'WAN control failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Unlock error:', err);
      Alert.alert('Error', 'Failed to trigger unlock. Please check your connection.');
    }
  };

  const { width } = Dimensions.get('window');
  const playerHeight = Math.round((width * 9) / 16); // 16:9 player

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Intercom</Text>
        <View style={styles.modeChip}>
          <Text style={styles.modeChipText}>Mode: {selectedOption}</Text>
        </View>
      </View>

      {/* Camera view */}
      <View style={styles.content}>
        <View style={[styles.playerContainer, { height: playerHeight }]}>
          <RTSPViewer uri={uri} style={styles.player} />
        </View>

        {/* Unlock button */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={onPressUnlockDoor}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Unlock Door</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b132b' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1c2541',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2d3a5f',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  modeChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2d3a5f',
  },
  modeChipText: { color: '#cde7f2', fontSize: 12, fontWeight: '600' },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  playerContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  player: { width: '100%', height: '100%' },

  controls: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    minWidth: 200,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonPrimary: {
    backgroundColor: '#5bc0be',
  },
  buttonText: { color: '#0b132b', fontWeight: '700', fontSize: 16, textAlign: 'center' },
});