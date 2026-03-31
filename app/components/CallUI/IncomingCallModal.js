import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const IncomingCallModal = ({ visible, callerName, onAccept, onReject }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-height)).current; // Slide down from top

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Pulsing effect for the caller avatar
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 300,
        useNativeDriver: true,
      }).start();
      pulseAnim.stopAnimation();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
      {/* Blurred / Dark gradient background simulation */}
      <View style={styles.backgroundDimmer} />

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <Text style={styles.titleText}>Incoming Call</Text>
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Ionicons name="person" size={60} color="#fff" />
          </Animated.View>
          <Text style={styles.callerName}>{callerName || 'Unknown Caller'}</Text>
          <Text style={styles.subtitleText}>AkuBela Smart Panel</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={onReject} activeOpacity={0.8}>
            <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept} activeOpacity={0.8}>
            <Ionicons name="call" size={32} color="#fff" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 99999,
  },
  backgroundDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 25, 30, 0.95)', // Deep frosted tech look
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 80,
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(50, 210, 214, 0.2)', // Pulse ring
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#32d2d6',
    marginBottom: 24,
    shadowColor: '#32d2d6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  callerName: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#32d2d6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 90,
    alignItems: 'center',
  },
  rejectButton: {
    paddingVertical: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    shadowColor: '#ff3b30',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  acceptButton: {
    paddingVertical: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34c759',
    justifyContent: 'center',
    shadowColor: '#34c759',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
});

export default IncomingCallModal;
