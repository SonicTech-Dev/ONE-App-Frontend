import React from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import RTSPViewer from './RTSPViewer';

const LAN_RTSP_URL = 'rtsp://admin:Sonic123@192.168.1.104:554/cam/realmonitor?channel=1&subtype=0';

export default function IntercomScreen() {
  // Streaming view opens immediately, no modal, styled as a big full screen view with a close button
  // If you want navigation, you can use react-navigation to handle "goBack" or similar logic for closing

  // Example: if you want a close button to go back, you might need navigation (not shown here)
  // Otherwise, simply show the stream

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intercom Streaming</Text>
      <View style={styles.videoContainer}>
        <RTSPViewer
          uri={LAN_RTSP_URL}
          style={styles.rtspView}
        />
      </View>
      {/* Example close button if you want to trigger navigation.goBack() */}
      {/* Remove this block if you use navigation header */}
      {/* 
      <TouchableOpacity
        style={styles.closeButtonContainer}
        onPress={() => {}}
        activeOpacity={0.7}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1b2d',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    letterSpacing: 1,
  },
  videoContainer: {
    width: '98%',
    maxWidth: 650,
    aspectRatio: 1.6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(0,0,0,0.14)',
    elevation: 7,
  },
  rtspView: {
    flex: 1,
    width: '100%',
    minHeight: 320,
    backgroundColor: '#111',
    borderRadius: 16,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },
  closeButtonText: {
    color: '#c53030',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});