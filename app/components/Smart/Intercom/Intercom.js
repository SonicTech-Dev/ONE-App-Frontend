import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import RTSPViewer from './RTSPViewer';
import { buildLanHeaders } from '../SmartScreenSections/LanAuth';
import Screen from '../../Screen';

const FALLBACK_LAN_RTSP_URL = 'rtsp://admin:Sonic123@192.168.2.114:554/';
const FALLBACK_WAN_RTSP_URL = 'rtsp://user:J19IE753w25867v6@35.156.199.213:554/0C11052C6E92';
const FALLBACK_DEVICE_ID = '0C11052C6E92';
const BACKEND_CONTROL_URL = 'https://one-development.soniciot.com/control_devices/';

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
    <Screen style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.contextChip}>
            <Text style={styles.contextChipText}>Entrance Panel</Text>
          </View>
          <View style={[styles.contextChip, styles.modeChip]}>
            <Text style={styles.modeChipText}>{selectedOption}</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Live Intercom Feed</Text>
          <Text style={styles.cardSubtitle}>View the entrance stream and open the door remotely.</Text>

          <View style={[styles.playerContainer, { height: playerHeight }]}>
            <RTSPViewer uri={uri} style={styles.player} />
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>

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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fc' },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contextChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#6f4bd8',
  },
  contextChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modeChip: {
    backgroundColor: '#efe8ff',
  },
  modeChipText: {
    color: '#6a4ab8',
    fontSize: 12,
    fontWeight: '700',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    color: '#263650',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#6c7a90',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  content: { flex: 1 },
  playerContainer: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(111,75,216,0.28)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  player: { width: '100%', height: '100%' },
  controls: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
  },
  buttonPrimary: {
    backgroundColor: '#966afd',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center' },
});