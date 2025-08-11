import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import RTSPViewer from './RTSPViewer';
import { NativeModules, NativeEventEmitter } from 'react-native';

const TEST_RTSP_URL = 'rtsp://admin:Sonic123@192.168.1.208:554/cam/realmonitor?channel=1&subtype=0';

const { RTSPModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(RTSPModule);

const ROI_WIDTH_PERCENT = 1;
const ROI_HEIGHT_PERCENT = 1;

// Replace with your actual image path
const BG_IMAGE = require('../Assets/bg.png');
const LOGO_LEFT = require('../Assets/Liwaas.png');
const LOGO_RIGHT = require('../Assets/uaeflag.png');

const TabbedRTSPViewer = ({ navigation }) => {
  const [ocrText, setOcrText] = useState('');
  const [ocrHistory, setOcrHistory] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const videoWidth = Dimensions.get('window').width - 32;
  const videoHeight = 240;

  const roiWidth = videoWidth * ROI_WIDTH_PERCENT;
  const roiHeight = videoHeight * ROI_HEIGHT_PERCENT;
  const roiX = (videoWidth - roiWidth) / 2;
  const roiY = (videoHeight - roiHeight) / 2;

  const intervalRef = useRef(null);

  useEffect(() => {
    RTSPModule.startStream();
    const subscription = eventEmitter.addListener('onTextDetected', (event) => {
      setOcrText(event.text);
      setOcrHistory((prev) => [event.text, ...prev]);
    });

    setElapsedMs(0);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 50);

    return () => {
      subscription.remove();
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleFullScreen = () => {
    navigation.navigate('FullScreenRTSP', { uri: TEST_RTSP_URL });
  };

  // Format timer as mm:ss:ms
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const msDisplay = Math.floor((ms % 1000) / 10); // show two digits
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${msDisplay.toString().padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.imageBackground} resizeMode="cover">
      <View style={styles.overlay}>
        {/* Top Row: Logos */}
        <View style={styles.logoRow}>
          <Image source={LOGO_LEFT} style={styles.logoliwa} />
          <Image source={LOGO_RIGHT} style={styles.logouae} />
        </View>
        {/* Live Camera label just below logos */}
        <Text style={styles.headerText}>AI-Neural Network</Text>

        {/* Camera View */}
        <View style={[styles.videoContainer, { width: videoWidth, height: videoHeight }]}>
          <RTSPViewer uri={TEST_RTSP_URL} style={{ width: videoWidth, height: videoHeight, borderRadius: 18 }} />
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

        {/* Current Reading & Timer - in one row */}
        <View style={styles.readingRow}>
          <View style={styles.ocrBox}>
            <Text style={styles.ocrTitle}>Current Reading</Text>
            <Text style={styles.ocrText}>{ocrText || 'No text detected yet.'}</Text>
          </View>
          <View style={styles.timerBox}>
            <Text style={styles.timerLabel}>Elapsed Time</Text>
            <Text style={styles.timer}>{formatTime(elapsedMs)}</Text>
          </View>
        </View>

        {/* OCR History */}
        <Text style={styles.ocrHistoryTitle}>Previous Readings</Text>
        <ScrollView style={styles.ocrHistory}>
          {ocrHistory.map((text, idx) => (
            <Text key={idx} style={styles.ocrHistoryText}>{text}</Text>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.70)', // soft white overlay for readability
    paddingTop: 18,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 2,
  },
  logoliwa: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
    logouae: {
    width: 90,
    height: 72,
    resizeMode: 'contain',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#272b3b',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 18,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#f0f4fa',
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#228be6',
    shadowColor: '#228be6',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  roiRect: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#52e067',
    backgroundColor: 'rgba(0,0,0,0.0)',
    zIndex: 10,
    borderRadius: 10,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 8,
    marginTop: 2,
  },
  ocrBox: {
    flex: 1,
    marginRight: 12,
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#c7d0e0',
  },
  ocrTitle: {
    fontWeight: 'bold',
    color: '#228be6',
    fontSize: 22,
    marginBottom: 8,
    letterSpacing: 1,
  },
  ocrText: {
    color: '#0b990b',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 1,
  },
  timerBox: {
    minWidth: 100,
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#c7d0e0',
    justifyContent: 'center',
  },
  timerLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#228be6',
    marginBottom: 2,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 1)',
    backgroundColor: '#e4f4ff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
    fontFamily: 'monospace',
  },
  fullScreenBtn: {
    backgroundColor: '#228be6',
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
  },
  fullScreenBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
  ocrHistoryTitle: {
    fontWeight: 'bold',
    color: '#228be6',
    fontSize: 18,
    marginLeft: 24,
    marginBottom: 6,
    letterSpacing: 1,
    marginTop: 2,
  },
  ocrHistory: {
    maxHeight: 200,
    marginHorizontal: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#c7d0e0',
  },
  ocrHistoryText: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
    fontStyle: 'italic',
  },
});

export default TabbedRTSPViewer;