import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';

import { NativeModules, NativeEventEmitter } from 'react-native';

const CAMERA_STREAMS = [
  { id: 'cam1', url: 'rtsp://admin:Sonic123@192.168.1.206:554/cam/realmonitor?channel=1&subtype=0' },
  { id: 'cam2', url: 'rtsp://admin:Sonic123@192.168.1.205:554/cam/realmonitor?channel=1&subtype=0' },
];

const ROI_RATIO = 0.5; // 50% of min(videoWidth, videoHeight)

const BG_IMAGE = require('../Assets/bg.png');
const LOGO_LEFT = require('../Assets/Liwaas.png');
const LOGO_RIGHT = require('../Assets/uaeflag.png');

const { RTSPModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(RTSPModule);

const TabbedRTSPViewer = ({ navigation }) => {
  const [ocrState, setOcrState] = useState({
    cam1: { text: '', history: [] },
    cam2: { text: '', history: [] },
  });
  const [elapsedMs, setElapsedMs] = useState({
    cam1: 0,
    cam2: 0,
  });

  const intervalRefs = useRef({
    cam1: null,
    cam2: null,
  });

  const screenWidth = Dimensions.get('window').width;
  const videoWidth = screenWidth - 32;
  const videoHeight = 240;

  useEffect(() => {
    CAMERA_STREAMS.forEach(stream => {
      RTSPModule.startStream(stream.id, stream.url);
      setElapsedMs(prev => ({
        ...prev,
        [stream.id]: 0,
      }));
      const start = Date.now();
      intervalRefs.current[stream.id] = setInterval(() => {
        setElapsedMs(prev => ({
          ...prev,
          [stream.id]: Date.now() - start,
        }));
      }, 50);
    });

    const subscription = eventEmitter.addListener('onTextDetected', event => {
      const { text, streamId } = event;
      setOcrState(prev => ({
        ...prev,
        [streamId]: {
          text,
          history: [text, ...(prev[streamId]?.history || [])],
        },
      }));
    });

    return () => {
      CAMERA_STREAMS.forEach(stream => {
        RTSPModule.stopStream(stream.id);
        clearInterval(intervalRefs.current[stream.id]);
      });
      subscription.remove();
    };
  }, []);

  // Format timer as mm:ss:ms
  const formatTime = ms => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const msDisplay = Math.floor((ms % 1000) / 10); // show two digits
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${msDisplay.toString().padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.imageBackground} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.logoRow}>
          <Image source={LOGO_LEFT} style={styles.logoliwa} />
          <Image source={LOGO_RIGHT} style={styles.logouae} />
        </View>
        <Text style={styles.headerText}>AI-Neural Network</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {CAMERA_STREAMS.map(stream => (
            <View key={stream.id} style={styles.cameraBox}>
              <Text style={styles.camLabel}>Camera {stream.id.toUpperCase()}</Text>
              <View style={styles.videoContainer}>
              </View>
              <View style={styles.readingBlock}>
                <View style={styles.ocrBox}>
                  <Text style={styles.ocrTitle}>Current Reading</Text>
                  <Text style={styles.ocrText}>{ocrState[stream.id]?.text || 'No text detected yet.'}</Text>
                </View>
                <View style={styles.timerBox}>
                  <Text style={styles.timerLabel}>Elapsed Time</Text>
                  <Text style={styles.timer}>{formatTime(elapsedMs[stream.id] || 0)}</Text>
                </View>
                <Text style={styles.ocrHistoryTitle}>Previous Readings</Text>
                <ScrollView style={styles.ocrHistory}>
                  {ocrState[stream.id]?.history.map((text, idx) => (
                    <Text key={idx} style={styles.ocrHistoryText}>{text}</Text>
                  ))}
                </ScrollView>
              </View>
            </View>
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
    backgroundColor: 'rgba(255,255,255,0.70)',
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
  scrollContainer: {
    paddingBottom: 24,
  },
  cameraBox: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(248,250,252,0.90)',
    borderRadius: 18,
    padding: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#c7d0e0',
    overflow: 'hidden',
  },
  camLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#228be6',
    marginTop: 6,
    marginBottom: 2,
    letterSpacing: 1,
  },
  horizontalBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: 800,
    flexWrap: 'wrap',
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: '#f0f4fa',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#228be6',
    shadowColor: '#228be6',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  roiRect: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#52e067',
    backgroundColor: 'rgba(0,0,0,0.0)',
    zIndex: 10,
    borderRadius: 10,
  },
  readingBlock: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  ocrBox: {
    width: '100%',
    marginBottom: 8,
    padding: 10,
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
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: 1,
  },
  ocrText: {
    color: '#0b990b',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
  },
  timerBox: {
    minWidth: 70,
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#c7d0e0',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timerLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#228be6',
    marginBottom: 2,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 0, 0, 1)',
    backgroundColor: '#e4f4ff',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
    fontFamily: 'monospace',
  },
  ocrHistoryTitle: {
    fontWeight: 'bold',
    color: '#228be6',
    fontSize: 14,
    marginLeft: 4,
    marginBottom: 3,
    letterSpacing: 1,
    marginTop: 2,
  },
  ocrHistory: {
    height: 80,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#c7d0e0',
  },
  ocrHistoryText: {
    color: '#666',
    fontSize: 12,
    marginTop: 1,
    marginBottom: 1,
    fontStyle: 'italic',
  },
});

export default TabbedRTSPViewer;