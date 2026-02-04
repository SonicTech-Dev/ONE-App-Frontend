import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  PanResponder,
} from 'react-native';

/**
 * DraggableSlider
 *
 * A lightweight custom horizontal slider using Animated + PanResponder.
 * - No external dependencies required.
 * - Smoothly follows the finger, doesn't fight external updates while dragging.
 * - Calls onComplete only when the user releases the thumb.
 *
 * Props:
 * - value: number (0-100) current position
 * - onChange?: (val: number) => void  called while dragging (optional)
 * - onComplete?: (val: number) => void called on release
 * - disabled?: boolean
 */
function DraggableSlider({ value = 0, onChange, onComplete, disabled = false }) {
  const trackWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const initialThumbXRef = useRef(0);

  // thumbX stores pixel position (0..trackWidth)
  const thumbX = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);
  const [localPercent, setLocalPercent] = useState(Math.round(value));

  // When external value changes and we're not dragging, update the thumb smoothly
  useEffect(() => {
    if (draggingRef.current) return;
    const w = trackWidthRef.current || 0;
    const targetX = Math.round((Math.max(0, Math.min(100, value)) / 100) * w);
    Animated.spring(thumbX, {
      toValue: targetX,
      useNativeDriver: false,
      speed: 20,
      bounciness: 0,
    }).start();
    setLocalPercent(Math.round(value));
  }, [value, thumbX]);

  // When layout measured, position thumb to current value
  const onTrackLayout = (e) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    const initialX = Math.round((Math.max(0, Math.min(100, value)) / 100) * w);
    thumbX.setValue(initialX);
    setMeasured(true);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        draggingRef.current = true;
        // capture current thumb pos
        thumbX.stopAnimation((current) => {
          initialThumbXRef.current = current || 0;
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const w = trackWidthRef.current || 1;
        let newX = initialThumbXRef.current + gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > w) newX = w;
        // update animated value and percent
        thumbX.setValue(newX);
        const percent = Math.round((newX / w) * 100);
        setLocalPercent(percent);
        onChange && onChange(percent);
      },
      onPanResponderRelease: (evt, gestureState) => {
        draggingRef.current = false;
        const w = trackWidthRef.current || 1;
        let newX = initialThumbXRef.current + gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > w) newX = w;
        const percent = Math.round((newX / w) * 100);
        setLocalPercent(percent);
        onComplete && onComplete(percent);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        // Treat as release
        draggingRef.current = false;
        thumbX.stopAnimation((current) => {
          const w = trackWidthRef.current || 1;
          const percent = Math.round(((current || 0) / w) * 100);
          setLocalPercent(percent);
          onComplete && onComplete(percent);
        });
      },
    })
  ).current;

  // derived widths/styles
  const filledWidth = thumbX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }); // We'll calculate style with interpolate later once track width known

  // Thumb translation style
  const thumbTranslateStyle = {
    transform: [
      {
        translateX: thumbX,
      },
    ],
  };

  return (
    <View style={sliderStyles.container}>
      <Text style={sliderStyles.sliderLabel}>Set Position:</Text>
      <View
        style={sliderStyles.trackContainer}
        onLayout={onTrackLayout}
        {...(measured ? panResponder.panHandlers : {})}
      >
        <View style={sliderStyles.trackBackground} />
        {/* Filled track uses absolute positioning and animated width */}
        <Animated.View
          style={[
            sliderStyles.trackFilled,
            {
              width: thumbX.interpolate({
                inputRange: [0, trackWidthRef.current || 1],
                outputRange: [0, trackWidthRef.current || 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        {/* Thumb */}
        <Animated.View style={[sliderStyles.thumb, thumbTranslateStyle]} />
      </View>
      <Text style={sliderStyles.sliderValue}>{localPercent}%</Text>
    </View>
  );
}

export default function CurtainModal({
  visible,
  onClose,
  device,
  deviceStatus,
  onOpen,
  onCloseCurtain,
  onPause,
  onSetPosition,
}) {
  const [position, setPosition] = useState(0);
  const [curtainState, setCurtainState] = useState('unknown');
  const [online, setOnline] = useState(null);
  const [positionAbilityFound, setPositionAbilityFound] = useState(false);

  function extractPosition(abilities) {
    const byPercent = abilities.find(
      (a) => a.attribute && typeof a.attribute.position_percent !== 'undefined'
    );
    if (byPercent)
      return { found: true, value: Number(byPercent.attribute.position_percent) };

    const byPosition = abilities.find(
      (a) => a.attribute && typeof a.attribute.position !== 'undefined'
    );
    if (byPosition) return { found: true, value: Number(byPosition.attribute.position) };

    return { found: false, value: null };
  }

  function extractCurtainState(abilities) {
    const curtainAbility = abilities.find(
      (a) =>
        a.ability_name &&
        (a.ability_name.toLowerCase().includes('curtain') ||
          a.ability_name.toLowerCase().includes('shade') ||
          a.ability_name.toLowerCase().includes('cover'))
    );
    if (curtainAbility && typeof curtainAbility.state !== 'undefined') {
      return curtainAbility.state;
    }
    if (abilities.length > 0 && typeof abilities[0].state !== 'undefined') {
      return abilities[0].state;
    }
    return 'unknown';
  }

  useEffect(() => {
    if (deviceStatus && deviceStatus.result) {
      const abilities = deviceStatus.result.abilities || [];

      // Extract and set curtain state
      setCurtainState(extractCurtainState(abilities));

      // Extract and set position
      const { found, value } = extractPosition(abilities);
      setPositionAbilityFound(found);
      // Only update the displayed position if ability exists and value is a number
      if (found && typeof value === 'number') {
        setPosition(Number(value ?? 0));
      }

      // Extract online status
      setOnline(deviceStatus.result.online);
    } else {
      // Reset on modal close or deviceStatus missing
      setCurtainState('unknown');
      setOnline(null);
      setPositionAbilityFound(false);
    }
  }, [deviceStatus]);

  // Controls
  const handleOpen = () => onOpen && onOpen();
  const handlePause = () => onPause && onPause();
  const handleClose = () => onCloseCurtain && onCloseCurtain();

  // Calls from the slider while dragging (optional)
  const handleSliderChange = (val) => {
    setPosition(val);
  };

  // Called when user releases the thumb
  const handleSlidingComplete = (val) => {
    setPosition(val);
    onSetPosition && onSetPosition(val);
  };

  const deviceLabel =
    device?.title ||
    deviceStatus?.result?.product_name ||
    deviceStatus?.result?.device_name ||
    deviceStatus?.result?.device_type ||
    'Curtain';

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>{deviceLabel}</Text>

          {/* Status display */}
          {!deviceStatus ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#32d2d6" />
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Online Status:</Text>
                <Text
                  style={[
                    styles.value,
                    online === true ? styles.online : styles.offline,
                  ]}
                >
                  {online === true ? 'Online' : online === false ? 'Offline' : 'Unknown'}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Curtain State:</Text>
                <Text style={styles.value}>{curtainState}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Position:</Text>
                <Text style={styles.value}>{positionAbilityFound ? `${position}%` : 'unknown'}</Text>
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlButton} onPress={handleOpen}>
              <Text style={styles.controlButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
              <Text style={styles.controlButtonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleClose}>
              <Text style={styles.controlButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Position Slider */}
          {positionAbilityFound && (
            <DraggableSlider
              value={position}
              onChange={handleSliderChange}
              onComplete={handleSlidingComplete}
              disabled={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trackContainer: {
    width: 260,
    height: 36,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  trackFilled: {
    position: 'absolute',
    left: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#32d2d6',
  },
  thumb: {
    position: 'absolute',
    left: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#32d2d6',
    top: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32d2d6',
    marginTop: 8,
  },
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#7a7b7c',
    flex: 1,
    textAlign: 'left',
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 18,
    width: '100%',
  },
  controlButton: {
    backgroundColor: '#32d2d6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});