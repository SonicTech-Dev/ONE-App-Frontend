import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import RTSPViewer from './RTSPViewer';

const CAMERA_1 = {
  LAN: 'rtsp://admin:Sonic123@192.168.2.121:554',
  WAN: 'rtsp://d4f54a92bea2a440c8a6a23d0b636dcf7:p5241f530fefc4497923e3db8de08c851@rtsp-a.ecloud.akubela.com:10554/TD-0C110500755C-ib89acd84d5864f288393fbe35775cf78',
};

const CAMERA_2 = {
  LAN: 'rtsp://admin:Sonic123@192.168.2.122:554/cam/realmonitor?channel=1/',
  WAN: 'rtsp://d4f54a92bea2a440c8a6a23d0b636dcf7:p5241f530fefc4497923e3db8de08c851@rtsp-a.ecloud.akubela.com:10554/TD-0C110500755C-if36b21d00f1d41259595fc4ec227cc6b',
};


export default function CameraView({ selectedOption }) {
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Camera View</Text>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Hikvision Camera' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('Hikvision Camera')}
        >
          <Text style={styles.tabButtonText}>Camera 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Dahua Camera' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('Dahua Camera')}
        >
          <Text style={styles.tabButtonText}>Camera 2</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Viewer */}
      <View style={[styles.playerContainer, { height: playerHeight }]}>
        <RTSPViewer uri={uri} style={styles.player} />
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
  title: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center' },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#1c2541',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2d3a5f',
  },
  tabButtonActive: {
    backgroundColor: '#5bc0be',
  },
  tabButtonText: {
    color: '#cde7f2',
    fontSize: 14,
    fontWeight: '600',
  },

  playerContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
  },
  player: { width: '100%', height: '100%' },
});