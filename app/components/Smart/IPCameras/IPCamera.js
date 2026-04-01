import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import RTSPViewer from './RTSPViewer';
import Screen from '../../Screen';

const CAMERA_1 = {
  LAN: 'rtsp://admin:Sonic123@192.168.2.121:554',
  WAN: 'rtsp://d4f54a92bea2a440c8a6a23d0b636dcf7:p5241f530fefc4497923e3db8de08c851@rtsp-a.ecloud.akubela.com:10554/TD-0C110500755C-ib89acd84d5864f288393fbe35775cf78',
};

const CAMERA_2 = {
  LAN: 'rtsp://admin:Sonic123@192.168.2.122:554/cam/realmonitor?channel=1/',
  WAN: 'rtsp://d4f54a92bea2a440c8a6a23d0b636dcf7:p5241f530fefc4497923e3db8de08c851@rtsp-a.ecloud.akubela.com:10554/TD-0C110500755C-if36b21d00f1d41259595fc4ec227cc6b',
};


export default function CameraView({ route }) {
  const selectedOption = route?.params?.selectedOption === 'WAN' ? 'WAN' : 'LAN';
  const [selectedTab, setSelectedTab] = useState('Hikvision Camera');

  // URLs for the selected camera
  const urls = selectedTab === 'Hikvision Camera' ? CAMERA_1 : CAMERA_2;

  // Choose the appropriate RTSP URL based on `selectedOption`
  const uri = useMemo(() => {
    return selectedOption === 'LAN' ? urls.LAN : urls.WAN;
  }, [selectedOption, urls]);

  const { width } = Dimensions.get('window');
  const playerHeight = Math.round((width * 9) / 16); // 16:9 player

  return (
    <Screen style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.contextChip}>
            <Text style={styles.contextChipText}>Camera Hub</Text>
          </View>
          <View style={[styles.contextChip, styles.modeChip]}>
            <Text style={styles.modeChipText}>{selectedOption}</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.cardTitle}>Live Cameras</Text>
          <Text style={styles.cardSubtitle}>Switch feeds and monitor entrances in real time.</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'Hikvision Camera' && styles.tabButtonActive]}
              onPress={() => setSelectedTab('Hikvision Camera')}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === 'Hikvision Camera' && styles.tabButtonTextActive,
                ]}
              >
                Camera 1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'Dahua Camera' && styles.tabButtonActive]}
              onPress={() => setSelectedTab('Dahua Camera')}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === 'Dahua Camera' && styles.tabButtonTextActive,
                ]}
              >
                Camera 2
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.playerContainer, { height: playerHeight }]}>
            <RTSPViewer uri={uri} style={styles.player} />
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
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
    backgroundColor: '#1c1c1e',
  },
  contextChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modeChip: {
    backgroundColor: '#eaf2ff',
  },
  modeChipText: {
    color: '#325ea8',
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f1f4f9',
  },
  tabButtonActive: {
    backgroundColor: '#d9eceb',
  },
  tabButtonText: {
    color: '#506078',
    fontSize: 14,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#0f766e',
    fontWeight: '700',
  },

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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
});