import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet, Platform } from 'react-native';
import RTSPViewer from './RTSPViewer';

const LAN_RTSP_URL = 'rtsp://admin:Sonic123@192.168.1.104:554/cam/realmonitor?channel=1&subtype=0';

export default function IntercomScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleStartMonitoring = () => {
    setModalVisible(true);
  };

  const handleStopMonitoring = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Intercom LAN Monitoring"
        onPress={handleStartMonitoring}
        color="#3182ce"
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleStopMonitoring}
      >
        <View style={styles.fullScreen}>
          <RTSPViewer
            uri={LAN_RTSP_URL}
            style={styles.rtspView}
          />
          <View style={styles.closeButtonContainer}>
            <Button
              title="Close"
              onPress={handleStopMonitoring}
              color={Platform.OS === 'ios' ? '#d00' : '#c53030'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  fullScreen: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  rtspView: { flex: 1, width: '100%', height: '100%' },
  closeButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: 4,
  },
});