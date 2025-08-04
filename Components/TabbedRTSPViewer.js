import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text, ScrollView, Dimensions } from 'react-native';
import RTSPViewer from './RTSPViewer';
import { NativeModules, NativeEventEmitter } from 'react-native';

const TEST_RTSP_URL = 'rtsp://admin:Sonic123@192.168.1.205:554/';

const { RTSPModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(RTSPModule);

const ROI_WIDTH_PERCENT = 0.5;
const ROI_HEIGHT_PERCENT = 0.5;

const TabbedRTSPViewer = ({ navigation }) => {
  const [ocrText, setOcrText] = useState('');
  const [ocrHistory, setOcrHistory] = useState([]);

  const videoWidth = Dimensions.get('window').width;
  const videoHeight = 240;

  const roiWidth = videoWidth * ROI_WIDTH_PERCENT;
  const roiHeight = videoHeight * ROI_HEIGHT_PERCENT;
  const roiX = (videoWidth - roiWidth) / 1.8;
  const roiY = (videoHeight - roiHeight) / 1.7;

  useEffect(() => {
    RTSPModule.startStream();
    const subscription = eventEmitter.addListener('onTextDetected', (event) => {
      setOcrText(event.text);
      setOcrHistory((prev) => [event.text, ...prev]);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const handleFullScreen = () => {
    navigation.navigate('FullScreenRTSP', { uri: TEST_RTSP_URL });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
        <RTSPViewer uri={TEST_RTSP_URL} style={{ width: videoWidth, height: videoHeight }} />
        <View
          pointerEvents="none"
          style={[
            styles.roiRect,
            {
              left: roiX,
              top: roiY,
              width: roiWidth,
              height: roiHeight,
            },
          ]}
        />
      </View>

      <Button title="Full Screen" onPress={handleFullScreen} />
      <View style={styles.ocrBox}>
        <Text style={styles.ocrTitle}>Latest OCR Text:</Text>
        <Text style={styles.ocrText}>{ocrText || "No text detected yet."}</Text>
      </View>
      <ScrollView style={styles.ocrHistory}>
        {ocrHistory.map((text, idx) => (
          <Text key={idx} style={styles.ocrHistoryText}>{text}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  videoContainer: { position: 'relative', backgroundColor: 'black' },
  roiRect: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'lime',
    backgroundColor: 'rgba(0,0,0,0.0)',
    zIndex: 10,
  },
  ocrBox: { margin: 12, padding: 12, backgroundColor: '#222', borderRadius: 8 },
  ocrTitle: { fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  ocrText: { color: '#0f0', fontSize: 16 },
  ocrHistory: { maxHeight: 100, marginHorizontal: 12 },
  ocrHistoryText: { color: '#bbb', fontSize: 12, marginTop: 2 },
});

export default TabbedRTSPViewer;