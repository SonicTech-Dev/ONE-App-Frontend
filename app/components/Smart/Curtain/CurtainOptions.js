import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Slider from '@react-native-community/slider';

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
  const [isSliding, setIsSliding] = useState(false);
  const [curtainState, setCurtainState] = useState("unknown");
  const [online, setOnline] = useState(null);
  const [deviceImage, setDeviceImage] = useState(null);
  const [positionAbilityFound, setPositionAbilityFound] = useState(false);


  function extractPosition(abilities) {
    const byPercent = abilities.find(
      a =>
        a.attribute &&
        typeof a.attribute.position_percent !== "undefined"
    );
    if (byPercent)
      return { found: true, value: Number(byPercent.attribute.position_percent) };

    const byPosition = abilities.find(
      a =>
        a.attribute &&
        typeof a.attribute.position !== "undefined"
    );
    if (byPosition)
      return { found: true, value: Number(byPosition.attribute.position) };

    return { found: false, value: null };
  }

  function extractCurtainState(abilities) {
    const curtainAbility = abilities.find(a =>
      a.ability_name &&
      (
        a.ability_name.toLowerCase().includes("curtain") ||
        a.ability_name.toLowerCase().includes("shade") ||
        a.ability_name.toLowerCase().includes("cover")
      )
    );
    if (curtainAbility && typeof curtainAbility.state !== "undefined") {
      return curtainAbility.state;
    }
    if (abilities.length > 0 && typeof abilities[0].state !== "undefined") {
      return abilities[0].state;
    }
    return "unknown";
  }

  useEffect(() => {
    if (deviceStatus && deviceStatus.result) {
      const abilities = deviceStatus.result.abilities || [];

      // Extract and set curtain state
      setCurtainState(extractCurtainState(abilities));

      // Extract and set position
      const { found, value } = extractPosition(abilities);
      setPositionAbilityFound(found);
      if (found && !isSliding) setPosition(value ?? 0);



      // Extract and set device image and online
      setDeviceImage(deviceStatus.result.device_picture_url || null);
      setOnline(deviceStatus.result.online);
    } else {
      // Reset on modal close or deviceStatus missing
      setCurtainState("unknown");
      setOnline(null);
      setDeviceImage(null);
      setPositionAbilityFound(false);
      setPosition(0);
    }
    // Don't include isSliding as dependency or you'll get slider jitter
    // eslint-disable-next-line
  }, [deviceStatus]);

  // Controls
  const handleOpen = () => onOpen && onOpen();
  const handlePause = () => onPause && onPause();
  const handleClose = () => onCloseCurtain && onCloseCurtain();

  // Slider
  const handleSliderChange = (val) => {
    setIsSliding(true);
    setPosition(val);
  };
  const handleSlidingComplete = (val) => {
    setIsSliding(false);
    onSetPosition && onSetPosition(val);
  };

  const deviceLabel =
    device?.title ||
    deviceStatus?.result?.product_name ||
    deviceStatus?.result?.device_name ||
    deviceStatus?.result?.device_type ||
    "Curtain";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          {/* Title & Image */}
          <Text style={styles.title}>{deviceLabel}</Text>
          {deviceImage && (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          )}

          {/* Status display */}
          {!deviceStatus ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#32d2d6" />
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Online Status:</Text>
                <Text style={[
                  styles.value,
                  online === true ? styles.online : styles.offline
                ]}>
                  {online === true ? "Online" : online === false ? "Offline" : "Unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Curtain State:</Text>
                <Text style={styles.value}>{curtainState}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Position:</Text>
                <Text style={styles.value}>
                  {positionAbilityFound
                    ? `${position}%`
                    : "unknown"}
                </Text>
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
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Set Position:</Text>
              <Slider
                style={{ width: 220, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={position}
                minimumTrackTintColor="#32d2d6"
                maximumTrackTintColor="#bbb"
                thumbTintColor="#32d2d6"
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSlidingComplete}
              />
              <Text style={styles.sliderValue}>{position}%</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

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
  deviceImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
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
  sliderContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32d2d6',
    marginTop: 2,
  },
});