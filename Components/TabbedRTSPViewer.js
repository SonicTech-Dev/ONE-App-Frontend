import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import RTSPViewer from './RTSPViewer';

const TEST_RTSP_URL = 'rtsp://admin:Sonic123@192.168.1.205:554/';

const TabbedRTSPViewer = ({ navigation }) => {
  const handleFullScreen = () => {
    navigation.navigate('FullScreenRTSP', { uri: TEST_RTSP_URL });
  };

  return (
    <View style={styles.container}>
      <RTSPViewer uri={TEST_RTSP_URL} />
      <Button title="Full Screen" onPress={handleFullScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default TabbedRTSPViewer;